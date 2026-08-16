/**
 * Engine router: chain order and override promotion, fallback, cooldown
 * after consecutive failures, disabled-engine skipping, health recording,
 * and the probe outcome vocabulary.
 *
 * @module dsh-draw/test/router.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { EngineCallError } from '../src/engine.ts'
import type { HttpRequest, HttpResponse, HttpTransport } from '../src/http.ts'
import { EngineRouter } from '../src/router.ts'

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

function makeRouter(failureThreshold = 2, cooldownMs = 60_000, now?: () => number) {
  return new EngineRouter(config, { failureThreshold, cooldownMs, ...(now === undefined ? {} : { now }) })
}

describe('EngineRouter.generate', () => {
  it('serves from the first engine and records no fallback', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push(okImages())
    const result = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.engine).toBe('openai')
      expect(result.fallbackUsed).toBe(false)
      expect(result.attempts).toHaveLength(1)
    }
  })

  it('falls back to the next engine after a failure', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push({ status: 401, body: new Uint8Array() })
    transport.responses.push(okImages())
    const result = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.engine).toBe('cogview')
      expect(result.fallbackUsed).toBe(true)
      expect(result.attempts.map(attempt => attempt.engine)).toEqual(['openai', 'cogview'])
    }
  })

  it('promotes an explicit engine override to the front', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push(okImages())
    const result = await router.generate({ prompt: 'x', size: 'square', count: 1, engine: 'cogview' }, { transport, resolveCredential: async () => 'k' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.engine).toBe('cogview')
  })

  it('returns a full failure record when every engine fails', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push({ status: 500, body: new Uint8Array() }, { status: 500, body: new Uint8Array() })
    const result = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.attempts.map(attempt => attempt.engine)).toEqual(['openai', 'cogview'])
  })

  it('skips a disabled engine with a recorded attempt', async () => {
    const oneDisabled = resolveConfig({
      engines: [
        { id: 'a', baseUrl: 'https://a.example/v1', model: 'm', apiKeyRef: 'A_KEY', enabled: false },
        { id: 'b', baseUrl: 'https://b.example/v1', model: 'm', apiKeyRef: 'B_KEY' },
      ],
      defaultEngine: 'a',
    })
    const router = new EngineRouter(oneDisabled, { failureThreshold: 2, cooldownMs: 60_000 })
    const transport = new ScriptedTransport()
    transport.responses.push(okImages())
    const result = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.engine).toBe('b')
      expect(result.attempts[0]).toMatchObject({ engine: 'a', code: 'disabled' })
    }
  })
})

describe('EngineRouter cooldown', () => {
  it('trips cooldown after the failure threshold and skips the engine', async () => {
    let now = 1_000
    const router = makeRouter(2, 60_000, () => now)
    const transport = new ScriptedTransport()

    // Round 1: both engines fail once each — openai accumulates one failure.
    transport.responses.push({ status: 500, body: new Uint8Array() }, { status: 500, body: new Uint8Array() })
    const first = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(first.ok).toBe(false)
    expect(router.statusOf('openai')?.consecutiveFailures).toBe(1)

    // Round 2: openai fails again (threshold → cooldown), cogview serves.
    transport.responses.push({ status: 500, body: new Uint8Array() }, okImages())
    const second = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(second.ok).toBe(true)
    if (second.ok) {
      expect(second.engine).toBe('cogview')
      expect(second.fallbackUsed).toBe(true)
    }
    const status = router.statusOf('openai')
    expect(status?.consecutiveFailures).toBe(2)
    expect(status?.cooldownUntil).toBe(1_000 + 60_000)

    // Round 3: while cooling down, openai is skipped without an attempt.
    transport.responses.push(okImages())
    const third = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(third.ok).toBe(true)
    if (third.ok) {
      expect(third.engine).toBe('cogview')
      expect(third.attempts[0]).toMatchObject({ engine: 'openai', code: 'cooldown' })
    }

    // Round 4: after the cooldown window, openai is attempted again.
    now = 1_000 + 60_001
    transport.responses.push(okImages())
    const fourth = await router.generate({ prompt: 'x', size: 'square', count: 1 }, { transport, resolveCredential: async () => 'k' })
    expect(fourth.ok).toBe(true)
    if (fourth.ok) expect(fourth.engine).toBe('openai')
  })
})

describe('EngineRouter.probe', () => {
  it('reports an unconfigured credential without a request', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    const outcome = await router.probe(config.engines[0]!, { transport, resolveCredential: async () => undefined })
    expect(outcome).toMatchObject({ engineId: 'openai', reachable: false, credentialConfigured: false })
    expect(transport.requests).toHaveLength(0)
  })

  it('reports credential rejection with the HTTP status', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push({ status: 401, body: new Uint8Array() })
    const outcome = await router.probe(config.engines[0]!, { transport, resolveCredential: async () => 'k' })
    expect(outcome).toMatchObject({ engineId: 'openai', reachable: true, httpStatus: 401, credentialConfigured: true })
  })

  it('reports a clean endpoint', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push({ status: 200, body: new Uint8Array() })
    const outcome = await router.probe(config.engines[0]!, { transport, resolveCredential: async () => 'k' })
    expect(outcome).toMatchObject({ engineId: 'openai', reachable: true, httpStatus: 200 })
  })

  it('sanitizes network failure text and never mutates health', async () => {
    const router = makeRouter()
    const transport = new ScriptedTransport()
    transport.responses.push(new EngineCallError('request', 'network', 'Bearer abc123 leaked'))
    const outcome = await router.probe(config.engines[0]!, { transport, resolveCredential: async () => 'k' })
    expect(outcome.reachable).toBe(false)
    expect(outcome.note).not.toContain('abc123')
    expect(router.statusOf('openai')?.consecutiveFailures).toBe(0)
  })
})
