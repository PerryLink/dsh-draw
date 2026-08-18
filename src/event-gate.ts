/**
 * The session-event adaptive gate. `draw/generated` is declared only in this
 * package's types, so it sits outside every host's `KNOWN_SESSION_EVENT_TYPES`:
 * hosts whose session reader validates a static whitelist (rc.6/rc.7) refuse to
 * reopen a session containing the event unless it carries the `ignorable`
 * envelope — and those hosts' `Session.append` cannot stamp it. The gate
 * therefore appends only when the type is host-known or a mount-time probe
 * proves envelope support; otherwise the accounting payload goes to the
 * in-memory fallback ledger (see session-events.ts) so quota keeps working for
 * the live session without poisoning the log.
 *
 * @module dsh-draw/event-gate
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { KNOWN_SESSION_EVENT_TYPES } from '@deepseek-ai/dsh-session'

/** One gate decision: whether to append, and whether to mark ignorable. */
export interface EventGateDecision {
  /** Append the event to the session log. */
  append: boolean
  /** Stamp the `ignorable` envelope (only meaningful when append). */
  ignorable: boolean
}

/** Decision function over session event types. */
export type EventGate = (type: string) => EventGateDecision

/**
 * Build the gate: host-known types append plainly; unknown types append with
 * the ignorable envelope only when the host append honors it; everything else
 * is skipped — an unknown, unmarked event would make the session refuse to
 * load on restart under the rc.6/rc.7 static whitelist.
 *
 * @param knownTypes - the host's KNOWN_SESSION_EVENT_TYPES.
 * @param ignorableAppend - whether the host append stamps the envelope.
 * @returns the decision function.
 */
export function makeEventGate(knownTypes: ReadonlySet<string>, ignorableAppend = false): EventGate {
  return (type) => {
    if (knownTypes.has(type)) return { append: true, ignorable: false }
    if (ignorableAppend) return { append: true, ignorable: true }
    return { append: false, ignorable: false }
  }
}

/** The append face the probe needs; rc.6 types declare no envelope parameter. */
type EnvelopeAppend = (type: string, data: unknown, opts: { ignorable: boolean }) => { ignorable?: boolean } | undefined

/**
 * Probe whether the host `Session.append` stamps the ignorable envelope. Runs
 * on a fully detached SessionStore — never host persistence — appending one
 * probe event with `{ ignorable: true }` and reading the marker back. rc.6's
 * append silently drops the unknown options key (probe false); every failure
 * is contained as "unsupported".
 *
 * @returns whether the envelope is honored.
 */
export function probeIgnorableAppend(): boolean {
  try {
    const store = new SessionStore(new Context())
    const session = store.create()
    const event = (session.append as unknown as EnvelopeAppend)('draw/generated', {
      engine: 'probe',
      model: 'probe',
      source: 'tool',
      prompt: 'probe',
      size: 'auto',
      quality: 'auto',
      count: 0,
      bytes: 0,
      attachmentIds: [],
      elapsedMs: 0,
    }, { ignorable: true })
    return event?.ignorable === true
  } catch {
    return false
  }
}

/** The gate over the host's known types plus the probed envelope support. */
export function makeHostEventGate(): EventGate {
  return makeEventGate(KNOWN_SESSION_EVENT_TYPES, probeIgnorableAppend())
}
