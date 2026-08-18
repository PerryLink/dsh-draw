/**
 * `dsh-draw` — the unified static-image generation router for DeepSeek Harness.
 *
 * Host half: resolves config, builds the health-aware engine router and the
 * shared drawer (validation, quota, routing, durable attachment storage, and
 * the `draw/generated` session audit event), registers the `image_generate`
 * tool, and mounts the `draw` Typert Remote service the settings panel and
 * result card consume. The browser half lives in `src/client/` and registers
 * the keyed `tool.call.toolview` result card plus the Plugins settings tab.
 *
 * Function plugin — no default export (the Loader unwraps
 * `exports.default ?? exports`).
 *
 * @module dsh-draw
 */

import type { Context } from '@deepseek-ai/cordis'
import type { AttachmentStore } from '@deepseek-ai/dsh-attachment'
import type { CredentialProvider } from '@deepseek-ai/dsh-credentials'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import type { SessionStore } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-tools'
import { Config, resolveConfig } from './config.ts'
import { Drawer } from './drawer.ts'
import { makeHostEventGate } from './event-gate.ts'
import { defaultHttpTransport, type HttpTransport } from './http.ts'
import { EngineRouter } from './router.ts'
import { DrawService } from './service.ts'
import { imageGenerateTool } from './tool.ts'

export const name = 'dsh-draw'

/** Hard services: the tool registry every contribution lands in. */
export const inject = ['tools']

export { Config, resolveConfig, type Config as DrawConfig, type ResolvedConfig, DEFAULT_ENGINES, engineById } from './config.ts'
export { EngineRouter, type AttemptView, type EngineStatus, type ProbeOutcome } from './router.ts'
export { Drawer, type DrawImage, type DrawFailureReason, type DrawOutcome, type DrawOptions, type DrawSuccess } from './drawer.ts'
export { imageGenerateTool } from './tool.ts'
export { DrawService } from './service.ts'
export { defaultHttpTransport, fusedSignal, type HttpTransport, type HttpRequest, type HttpResponse, HttpError } from './http.ts'
export { callEngine, EngineCallError, type EngineDeps, type ProducedImage } from './engine.ts'
export { translateRequest, normalizeRequest, type StandardImageRequest } from './translate.ts'
export { quotaState, checkQuotaGenerations, checkQuotaBytes, type QuotaLimits, type QuotaState } from './quota.ts'
export { sanitizeUrl, sanitizeText, sanitizeError, REDACTED } from './sanitize.ts'
export { appendDrawGenerated, commitDrawGenerated, drawGeneratedEvents, fallbackDrawGeneratedEvents, type DrawGeneratedEvent } from './session-events.ts'
export { makeEventGate, makeHostEventGate, probeIgnorableAppend, type EventGate, type EventGateDecision } from './event-gate.ts'
export { PLUGIN_VERSION } from './version.ts'
export { DRAW_INVOCATIONS, imageToWire, statusToView, probeToWire, type DrawStatusSnapshot } from './wire.ts'

/** Response byte ceiling: one engine call may carry several full-size images. */
const MAX_RESPONSE_BYTES = 64 * 1024 * 1024

/**
 * Mount the plugin: router, drawer, the `image_generate` tool, and the `draw`
 * Remote service. Every registration is an effect on this fiber, so
 * unload/hot-reload removes the tool and the service together.
 *
 * @param ctx - context carrying tools plus the optional attachment/credentials seams.
 * @param config - raw loader config; defaults applied through {@link resolveConfig}.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const resolved = resolveConfig(config)
  const logger = ctx.logger('draw')

  // Optional test seam: an embedding context may pre-select the transport
  // under 'dsh-draw/transport'; real deployments use the fetch transport.
  const transport: HttpTransport = (ctx.get('dsh-draw/transport') as HttpTransport | undefined)
    ?? defaultHttpTransport(resolved.requestTimeoutMs, MAX_RESPONSE_BYTES)
  const router = new EngineRouter(resolved, {
    failureThreshold: resolved.failureThreshold,
    cooldownMs: resolved.cooldownMs,
  })

  const credentials = () => ctx.get('credentials') as CredentialProvider | undefined

  // The draw/generated event type is declared only by this package: append it
  // only when the host knows the type or honors the ignorable envelope;
  // otherwise the accounting payload rides the in-memory fallback ledger.
  const drawer = new Drawer(resolved, router, {
    engine: {
      transport,
      resolveCredential: async (reference: string): Promise<string | undefined> => {
        const service = credentials()
        if (service === undefined) return undefined
        const resolvedCredential = await service.resolve(credentialRef(reference))
        return resolvedCredential?.value
      },
    },
    attachments: () => ctx.get('attachments') as AttachmentStore | undefined,
    sessions: () => ctx.get('sessions') as SessionStore | undefined,
  }, { gate: makeHostEventGate(), warn: (message) => logger.warn(message) })

  ctx.effect(() => ctx.tools.register(imageGenerateTool(drawer, resolved)), 'dsh-draw: image_generate tool')

  await ctx.plugin(DrawService, { config: resolved, router, drawer, credentials: credentials() })
  logger.info(`image generation enabled: ${resolved.engines.map(engine => engine.id).join(', ')} (preferred ${resolved.defaultEngine})`)
}
