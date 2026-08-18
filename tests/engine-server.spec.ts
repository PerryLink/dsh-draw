/**
 * Adversarial engine-server suite: a sealed local `node:http` server drives
 * `callEngine` through the real fetch transport across the success, auth
 * (401), HTTP-failure (404), malformed-JSON, and timeout paths without any
 * external endpoint. The timeout path proves a hanging engine cannot outlast
 * the per-call budget.
 * @module dsh-draw/tests/engine-server.spec
 */

import { createServer } from 'node:http'
import type { Server } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import type { ResolvedEngineConfig } from '../src/config.ts'
import { callEngine } from '../src/engine.ts'
import { defaultHttpTransport } from '../src/http.ts'
import type { TranslatedImageRequest } from '../src/translate.ts'

const servers: Server[] = []
afterEach(async () => {
  for (const server of servers.splice(0)) {
    await new Promise<void>(resolve => server.close(() => resolve()))
  }
})

function startServer(handler: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void): Promise<string> {
  const server = createServer(handler)
  servers.push(server)
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (address === null || typeof address === 'string') throw new Error('fake server bound to no port')
      resolve(`http://127.0.0.1:${address.port}`)
    })
  })
}

function engineFor(baseUrl: string): ResolvedEngineConfig {
  return resolveConfig({
    engines: [{ id: 'test', baseUrl, model: 'm', apiKeyRef: 'TEST_KEY', responseFormat: 'b64_json' }],
    defaultEngine: 'test',
  }).engines[0]!
}

const request: TranslatedImageRequest = { model: 'm', prompt: 'a cat', size: '1024x1024', n: 1, responseFormat: 'b64_json' }

const maxBytes = 64 * 1024 * 1024

describe('callEngine against a fake engine server', () => {
  it('decodes a 200 b64_json answer into produced images', async () => {
    const base = await startServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ data: [{ b64_json: Buffer.from('image-bytes').toString('base64') }] }))
    })
    const images = await callEngine(engineFor(base), request, {
      transport: defaultHttpTransport(5_000, maxBytes),
      resolveCredential: async () => 'sk-test',
    })
    expect(images).toHaveLength(1)
    expect(new TextDecoder().decode(images[0]!.data)).toBe('image-bytes')
  })

  it('maps a 401 to the auth phase', async () => {
    const base = await startServer((_req, res) => { res.writeHead(401); res.end('no') })
    await expect(callEngine(engineFor(base), request, {
      transport: defaultHttpTransport(5_000, maxBytes),
      resolveCredential: async () => 'sk-bad',
    })).rejects.toMatchObject({ phase: 'request', code: 'auth', status: 401 })
  })

  it('maps a 404 to the http phase with the status', async () => {
    const base = await startServer((_req, res) => { res.writeHead(404); res.end('missing') })
    await expect(callEngine(engineFor(base), request, {
      transport: defaultHttpTransport(5_000, maxBytes),
      resolveCredential: async () => 'sk-test',
    })).rejects.toMatchObject({ phase: 'request', code: 'http', status: 404 })
  })

  it('maps a malformed JSON body to the parse phase', async () => {
    const base = await startServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end('not json at all')
    })
    await expect(callEngine(engineFor(base), request, {
      transport: defaultHttpTransport(5_000, maxBytes),
      resolveCredential: async () => 'sk-test',
    })).rejects.toMatchObject({ phase: 'parse', code: 'parse' })
  })

  it('aborts a hanging engine at the per-call timeout', async () => {
    const base = await startServer((_req, res) => {
      setTimeout(() => { res.writeHead(200); res.end('{}') }, 2_000)
    })
    const started = Date.now()
    // Transport-level failures (timeout/network/abort) surface as HttpError,
    // not EngineCallError — the router maps them to fallback decisions.
    await expect(callEngine(engineFor(base), request, {
      transport: defaultHttpTransport(200, maxBytes),
      resolveCredential: async () => 'sk-test',
    })).rejects.toMatchObject({ code: 'timeout' })
    expect(Date.now() - started).toBeLessThan(1_000)
  })
})
