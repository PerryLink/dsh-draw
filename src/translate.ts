/**
 * Standard-parameter translation: the tool-level vocabulary
 * (`prompt`/size/count/quality/style) mapped onto one concrete engine's
 * request. Pure functions with no I/O — unit tests pin every mapping.
 *
 * @module dsh-draw/translate
 */

import type { ResolvedEngineConfig, StandardSize } from './config.ts'

/** Standard quality vocabulary; `auto` means "leave the engine default". */
export type StandardQuality = 'low' | 'medium' | 'high' | 'auto'

/** Standard style vocabulary (engines that lack styles drop it). */
export type StandardStyle = 'natural' | 'vivid'

/** Standard tool-level image request. */
export interface StandardImageRequest {
  /** Image prompt, non-empty and within the configured length cap. */
  prompt: string
  /** Standard size vocabulary (default `square`). */
  size?: StandardSize
  /** Number of images (default 1; capped by the engine/config). */
  count?: number
  /** Standard quality vocabulary (default `auto`). */
  quality?: StandardQuality
  /** Standard style vocabulary; omitted = engine default. */
  style?: StandardStyle
  /** Engine id override; omitted = the router's chain order. */
  engine?: string
}

/** Concrete per-engine request body fields. */
export interface TranslatedImageRequest {
  /** Engine model name. */
  model: string
  /** Prompt, verbatim. */
  prompt: string
  /** Concrete engine size string. */
  size: string
  /** Number of images. */
  n: number
  /** Included only when the engine declares quality support and it is not `auto`. */
  quality?: StandardQuality
  /** Included only when the engine declares style support and one was requested. */
  style?: StandardStyle
  /** How the response delivers bytes. */
  responseFormat: 'b64_json' | 'url'
}

const SIZES: readonly StandardSize[] = ['square', 'landscape', 'portrait', 'auto']
const QUALITIES: readonly StandardQuality[] = ['low', 'medium', 'high', 'auto']
const STYLES: readonly StandardStyle[] = ['natural', 'vivid']

/**
 * Normalize unvalidated tool args to a {@link StandardImageRequest}; malformed
 * values fall back to defaults. The prompt passes through verbatim — length
 * validation is the drawer's job (an over-long prompt fails the call loudly
 * instead of being silently truncated).
 *
 * @param args - unvalidated tool arguments.
 * @param maxImagesPerCall - configured cap the requested count clamps to.
 * @returns the normalized request.
 */
export function normalizeRequest(args: unknown, maxImagesPerCall: number): StandardImageRequest {
  const record = typeof args === 'object' && args !== null ? args as Record<string, unknown> : {}
  const prompt = typeof record['prompt'] === 'string' ? record['prompt'] : ''
  const rawSize = record['size']
  const size = typeof rawSize === 'string' && (SIZES as readonly string[]).includes(rawSize) ? rawSize as StandardSize : 'square'
  const rawCount = record['count']
  const parsedCount = typeof rawCount === 'number' ? Math.trunc(rawCount) : 1
  const count = Math.min(Math.max(Number.isFinite(parsedCount) ? parsedCount : 1, 1), maxImagesPerCall)
  const rawQuality = record['quality']
  const quality = typeof rawQuality === 'string' && (QUALITIES as readonly string[]).includes(rawQuality) ? rawQuality as StandardQuality : 'auto'
  const rawStyle = record['style']
  const style = typeof rawStyle === 'string' && (STYLES as readonly string[]).includes(rawStyle) ? rawStyle as StandardStyle : undefined
  const rawEngine = record['engine']
  const engine = typeof rawEngine === 'string' && rawEngine.length > 0 ? rawEngine : undefined
  return { prompt, size, count, quality, ...(style !== undefined ? { style } : {}), ...(engine !== undefined ? { engine } : {}) }
}

/**
 * Translate one standardized request into a concrete engine request.
 *
 * @param engine - resolved engine configuration.
 * @param request - normalized standard request.
 * @returns the engine request fields.
 */
export function translateRequest(engine: ResolvedEngineConfig, request: StandardImageRequest): TranslatedImageRequest {
  const size = engine.sizeMap[request.size ?? 'square']
  const requestBody: TranslatedImageRequest = {
    model: engine.model,
    prompt: request.prompt,
    size,
    n: request.count ?? 1,
    ...(engine.qualitySupported && request.quality !== 'auto' ? { quality: request.quality } : {}),
    ...(engine.styleSupported && request.style !== undefined ? { style: request.style } : {}),
    responseFormat: engine.responseFormat,
  }
  return requestBody
}
