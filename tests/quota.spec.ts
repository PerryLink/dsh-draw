/**
 * Per-session quota accounting: usage folds from the durable `draw/generated`
 * session events, and both axes deny before any engine or store is touched.
 *
 * @module dsh-draw/test/quota.spec
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { SessionId } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import { appendDrawGenerated } from '../src/session-events.ts'
import { checkQuotaBytes, checkQuotaGenerations, quotaState } from '../src/quota.ts'

async function makeSession(): Promise<import('@deepseek-ai/dsh-session').Session> {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  const session = ctx.sessions.create(SessionId('quota-harness'))
  session.append('turn/start', { turn: 1 })
  return session
}

describe('quotaState', () => {
  it('folds generation and byte totals from the log', async () => {
    const session = await makeSession()
    appendDrawGenerated(session, {
      engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
      count: 2, bytes: 100, attachmentIds: ['a', 'b'], elapsedMs: 10,
    })
    appendDrawGenerated(session, {
      engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
      count: 1, bytes: 50, attachmentIds: ['c'], elapsedMs: 10,
    })
    expect(quotaState(session)).toEqual({ generations: 2, bytes: 150 })
  })

  it('is zero on a clean session', async () => {
    const session = await makeSession()
    expect(quotaState(session)).toEqual({ generations: 0, bytes: 0 })
  })
})

describe('checkQuotaGenerations', () => {
  it('allows below the cap and denies at the cap', async () => {
    const session = await makeSession()
    const limits = { maxGenerations: 1, maxBytes: 1_000_000 }
    expect(checkQuotaGenerations(session, limits).allowed).toBe(true)
    appendDrawGenerated(session, {
      engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
      count: 1, bytes: 100, attachmentIds: ['a'], elapsedMs: 10,
    })
    expect(checkQuotaGenerations(session, limits)).toMatchObject({ allowed: false, reason: 'generations' })
  })
})

describe('checkQuotaBytes', () => {
  it('denies when the incoming bytes would exceed the cap', async () => {
    const session = await makeSession()
    const limits = { maxGenerations: 100, maxBytes: 1_000 }
    appendDrawGenerated(session, {
      engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
      count: 1, bytes: 800, attachmentIds: ['a'], elapsedMs: 10,
    })
    expect(checkQuotaBytes(session, limits, 300)).toMatchObject({ allowed: false, reason: 'bytes' })
    expect(checkQuotaBytes(session, limits, 200).allowed).toBe(true)
  })
})
