/**
 * The `draw` host service: the Typert Remote namespace the settings panel and
 * the result card consume (`draw/status`, `draw/probe`, `draw/setCredential`,
 * `draw/unsetCredential`, `draw/regenerate`). Status snapshots are read-only;
 * credential writes go through the official `ctx.credentials` seam (values
 * never enter a log or a snapshot); regenerate re-runs the full drawer path
 * so a panel regeneration is as durable and quota-accounted as a tool call.
 *
 * @module dsh-draw/service
 */

import type { Context } from '@deepseek-ai/cordis'
import { credentialRef, type CredentialProvider } from '@deepseek-ai/dsh-credentials'
import type {} from '@deepseek-ai/dsh-attachment'
import type {} from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-tools'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { ResolvedConfig } from './config.ts'
import type { Drawer, DrawSuccess } from './drawer.ts'
import { engineById } from './config.ts'
import type { EngineRouter } from './router.ts'
import { PLUGIN_VERSION } from './version.ts'
import {
  imageToWire,
  probeToWire,
  statusToView,
  type CredentialActionResult,
  type DrawProbeResult,
  type DrawRegenerateResult,
  type DrawStatusSnapshot,
} from './wire.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Image-generation host service (this package). */
    draw: DrawService
  }
}

/** Bindings the service reads at call time (hot-swappable optional seams). */
export interface DrawServiceOptions {
  /** Resolved plugin configuration. */
  config: ResolvedConfig
  /** The engine router (health state for the status snapshot). */
  router: EngineRouter
  /** The generation drawer (regenerate path). */
  drawer: Drawer
  /** Per-call credential service; undefined = credential actions degrade. */
  credentials: CredentialProvider | undefined
}

/**
 * The `draw` Typert Remote service.
 */
export class DrawService extends TypertRemoteService {
  /** Per-call bindings (replaced on plugin reload). */
  options: DrawServiceOptions

  /**
   * @param ctx - the mounting context.
   * @param options - runtime bindings.
   */
  constructor(ctx: Context, options: DrawServiceOptions) {
    super(ctx, 'draw')
    this.options = options
  }

  /** Resolve one engine's credential view for the status snapshot. */
  private async credentialView(reference: string) {
    const credentials = this.options.credentials
    if (credentials === undefined) return { configured: false, writable: false }
    try {
      const info = await credentials.describe(credentialRef(reference))
      return { configured: info.configured, writable: info.writable, ...(info.source !== undefined ? { source: info.source } : {}) }
    } catch {
      return { configured: false, writable: false }
    }
  }

  /** Read-only panel snapshot: engine chain, health, credential facts, quota. */
  async status(): Promise<DrawStatusSnapshot> {
    const { config, router } = this.options
    const engines = []
    for (const engine of config.engines) {
      const status = router.statusOf(engine.id)
      const view = statusToView(
        status ?? { engineId: engine.id, consecutiveFailures: 0, cooldownUntil: null, lastError: null, lastStatus: null },
        {
          id: engine.id,
          model: engine.model,
          baseUrl: engine.baseUrl,
          apiKeyRef: engine.apiKeyRef,
          enabled: engine.enabled,
          preferred: engine.id === config.defaultEngine,
        },
        await this.credentialView(engine.apiKeyRef),
      )
      engines.push(view)
    }
    return {
      pluginVersion: PLUGIN_VERSION,
      engines,
      quota: { maxGenerationsPerSession: config.maxGenerationsPerSession, maxBytesPerSession: config.maxBytesPerSession },
      requestTimeoutMs: config.requestTimeoutMs,
      maxImagesPerCall: config.maxImagesPerCall,
    }
  }

  /** Probe one engine's connectivity without mutating routing health. */
  async probe(engineId: string): Promise<DrawProbeResult> {
    const engine = engineById(this.options.config, engineId)
    if (engine === undefined) {
      return { engineId, reachable: false, httpStatus: null, target: '', note: `unknown engine "${engineId}"`, credentialConfigured: false }
    }
    const outcome = await this.options.router.probe(engine, {
      transport: this.options.drawer.deps.engine.transport,
      resolveCredential: this.options.drawer.deps.engine.resolveCredential,
    })
    return probeToWire(outcome)
  }

  /** Store one API key under the engine's credential reference (credentials seam). */
  async setCredential(engineId: string, value: string): Promise<CredentialActionResult> {
    const engine = engineById(this.options.config, engineId)
    if (engine === undefined) throw new TypeError(`unknown engine "${engineId}"`)
    const credentials = this.options.credentials
    if (credentials === undefined) throw new TypeError('the credential service is not composed on this profile')
    if (typeof value !== 'string' || value.length === 0) throw new TypeError('credential value must be a non-empty string')
    await credentials.set(credentialRef(engine.apiKeyRef), value)
    return { engineId, reference: engine.apiKeyRef, note: `stored under the ${engine.apiKeyRef} credential reference` }
  }

  /** Remove a stored API key for the engine's credential reference. */
  async unsetCredential(engineId: string): Promise<CredentialActionResult> {
    const engine = engineById(this.options.config, engineId)
    if (engine === undefined) throw new TypeError(`unknown engine "${engineId}"`)
    const credentials = this.options.credentials
    if (credentials === undefined) throw new TypeError('the credential service is not composed on this profile')
    await credentials.unset(credentialRef(engine.apiKeyRef))
    return { engineId, reference: engine.apiKeyRef, note: `removed from the ${engine.apiKeyRef} credential reference` }
  }

  /** Re-run a generation from the result card through the full drawer path. */
  async regenerate(sessionId: string, args: unknown): Promise<DrawRegenerateResult> {
    const sessions = this.options.drawer.deps.sessions?.()
    if (sessions === undefined) throw new TypeError('the session store is not composed on this profile')
    const session = sessions.get(SessionId(sessionId))
    if (session === undefined) throw new TypeError(`unknown session "${sessionId}"`)
    const outcome = await this.options.drawer.generate(args, { session, source: 'regenerate' })
    if (!outcome.ok) throw new TypeError(outcome.message)
    return projectRegenerate(outcome)
  }
}

/** Project a successful draw onto the regenerate wire shape. */
function projectRegenerate(outcome: DrawSuccess): DrawRegenerateResult {
  return {
    engine: outcome.engine,
    model: outcome.model,
    size: outcome.size,
    images: outcome.images.map(imageToWire),
    quota: outcome.quota,
    quotaLimits: outcome.limits,
    fallbackUsed: outcome.fallbackUsed,
    elapsedMs: outcome.elapsedMs,
    attempts: outcome.attempts,
  }
}
