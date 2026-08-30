/**
 * The browser-half pure presenters: `presentDrawResult` folds a settled
 * `image_generate` tool-result block onto the card model (and rejects
 * running/error/foreign blocks), and `presentDrawPanel` folds the `draw/status`
 * snapshot onto the settings row model with an injected clock so the cooldown
 * flag is pinned without the wall clock. Everything runs directly on the args —
 * no DOM, no I/O, no real timers.
 *
 * @module dsh-draw/test/present.spec
 */

import { describe, expect, it } from 'vitest'
import type { DrawStatusSnapshot } from '../src/wire.ts'
import { presentDrawPanel, presentDrawResult, type ToolCallBlock, type ToolResultNode } from '../src/client/present.ts'

/** A settled `image_generate` tool-result block with the fields the card reads. */
function resultBlock(over: Partial<ToolResultNode> = {}): ToolCallBlock {
  return {
    kind: 'tool-result',
    seq: 1,
    time: 0,
    callId: 'call-1',
    call: { name: 'image_generate', argsRaw: JSON.stringify({ prompt: 'a cat', size: 'landscape' }) },
    callTime: 0,
    content: [],
    isError: false,
    meta: {
      engine: 'openai',
      model: 'gpt-image-1',
      fallbackUsed: false,
      images: [{ attachmentId: 'att-1', name: 'openai-1.png' }],
      quota: { generations: 1, bytes: 100 },
      limits: { maxGenerations: 200, maxBytes: 209715200 },
    },
    callView: null,
    resultView: null,
    subCalls: [],
    ...over,
  } as unknown as ToolCallBlock
}

/** A full `draw/status` snapshot for the panel presenter. */
function snapshot(over: Partial<DrawStatusSnapshot> = {}): DrawStatusSnapshot {
  return {
    pluginVersion: '0.1.2',
    engines: [
      {
        id: 'openai',
        model: 'gpt-image-1',
        baseUrl: 'https://api.openai.com/v1',
        apiKeyRef: 'OPENAI_API_KEY',
        enabled: true,
        preferred: true,
        credential: { configured: true, source: 'env', writable: true },
        health: { consecutiveFailures: 0, cooldownUntil: null, lastError: null, lastStatus: null },
      },
    ],
    quota: { maxGenerationsPerSession: 200, maxBytesPerSession: 209715200 },
    requestTimeoutMs: 120000,
    maxImagesPerCall: 4,
    ...over,
  }
}

describe('presentDrawResult', () => {
  it('projects a settled image_generate result onto the card model', () => {
    const presented = presentDrawResult(resultBlock())
    expect(presented).toMatchObject({
      engine: 'openai',
      model: 'gpt-image-1',
      fallbackUsed: false,
      images: [{ attachmentId: 'att-1', name: 'openai-1.png' }],
      quota: { generations: 1, bytes: 100 },
      limits: { maxGenerations: 200, maxBytes: 209715200 },
    })
    expect(presented?.args).toEqual({ prompt: 'a cat', size: 'landscape' })
  })

  it('returns undefined for an error result', () => {
    expect(presentDrawResult(resultBlock({ isError: true }))).toBeUndefined()
  })

  it('returns undefined for a foreign tool', () => {
    expect(presentDrawResult(resultBlock({
      call: { name: 'other_tool', argsRaw: '{}' },
    }))).toBeUndefined()
  })

  it('returns undefined for a running (non-tool-result) block', () => {
    expect(presentDrawResult({ kind: 'tool-call', callId: 'call-1', name: 'image_generate', argsRaw: '{}' } as unknown as ToolCallBlock)).toBeUndefined()
  })

  it('falls back to defaults when the meta is absent', () => {
    const presented = presentDrawResult(resultBlock({ meta: undefined }))
    expect(presented).toMatchObject({
      engine: 'unknown',
      model: 'unknown',
      fallbackUsed: false,
      images: [],
      quota: { generations: 0, bytes: 0 },
      limits: { maxGenerations: 0, maxBytes: 0 },
    })
  })

  it('drops the regenerate args on malformed argsRaw', () => {
    const presented = presentDrawResult(resultBlock({ call: { name: 'image_generate', argsRaw: 'not json' } }))
    expect(presented?.args).toBeUndefined()
  })

  it('declines a null call head so the generic card shows the callId', () => {
    // Window truncation may leave the call head outside the window; without
    // the wire tool name the card cannot confirm it owns this result and
    // yields to the generic card.
    expect(presentDrawResult(resultBlock({ call: null }))).toBeUndefined()
  })
})

describe('presentDrawPanel', () => {
  it('projects the snapshot onto the row model', () => {
    const presented = presentDrawPanel(snapshot(), () => 1_000)
    expect(presented.pluginVersion).toBe('0.1.2')
    expect(presented.quota).toEqual({ maxGenerationsPerSession: 200, maxBytesPerSession: 209715200 })
    expect(presented.engines[0]).toMatchObject({
      id: 'openai',
      model: 'gpt-image-1',
      baseUrl: 'https://api.openai.com/v1',
      apiKeyRef: 'OPENAI_API_KEY',
      enabled: true,
      preferred: true,
      credentialConfigured: true,
      credentialSource: 'env',
      credentialWritable: true,
      consecutiveFailures: 0,
      coolingDown: false,
      lastError: null,
    })
  })

  it('flags an engine whose cooldown window has not yet elapsed', () => {
    const cooling = snapshot({
      engines: [{
        id: 'openai', model: 'm', baseUrl: 'https://a.example/v1', apiKeyRef: 'A_KEY', enabled: true, preferred: true,
        credential: { configured: false, writable: true },
        health: { consecutiveFailures: 2, cooldownUntil: 2_000, lastError: 'boom', lastStatus: 500 },
      }],
    })
    expect(presentDrawPanel(cooling, () => 1_000).engines[0]?.coolingDown).toBe(true)
    expect(presentDrawPanel(cooling, () => 2_001).engines[0]?.coolingDown).toBe(false)
  })

  it('never flags cooling down when cooldownUntil is null', () => {
    const presented = presentDrawPanel(snapshot(), () => Number.MAX_SAFE_INTEGER)
    expect(presented.engines[0]?.coolingDown).toBe(false)
  })

  it('omits the credential source while unconfigured', () => {
    const unconfigured = snapshot({
      engines: [{
        id: 'openai', model: 'm', baseUrl: 'https://a.example/v1', apiKeyRef: 'A_KEY', enabled: true, preferred: false,
        credential: { configured: false, writable: true },
        health: { consecutiveFailures: 0, cooldownUntil: null, lastError: null, lastStatus: null },
      }],
    })
    const row = presentDrawPanel(unconfigured, () => 0).engines[0]!
    expect(row.credentialConfigured).toBe(false)
    expect('credentialSource' in row).toBe(false)
  })
})
