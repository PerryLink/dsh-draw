/**
 * Pure presentation projections for the dsh-draw browser half: the tool
 * result value and the settings snapshot are folded into view models that the
 * React components render without further logic. Everything here is a pure
 * function of its input, so tests pin the projections without a DOM.
 *
 * @module dsh-draw/client/present
 */

import type { ToolCallBlock } from '@deepseek-ai/dsh-client-runtime/client'
import type { DrawStatusSnapshot } from '../wire.ts'

/** One image of the presented result card. */
export interface PresentedImage {
  attachmentId: string
  name: string
}

/** The presented result card model. */
export interface PresentedDrawResult {
  /** Engine id that produced the images. */
  engine: string
  /** Engine model name. */
  model: string
  /** Whether an earlier engine failed first. */
  fallbackUsed: boolean
  /** Image names in result order. */
  images: readonly PresentedImage[]
  /** Quota line: generations and bytes used. */
  quota: { generations: number; bytes: number }
  /** Effective limits. */
  limits: { maxGenerations: number; maxBytes: number }
  /** Original tool args (the regenerate input); undefined while unknown. */
  args: Record<string, unknown> | undefined
}

/**
 * Project one settled `image_generate` tool block onto the card model.
 *
 * @param block - the frozen tool-call block (running or settled).
 * @returns the presented model, or `undefined` when the block is not a settled
 *   image_generate result.
 */
export function presentDrawResult(block: ToolCallBlock): PresentedDrawResult | undefined {
  if (!('kind' in block) || block.kind !== 'tool-result' || block.isError) return undefined
  if (block.call?.name !== 'image_generate') return undefined
  const value = (block.meta as { engine?: unknown; model?: unknown; fallbackUsed?: unknown; images?: unknown; quota?: unknown; limits?: unknown } | undefined) ?? {}
  const images: PresentedImage[] = []
  if (Array.isArray(value.images)) {
    for (const raw of value.images) {
      const image = raw as { attachmentId?: unknown; name?: unknown }
      if (typeof image?.attachmentId === 'string') {
        images.push({ attachmentId: image.attachmentId, name: typeof image.name === 'string' ? image.name : 'image' })
      }
    }
  }
  const quota = (value.quota ?? {}) as { generations?: unknown; bytes?: unknown }
  const limits = (value.limits ?? {}) as { maxGenerations?: unknown; maxBytes?: unknown }
  let args: Record<string, unknown> | undefined
  if (block.call?.argsRaw !== undefined && block.call.argsRaw !== '') {
    try {
      const parsed = JSON.parse(block.call.argsRaw) as unknown
      args = typeof parsed === 'object' && parsed !== null ? parsed as Record<string, unknown> : undefined
    } catch {
      args = undefined
    }
  }
  return {
    engine: typeof value.engine === 'string' ? value.engine : 'unknown',
    model: typeof value.model === 'string' ? value.model : 'unknown',
    fallbackUsed: value.fallbackUsed === true,
    images,
    quota: {
      generations: typeof quota.generations === 'number' ? quota.generations : 0,
      bytes: typeof quota.bytes === 'number' ? quota.bytes : 0,
    },
    limits: {
      maxGenerations: typeof limits.maxGenerations === 'number' ? limits.maxGenerations : 0,
      maxBytes: typeof limits.maxBytes === 'number' ? limits.maxBytes : 0,
    },
    args,
  }
}

/** One engine row of the presented settings panel. */
export interface PresentedEngineRow {
  id: string
  model: string
  baseUrl: string
  apiKeyRef: string
  enabled: boolean
  preferred: boolean
  credentialConfigured: boolean
  credentialSource?: string
  credentialWritable: boolean
  consecutiveFailures: number
  coolingDown: boolean
  lastError: string | null
}

/** The presented settings snapshot. */
export interface PresentedDrawPanel {
  pluginVersion: string
  engines: readonly PresentedEngineRow[]
  quota: { maxGenerationsPerSession: number; maxBytesPerSession: number }
  requestTimeoutMs: number
  maxImagesPerCall: number
}

/**
 * Project the panel snapshot onto the settings row model.
 *
 * @param snapshot - the `draw/status` wire snapshot.
 * @param now - clock override for the cooldown flag (default {@link Date.now});
 *   injected so the presenter stays a pure function of its inputs.
 * @returns the presented panel model.
 */
export function presentDrawPanel(snapshot: DrawStatusSnapshot, now: () => number = Date.now): PresentedDrawPanel {
  return {
    pluginVersion: snapshot.pluginVersion,
    engines: snapshot.engines.map(engine => ({
      id: engine.id,
      model: engine.model,
      baseUrl: engine.baseUrl,
      apiKeyRef: engine.apiKeyRef,
      enabled: engine.enabled,
      preferred: engine.preferred,
      credentialConfigured: engine.credential.configured,
      ...(engine.credential.source !== undefined ? { credentialSource: engine.credential.source } : {}),
      credentialWritable: engine.credential.writable,
      consecutiveFailures: engine.health.consecutiveFailures,
      coolingDown: engine.health.cooldownUntil !== null && engine.health.cooldownUntil > now(),
      lastError: engine.health.lastError,
    })),
    quota: { maxGenerationsPerSession: snapshot.quota.maxGenerationsPerSession, maxBytesPerSession: snapshot.quota.maxBytesPerSession },
    requestTimeoutMs: snapshot.requestTimeoutMs,
    maxImagesPerCall: snapshot.maxImagesPerCall,
  }
}
