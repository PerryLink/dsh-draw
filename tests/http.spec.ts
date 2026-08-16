/**
 * HTTP seam: signal fusion (timeout, caller abort), failure mapping, base64
 * decoding, and the scripted transport contract.
 *
 * @module dsh-draw/test/http.spec
 */

import { describe, expect, it } from 'vitest'
import { decodeBase64, fusedSignal, HttpError } from '../src/http.ts'

describe('fusedSignal', () => {
  it('aborts after the timeout with a timeout reason', async () => {
    const { signal, dispose } = fusedSignal(undefined, 10)
    await new Promise(resolve => setTimeout(resolve, 30))
    expect(signal.aborted).toBe(true)
    expect(signal.reason).toBeInstanceOf(HttpError)
    dispose()
  })

  it('forwards the caller abort', () => {
    const controller = new AbortController()
    const { signal, dispose } = fusedSignal(controller.signal, 60_000)
    controller.abort(new Error('caller cancelled'))
    expect(signal.aborted).toBe(true)
    dispose()
  })

  it('returns the already-aborted signal unchanged', () => {
    const controller = new AbortController()
    controller.abort()
    const { signal, dispose } = fusedSignal(controller.signal, 60_000)
    expect(signal).toBe(controller.signal)
    dispose()
  })
})

describe('decodeBase64', () => {
  it('decodes a standard base64 payload', () => {
    const decoded = decodeBase64(btoa('hello'))
    expect(new TextDecoder().decode(decoded)).toBe('hello')
  })

  it('fails loud on an empty payload', () => {
    expect(() => decodeBase64('')).toThrow(/empty base64/u)
  })
})

describe('HttpError', () => {
  it('carries the stable code and optional status', () => {
    const error = new HttpError('timeout', 'slow', { status: 504 })
    expect(error.code).toBe('timeout')
    expect(error.status).toBe(504)
  })
})
