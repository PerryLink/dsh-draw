/**
 * Plugin assembly: mount through the REAL Context + ToolRuntime, then drive
 * the `draw` Remote service and the `image_generate` tool end to end with
 * scripted transport, real attachments, and a fake credential provider.
 *
 * @module dsh-draw/test/index.spec
 */

import { describe, expect, it } from 'vitest'
import { quotaState } from '../src/quota.ts'
import type { DrawService } from '../src/service.ts'
import { CallId } from './call-id.ts'
import { mountHarness } from './harness.ts'

function okImages(count = 1) {
  const items = Array.from({ length: count }, () => ({ b64_json: btoa(`img-${Math.random()}`) }))
  return { status: 200, body: new TextEncoder().encode(JSON.stringify({ data: items })) }
}

describe('dsh-draw assembly', () => {
  it('registers the tool and serves the draw/status snapshot', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    expect(harness.ctx.tools.get('image_generate')).toBeDefined()
    const service = harness.ctx.get('draw') as DrawService
    const status = await service.status()
    expect(status.pluginVersion).toBe('0.2.2')
    expect(status.engines.map(engine => engine.id)).toEqual(['openai', 'cogview'])
    expect(status.engines[0]).toMatchObject({ preferred: true, credential: { configured: false } })
  })

  it('sets and unsets a credential through the draw remote', async () => {
    const harness = await mountHarness({ credentials: true })
    const service = harness.ctx.get('draw') as DrawService
    const set = await service.setCredential('openai', 'sk-secret')
    expect(set).toMatchObject({ engineId: 'openai', reference: 'OPENAI_API_KEY' })
    const status = await service.status()
    expect(status.engines[0]?.credential.configured).toBe(true)
    const unset = await service.unsetCredential('openai')
    expect(unset).toMatchObject({ engineId: 'openai' })
    expect((await service.status()).engines[0]?.credential.configured).toBe(false)
  })

  it('rejects a credential action for an unknown engine', async () => {
    const harness = await mountHarness({ credentials: true })
    const service = harness.ctx.get('draw') as DrawService
    await expect(service.setCredential('nope', 'x')).rejects.toThrow(/unknown engine/u)
  })

  it('serves a full generation through the tool with a real attachment', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    harness.credentials!.values.set('OPENAI_API_KEY', 'sk-test')
    harness.transport.next = okImages(1)
    const result = await harness.ctx.tools.execute({
      callId: CallId('assembly-spec-1'),
      name: 'image_generate',
      arguments: { prompt: 'a cat' },
      agent: harness.agent,
      signal: new AbortController().signal,
    })
    expect(result.isError).toBe(false)
    if (result.isError) return
    const value = result.value as { engine: string; images: Array<{ attachmentId: string }> }
    expect(value.engine).toBe('openai')
    expect(value.images[0]?.attachmentId).toBe('att-1')
    expect(harness.attachments?.saved).toHaveLength(1)
  })

  it('regenerates through the draw remote with the same durable path', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    harness.credentials!.values.set('OPENAI_API_KEY', 'sk-test')
    harness.transport.next = okImages(2)
    const service = harness.ctx.get('draw') as DrawService
    const result = await service.regenerate(String(harness.session.id), { prompt: 'a dog' })
    expect(result.engine).toBe('openai')
    expect(result.images).toHaveLength(2)
    // The pinned rc.6 peers cannot carry draw/generated safely (static event
    // whitelist, no ignorable envelope): the accounting payload rides the
    // in-memory fallback ledger — the log stays reloadable and quota folds it.
    expect(harness.session.events.filter(event => event.type === 'draw/generated')).toHaveLength(0)
    expect(quotaState(harness.session)).toEqual({ generations: 1, bytes: result.images.reduce((sum, image) => sum + image.bytes, 0) })
  })

  it('fails the regenerate path for an unknown session', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    const service = harness.ctx.get('draw') as DrawService
    await expect(service.regenerate('missing-session', { prompt: 'x' })).rejects.toThrow(/unknown session/u)
  })
})
