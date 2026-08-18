/**
 * The dsh-draw session event: one durable record per completed generation
 * (tool call or panel regenerate), appended to the owning session log. It is
 * log-only (`ignorable`) and exists so quota accounting and the durable audit
 * trail are reconstructable from the log alone. The model-visible input and
 * output of the call ride the loop-owned `tool/call` and `tool/result`
 * events; this event carries the accounting facts those events do not.
 *
 * The event type is declared only here, so plugin paths append it through
 * {@link commitDrawGenerated}: the adaptive gate (event-gate.ts) appends only
 * when the host knows the type or honors the `ignorable` envelope, and
 * otherwise records the payload in the in-memory fallback ledger (live-session
 * quota keeps working; the durable trail resumes once the host gains a plugin
 * event surface).
 *
 * @module dsh-draw/session-events
 */

import type { Session } from '@deepseek-ai/dsh-session'
import type { EventGate } from './event-gate.ts'

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    /**
     * One completed image generation: engine, standardized request, produced
     * bytes, and the durable attachment ids. Log-only UI/accounting state.
     */
    'draw/generated': DrawGeneratedEvent
  }
}

/** Payload of the `draw/generated` session event. */
export interface DrawGeneratedEvent {
  /** Engine id that produced the images. */
  engine: string
  /** Engine model name. */
  model: string
  /** Who requested the generation: the tool body or a panel regenerate. */
  source: 'tool' | 'regenerate'
  /** The standardized prompt, verbatim from the model request. */
  prompt: string
  /** Standard size vocabulary value of the request. */
  size: 'square' | 'landscape' | 'portrait' | 'auto'
  /** Standard quality value of the request. */
  quality: 'low' | 'medium' | 'high' | 'auto'
  /** Number of images produced. */
  count: number
  /** Sum of the produced image byte lengths. */
  bytes: number
  /** Durable attachment ids in result order. */
  attachmentIds: readonly string[]
  /** Engine round-trip latency in milliseconds. */
  elapsedMs: number
}

/**
 * Append one `draw/generated` event to a session, ungated. Plugin paths use
 * {@link commitDrawGenerated} instead; this raw form remains for tests and
 * hosts that know the type.
 *
 * @param session - owning session.
 * @param event - accounting payload.
 * @returns the logged event.
 */
export function appendDrawGenerated(session: Session, event: DrawGeneratedEvent) {
  return session.append('draw/generated', event)
}

/** The append face with the envelope option; rc.6 types declare none. */
type EnvelopeAppend = (type: string, data: unknown, opts: { ignorable: boolean }) => unknown

/**
 * In-memory accounting ledger for hosts whose session log cannot carry
 * `draw/generated` safely (rc.6/rc.7 static whitelist, no ignorable envelope).
 * Keyed by Session identity: the entries live exactly as long as the session.
 */
const fallbackLedger = new WeakMap<Session, DrawGeneratedEvent[]>()

/**
 * Commit one completed generation: append the `draw/generated` event when the
 * gate allows (with the ignorable envelope when required), otherwise record
 * the payload in the in-memory fallback ledger. A failed append degrades to
 * the same ledger and never breaks the draw.
 *
 * @param session - owning session.
 * @param event - accounting payload.
 * @param gate - the adaptive gate (event-gate.ts).
 * @param warn - log warning sink for append failures.
 */
export function commitDrawGenerated(session: Session, event: DrawGeneratedEvent, gate: EventGate, warn: (message: string) => void): void {
  const decision = gate('draw/generated')
  if (decision.append) {
    try {
      if (decision.ignorable) {
        ;(session.append as unknown as EnvelopeAppend)('draw/generated', event, { ignorable: true })
      } else {
        session.append('draw/generated', event)
      }
      return
    } catch (error) {
      warn(`draw session event append failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  const list = fallbackLedger.get(session) ?? []
  list.push(event)
  fallbackLedger.set(session, list)
}

/**
 * The in-memory fallback records of a session, in commit order. Populated
 * only while the host cannot carry `draw/generated` in the log; quota folds
 * these on top of the logged events.
 *
 * @param session - session whose ledger is read.
 * @returns the fallback payloads.
 */
export function fallbackDrawGeneratedEvents(session: Session): readonly DrawGeneratedEvent[] {
  return fallbackLedger.get(session) ?? []
}

/**
 * Collect the `draw/generated` events of a session in log order. Declaration
 * merging narrows `event.type === 'draw/generated'` to the payload type.
 *
 * @param session - session whose log is scanned.
 * @returns the accounting events.
 */
export function drawGeneratedEvents(session: Session): readonly import('@deepseek-ai/dsh-session').SessionEvent<'draw/generated'>[] {
  return session.events.filter(event => event.type === 'draw/generated')
}
