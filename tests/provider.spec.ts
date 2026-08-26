/**
 * Engine-provider seam: the replicate and fal adapters speak their vendors'
 * native wire shapes (prediction polling and fal.run queue) while producing
 * the same {@link ProducedImage} results the router and drawer consume.
 *
 * @module dsh-draw/test/provider.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig, type ResolvedEngineConfig } from '../src/config.ts'
import type { HttpRequest, HttpResponse, HttpTransport } from '../src/http.ts'
import { providerFor } from '../src/provider.ts'
import type { StandardImageRequest } from '../src/translate.ts'

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

function engineOf(provider: 'replicate' | 'fal'): ResolvedEngineConfig {
  const baseUrl = provider === 'replicate' ? 'https://api.replicate.com/v1' : 'https://fal.run'
  const model = provider === 'replicate' ? 'black-forest-labs/flux-schnell' : 'fal-ai/flux/schnell'
  const config = resolveConfig({
    engines: [{
      id: `${provider}-engine`,
      baseUrl,
      model,
      apiKeyRef: 'ENGINE_KEY',
      provider,
      sizeMap: { square: 'square_hd', landscape: 'landscape_4_3', portrait: 'portrait_4_3', auto: 'square_hd' },
      responseFormat: 'url',
      imageMediaType: 'image/png',
    }],
    defaultEngine: `${provider}-engine`,
  })
  return config.engines[0]!
}

const request: StandardImageRequest = { prompt: 'a cat', size: 'square', count: 1 }

describe('providerFor', () => {
  it('resolves every vocabulary to a provider', () => {
    expect(providerFor('openai').vocabulary).toBe('openai')
    expect(providerFor('replicate').vocabulary).toBe('replicate')
    expect(providerFor('fal').vocabulary).toBe('fal')
  })
})

describe('replicate provider', () => {
  it('creates a prediction, reads its output URLs, and downloads them', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { id: 'pred-1', status: 'succeeded', output: ['https://cdn.example.com/a.png'] }))
    transport.responses.push({ status: 200, body: new TextEncoder().encode('png-bytes') })

    const images = await providerFor('replicate').generate(engineOf('replicate'), request, deps(transport))

    expect(new TextDecoder().decode(images[0]!.data)).toBe('png-bytes')
    const create = transport.requests[0]!
    expect(create.method).toBe('POST')
    expect(create.url).toBe('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions')
    expect(create.headers).toMatchObject({ authorization: 'Bearer sk-test' })
    const body = JSON.parse(new TextDecoder().decode(create.body)) as { input: Record<string, unknown> }
    expect(body.input).toMatchObject({ prompt: 'a cat', num_outputs: 1 })
    expect(transport.requests[1]!.method).toBe('GET')
    expect(transport.requests[1]!.url).toBe('https://cdn.example.com/a.png')
  })

  it('polls the prediction until it succeeds', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { id: 'pred-2', status: 'starting', urls: { get: 'https://api.replicate.com/v1/predictions/pred-2' } }))
    transport.responses.push(jsonResponse(200, { id: 'pred-2', status: 'processing' }))
    transport.responses.push(jsonResponse(200, { id: 'pred-2', status: 'succeeded', output: ['https://cdn.example.com/b.png'] }))
    transport.responses.push({ status: 200, body: new TextEncoder().encode('second-png') })

    const images = await providerFor('replicate').generate(engineOf('replicate'), request, deps(transport))

    expect(images).toHaveLength(1)
    expect(new TextDecoder().decode(images[0]!.data)).toBe('second-png')
    expect(transport.requests[1]!.url).toBe('https://api.replicate.com/v1/predictions/pred-2')
  })

  it('fails on a failed prediction', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { id: 'pred-3', status: 'failed' }))
    await expect(providerFor('replicate').generate(engineOf('replicate'), request, deps(transport)))
      .rejects.toMatchObject({ phase: 'request', code: 'http' })
  })
})

describe('fal provider', () => {
  it('posts the fal.run queue shape with Key auth and downloads the image URLs', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, { images: [{ url: 'https://fal.media/a.png', width: 1024, height: 1024 }] }))
    transport.responses.push({ status: 200, body: new TextEncoder().encode('fal-png') })

    const images = await providerFor('fal').generate(engineOf('fal'), request, deps(transport))

    expect(new TextDecoder().decode(images[0]!.data)).toBe('fal-png')
    const post = transport.requests[0]!
    expect(post.method).toBe('POST')
    expect(post.url).toBe('https://fal.run/fal-ai/flux/schnell')
    expect(post.headers).toMatchObject({ authorization: 'Key sk-test' })
    const body = JSON.parse(new TextDecoder().decode(post.body)) as Record<string, unknown>
    expect(body).toMatchObject({ prompt: 'a cat', image_size: 'square_hd', num_images: 1 })
    expect(transport.requests[1]!.url).toBe('https://fal.media/a.png')
  })

  it('fails with the parse phase when the response has no images array', async () => {
    const transport = new ScriptedTransport()
    transport.responses.push(jsonResponse(200, {}))
    await expect(providerFor('fal').generate(engineOf('fal'), request, deps(transport)))
      .rejects.toMatchObject({ phase: 'parse', code: 'parse' })
  })
})
