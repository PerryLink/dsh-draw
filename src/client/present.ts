/**
 * Pure presentation projections for the dsh-draw browser half: the tool
 * result value and the settings snapshot are folded into view models that the
 * React components render without further logic. Everything here is a pure
 * function of its input, so tests pin the projections without a DOM.
 *
 * @module dsh-draw/client/present
 */

import type { DrawStatusSnapshot } from '../wire.ts'

/**
 * Local structural contract for the frozen tool-call block the card reads.
 * Declared locally because the owning packages publish the block union
 * differently across host lines: the published `0.1.1-rc.2` line keeps it in
 * the removed `dsh-client-runtime` package, and the unreleased
 * `0.1.2-alpha.1` host owns it in the unpublished `dsh-client-ui-chat`. The
 * runtime contract is structural — the presenter only discriminates on
 * `kind` and reads the call head, error flag, and meta.
 */

/** One frozen running tool call (no `kind`; the presenter's first guard drops it). */
export interface RunningToolCallBlock {
  /** Tool call identity, stable across running and settled forms. */
  callId: string
  /** Wire tool name. */
  name: string
  /** Verbatim serialized arguments. */
  argsRaw: string
  /** Owning turn. */
  turn: number
  /** Owning step. */
  step: number
  /** Unix epoch ms when the call was logged. */
  time: number
}

/** One settled tool result (fields the presenter reads). */
export interface SettledToolResultBlock {
  kind: 'tool-result'
  isError: boolean
  /** Call head; null when window truncation left the call outside. */
  call: { name: string; argsRaw: string } | null
  /** Tool-owned presentation metadata (the card's engine/quota/limits facts). */
  meta?: unknown
}

/** Frozen running-or-settled tool block. */
export type ToolCallBlock = RunningToolCallBlock | SettledToolResultBlock

/** Settled tool-result node only. */
export type ToolResultNode = SettledToolResultBlock

/**
 * The Host's tool-call-view stage discriminant. The Host splits the owner
 * currency into `preparing` / `start` / `result`, each carrying its own stage
 * block, and dispatches the SAME keyed entry in every stage — so a keyed card
 * receives a preparing owner whose block has no `kind` and no `argsRaw`.
 *
 * {@link TOOL_CALL_PHASES} is the single source of truth for this union: the
 * literal type is derived from the array, so a value and its type can never
 * drift apart, and `scripts/verify-host-contract.mjs` compares the array
 * against the Host's own `ToolCallPhaseProps` declaration.
 */
export const TOOL_CALL_PHASES = ['preparing', 'start', 'result'] as const

/** One stage of the Host's tool-call view. */
export type ToolCallPhase = (typeof TOOL_CALL_PHASES)[number]

/**
 * Classify a frozen tool block into its Host stage, mirroring the Host's own
 * `toolCallPhase`: a settled node wins on `kind`, and the running family splits
 * on `phase`. `ToolCallBlock` is structurally narrower than the Host union
 * (`RunningToolCallBlock` declares no `phase` field), so the running arm is
 * read through a structural probe rather than a declared member.
 *
 * @param block - the frozen tool block the owner delivered.
 * @returns the stage this block belongs to.
 */
export function toolCallPhase(block: ToolCallBlock): ToolCallPhase {
  if ('kind' in block) return 'result'
  return (block as { phase?: unknown }).phase === 'preparing' ? 'preparing' : 'start'
}

/** How a card presents one stage of its own keyed tool call. */
export interface PresentedToolCallPhase {
  /** The Host stage this presentation covers. */
  phase: ToolCallPhase
  /**
   * Whether this stage carries a settled result to present, or whether the
   * card must render its own in-flight row for a call still arriving.
   */
  state: 'result' | 'in-flight'
}

/**
 * Project the card's one appearance per Host stage.
 *
 * Only the `result` stage carries the engine/quota facts and the regenerate
 * action. The earlier stages have no arguments and no result, and the keyed
 * slot is OCCUPIED for them — the Host's own generic row is unreachable
 * (the renderer falls back only for an empty cell) — so the card owning an
 * in-flight row is what keeps the row visible while the call streams.
 *
 * A stage outside the declared vocabulary is reported loudly instead of being
 * silently swept into `preparing`; the `switch` is exhaustive over
 * {@link ToolCallPhase}, so a new stage fails the build before it can reach
 * this default.
 *
 * @param phase - the stage classified from the owner's block.
 * @returns the presentation this card owes that stage.
 */
export function presentToolCallPhase(phase: ToolCallPhase): PresentedToolCallPhase {
  switch (phase) {
    case 'result':
      return { phase, state: 'result' }
    case 'preparing':
    case 'start':
      return { phase, state: 'in-flight' }
    default:
      return exhaustiveToolCallPhase(phase)
  }
}

/**
 * Compile-time completeness check for the stage vocabulary: a new Host stage
 * added to {@link ToolCallPhase} without a branch above fails the build here.
 *
 * @param phase - the unhandled stage.
 * @returns never; throws at runtime.
 */
function exhaustiveToolCallPhase(phase: never): never {
  throw new Error(`unhandled tool-call phase: ${JSON.stringify(phase)}`)
}

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
 * The stage guard is explicit, not incidental: only the Host's `result` stage
 * carries `kind`, and the preparing stage's block is an ordinary object, so
 * an `undefined` return is the presenter's answer for every non-result stage
 * as well as for a foreign tool, an error result, or a window-truncated call
 * head. The card pairs that answer with {@link toolCallPhase} to render its
 * in-flight row instead of an empty node.
 *
 * @param block - the frozen tool-call block (running or settled).
 * @returns the presented model, or `undefined` when the block is not a settled
 *   image_generate result.
 */
export function presentDrawResult(block: ToolCallBlock): PresentedDrawResult | undefined {
  if (toolCallPhase(block) !== 'result') return undefined
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
