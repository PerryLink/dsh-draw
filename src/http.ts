/**
 * The HTTP transport seam: engine calls go through one injectable
 * request function so tests can pin every wire interaction without network
 * I/O. The default implementation is Node's global `fetch` (undici) with a
 * per-call timeout fused onto the caller's cancellation signal.
 *
 * @module dsh-draw/http
 */

/** One transport request: URL, headers, optional body, and cancellation. */
export interface HttpRequest {
  /** HTTP method. */
  method: string
  /** Absolute target URL. */
  url: string
  /** Header map (values are raw secrets — never logged). */
  headers?: Readonly<Record<string, string>>
  /** Request body bytes; omitted for body-less requests. */
  body?: Uint8Array<ArrayBuffer>
  /** Caller cancellation; transport failures must observe it. */
  signal?: AbortSignal
}

/** One transport response: status plus raw bytes. */
export interface HttpResponse {
  /** HTTP status code. */
  status: number
  /** Raw response body bytes. */
  body: Uint8Array
}

/** Machine-routable failure codes of the transport seam. */
export type HttpErrorCode = 'timeout' | 'aborted' | 'network' | 'invalid-response'

/**
 * A transport-level failure. `status` is absent for network/timeout failures;
 * `code` routes fallback and cooldown decisions.
 */
export class HttpError extends Error {
  /** Stable failure code. */
  readonly code: HttpErrorCode
  /** HTTP status when a response existed. */
  readonly status?: number
  /** @param code - stable failure code. @param message - display-safe message. @param options - optional status and cause. */
  constructor(code: HttpErrorCode, message: string, options?: { status?: number; cause?: unknown }) {
    super(message, options?.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'HttpError'
    this.code = code
    if (options?.status !== undefined) this.status = options.status
  }
}

/** Transport face the engine and probe layers consume. */
export interface HttpTransport {
  /**
   * Perform one request and return the raw response. Never resolves with a
   * thrown engine business error; non-2xx statuses are ordinary results.
   *
   * @param request - method, URL, headers, body, and cancellation.
   * @returns status plus raw bytes.
   * @throws {@link HttpError} for timeouts, aborts, and network failures.
   */
  request(request: HttpRequest): Promise<HttpResponse>
}

/**
 * Fuse a caller signal with a per-call timeout into one signal and a disposer
 * that clears the timer when the call settles.
 *
 * @param signal - caller signal, or undefined.
 * @param timeoutMs - positive timeout.
 * @returns the fused signal plus its disposer.
 */
export function fusedSignal(signal: AbortSignal | undefined, timeoutMs: number): { signal: AbortSignal; dispose: () => void } {
  if (signal === undefined) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(new HttpError('timeout', `request exceeded ${timeoutMs} ms`)), timeoutMs)
    return { signal: controller.signal, dispose: () => clearTimeout(timer) }
  }
  if (signal.aborted) return { signal, dispose: () => undefined }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new HttpError('timeout', `request exceeded ${timeoutMs} ms`)), timeoutMs)
  const forward = () => { controller.abort(signal.reason) }
  signal.addEventListener('abort', forward, { once: true })
  const dispose = () => {
    clearTimeout(timer)
    signal.removeEventListener('abort', forward)
  }
  return { signal: controller.signal, dispose }
}

/** Map an undici/fetch rejection to an {@link HttpError} by its observable identity. */
function mapFetchFailure(signal: AbortSignal, error: unknown): HttpError {
  const reason = signal.reason
  if (signal.aborted && reason instanceof HttpError) return reason
  if (signal.aborted) return new HttpError('aborted', reason instanceof Error ? reason.message : 'request aborted', { cause: error })
  if (error instanceof Error && error.name === 'TimeoutError') {
    return new HttpError('timeout', error.message, { cause: error })
  }
  const message = error instanceof Error ? error.message : String(error)
  return new HttpError('network', message, { cause: error })
}

/**
 * The production transport: global `fetch` (undici under Node ≥ 22) with the
 * timeout fused onto the caller signal. The response body is read to bytes;
 * oversized or unreadable bodies surface as `invalid-response`.
 *
 * @param timeoutMs - per-call timeout.
 * @param maxBytes - response byte cap (the engine's image cap plus headroom).
 * @returns a transport ready for the router.
 */
export function defaultHttpTransport(timeoutMs: number, maxBytes: number): HttpTransport {
  return {
    async request(request: HttpRequest): Promise<HttpResponse> {
      const { signal, dispose } = fusedSignal(request.signal, timeoutMs)
      try {
        let response: Response
        try {
          response = await fetch(request.url, {
            method: request.method,
            ...(request.headers === undefined ? {} : { headers: request.headers }),
            ...(request.body === undefined ? {} : { body: request.body }),
            signal,
            redirect: 'follow',
          })
        } catch (error) {
          throw mapFetchFailure(signal, error)
        }
        let body: Uint8Array
        try {
          body = new Uint8Array(await response.arrayBuffer())
        } catch (error) {
          throw new HttpError('invalid-response', `failed to read response body: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
        }
        if (body.byteLength > maxBytes) {
          throw new HttpError('invalid-response', `response body exceeds ${maxBytes} bytes`, { status: response.status })
        }
        return { status: response.status, body }
      } finally {
        dispose()
      }
    },
  }
}

/**
 * Decode a standard base64 string to bytes. A malformed string fails loud —
 * a provider change would otherwise silently corrupt an image.
 *
 * @param data - base64 payload without a data: prefix.
 * @returns decoded bytes.
 * @throws when the payload is not valid base64.
 */
export function decodeBase64(data: string): Uint8Array {
  if (data.length === 0) throw new HttpError('invalid-response', 'empty base64 image payload')
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}
