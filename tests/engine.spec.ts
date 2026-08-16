/**
 * Engine adapter: request shape, auth/HTTP/parse failure phases, base64 and
 * URL delivery, and the URL-download failure mapping.
 *
 * @module dsh-draw/test/engine.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'
import { callEngine, EngineCallError } from '../src/engine.ts'
import type { HttpRequest, HttpResponse, HttpTransport } from '../src/http.ts'
import { translateRequest } from '../src/translate.ts'

const config = resolveConfig(undefined)
const engine = config.engines[0]!

function jsonResponse(status: number, payload: unknown): HttpResponse {
  return { status, body: new TextEncoder().encode(JSON.stringify(payload)) }
}

class ScriptedTransport implements HttpTransport {
  responses: HttpResponse[] = []
  requests: HttpRequest[] = []

  request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    const next = this.responses.shift()
    if (next === undefined) throw new Error('not scripted')
    return Promise.resolve(next)
  }
}

function deps(transport: ScriptedTransport, credential = 'sk-test') {
  return { transport, resolveCredential: async () => credential }
}

describe('callEngine', () => {
  it('posts the translated body with the bearer credential', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { data: [{ b64_json: btoa('png-bytes') }] }))
    const images = await callEngine(engine, translateRequest(engine, { prompt: 'a cat', size: 'square', count: 1 }), deps(transport))
    expect(images).toHaveLength(1)
    expect(new TextDecoder().decode(images[0]!.data)).toBe('png-bytes')
    const request = transport.requests[0]!
    expect(request.method).toBe('POST')
    expect(request.url).toBe('https://api.openai.com/v1/images/generations')
    expect(request.headers).toMatchObject({ authorization: 'Bearer sk-test', 'content-type': 'application/json' })
    const body = JSON.parse(new TextDecoder().decode(request.body)) as Record<string, unknown>
    expect(body).toMatchObject({ model: 'gpt-image-1', prompt: 'a cat', size: '1024x1024', n: 1, response_format: 'b64_json' })
  })

  it('fails with the credential phase when the reference is unconfigured', async () => {
    const transport = new ScriptedTransport()
    await expect(callEngine(engine, translateRequest(engine, { prompt: 'x', size: 'square', count: 1 }), {
      transport,
      resolveCredential: async () => undefined,
    })).rejects.toMatchObject({ phase: 'credential', code: 'unconfigured' } as Partial<EngineCallError>)
  })

  it('fails with the auth code on 401', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push({ status: 401, body: new Uint8Array() })
    await expect(callEngine(engine, translateRequest(engine, { prompt: 'x', size: 'square', count: 1 }), deps(transport)))
      .rejects.toMatchObject({ phase: 'request', code: 'auth', status: 401 } as Partial<EngineCallError>)
  })

  it('fails with the parse phase on a non-JSON body', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push({ status: 200, body: new TextEncoder().encode('not json') })
    await expect(callEngine(engine, translateRequest(engine, { prompt: 'x', size: 'square', count: 1 }), deps(transport)))
      .rejects.toMatchObject({ phase: 'parse', code: 'parse' } as Partial<EngineCallError>)
  })

  it('fails loudly when the data array is missing', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, {}))
    await expect(callEngine(engine, translateRequest(engine, { prompt: 'x', size: 'square', count: 1 }), deps(transport)))
      .rejects.toMatchObject({ phase: 'parse', code: 'parse' } as Partial<EngineCallError>)
  })

  it('fails loudly on an image entry without bytes or a URL', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { data: [{ nope: true }] }))
    await expect(callEngine(engine, translateRequest(engine, { prompt: 'x', size: 'square', count: 1 }), deps(transport)))
      .rejects.toMatchObject({ phase: 'parse', code: 'parse' } as Partial<EngineCallError>)
  })

  it('downloads url-delivered images with the same bearer credential', async () => {
    const cogview = config.engines[1]!
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { data: [{ url: 'https://cdn.example/img.png' }] }))
    transport.responses.push({ status: 200, body: new TextEncoder().encode('url-bytes') })
    const images = await callEngine(cogview, translateRequest(cogview, { prompt: 'x', size: 'square', count: 1 }), deps(transport))
    expect(new TextDecoder().decode(images[0]!.data)).toBe('url-bytes')
    const download = transport.requests[1]!
    expect(download.method).toBe('GET')
    expect(download.url).toBe('https://cdn.example/img.png')
    expect(download.headers).toMatchObject({ authorization: 'Bearer sk-test' })
  })

  it('maps a failed URL download to a request failure', async () => {
    const cogview = config.engines[1]!
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { data: [{ url: 'https://cdn.example/img.png' }] }))
    transport.responses.push({ status: 503, body: new Uint8Array() })
    await expect(callEngine(cogview, translateRequest(cogview, { prompt: 'x', size: 'square', count: 1 }), deps(transport)))
      .rejects.toMatchObject({ phase: 'request', code: 'http', status: 503 } as Partial<EngineCallError>)
  })
})
