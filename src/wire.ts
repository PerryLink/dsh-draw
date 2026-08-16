/**
 * The panel's wire vocabulary: the snapshot and action types served over the
 * `draw` Remote namespace, their zod v4 validation schemas (the strict codecs
 * both Typert faces carry), and the invocation descriptors shared verbatim by
 * the host `./typert` manifest and the client Remote contribution. One
 * canonical source for both faces keeps the host and client codecs from ever
 * drifting apart.
 *
 * @module dsh-draw/wire
 */

import { z } from 'zod'
import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'
import type { AttemptView, EngineStatus, ProbeOutcome } from './router.ts'
import type { QuotaLimits, QuotaState } from './quota.ts'
import type { DrawImage } from './drawer.ts'

/** Credential facts for one engine, safe for configuration UIs — never the value. */
export interface EngineCredentialView {
  /** Whether the reference currently resolves to a value. */
  configured: boolean
  /** Source layer supplying the value; absent while unconfigured. */
  source?: string
  /** Whether the panel may store a value for this reference. */
  writable: boolean
}

/** One engine's panel view. */
export interface EngineView {
  /** Engine id. */
  id: string
  /** Engine model name. */
  model: string
  /** Sanitized API root. */
  baseUrl: string
  /** Credential reference (environment-variable name); never a value. */
  apiKeyRef: string
  /** Whether the router may use this engine. */
  enabled: boolean
  /** Whether the router prefers this engine. */
  preferred: boolean
  /** Credential resolution facts. */
  credential: EngineCredentialView
  /** Routing health. */
  health: {
    /** Consecutive failures since the last success. */
    consecutiveFailures: number
    /** Epoch ms until which the engine is in cooldown; `null` = not cooling down. */
    cooldownUntil: number | null
    /** Display-safe last failure detail; `null` = none. */
    lastError: string | null
    /** HTTP status of the last failure; `null` = none. */
    lastStatus: number | null
  }
}

/** The complete panel snapshot served by `draw/status`. */
export interface DrawStatusSnapshot {
  /** Plugin build version. */
  pluginVersion: string
  /** Engine chain in config order. */
  engines: readonly EngineView[]
  /** Effective quota limits. */
  quota: {
    /** Per-session generation-call cap. */
    maxGenerationsPerSession: number
    /** Per-session image-byte cap. */
    maxBytesPerSession: number
  }
  /** Per-generation request timeout in milliseconds. */
  requestTimeoutMs: number
  /** Cap on images one call may produce. */
  maxImagesPerCall: number
}

/** Strict wire schema for {@link DrawStatusSnapshot} (zod v4, both Typert faces). */
export const DRAW_STATUS_SCHEMA = z.object({
  pluginVersion: z.string(),
  engines: z.array(z.object({
    id: z.string(),
    model: z.string(),
    baseUrl: z.string(),
    apiKeyRef: z.string(),
    enabled: z.boolean(),
    preferred: z.boolean(),
    credential: z.object({
      configured: z.boolean(),
      source: z.string().optional(),
      writable: z.boolean(),
    }),
    health: z.object({
      consecutiveFailures: z.number().int(),
      cooldownUntil: z.number().int().nullable(),
      lastError: z.string().nullable(),
      lastStatus: z.number().int().nullable(),
    }),
  })),
  quota: z.object({
    maxGenerationsPerSession: z.number().int(),
    maxBytesPerSession: z.number().int(),
  }),
  requestTimeoutMs: z.number().int(),
  maxImagesPerCall: z.number().int(),
})

/** Result of the `draw/probe` invocation: one engine's connectivity check. */
export interface DrawProbeResult {
  /** Engine id. */
  engineId: string
  /** Whether the endpoint answered with any HTTP status. */
  reachable: boolean
  /** HTTP status when one existed. */
  httpStatus: number | null
  /** Sanitized probed URL. */
  target: string
  /** Display-safe note. */
  note: string
  /** Whether the credential reference resolved at probe time. */
  credentialConfigured: boolean
}

/** Strict wire schema for {@link DrawProbeResult}. */
export const DRAW_PROBE_SCHEMA = z.object({
  engineId: z.string(),
  reachable: z.boolean(),
  httpStatus: z.number().int().nullable(),
  target: z.string(),
  note: z.string(),
  credentialConfigured: z.boolean(),
})

/** Result of the `draw/setCredential` and `draw/unsetCredential` invocations. */
export interface CredentialActionResult {
  /** Engine id the action targeted. */
  engineId: string
  /** Credential reference the value was stored under / removed from. */
  reference: string
  /** Display-safe confirmation. */
  note: string
}

/** Strict wire schema for {@link CredentialActionResult}. */
export const CREDENTIAL_ACTION_SCHEMA = z.object({
  engineId: z.string(),
  reference: z.string(),
  note: z.string(),
})

/** One regenerated image as the wire carries it (lossless JSON only). */
export interface DrawImageWire {
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

/** The regenerate result served by `draw/regenerate`. */
export interface DrawRegenerateResult {
  /** Engine id that produced the images. */
  engine: string
  /** Engine model name. */
  model: string
  /** Standard size vocabulary value of the request. */
  size: string
  /** Durable result images. */
  images: readonly DrawImageWire[]
  /** Usage after this generation committed. */
  quota: QuotaState
  /** Quota limits in force. */
  quotaLimits: QuotaLimits
  /** Whether an earlier engine in the chain failed first. */
  fallbackUsed: boolean
  /** Engine round-trip latency in milliseconds. */
  elapsedMs: number
  /** Every router attempt in chain order (display-safe). */
  attempts: readonly AttemptView[]
}

/** Strict wire schema for {@link DrawRegenerateResult}. */
export const DRAW_REGENERATE_SCHEMA = z.object({
  engine: z.string(),
  model: z.string(),
  size: z.string(),
  images: z.array(z.object({
    attachmentId: z.string(),
    mediaType: z.string(),
    bytes: z.number().int(),
    width: z.number().int(),
    height: z.number().int(),
    name: z.string().optional(),
  })),
  quota: z.object({ generations: z.number().int(), bytes: z.number().int() }),
  quotaLimits: z.object({ maxGenerations: z.number().int(), maxBytes: z.number().int() }),
  fallbackUsed: z.boolean(),
  elapsedMs: z.number().int(),
  attempts: z.array(z.object({
    engine: z.string(),
    phase: z.union([z.literal('credential'), z.literal('request'), z.literal('parse')]).optional(),
    code: z.string(),
    message: z.string().optional(),
    status: z.number().int().optional(),
  })),
})

/** Project a draw outcome image onto the wire shape. */
export function imageToWire(image: DrawImage): DrawImageWire {
  return {
    attachmentId: image.attachmentId,
    mediaType: image.mediaType,
    bytes: image.bytes,
    width: image.width,
    height: image.height,
    ...(image.name !== undefined ? { name: image.name } : {}),
  }
}

/** Project a router engine status onto the panel view shape. */
export function statusToView(status: EngineStatus, engine: { id: string; model: string; baseUrl: string; apiKeyRef: string; enabled: boolean; preferred: boolean }, credential: EngineCredentialView): EngineView {
  return {
    id: engine.id,
    model: engine.model,
    baseUrl: engine.baseUrl,
    apiKeyRef: engine.apiKeyRef,
    enabled: engine.enabled,
    preferred: engine.preferred,
    credential,
    health: {
      consecutiveFailures: status.consecutiveFailures,
      cooldownUntil: status.cooldownUntil,
      lastError: status.lastError,
      lastStatus: status.lastStatus,
    },
  }
}

/** Project a probe outcome onto the wire shape. */
export function probeToWire(probe: ProbeOutcome): DrawProbeResult {
  return {
    engineId: probe.engineId,
    reachable: probe.reachable,
    httpStatus: probe.httpStatus,
    target: probe.target,
    note: probe.note,
    credentialConfigured: probe.credentialConfigured,
  }
}

/** JSON codec for one engine id. */
const ENGINE_ID_CODEC = z.string()

/** JSON codec for one credential value (non-empty). */
const CREDENTIAL_VALUE_CODEC = z.string().min(1)

/** JSON codec for regenerate arguments: the original tool args, verbatim. */
const REGENERATE_ARGS_CODEC = z.object({
  prompt: z.string().min(1),
  size: z.string().optional(),
  count: z.number().int().optional(),
  quality: z.string().optional(),
  style: z.string().optional(),
  engine: z.string().optional(),
}).passthrough()

/** JSON codec for one session id (the wire carries the branded id as a string). */
const SESSION_ID_CODEC = z.string().min(1)

/**
 * The `draw/status` invocation descriptor: the settings-panel snapshot.
 */
export const DRAW_STATUS_DESCRIPTOR = Object.freeze({
  id: 'dsh-draw#draw/status',
  service: 'dsh-draw',
  namespace: 'draw',
  method: 'status',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-draw/types#DrawStatusSnapshot',
    schema: DRAW_STATUS_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/**
 * The `draw/probe` invocation descriptor: one engine's connectivity check.
 */
export const DRAW_PROBE_DESCRIPTOR = Object.freeze({
  id: 'dsh-draw#draw/probe',
  service: 'dsh-draw',
  namespace: 'draw',
  method: 'probe',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([Object.freeze({
    name: 'engineId',
    wire: 'engineId',
    source: 'json',
    codec: Object.freeze({
      mode: 'strict',
      typeSymbol: 'dsh-draw/types#EngineId',
      schema: ENGINE_ID_CODEC,
    }),
  } satisfies InvocationDescriptor['parameters'][number])]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-draw/types#DrawProbeResult',
    schema: DRAW_PROBE_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/**
 * The `draw/setCredential` invocation descriptor: store an API key under the
 * engine's credential reference. The value crosses the wire once and is never
 * logged, snapshotted, or returned.
 */
export const DRAW_SET_CREDENTIAL_DESCRIPTOR = Object.freeze({
  id: 'dsh-draw#draw/setCredential',
  service: 'dsh-draw',
  namespace: 'draw',
  method: 'setCredential',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([
    Object.freeze({
      name: 'engineId',
      wire: 'engineId',
      source: 'json',
      codec: Object.freeze({ mode: 'strict', typeSymbol: 'dsh-draw/types#EngineId', schema: ENGINE_ID_CODEC }),
    } satisfies InvocationDescriptor['parameters'][number]),
    Object.freeze({
      name: 'value',
      wire: 'value',
      source: 'json',
      codec: Object.freeze({ mode: 'strict', typeSymbol: 'dsh-draw/types#CredentialValue', schema: CREDENTIAL_VALUE_CODEC }),
    } satisfies InvocationDescriptor['parameters'][number]),
  ]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-draw/types#CredentialActionResult',
    schema: CREDENTIAL_ACTION_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/**
 * The `draw/unsetCredential` invocation descriptor: remove a stored API key.
 */
export const DRAW_UNSET_CREDENTIAL_DESCRIPTOR = Object.freeze({
  id: 'dsh-draw#draw/unsetCredential',
  service: 'dsh-draw',
  namespace: 'draw',
  method: 'unsetCredential',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([Object.freeze({
    name: 'engineId',
    wire: 'engineId',
    source: 'json',
    codec: Object.freeze({ mode: 'strict', typeSymbol: 'dsh-draw/types#EngineId', schema: ENGINE_ID_CODEC }),
  } satisfies InvocationDescriptor['parameters'][number])]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-draw/types#CredentialActionResult',
    schema: CREDENTIAL_ACTION_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/**
 * The `draw/regenerate` invocation descriptor: re-run a generation from the
 * result card with the original tool args. The host re-runs the full drawer
 * path (quota, routing, attachment storage, audit event) so a regenerate is
 * as durable and accounted as a tool call.
 */
export const DRAW_REGENERATE_DESCRIPTOR = Object.freeze({
  id: 'dsh-draw#draw/regenerate',
  service: 'dsh-draw',
  namespace: 'draw',
  method: 'regenerate',
  invocation: Object.freeze({ kind: 'direct' }),
  parameters: Object.freeze([
    Object.freeze({
      name: 'sessionId',
      wire: 'sessionId',
      source: 'json',
      codec: Object.freeze({ mode: 'strict', typeSymbol: 'dsh-draw/types#SessionId', schema: SESSION_ID_CODEC }),
    } satisfies InvocationDescriptor['parameters'][number]),
    Object.freeze({
      name: 'args',
      wire: 'args',
      source: 'json',
      codec: Object.freeze({ mode: 'strict', typeSymbol: 'dsh-draw/types#RegenerateArgs', schema: REGENERATE_ARGS_CODEC }),
    } satisfies InvocationDescriptor['parameters'][number]),
  ]),
  result: Object.freeze({
    mode: 'strict',
    typeSymbol: 'dsh-draw/types#DrawRegenerateResult',
    schema: DRAW_REGENERATE_SCHEMA,
  }),
  sourceLocation: Object.freeze({ file: 'src/wire.ts', line: 1, column: 1 }),
} as const) satisfies InvocationDescriptor

/** The canonical invocation list both Typert faces register. */
export const DRAW_INVOCATIONS = Object.freeze([
  DRAW_STATUS_DESCRIPTOR,
  DRAW_PROBE_DESCRIPTOR,
  DRAW_SET_CREDENTIAL_DESCRIPTOR,
  DRAW_UNSET_CREDENTIAL_DESCRIPTOR,
  DRAW_REGENERATE_DESCRIPTOR,
])
