/**
 * The tool surface through the REAL tool pipeline: registration, argument
 * validation, the canonical value, the render content (image blocks), the
 * replayable presentation meta, and failure materialization.
 *
 * @module dsh-draw/test/tool.spec
 */

import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { imageGenerateTool } from '../src/tool.ts'
import { Drawer } from '../src/drawer.ts'
import { EngineRouter } from '../src/router.ts'
import { CallId } from './call-id.ts'
import { FakeAttachmentStore, mountHarness, ScriptedTransport, testEventSink, type Harness } from './harness.ts'

function okImages(count = 1) {
  const items = Array.from({ length: count }, () => ({ b64_json: btoa(`img-${Math.random()}`) }))
  return { status: 200, body: new TextEncoder().encode(JSON.stringify({ data: items })) }
}

let callCounter = 0

async function callTool(harness: Harness, name: string, args: unknown): Promise<ToolExecutionResult> {
  callCounter += 1
  return harness.ctx.tools.execute({
    callId: CallId(`tool-spec-${callCounter}`),
    name,
    arguments: args,
    agent: harness.agent,
    signal: new AbortController().signal,
  })
}

describe('image_generate through the real registry', () => {
  it('registers the tool', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    expect(harness.ctx.tools.get('image_generate')).toBeDefined()
    // The registry's normalized model projection: `required: true` collapses
    // into the top-level required list and the parameter surface stays intact.
    const schema = harness.ctx.tools.schemas().find(entry => entry.name === 'image_generate')!
    expect(schema.parameters).toMatchObject({
      type: 'object',
      required: ['prompt'],
      properties: {
        prompt: { type: 'string', description: 'Image prompt.' },
        size: { type: 'string', enum: ['square', 'landscape', 'portrait', 'auto'] },
        count: { type: 'integer' },
        engine: { type: 'string' },
      },
    })
  })

  it('generates, renders image blocks, and carries the presentation meta', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    harness.credentials!.values.set('OPENAI_API_KEY', 'sk-test')
    harness.transport.next = okImages(2)
    const result = await callTool(harness, 'image_generate', { prompt: 'a cat', size: 'landscape' })
    expect(result.isError).toBe(false)
    if (result.isError) return
    const value = result.value as { ok: boolean; engine: string; images: unknown[]; fallbackUsed: boolean }
    expect(value.ok).toBe(true)
    expect(value.engine).toBe('openai')
    expect(value.images).toHaveLength(2)
    expect(value.fallbackUsed).toBe(false)
    expect(result.content.some((block: ContentBlock) => block.type === 'image')).toBe(true)
    expect(result.meta).toMatchObject({ ok: true, engine: 'openai' })
  })

  it('rejects a missing prompt through the registry schema', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    const result = await callTool(harness, 'image_generate', {})
    expect(result.isError).toBe(true)
  })

  it('materializes an engine failure as a model-readable error', async () => {
    const harness = await mountHarness({ attachments: true, credentials: true })
    harness.transport.next = { status: 500, body: new Uint8Array() }
    const result = await callTool(harness, 'image_generate', { prompt: 'a cat' })
    expect(result.isError).toBe(true)
    if (result.isError) expect(result.error.message).toContain('no configured engine produced images')
  })
})

describe('imageGenerateTool construction', () => {
  it('builds the named tool over a standalone drawer', async () => {
    const config = resolveConfig(undefined)
    const transport = new ScriptedTransport()
    transport.next = okImages(1)
    const router = new EngineRouter(config, { failureThreshold: 2, cooldownMs: 60_000 })
    const { Context } = await import('@deepseek-ai/cordis')
    const SessionStoreModule = await import('@deepseek-ai/dsh-session')
    const ctx = new Context()
    await ctx.plugin(SessionStoreModule.default as unknown as import('@deepseek-ai/cordis').Plugin, {})
    const session = ctx.sessions.create(SessionStoreModule.SessionId('standalone'))
    session.append('turn/start', { turn: 1 })
    await ctx.plugin(FakeAttachmentStore as unknown as import('@deepseek-ai/cordis').Plugin, {})
    const attachments = ctx.get('attachments') as unknown as FakeAttachmentStore
    const drawer = new Drawer(config, router, {
      engine: { transport, resolveCredential: async () => 'k' },
      attachments: () => attachments,
      sessions: () => ctx.sessions,
    }, testEventSink)
    const tool = imageGenerateTool(drawer, config)
    expect(tool.name).toBe('image_generate')
  })
})
