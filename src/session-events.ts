/**
 * The dsh-draw session event: one durable record per completed generation
 * (tool call or panel regenerate), appended to the owning session log. It is
 * log-only (`ignorable`) and exists so quota accounting and the durable audit
 * trail are reconstructable from the log alone. The model-visible input and
 * output of the call ride the loop-owned `tool/call` and `tool/result`
 * events; this event carries the accounting facts those events do not.
 *
 * @module dsh-draw/session-events
 */

import type { Session } from '@deepseek-ai/dsh-session'

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
 * Append one `draw/generated` event to a session.
 *
 * @param session - owning session.
 * @param event - accounting payload.
 * @returns the logged event.
 */
export function appendDrawGenerated(session: Session, event: DrawGeneratedEvent) {
  // Two-argument append: the pinned 0.1.0-rc.6 peers have no append-envelope
  // option; the two-argument form typechecks against rc.6 and newer builds.
  return session.append('draw/generated', event)
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
