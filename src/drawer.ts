/**
 * The generation drawer: the shared orchestration behind the `image_generate`
 * tool body and the settings-panel/card regenerate action. One path owns
 * validation, quota, routing, durable attachment storage, and the session
 * audit event, so the two entry points can never drift.
 *
 * @module dsh-draw/drawer
 */

import type { AttachmentStore, ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import type { Session, SessionStore } from '@deepseek-ai/dsh-session'
import type { ResolvedConfig } from './config.ts'
import type { EngineDeps, ProducedImage } from './engine.ts'
import { checkQuotaBytes, checkQuotaGenerations, type QuotaLimits, type QuotaState } from './quota.ts'
import { EngineRouter, type AttemptView } from './router.ts'
import { commitDrawGenerated } from './session-events.ts'
import type { EventGate } from './event-gate.ts'
import { normalizeRequest } from './translate.ts'

/** One durable result image as the canonical value and wire carry it. */
export interface DrawImage {
  /** Opaque attachment id. */
  attachmentId: string
  /** Verified media type. */
  mediaType: string
  /** Exact byte length. */
  bytes: number
  /** Intrinsic width in pixels. */
  width: number
  /** Intrinsic height in pixels. */
  height: number
  /** Display name. */
  name?: string
}

/** A successful draw. */
export interface DrawSuccess {
  /** Discriminant. */
  ok: true
  /** Engine id that produced the images. */
  engine: string
  /** Engine model name. */
  model: string
  /** Standard size vocabulary value of the request. */
  size: 'square' | 'landscape' | 'portrait' | 'auto'
  /** Durable result images. */
  images: readonly DrawImage[]
  /** Usage after this generation committed. */
  quota: QuotaState
  /** Quota limits in force. */
  limits: QuotaLimits
  /** Whether an earlier engine in the chain failed first. */
  fallbackUsed: boolean
  /** Engine round-trip latency in milliseconds. */
  elapsedMs: number
  /** Every router attempt in chain order. */
  attempts: readonly AttemptView[]
}

/** Why a draw failed before or during routing. */
export type DrawFailureReason =
  | 'invalid-prompt'
  | 'quota-generations'
  | 'quota-bytes'
  | 'no-session'
  | 'attachments-unavailable'
  | 'all-engines-failed'

/** A failed draw with a machine-routable reason and display-safe message. */
export interface DrawFailure {
  /** Discriminant. */
  ok: false
  /** Which stage blocked the draw. */
  reason: DrawFailureReason
  /** Display-safe explanation. */
  message: string
  /** Quota usage at decision time for quota failures. */
  quota?: QuotaState
  /** Router attempts for engine failures. */
  attempts?: readonly AttemptView[]
}

/** Draw outcome. */
export type DrawOutcome = DrawSuccess | DrawFailure

/** Options for one generation. */
export interface DrawOptions {
  /** Caller cancellation. */
  signal?: AbortSignal
  /** Owning session (required: quota and the audit event live in the log). */
  session: Session | undefined
  /** Who requested the generation (recorded in the audit event). */
  source: 'tool' | 'regenerate'
}

/** Drawer dependencies, resolved per call so optional services stay hot-swappable. */
export interface DrawerDeps {
  /** Engine transport and credential resolution. */
  engine: EngineDeps
  /** Per-call durable attachment store accessor (absent fails the draw closed). */
  attachments?: () => AttachmentStore | undefined
  /** Per-call session store accessor for the regenerate path. */
  sessions?: () => SessionStore | undefined
}

/** How the drawer commits the `draw/generated` accounting event. */
export interface DrawerEventSink {
  /** The adaptive session-event gate, probed at mount. */
  gate: EventGate
  /** Log warning sink for append failures. */
  warn: (message: string) => void
}

/**
 * The shared generation path.
 */
export class Drawer {
  /**
   * @param config - resolved plugin configuration.
   * @param router - the engine router.
   * @param deps - per-call dependencies (public: the remote service reads them for probes).
   * @param events - the gated session-event sink (log when safe, in-memory ledger otherwise).
   */
  constructor(
    private readonly config: ResolvedConfig,
    private readonly router: EngineRouter,
    readonly deps: DrawerDeps,
    private readonly events: DrawerEventSink,
  ) {}

  /**
   * Run one generation end to end: normalize and validate, check quota,
   * route through the engine chain, commit images to the attachment store,
   * and append the audit event.
   *
   * @param args - unvalidated standard request (tool args or card regenerate args).
   * @param options - cancellation, session, and source.
   * @returns the outcome.
   */
  async generate(args: unknown, options: DrawOptions): Promise<DrawOutcome> {
    const request = normalizeRequest(args, this.config.maxImagesPerCall)
    if (request.prompt.trim().length === 0) {
      return { ok: false, reason: 'invalid-prompt', message: 'image_generate: prompt must be a non-empty string' }
    }
    if (request.prompt.length > this.config.maxPromptLength) {
      return { ok: false, reason: 'invalid-prompt', message: `image_generate: prompt exceeds the configured ${this.config.maxPromptLength}-character cap` }
    }
    const session = options.session
    if (session === undefined) {
      return { ok: false, reason: 'no-session', message: 'image_generate: no session owns this call — quota accounting and the audit event need a session' }
    }
    const limits: QuotaLimits = {
      maxGenerations: this.config.maxGenerationsPerSession,
      maxBytes: this.config.maxBytesPerSession,
    }
    const generationCheck = checkQuotaGenerations(session, limits)
    if (!generationCheck.allowed) {
      return { ok: false, reason: 'quota-generations', message: `image_generate: session generation quota exhausted (${generationCheck.state.generations}/${limits.maxGenerations} calls)`, quota: generationCheck.state }
    }
    const startedAt = Date.now()
    const routed = await this.router.generate(request, this.deps.engine, options.signal)
    if (!routed.ok) {
      return {
        ok: false,
        reason: 'all-engines-failed',
        message: `image_generate: no configured engine produced images${routed.attempts.length === 0 ? '' : ` (${routed.attempts.map(attempt => attempt.engine).join(', ')})`}`,
        attempts: routed.attempts,
        quota: generationCheck.state,
      }
    }
    const attachments = this.deps.attachments?.()
    if (attachments === undefined) {
      return { ok: false, reason: 'attachments-unavailable', message: 'image_generate: the attachment store is not composed — images cannot be saved durably', quota: generationCheck.state, attempts: routed.attempts }
    }
    const totalBytes = routed.images.reduce((sum, image) => sum + image.data.byteLength, 0)
    const byteCheck = checkQuotaBytes(session, limits, totalBytes)
    if (!byteCheck.allowed) {
      return { ok: false, reason: 'quota-bytes', message: `image_generate: session image-byte quota exhausted (${byteCheck.state.bytes}/${limits.maxBytes} bytes)`, quota: byteCheck.state, attempts: routed.attempts }
    }
    let refs: readonly ImageAttachmentRef[]
    try {
      refs = await this.saveImages(attachments, routed.engine, routed.images, options.signal)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, reason: 'attachments-unavailable', message: `image_generate: saving images failed: ${message}`, quota: generationCheck.state, attempts: routed.attempts }
    }
    const images: DrawImage[] = refs.map(ref => ({
      attachmentId: String(ref.attachmentId),
      mediaType: ref.mediaType,
      bytes: ref.bytes,
      width: ref.width,
      height: ref.height,
      ...(ref.name !== undefined ? { name: ref.name } : {}),
    }))
    const elapsedMs = Date.now() - startedAt
    commitDrawGenerated(session, {
      engine: routed.engine,
      model: routed.model,
      source: options.source,
      prompt: request.prompt,
      size: request.size ?? 'square',
      quality: request.quality ?? 'auto',
      count: images.length,
      bytes: totalBytes,
      attachmentIds: images.map(image => image.attachmentId),
      elapsedMs,
    }, this.events.gate, this.events.warn)
    const after = checkQuotaGenerations(session, limits)
    return {
      ok: true,
      engine: routed.engine,
      model: routed.model,
      size: request.size ?? 'square',
      images,
      quota: after.state,
      limits,
      fallbackUsed: routed.fallbackUsed,
      elapsedMs,
      attempts: routed.attempts,
    }
  }

  /** Save every produced image to the attachment store; an empty image fails the batch. */
  private async saveImages(
    attachments: AttachmentStore,
    engineId: string,
    produced: readonly ProducedImage[],
    signal?: AbortSignal,
  ): Promise<readonly ImageAttachmentRef[]> {
    const refs: ImageAttachmentRef[] = []
    for (let index = 0; index < produced.length; index += 1) {
      signal?.throwIfAborted()
      const image = produced[index]!
      if (image.data.byteLength === 0) {
        throw new Error(`engine "${engineId}" produced an empty image`)
      }
      refs.push(await attachments.saveImage({
        data: image.data,
        mediaType: image.mediaType,
        name: `${engineId}-${index + 1}.${image.mediaType === 'image/jpeg' ? 'jpg' : image.mediaType.slice('image/'.length)}`,
      }))
    }
    return refs
  }
}
