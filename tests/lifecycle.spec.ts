/**
 * Fiber-disposal / HMR-safety suite: mounting the plugin over the REAL tool
 * runtime, disposing its contributing fiber, and re-querying the authoritative
 * registries to prove the `image_generate` tool and the `draw` service both
 * disappear.
 * @module dsh-draw/tests/lifecycle.spec
 */

import { Context } from '@deepseek-ai/cordis'
import SessionStore, { SessionId } from '@deepseek-ai/dsh-session'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import { describe, expect, it } from 'vitest'
import { ScriptedTransport } from './harness.ts'

async function mount() {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  const session = ctx.sessions.create(SessionId('draw-lifecycle'))
  session.append('turn/start', { turn: 1 })
  ctx.provide('systemPrompt', { tools: () => () => undefined, section: () => () => undefined } as never)
  await ctx.plugin(ToolRuntime)
  ctx.provide('dsh-draw/transport', new ScriptedTransport())
  const plugin = await import('../src/index.ts')
  const fiber = await ctx.plugin(plugin as unknown as import('@deepseek-ai/cordis').Plugin, {})
  return { ctx, fiber }
}

describe('fiber disposal', () => {
  it('removes image_generate and the draw service when the fiber is disposed', async () => {
    const harness = await mount()
    try {
      expect(harness.ctx.tools.get('image_generate')).toBeDefined()
      expect(harness.ctx.get('draw')).toBeDefined()

      await harness.fiber.dispose()

      expect(harness.ctx.tools.get('image_generate')).toBeUndefined()
      expect(harness.ctx.get('draw')).toBeUndefined()
    } finally {
      await harness.ctx.fiber.dispose()
    }
  })
})
