/**
 * The `draw/generated` session event: append and fold, plus the version
 * tripwire that keeps `src/version.ts` in lockstep with package.json.
 *
 * @module dsh-draw/test/session-events.spec
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { SessionId } from '@deepseek-ai/dsh-session'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { appendDrawGenerated, drawGeneratedEvents } from '../src/session-events.ts'
import { PLUGIN_VERSION } from '../src/version.ts'

describe('draw/generated event', () => {
  it('appends one event and folds it back in order', async () => {
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    const session = ctx.sessions.create(SessionId('event-harness'))
    session.append('turn/start', { turn: 1 })
    appendDrawGenerated(session, {
      engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
      count: 1, bytes: 42, attachmentIds: ['a1'], elapsedMs: 7,
    })
    const events = drawGeneratedEvents(session)
    expect(events).toHaveLength(1)
    expect(events[0]?.data).toMatchObject({ engine: 'openai', bytes: 42, attachmentIds: ['a1'] })
  })
})

describe('version tripwire', () => {
  it('keeps src/version.ts in lockstep with package.json', () => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
    const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as { version: string }
    expect(PLUGIN_VERSION).toBe(pkg.version)
  })
})
