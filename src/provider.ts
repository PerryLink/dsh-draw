/**
 * The engine-provider seam: one adapter per image-generation vocabulary. The
 * OpenAI provider is the existing OpenAI-compatible `POST /images/generations`
 * adapter; `replicate` and `fal` adapters speak those vendors' native request
 * and response shapes (prediction polling and `fal.run` queue respectively).
 * A configured engine declares its vocabulary (`provider`); the router
 * dispatches through {@link providerFor}, so cooldown fallback, quota, and the
 * audit path stay vocabulary-agnostic.
 *
 * @module dsh-draw/provider
 */

import type { ResolvedEngineConfig } from './config.ts'
import {
  callEngine,
  EngineCallError,
  type EngineDeps,
  type ProducedImage,
} from './engine.ts'
import type { StandardImageRequest } from './translate.ts'
import { translateRequest } from './translate.ts'

/** The image-generation vocabularies a configured engine may declare. */
export type EngineVocabulary = 'openai' | 'replicate' | 'fal'

/**
 * One engine adapter: translates the standard tool request into a vendor
 * request, calls it, and returns produced image bytes. A provider must never
 * leak the credential — `deps.resolveCredential` resolves it per call.
 */
export interface EngineProvider {
  /** Which vocabulary this adapter speaks. */
  readonly vocabulary: EngineVocabulary
  /**
   * Generate images for one standardized request.
   * @param engine - resolved engine configuration.
   * @param request - normalized standard request.
   * @param deps - transport and credential resolution.
   * @param signal - caller cancellation.
   * @returns the produced images.
   */
  generate(engine: ResolvedEngineConfig, request: StandardImageRequest, deps: EngineDeps, signal?: AbortSignal): Promise<ProducedImage[]>
}

/** The OpenAI-compatible adapter: delegates to the existing `/images/generations` path. */
const openaiProvider: EngineProvider = {
  vocabulary: 'openai',
  generate(engine, request, deps, signal) {
    return callEngine(engine, translateRequest(engine, request), deps, signal)
  },
}

/** Replicate prediction polling interval (ms). */
const REPLICATE_POLL_INTERVAL_MS = 1_000

/** Maximum prediction polls before the call fails as a slow request. */
const REPLICATE_MAX_POLLS = 120

/** Parse one concrete `WIDTHxHEIGHT` size string into dimensions. */
function dimensionsOf(size: string): { width: number; height: number } | undefined {
  const match = /^(\d{2,5})x(\d{2,5})$/u.exec(size)
  if (match === null) return undefined
  return { width: Number(match[1]), height: Number(match[2]) }
}

/** Resolve an engine credential, failing closed when it is unconfigured. */
async function requireCredential(engine: ResolvedEngineConfig, deps: EngineDeps): Promise<string> {
  const credential = await deps.resolveCredential(engine.apiKeyRef)
  if (credential === undefined) {
    throw new EngineCallError('credential', 'unconfigured', `engine "${engine.id}" has no resolved credential reference ${engine.apiKeyRef}`)
  }
  return credential
}

/** Parse a JSON response body, failing with a structured parse error. */
function parseJson(engine: ResolvedEngineConfig, body: Uint8Array): Record<string, unknown> {
  let parsed: unknown
  try {
    parsed = JSON.parse(new TextDecoder().decode(body))
  } catch (cause) {
    throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned a non-JSON response`, { cause })
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned a non-object payload`)
  }
  return parsed as Record<string, unknown>
}

/** Download one image URL with an explicit authorization header value. */
async function downloadImage(
  engine: ResolvedEngineConfig,
  url: string,
  authorization: string,
  deps: EngineDeps,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  const response = await deps.transport.request({
    method: 'GET',
    url,
    headers: { authorization },
    ...(signal === undefined ? {} : { signal }),
  })
  if (response.status < 200 || response.status >= 300) {
    throw new EngineCallError('request', 'http', `engine "${engine.id}" image download failed with HTTP ${response.status}`, { status: response.status })
  }
  return response.body
}

/** Sleep without swallowing the caller's abort (checked by the caller's loop). */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** The Replicate adapter: create a prediction, poll to completion, then download its output URLs. */
const replicateProvider: EngineProvider = {
  vocabulary: 'replicate',
  async generate(engine, request, deps, signal) {
    const credential = await requireCredential(engine, deps)
    const dimensions = dimensionsOf(engine.sizeMap[request.size ?? 'square'])
    const input: Record<string, unknown> = {
      prompt: request.prompt,
      num_outputs: request.count ?? 1,
      ...(dimensions === undefined ? {} : { width: dimensions.width, height: dimensions.height }),
    }
    const create = await deps.transport.request({
      method: 'POST',
      url: `${engine.baseUrl}/models/${engine.model}/predictions`,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${credential}` },
      body: new TextEncoder().encode(JSON.stringify({ input })),
      ...(signal === undefined ? {} : { signal }),
    })
    if (create.status === 401 || create.status === 403) {
      throw new EngineCallError('request', 'auth', `engine "${engine.id}" rejected the credential (HTTP ${create.status})`, { status: create.status })
    }
    if (create.status < 200 || create.status >= 300) {
      throw new EngineCallError('request', 'http', `engine "${engine.id}" failed with HTTP ${create.status}`, { status: create.status })
    }
    let prediction = parseJson(engine, create.body)
    const id = typeof prediction['id'] === 'string' ? prediction['id'] : ''
    const urls = typeof prediction['urls'] === 'object' && prediction['urls'] !== null
      ? prediction['urls'] as Record<string, unknown>
      : {}
    const pollUrl = typeof urls['get'] === 'string' && urls['get'] !== '' ? urls['get'] : `${engine.baseUrl}/predictions/${id}`
    for (let poll = 0; poll < REPLICATE_MAX_POLLS; poll += 1) {
      signal?.throwIfAborted()
      const status = typeof prediction['status'] === 'string' ? prediction['status'] : ''
      if (status === 'succeeded') break
      if (status === 'failed' || status === 'canceled') {
        throw new EngineCallError('request', 'http', `engine "${engine.id}" prediction ${status}`)
      }
      await sleep(REPLICATE_POLL_INTERVAL_MS)
      const polled = await deps.transport.request({
        method: 'GET',
        url: pollUrl,
        headers: { authorization: `Bearer ${credential}` },
        ...(signal === undefined ? {} : { signal }),
      })
      if (polled.status < 200 || polled.status >= 300) {
        throw new EngineCallError('request', 'http', `engine "${engine.id}" prediction poll failed with HTTP ${polled.status}`, { status: polled.status })
      }
      prediction = parseJson(engine, polled.body)
    }
    if (prediction['status'] !== 'succeeded') {
      throw new EngineCallError('request', 'http', `engine "${engine.id}" prediction did not finish within ${REPLICATE_MAX_POLLS} polls`)
    }
    const output = prediction['output']
    if (!Array.isArray(output)) {
      throw new EngineCallError('parse', 'parse', `engine "${engine.id}" prediction has no output array`)
    }
    const images: ProducedImage[] = []
    for (const item of output) {
      if (typeof item !== 'string' || item === '') {
        throw new EngineCallError('parse', 'parse', `engine "${engine.id}" prediction returned a non-URL output entry`)
      }
      images.push({ data: await downloadImage(engine, item, `Bearer ${credential}`, deps, signal), mediaType: engine.imageMediaType })
    }
    if (images.length === 0) {
      throw new EngineCallError('parse', 'parse', `engine "${engine.id}" prediction returned no images`)
    }
    return images
  },
}

/** The fal.ai adapter: POST the `fal.run` queue endpoint and download the returned image URLs. */
const falProvider: EngineProvider = {
  vocabulary: 'fal',
  async generate(engine, request, deps, signal) {
    const credential = await requireCredential(engine, deps)
    const body: Record<string, unknown> = {
      prompt: request.prompt,
      image_size: engine.sizeMap[request.size ?? 'square'],
      num_images: request.count ?? 1,
    }
    const response = await deps.transport.request({
      method: 'POST',
      url: `${engine.baseUrl}/${engine.model}`,
      headers: { 'content-type': 'application/json', authorization: `Key ${credential}` },
      body: new TextEncoder().encode(JSON.stringify(body)),
      ...(signal === undefined ? {} : { signal }),
    })
    if (response.status === 401 || response.status === 403) {
      throw new EngineCallError('request', 'auth', `engine "${engine.id}" rejected the credential (HTTP ${response.status})`, { status: response.status })
    }
    if (response.status < 200 || response.status >= 300) {
      throw new EngineCallError('request', 'http', `engine "${engine.id}" failed with HTTP ${response.status}`, { status: response.status })
    }
    const payload = parseJson(engine, response.body)
    const entries = payload['images']
    if (!Array.isArray(entries)) {
      throw new EngineCallError('parse', 'parse', `engine "${engine.id}" response has no images array`)
    }
    const images: ProducedImage[] = []
    for (const raw of entries) {
      const url = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>)['url'] : undefined
      if (typeof url !== 'string' || url === '') {
        throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned an image entry without a URL`)
      }
      images.push({ data: await downloadImage(engine, url, `Key ${credential}`, deps, signal), mediaType: engine.imageMediaType })
    }
    if (images.length === 0) {
      throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned no images`)
    }
    return images
  },
}

/** The provider registry, keyed by vocabulary. */
export const PROVIDERS: Readonly<Record<EngineVocabulary, EngineProvider>> = Object.freeze({
  openai: openaiProvider,
  replicate: replicateProvider,
  fal: falProvider,
})

/** Resolve the provider for one vocabulary (always present — the config gate restricts the value). */
export function providerFor(vocabulary: EngineVocabulary): EngineProvider {
  return PROVIDERS[vocabulary]
}
