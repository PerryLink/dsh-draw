/**
 * The drawer: one path owns validation, quota, routing, attachment storage,
 * and the audit event. Success, every failure reason, and the audit event
 * are pinned end to end with scripted engines.
 *
 * @module dsh-draw/test/drawer.spec
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { SessionId, type Session } from '@deepseek-ai/dsh-session'
import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { Drawer } from '../src/drawer.ts'
import type { HttpRequest, HttpResponse, HttpTransport } from '../src/http.ts'
import { EngineRouter } from '../src/router.ts'
import { FakeAttachmentStore, testEventSink } from './harness.ts'

const config = resolveConfig(undefined)

class ScriptedTransport implements HttpTransport {
  responses: (HttpResponse | Error)[] = []
  requests: HttpRequest[] = []

  request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    const next = this.responses.shift()
    if (next === undefined) throw new Error('not scripted')
    if (next instanceof Error) return Promise.reject(next)
    return Promise.resolve(next)
  }
}

function okImages(count = 1): HttpResponse {
  const items = Array.from({ length: count }, () => ({ b64_json: btoa(`img-${Math.random()}`) }))
  return { status: 200, body: new TextEncoder().encode(JSON.stringify({ data: items })) }
}

async function assemble(options: { session?: boolean; attachments?: boolean } = {}) {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  let session: Session | undefined
  if (options.session !== false) {
    session = ctx.sessions.create(SessionId('drawer-harness'))
    session.append('turn/start', { turn: 1 })
  }
  if (options.attachments === true) await ctx.plugin(FakeAttachmentStore)
  const transport = new ScriptedTransport()
  const router = new EngineRouter(config, { failureThreshold: 2, cooldownMs: 60_000 })
  const attachments = ctx.get('attachments') as unknown as FakeAttachmentStore | undefined
  const drawer = new Drawer(config, router, {
    engine: { transport, resolveCredential: async () => 'k' },
    attachments: () => attachments,
    sessions: () => ctx.sessions,
  }, testEventSink)
  return { drawer, transport, session, attachments }
}

describe('Drawer.generate', () => {
  it('generates, saves attachments, and appends the audit event', async () => {
    const { drawer, transport, session, attachments } = await assemble({ attachments: true })
    transport.responses.push(okImages(2))
    const outcome = await drawer.generate({ prompt: 'a cat', size: 'landscape' }, { session, source: 'tool' })
    expect(outcome.ok).toBe(true)
    if (outcome.ok) {
      expect(outcome.engine).toBe('openai')
      expect(outcome.images).toHaveLength(2)
      expect(outcome.images[0]?.attachmentId).toBe('att-1')
      expect(outcome.quota).toEqual({ generations: 1, bytes: outcome.images.reduce((sum, image) => sum + image.bytes, 0) })
      expect(outcome.fallbackUsed).toBe(false)
    }
    expect(attachments?.saved).toHaveLength(2)
    const events = session!.snapshotEvents().filter(event => event.type === 'draw/generated')
    expect(events).toHaveLength(1)
    expect(events[0]?.data).toMatchObject({ engine: 'openai', source: 'tool', size: 'landscape', count: 2 })
  })

  it('rejects an empty prompt before any engine call', async () => {
    const { drawer, transport, session } = await assemble()
    const outcome = await drawer.generate({ prompt: '   ' }, { session, source: 'tool' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.reason).toBe('invalid-prompt')
    expect(transport.requests).toHaveLength(0)
  })

  it('rejects an over-long prompt', async () => {
    const { drawer, transport, session } = await assemble()
    const outcome = await drawer.generate({ prompt: 'x'.repeat(config.maxPromptLength + 1) }, { session, source: 'tool' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.reason).toBe('invalid-prompt')
    expect(transport.requests).toHaveLength(0)
  })

  it('fails with no-session before any engine call', async () => {
    const { drawer, transport } = await assemble({ session: false })
    const outcome = await drawer.generate({ prompt: 'a cat' }, { session: undefined, source: 'tool' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.reason).toBe('no-session')
    expect(transport.requests).toHaveLength(0)
  })

  it('fails with all-engines-failed when routing exhausts the chain', async () => {
    const { drawer, transport, session } = await assemble()
    transport.responses.push({ status: 500, body: new Uint8Array() }, { status: 500, body: new Uint8Array() })
    const outcome = await drawer.generate({ prompt: 'a cat' }, { session, source: 'tool' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) {
      expect(outcome.reason).toBe('all-engines-failed')
      expect(outcome.attempts?.map(attempt => attempt.engine)).toEqual(['openai', 'cogview'])
    }
  })

  it('fails with attachments-unavailable when the store is not composed', async () => {
    const { drawer, transport, session } = await assemble()
    transport.responses.push(okImages(1))
    const outcome = await drawer.generate({ prompt: 'a cat' }, { session, source: 'tool' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.reason).toBe('attachments-unavailable')
  })

  it('denies the byte quota before saving anything', async () => {
    const { transport, session, attachments } = await assemble({ attachments: true })
    const tight = resolveConfig({ maxBytesPerSession: 1024 * 1024 })
    const router = new EngineRouter(tight, { failureThreshold: 2, cooldownMs: 60_000 })
    const tightDrawer = new Drawer(tight, router, {
      engine: { transport, resolveCredential: async () => 'k' },
      attachments: () => attachments,
      sessions: () => (session === undefined ? undefined : ({} as never)),
    }, testEventSink)
    session!.append('draw/generated', {
      engine: 'openai', model: 'm', source: 'tool', prompt: 'p', size: 'square', quality: 'auto',
      count: 1, bytes: 1024 * 1024, attachmentIds: ['pre'], elapsedMs: 1,
    } as never)
    transport.responses.push(okImages(1))
    const outcome = await tightDrawer.generate({ prompt: 'a cat' }, { session, source: 'tool' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.reason).toBe('quota-bytes')
    expect(attachments?.saved).toHaveLength(0)
  })
})
