/**
 * Standard-parameter translation: malformed tool args fall back to defaults,
 * the count clamps to the configured cap, and per-engine translation applies
 * size maps plus the quality/style/response-format gating.
 *
 * @module dsh-draw/test/translate.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { normalizeRequest, translateRequest } from '../src/translate.ts'

const config = resolveConfig(undefined)

describe('normalizeRequest', () => {
  it('normalizes a full request', () => {
    expect(normalizeRequest({ prompt: 'a cat', size: 'landscape', count: 2, quality: 'high', style: 'vivid', engine: 'cogview' }, 4)).toEqual({
      prompt: 'a cat',
      size: 'landscape',
      count: 2,
      quality: 'high',
      style: 'vivid',
      engine: 'cogview',
    })
  })

  it('falls back to defaults on malformed input', () => {
    expect(normalizeRequest({ prompt: 'x', size: 'weird', count: -3, quality: 'ultra', style: 'unknown' }, 4)).toEqual({
      prompt: 'x',
      size: 'square',
      count: 1,
      quality: 'auto',
    })
  })

  it('clamps the count to the configured cap', () => {
    expect(normalizeRequest({ prompt: 'x', count: 99 }, 4).count).toBe(4)
  })

  it('treats a non-object as an empty request', () => {
    expect(normalizeRequest(null, 4).prompt).toBe('')
  })
})

describe('translateRequest', () => {
  it('maps standard sizes through the engine size map', () => {
    const engine = config.engines[1]!
    expect(translateRequest(engine, normalizeRequest({ prompt: 'x', size: 'landscape' }, 4))).toMatchObject({
      model: 'cogview-3-flash',
      size: '1344x768',
      n: 1,
      responseFormat: 'url',
    })
  })

  it('drops quality and style for engines without support', () => {
    const engine = config.engines[1]!
    const translated = translateRequest(engine, normalizeRequest({ prompt: 'x', quality: 'high', style: 'vivid' }, 4))
    expect('quality' in translated).toBe(false)
    expect('style' in translated).toBe(false)
  })

  it('keeps quality and style for engines with support', () => {
    const engine = config.engines[0]!
    const translated = translateRequest(engine, normalizeRequest({ prompt: 'x', quality: 'high', style: 'natural' }, 4))
    expect(translated.quality).toBe('high')
    expect(translated.style).toBe('natural')
    expect(translated.responseFormat).toBe('b64_json')
  })

  it('defaults the size to square', () => {
    const engine = config.engines[0]!
    expect(translateRequest(engine, normalizeRequest({ prompt: 'x' }, 4)).size).toBe('1024x1024')
  })
})
