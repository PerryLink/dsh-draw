/**
 * Per-session quota accounting. The durable source of truth is the session
 * log: every completed generation appends one `draw/generated` event, and
 * quota is computed by folding those events, so usage survives restart and
 * fork and cannot drift from what the log records.
 *
 * @module dsh-draw/quota
 */

import type { Session } from '@deepseek-ai/dsh-session'
import { drawGeneratedEvents } from './session-events.ts'

/** The two quota axes. */
export interface QuotaLimits {
  /** Cap on generation calls (each call may produce several images). */
  maxGenerations: number
  /** Cap on generated image bytes. */
  maxBytes: number
}

/** Current usage, folded from the session log. */
export interface QuotaState {
  /** Generation calls recorded in the log. */
  generations: number
  /** Sum of recorded image bytes. */
  bytes: number
}

/** A denied quota check with the blocking axis and current state. */
export interface QuotaDenial {
  /** Discriminant. */
  allowed: false
  /** Which axis blocked the call. */
  reason: 'generations' | 'bytes'
  /** Usage at decision time. */
  state: QuotaState
}

/** An allowed quota check with the current state. */
export interface QuotaAllowance {
  /** Discriminant. */
  allowed: true
  /** Usage at decision time. */
  state: QuotaState
}

/** Quota decision. */
export type QuotaCheck = QuotaAllowance | QuotaDenial

/**
 * Fold one session's `draw/generated` events into current usage.
 *
 * @param session - session whose log is folded.
 * @returns generation and byte totals.
 */
export function quotaState(session: Session): QuotaState {
  let generations = 0
  let bytes = 0
  for (const event of drawGeneratedEvents(session)) {
    generations += 1
    bytes += event.data.bytes
  }
  return { generations, bytes }
}

/**
 * Check the generation-call axis before any engine is contacted: a session at
 * its cap fails fast without spending engine credits.
 *
 * @param session - owning session.
 * @param limits - configured limits.
 * @returns allowance or denial.
 */
export function checkQuotaGenerations(session: Session, limits: QuotaLimits): QuotaCheck {
  const state = quotaState(session)
  if (state.generations >= limits.maxGenerations) {
    return { allowed: false, reason: 'generations', state }
  }
  return { allowed: true, state }
}

/**
 * Check the byte axis after the engine produced images but before anything is
 * stored: the incoming bytes must fit under the cap, otherwise the images are
 * discarded without touching the attachment store.
 *
 * @param session - owning session.
 * @param limits - configured limits.
 * @param incomingBytes - bytes the new images would add.
 * @returns allowance or denial.
 */
export function checkQuotaBytes(session: Session, limits: QuotaLimits, incomingBytes: number): QuotaCheck {
  const state = quotaState(session)
  if (state.bytes + incomingBytes > limits.maxBytes) {
    return { allowed: false, reason: 'bytes', state }
  }
  return { allowed: true, state }
}
