/**
 * Engine routing with health-aware fallback: the configured chain is walked
 * top-down, every engine is attempted at most once per call, and consecutive
 * failures push an engine into cooldown so a broken engine stops eating the
 * request budget. The router is a plain class (not a Cordis Service): it is
 * plugin-owned state, not a published capability.
 *
 * @module dsh-draw/router
 */

import type { ResolvedConfig, ResolvedEngineConfig } from './config.ts'
import { callEngine, EngineCallError, type EngineDeps, type ProducedImage } from './engine.ts'
import { sanitizeError, sanitizeText, sanitizeUrl } from './sanitize.ts'
import { translateRequest, type StandardImageRequest } from './translate.ts'

/** One recorded attempt against one engine, success or failure. */
export interface AttemptView {
  /** Engine id. */
  engine: string
  /** Failure phase for a failed attempt; absent on success. */
  phase?: 'credential' | 'request' | 'parse'
  /** Stable machine code: `unconfigured`, `auth`, `http`, `parse`, `disabled`, `cooldown`. */
  code: string
  /** Display-safe failure detail; absent on success. */
  message?: string
  /** HTTP status when one existed. */
  status?: number
}

/** A successful routed generation. */
export interface RouterSuccess {
  /** Discriminant. */
  ok: true
  /** Engine id that produced the images. */
  engine: string
  /** Engine model name. */
  model: string
  /** Standard size vocabulary value of the request. */
  size: string
  /** Produced images. */
  images: readonly ProducedImage[]
  /** Whether an earlier engine in the chain failed first. */
  fallbackUsed: boolean
  /** Every attempt in chain order. */
  attempts: readonly AttemptView[]
}

/** A routed generation where every usable engine failed or was skipped. */
export interface RouterFailure {
  /** Discriminant. */
  ok: false
  /** Every attempt in chain order. */
  attempts: readonly AttemptView[]
}

/** Router result. */
export type RouterResult = RouterSuccess | RouterFailure

/** One engine's health state for the settings panel. */
export interface EngineStatus {
  /** Engine id. */
  engineId: string
  /** Consecutive failures since the last success. */
  consecutiveFailures: number
  /** Epoch ms until which the engine is in cooldown; `null` = not cooling down. */
  cooldownUntil: number | null
  /** Display-safe last failure detail; `null` = none recorded. */
  lastError: string | null
  /** HTTP status of the last failure, when one existed. */
  lastStatus: number | null
}

/** One probe outcome (never mutates routing health). */
export interface ProbeOutcome {
  /** Engine id. */
  engineId: string
  /** Whether the endpoint answered with any HTTP status. */
  reachable: boolean
  /** HTTP status when one existed. */
  httpStatus: number | null
  /** Sanitized base URL probed (the models listing endpoint). */
  target: string
  /** Display-safe result note. */
  note: string
  /** Whether the credential was resolvable at probe time. */
  credentialConfigured: boolean
}

/** Engine bookkeeping the router mutates. */
interface EngineHealth {
  /** Consecutive failures since the last success. */
  consecutiveFailures: number
  /** Epoch ms until which the engine is in cooldown; `null` = not cooling down. */
  cooldownUntil: number | null
  /** Display-safe last failure detail. */
  lastError: string | null
  /** HTTP status of the last failure. */
  lastStatus: number | null
}

/** Router construction options. */
export interface RouterOptions {
  /** Consecutive failures before an engine enters cooldown. */
  failureThreshold: number
  /** Cooldown length in milliseconds. */
  cooldownMs: number
  /** Clock override for tests. */
  now?: () => number
}

/**
 * The engine chain with per-engine health and cooldown. All mutations are
 * synchronous bookkeeping guarded by `generate`'s single-writer path (the
 * tool is not concurrency-safe, so generations serialize).
 */
export class EngineRouter {
  private readonly health = new Map<string, EngineHealth>()
  private readonly now: () => number

  /**
   * @param config - resolved plugin configuration (engine order and bounds).
   * @param options - failure threshold, cooldown, and clock.
   */
  constructor(
    private readonly config: ResolvedConfig,
    options: RouterOptions,
  ) {
    this.now = options.now ?? Date.now
    for (const engine of config.engines) {
      this.health.set(engine.id, { consecutiveFailures: 0, cooldownUntil: null, lastError: null, lastStatus: null })
    }
  }

  /**
   * Route one standardized request through the configured chain. The chain
   * order is the config array order, except an explicit `request.engine`
   * promotes that engine to the front; every engine is attempted at most
   * once, and an engine in cooldown or without a resolved credential is
   * skipped with a recorded attempt.
   *
   * @param request - normalized standard request.
   * @param deps - transport and credential resolution.
   * @param signal - caller cancellation.
   * @returns success with images, or the complete failure record.
   */
  async generate(request: StandardImageRequest, deps: EngineDeps, signal?: AbortSignal): Promise<RouterResult> {
    const ordered = this.chainOrder(request.engine)
    const attempts: AttemptView[] = []
    let tried = 0
    for (const engine of ordered) {
      if (tried > 0) signal?.throwIfAborted()
      const skip = this.skipReason(engine)
      if (skip !== undefined) {
        attempts.push({ engine: engine.id, code: skip.code, message: skip.message })
        continue
      }
      tried += 1
      try {
        const images = await callEngine(engine, this.translate(engine, request), deps, signal)
        this.recordSuccess(engine.id)
        attempts.push({ engine: engine.id, code: 'ok' })
        return {
          ok: true,
          engine: engine.id,
          model: engine.model,
          size: request.size ?? 'square',
          images,
          fallbackUsed: tried > 1,
          attempts,
        }
      } catch (error) {
        const view = this.recordFailure(engine.id, error)
        attempts.push(view)
        if (view.phase === 'credential' || view.code === 'auth' || view.code === 'parse') {
          // Credential and schema failures are deterministic for this engine —
          // continue the chain so a healthy next engine still serves the call.
          continue
        }
        if (signal !== undefined && signal.aborted) throw signal.reason
        continue
      }
    }
    return { ok: false, attempts }
  }

  /** One engine's current health snapshot. */
  statusOf(engineId: string): EngineStatus | undefined {
    const health = this.health.get(engineId)
    if (health === undefined) return undefined
    return {
      engineId,
      consecutiveFailures: health.consecutiveFailures,
      cooldownUntil: health.cooldownUntil,
      lastError: health.lastError,
      lastStatus: health.lastStatus,
    }
  }

  /** Health snapshots for every configured engine in chain order. */
  statuses(): readonly EngineStatus[] {
    return this.config.engines
      .map(engine => this.statusOf(engine.id))
      .filter((status): status is EngineStatus => status !== undefined)
  }

  /**
   * Probe one engine with a cheap authenticated `GET {baseUrl}/models` call.
   * The probe reports reachability and credential validity without mutating
   * routing health — it is a settings-panel check, not the router's memory.
   *
   * @param engine - engine to probe.
   * @param deps - transport and credential resolution.
   * @returns the probe outcome.
   */
  async probe(engine: ResolvedEngineConfig, deps: EngineDeps): Promise<ProbeOutcome> {
    const target = sanitizeUrl(`${engine.baseUrl}/models`)
    const credential = await deps.resolveCredential(engine.apiKeyRef)
    if (credential === undefined) {
      return { engineId: engine.id, reachable: false, httpStatus: null, target, note: `credential reference ${engine.apiKeyRef} is not configured`, credentialConfigured: false }
    }
    try {
      const response = await deps.transport.request({
        method: 'GET',
        url: `${engine.baseUrl}/models`,
        headers: { authorization: `Bearer ${credential}` },
      })
      if (response.status === 401 || response.status === 403) {
        return { engineId: engine.id, reachable: true, httpStatus: response.status, target, note: `endpoint answered but rejected the credential (HTTP ${response.status})`, credentialConfigured: true }
      }
      if (response.status === 404 || response.status === 405 || response.status === 501) {
        return { engineId: engine.id, reachable: true, httpStatus: response.status, target, note: `endpoint answered (HTTP ${response.status}); the models listing may be absent but generation can still work`, credentialConfigured: true }
      }
      if (response.status < 200 || response.status >= 300) {
        return { engineId: engine.id, reachable: true, httpStatus: response.status, target, note: `endpoint answered with HTTP ${response.status}`, credentialConfigured: true }
      }
      return { engineId: engine.id, reachable: true, httpStatus: response.status, target, note: 'endpoint reachable and credential accepted', credentialConfigured: true }
    } catch (error) {
      return { engineId: engine.id, reachable: false, httpStatus: null, target, note: sanitizeError(error), credentialConfigured: true }
    }
  }

  /** Chain order: an explicit engine override first, then config order minus the override. */
  private chainOrder(override: string | undefined): readonly ResolvedEngineConfig[] {
    const engines = [...this.config.engines]
    if (override === undefined || override === this.config.defaultEngine) {
      const index = engines.findIndex(engine => engine.id === this.config.defaultEngine)
      if (index > 0) {
        const [preferred] = engines.splice(index, 1)
        engines.unshift(preferred!)
      }
      return engines
    }
    const index = engines.findIndex(engine => engine.id === override)
    if (index < 0) {
      // Unknown override: fall back to the configured chain (the override
      // intent is recorded nowhere else; the tool output names the engine).
      return engines
    }
    const [preferred] = engines.splice(index, 1)
    engines.unshift(preferred!)
    return engines
  }

  /** Why an engine may not even be attempted: disabled, cooling down. */
  private skipReason(engine: ResolvedEngineConfig): { code: string; message: string } | undefined {
    if (!engine.enabled) return { code: 'disabled', message: `engine "${engine.id}" is disabled` }
    const health = this.health.get(engine.id)
    const now = this.now()
    const cooldown = health?.cooldownUntil
    if (cooldown !== null && cooldown !== undefined && cooldown > now) {
      return { code: 'cooldown', message: `engine "${engine.id}" is cooling down after repeated failures` }
    }
    return undefined
  }

  /** Translate the standard request against one engine (the pure translate step). */
  private translate(engine: ResolvedEngineConfig, request: StandardImageRequest) {
    return translateRequest(engine, request)
  }

  /** Record a success: reset consecutive failures and cooldown. */
  private recordSuccess(engineId: string): void {
    const health = this.health.get(engineId)
    if (health === undefined) return
    health.consecutiveFailures = 0
    health.cooldownUntil = null
    health.lastError = null
    health.lastStatus = null
  }

  /** Record a failure: bump the counter, trip cooldown at the threshold, and build the attempt view. */
  private recordFailure(engineId: string, error: unknown): AttemptView {
    const health = this.health.get(engineId)
    const engineError = error instanceof EngineCallError ? error : undefined
    const phase = engineError?.phase ?? 'request'
    const code = engineError?.code ?? 'http'
    const message = sanitizeText(sanitizeError(error))
    const status = engineError?.status
    if (health !== undefined) {
      health.consecutiveFailures += 1
      health.lastError = message
      health.lastStatus = status ?? null
      if (health.consecutiveFailures >= this.config.failureThreshold) {
        health.cooldownUntil = this.now() + this.config.cooldownMs
      }
    }
    return { engine: engineId, phase, code, message, ...(status !== undefined ? { status } : {}) }
  }
}
