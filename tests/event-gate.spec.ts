/**
 * The adaptive session-event gate: host-known types append plainly, unknown
 * types append with the `ignorable` envelope only when the host honors it, and
 * are skipped otherwise — an unknown, unmarked event would make the session
 * refuse to load on restart under the rc.6/rc.7 static whitelist. On the
 * pinned rc.6 peers the probe reads false, so commits ride the in-memory
 * fallback ledger and quota stays exact for the live session.
 *
 * @module dsh-draw/test/event-gate.spec
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { KNOWN_SESSION_EVENT_TYPES, SessionId } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import { makeEventGate, makeHostEventGate, probeIgnorableAppend } from '../src/event-gate.ts'
import { quotaState } from '../src/quota.ts'
import {
  commitDrawGenerated,
  drawGeneratedEvents,
  fallbackDrawGeneratedEvents,
  type DrawGeneratedEvent,
} from '../src/session-events.ts'

function eventOf(over: Partial<DrawGeneratedEvent> = {}): DrawGeneratedEvent {
  return {
    engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
    count: 1, bytes: 128, attachmentIds: ['att-1'], elapsedMs: 1, ...over,
  }
}

async function makeSession(id: string): Promise<import('@deepseek-ai/dsh-session').Session> {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  return ctx.sessions.create(SessionId(id))
}

describe('makeEventGate', () => {
  it('appends host-known types plainly', () => {
    const gate = makeEventGate(KNOWN_SESSION_EVENT_TYPES, false)
    expect(gate('turn/start')).toEqual({ append: true, ignorable: false })
  })

  it('appends unknown types with the ignorable envelope when the host honors it', () => {
    const gate = makeEventGate(KNOWN_SESSION_EVENT_TYPES, true)
    expect(gate('draw/generated')).toEqual({ append: true, ignorable: true })
  })

  it('skips unknown types when the host cannot mark them ignorable', () => {
    const gate = makeEventGate(KNOWN_SESSION_EVENT_TYPES, false)
    expect(gate('draw/generated')).toEqual({ append: false, ignorable: false })
  })
})

describe('probeIgnorableAppend (pinned rc.6 peers)', () => {
  // Flips to true once the pinned peers gain the append envelope; the gate
  // assertions below stay valid under either reading.
  it('reads false: rc.6 append drops the unknown envelope options key', () => {
    expect(probeIgnorableAppend()).toBe(false)
  })

  it('makeHostEventGate gates draw/generated off but keeps host-known types', () => {
    const gate = makeHostEventGate()
    expect(gate('draw/generated')).toEqual({ append: false, ignorable: false })
    expect(gate('turn/start')).toEqual({ append: true, ignorable: false })
  })
})

describe('commitDrawGenerated', () => {
  it('closed gate: nothing logged, the fallback ledger keeps quota exact', async () => {
    const session = await makeSession('gate-closed')
    const gate = makeEventGate(KNOWN_SESSION_EVENT_TYPES, false)
    commitDrawGenerated(session, eventOf(), gate, () => {
      throw new Error('no warning expected on a gated skip')
    })
    expect(drawGeneratedEvents(session)).toHaveLength(0)
    expect(fallbackDrawGeneratedEvents(session)).toHaveLength(1)
    expect(quotaState(session)).toEqual({ generations: 1, bytes: 128 })
  })

  it('open gate: the event is logged and no fallback entry is kept', async () => {
    const session = await makeSession('gate-open')
    const gate = makeEventGate(new Set([...KNOWN_SESSION_EVENT_TYPES, 'draw/generated']), false)
    commitDrawGenerated(session, eventOf({ bytes: 64 }), gate, () => {})
    expect(drawGeneratedEvents(session)).toHaveLength(1)
    expect(fallbackDrawGeneratedEvents(session)).toHaveLength(0)
    expect(quotaState(session)).toEqual({ generations: 1, bytes: 64 })
  })

  it('append failure: warns and degrades to the fallback ledger', async () => {
    const session = await makeSession('gate-throw')
    const gate = makeEventGate(new Set([...KNOWN_SESSION_EVENT_TYPES, 'draw/generated']), false)
    const warnings: string[] = []
    const throwing = Object.assign(Object.create(Object.getPrototypeOf(session)) as typeof session, session, {
      append: () => { throw new Error('append boom') },
    })
    commitDrawGenerated(throwing, eventOf({ bytes: 32 }), gate, (message) => warnings.push(message))
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('append boom')
    expect(fallbackDrawGeneratedEvents(throwing)).toHaveLength(1)
    expect(quotaState(throwing)).toEqual({ generations: 1, bytes: 32 })
  })

  it('two gated commits accumulate in the ledger in order', async () => {
    const session = await makeSession('gate-accumulate')
    const gate = makeEventGate(KNOWN_SESSION_EVENT_TYPES, false)
    commitDrawGenerated(session, eventOf({ bytes: 10, prompt: 'first' }), gate, () => {})
    commitDrawGenerated(session, eventOf({ bytes: 20, prompt: 'second' }), gate, () => {})
    expect(fallbackDrawGeneratedEvents(session).map(event => event.prompt)).toEqual(['first', 'second'])
    expect(quotaState(session)).toEqual({ generations: 2, bytes: 30 })
  })
})
