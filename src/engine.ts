/**
 * The OpenAI-compatible images adapter: one implementation covers OpenAI
 * Images, Zhipu CogView, and any config-driven compatible endpoint. The
 * request is a `POST {baseUrl}/images/generations` JSON body; the response is
 * `{ data: [{ b64_json } | { url }] }`. Engines declare their response format
 * and media type in config, so no provider-specific code branches exist.
 *
 * @module dsh-draw/engine
 */

import type { ImageMediaType } from '@deepseek-ai/dsh-attachment'
import type { ResolvedEngineConfig } from './config.ts'
import { decodeBase64, fusedSignal, type HttpTransport } from './http.ts'
import { sanitizeError } from './sanitize.ts'
import type { TranslatedImageRequest } from './translate.ts'

/** Failure phases of one engine call, each mapping to a router decision. */
export type EngineFailurePhase = 'credential' | 'request' | 'parse'

/**
 * A single engine call failure. `message` is display-safe (never carries the
 * API key); `status` carries the HTTP status when a response existed.
 */
export class EngineCallError extends Error {
  /** Which stage failed. */
  readonly phase: EngineFailurePhase
  /** Stable machine code: `unconfigured`, `auth`, `http`, `parse`. */
  readonly code: string
  /** HTTP status when a response existed. */
  readonly status?: number
  /** @param phase - failing stage. @param code - stable code. @param message - display-safe message. @param options - optional status and cause. */
  constructor(phase: EngineFailurePhase, code: string, message: string, options?: { status?: number; cause?: unknown }) {
    super(message, options?.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'EngineCallError'
    this.phase = phase
    this.code = code
    if (options?.status !== undefined) this.status = options.status
  }
}

/** One produced image: bytes plus the engine-declared media type. */
export interface ProducedImage {
  /** Encoded image bytes. */
  data: Uint8Array
  /** Engine-declared media type (validated by the attachment store). */
  mediaType: ImageMediaType
}

/** Dependencies the engine call resolves per operation. */
export interface EngineDeps {
  /** HTTP transport for the images request and any URL download. */
  transport: HttpTransport
  /** Resolve the engine's credential reference to a secret value (per call; never cached). */
  resolveCredential: (reference: string) => Promise<string | undefined>
}

/** Wire response shape of `POST /images/generations` (the fields we consume). */
interface ImagesResponseItem {
  /** Base64-encoded image (b64_json response format). */
  b64_json?: string
  /** Download URL (url response format). */
  url?: string
}

/** Wire response envelope. */
interface ImagesResponse {
  /** Produced images. */
  data?: unknown[]
}

/** Timeout for one image URL download (fraction of the request budget). */
const DOWNLOAD_TIMEOUT_MS = 60_000

/**
 * Call one engine for the given translated request.
 *
 * @param engine - resolved engine configuration.
 * @param request - translated request body fields.
 * @param deps - transport and credential resolution.
 * @param signal - caller cancellation.
 * @returns the produced images.
 * @throws {@link EngineCallError} with a phase the router can act on.
 */
export async function callEngine(
  engine: ResolvedEngineConfig,
  request: TranslatedImageRequest,
  deps: EngineDeps,
  signal?: AbortSignal,
): Promise<ProducedImage[]> {
  const credential = await deps.resolveCredential(engine.apiKeyRef)
  if (credential === undefined) {
    throw new EngineCallError('credential', 'unconfigured', `engine "${engine.id}" has no resolved credential reference ${engine.apiKeyRef}`)
  }
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${credential}`,
  }
  const body: Record<string, unknown> = {
    model: request.model,
    prompt: request.prompt,
    size: request.size,
    n: request.n,
    ...(request.quality !== undefined ? { quality: request.quality } : {}),
    ...(request.style !== undefined ? { style: request.style } : {}),
    ...(request.responseFormat === 'b64_json' ? { response_format: request.responseFormat } : {}),
  }
  const response = await deps.transport.request({
    method: 'POST',
    url: `${engine.baseUrl}/images/generations`,
    headers,
    body: new TextEncoder().encode(JSON.stringify(body)),
    ...(signal === undefined ? {} : { signal }),
  })
  if (response.status === 401 || response.status === 403) {
    throw new EngineCallError('request', 'auth', `engine "${engine.id}" rejected the credential (HTTP ${response.status})`, { status: response.status })
  }
  if (response.status < 200 || response.status >= 300) {
    throw new EngineCallError('request', 'http', `engine "${engine.id}" failed with HTTP ${response.status}`, { status: response.status })
  }
  let parsed: ImagesResponse
  try {
    parsed = JSON.parse(new TextDecoder().decode(response.body)) as ImagesResponse
  } catch (cause) {
    throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned a non-JSON response`, { cause })
  }
  const items = Array.isArray(parsed.data) ? parsed.data : undefined
  if (items === undefined) {
    throw new EngineCallError('parse', 'parse', `engine "${engine.id}" response has no data array`)
  }
  const images: ProducedImage[] = []
  for (const raw of items) {
    if (typeof raw !== 'object' || raw === null) {
      throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned a malformed image entry`)
    }
    const item = raw as ImagesResponseItem
    if (typeof item.b64_json === 'string' && item.b64_json.length > 0) {
      images.push({ data: decodeBase64(item.b64_json), mediaType: engine.imageMediaType })
      continue
    }
    if (typeof item.url === 'string' && item.url.length > 0) {
      images.push({ data: await downloadImageUrl(engine, item.url, credential, deps, signal), mediaType: engine.imageMediaType })
      continue
    }
    throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned an image entry without bytes or a URL`)
  }
  if (images.length === 0) {
    throw new EngineCallError('parse', 'parse', `engine "${engine.id}" returned no images`)
  }
  return images
}

/**
 * Download one image URL with the engine's bearer credential. The download is
 * one GET request on the same transport; a non-2xx status is an engine
 * failure, not silent emptiness.
 */
async function downloadImageUrl(
  engine: ResolvedEngineConfig,
  url: string,
  credential: string,
  deps: EngineDeps,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  const { signal: downloadSignal, dispose } = fusedSignal(signal, DOWNLOAD_TIMEOUT_MS)
  try {
    const response = await deps.transport.request({
      method: 'GET',
      url,
      headers: { authorization: `Bearer ${credential}` },
      signal: downloadSignal,
    })
    if (response.status < 200 || response.status >= 300) {
      throw new EngineCallError('request', 'http', `engine "${engine.id}" image download failed with HTTP ${response.status}`, { status: response.status })
    }
    return response.body
  } catch (error) {
    if (error instanceof EngineCallError) throw error
    throw new EngineCallError('request', 'http', `engine "${engine.id}" image download failed: ${sanitizeError(error)}`, { cause: error })
  } finally {
    dispose()
  }
}
