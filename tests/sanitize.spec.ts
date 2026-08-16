/**
 * Display sanitization: URL credentials, embedded credential pairs, bearer
 * tokens, JWTs, and thrown-value redaction — extreme cases included.
 *
 * @module dsh-draw/test/sanitize.spec
 */

import { describe, expect, it } from 'vitest'
import { sanitizeError, sanitizeText, sanitizeUrl } from '../src/sanitize.ts'

describe('sanitizeUrl', () => {
  it('redacts the userinfo password', () => {
    expect(sanitizeUrl('https://user:secret@api.example.com/v1')).toBe('https://user:***@api.example.com/v1')
  })

  it('redacts credential query values', () => {
    expect(sanitizeUrl('https://api.example.com/v1?api_key=sk-live&x=1')).toBe('https://api.example.com/v1?api_key=***&x=1')
  })

  it('redacts credentials in parsed URLs', () => {
    expect(sanitizeUrl('https://user:secret@api.example.com/v1?token=abc')).toBe('https://user:***@api.example.com/v1?token=***')
  })

  it('leaves clean URLs untouched', () => {
    expect(sanitizeUrl('https://api.example.com/v1/images')).toBe('https://api.example.com/v1/images')
  })
})

describe('sanitizeText', () => {
  it('redacts bearer tokens', () => {
    // The header rule re-masks the Bearer keyword as the header's value; the
    // output stays fully redacted either way.
    expect(sanitizeText('Authorization: Bearer AbCdEf1234567890')).toBe('Authorization: *** ***')
  })

  it('redacts header credential lines', () => {
    expect(sanitizeText('api-key: sk-live-12345')).toBe('api-key: ***')
  })

  it('redacts raw JWTs', () => {
    expect(sanitizeText('token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signaturevalue here')).toBe('token *** here')
  })

  it('redacts environment-shaped credentials', () => {
    expect(sanitizeText('GITHUB_TOKEN=ghp_abcdef123456')).toBe('GITHUB_TOKEN=***')
  })

  it('leaves ordinary text alone', () => {
    expect(sanitizeText('the engine answered with HTTP 500')).toBe('the engine answered with HTTP 500')
  })
})

describe('sanitizeError', () => {
  it('redacts credential text inside errors', () => {
    expect(sanitizeError('failed with Bearer abc123xyz')).toBe('failed with Bearer ***')
  })

  it('never throws on unrenderable values', () => {
    const hostile = { toString(): string { throw new Error('boom') } }
    expect(() => sanitizeError(hostile)).not.toThrow()
  })
})
