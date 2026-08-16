/**
 * Config contract: the Schemastery schema fills defaults, and `resolveConfig`
 * re-judges every cross-field fact (duplicate ids, credential-bearing URLs,
 * unknown default engine, bounds) so misconfiguration fails loud at load.
 *
 * @module dsh-draw/test/config.spec
 */

import { describe, expect, it } from 'vitest'
import { Config, DEFAULT_ENGINES, resolveConfig } from '../src/config.ts'

describe('Config schema', () => {
  it('applies every default on an empty input', () => {
    const resolved = Config({})
    expect(resolved.engines).toHaveLength(2)
    expect(resolved.defaultEngine).toBe('openai')
    expect(resolved.requestTimeoutMs).toBe(120_000)
    expect(resolved.maxImagesPerCall).toBe(4)
    expect(resolved.maxPromptLength).toBe(4_000)
    expect(resolved.maxGenerationsPerSession).toBe(200)
    expect(resolved.maxBytesPerSession).toBe(200 * 1024 * 1024)
    expect(resolved.failureThreshold).toBe(2)
    expect(resolved.cooldownMs).toBe(60_000)
  })

  it('rejects an out-of-range timeout', () => {
    expect(() => Config({ requestTimeoutMs: 999_999_999 })).toThrow()
  })
})

describe('resolveConfig', () => {
  it('resolves the shipped presets by default', () => {
    const resolved = resolveConfig(undefined)
    expect(resolved.engines.map(engine => engine.id)).toEqual(['openai', 'cogview'])
    expect(resolved.defaultEngine).toBe('openai')
  })

  it('fails loud on a duplicate engine id', () => {
    expect(() => resolveConfig({
      engines: [
        { id: 'a', baseUrl: 'https://a.example/v1', model: 'm', apiKeyRef: 'A_KEY' },
        { id: 'a', baseUrl: 'https://b.example/v1', model: 'm', apiKeyRef: 'B_KEY' },
      ],
    })).toThrow(/duplicate engine id/u)
  })

  it('fails loud on a credential-bearing baseUrl', () => {
    expect(() => resolveConfig({
      engines: [{ id: 'a', baseUrl: 'https://user:pass@a.example/v1', model: 'm', apiKeyRef: 'A_KEY' }],
    })).toThrow(/must not embed credentials/u)
  })

  it('fails loud on an unknown defaultEngine', () => {
    expect(() => resolveConfig({ defaultEngine: 'nope' })).toThrow(/does not name a configured engine/u)
  })

  it('fails loud on an invalid apiKeyRef', () => {
    expect(() => resolveConfig({
      engines: [{ id: 'a', baseUrl: 'https://a.example/v1', model: 'm', apiKeyRef: 'not a ref!' }],
    })).toThrow(/apiKeyRef/u)
  })

  it('fails loud on an empty engine chain', () => {
    expect(() => resolveConfig({ engines: [] })).toThrow(/at least one engine/u)
  })

  it('fills per-engine defaults for user engines', () => {
    const resolved = resolveConfig({
      engines: [{ id: 'mine', baseUrl: 'https://mine.example/v1/', model: 'x', apiKeyRef: 'MINE_KEY' }],
    })
    const engine = resolved.engines[0]!
    expect(engine.baseUrl).toBe('https://mine.example/v1')
    expect(engine.enabled).toBe(true)
    expect(engine.sizeMap.square).toBe('1024x1024')
    expect(engine.qualitySupported).toBe(false)
    expect(engine.responseFormat).toBe('b64_json')
    expect(engine.imageMediaType).toBe('image/png')
  })

  it('keeps the default engine order stable', () => {
    expect(DEFAULT_ENGINES[0]?.id).toBe('openai')
    expect(DEFAULT_ENGINES[1]?.id).toBe('cogview')
  })
})
