/**
 * Shared test harness: REAL Cordis `Context`, REAL `SessionStore`/`Session`,
 * REAL `ToolRuntime` from the 0.1.0-rc.6 peers, plus scripted transport,
 * a real `AttachmentStore` subclass keeping images in memory, a fake
 * credential provider, and a fake session store face. The network boundary
 * is scripted; the plugin contract, tool pipeline, quota accounting, and the
 * session audit run for real.
 *
 * @module dsh-draw/test/harness
 */

import { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { AttachmentId, AttachmentStore, type ImageAttachmentRef, type SaveImageAttachment } from '@deepseek-ai/dsh-attachment'
import type { CredentialRef } from '@deepseek-ai/dsh-credentials'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import SessionStore, { SessionId, type Session } from '@deepseek-ai/dsh-session'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import { HttpError, type HttpRequest, type HttpResponse, type HttpTransport } from '../src/http.ts'

/** A transport whose every response is scripted. */
export class ScriptedTransport implements HttpTransport {
  /** Scripted response or error per call (single-shot). */
  next: HttpResponse | Error = { status: 200, body: new Uint8Array() }
  /** Recorded requests. */
  requests: HttpRequest[] = []

  request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    const scripted = this.next
    if (scripted instanceof Error) return Promise.reject(scripted)
    return Promise.resolve(scripted)
  }
}

/** A fake credential provider: resolution answers from a map. */
export class FakeCredentials {
  values = new Map<string, string>()
  writable = true

  async resolve(ref: CredentialRef): Promise<{ value: string; source: string } | undefined> {
    const value = this.values.get(String(ref))
    return value === undefined ? undefined : { value, source: 'env' }
  }

  async describe(ref: CredentialRef): Promise<{ configured: boolean; source?: string; writable: boolean }> {
    const configured = this.values.has(String(ref))
    return { configured, ...(configured ? { source: 'env' } : {}), writable: this.writable }
  }

  async set(ref: CredentialRef, value: string): Promise<void> {
    if (value === '') throw new TypeError('empty credential')
    this.values.set(String(ref), value)
  }

  async unset(ref: CredentialRef): Promise<void> {
    this.values.delete(String(ref))
  }
}

/** An attachment store that keeps saved images in memory. */
export class FakeAttachmentStore extends AttachmentStore {
  readonly imageLimits = {
    maxImageBytes: 30 * 1024 * 1024,
    maxImagesPerMessage: 10,
    maxMessageImageBytes: 100 * 1024 * 1024,
    maxImagePixels: 100_000_000,
    mediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const,
  }

  saved: SaveImageAttachment[] = []

  constructor(ctx: Context) {
    super(ctx)
  }

  validateImage(input: SaveImageAttachment): Promise<void> {
    if (!this.imageLimits.mediaTypes.includes(input.mediaType)) return Promise.reject(new Error('unsupported media type'))
    return Promise.resolve()
  }

  async saveImage(input: SaveImageAttachment): Promise<ImageAttachmentRef> {
    await this.validateImage(input)
    this.saved.push(input)
    return {
      attachmentId: AttachmentId(`att-${this.saved.length}`),
      mediaType: input.mediaType,
      bytes: input.data.byteLength,
      width: 64,
      height: 64,
      ...input.name !== undefined ? { name: input.name } : {},
    }
  }

  readImage(): never {
    throw new Error('not used by tests')
  }
}

/** Build a structurally complete fake agent over a real session. */
export function makeAgent(session: Session, options: { provider?: string; model?: string } = {}): Agent {
  const fake = {
    id: session.id,
    options,
    session,
    inbox: {},
    status: 'idle',
    ctx: new Context(),
    cancel: () => undefined,
    whenIdle: async () => undefined,
    runMaintenance: async (task: (signal: AbortSignal) => Promise<unknown>) => task(new AbortController().signal),
    send: () => undefined,
    followup: () => undefined,
    steer: () => undefined,
    inject: () => undefined,
  }
  return fake as unknown as Agent
}

/** Harness assembly options. */
export interface HarnessOptions {
  /** Raw plugin config. */
  config?: Record<string, unknown>
  /** Mount the fake attachment store. */
  attachments?: boolean
  /** Mount the fake credentials provider. */
  credentials?: boolean
}

/** Everything a mounted harness hands back to a test. */
export interface Harness {
  readonly ctx: Context
  readonly session: Session
  readonly agent: Agent
  readonly transport: ScriptedTransport
  readonly attachments: FakeAttachmentStore | undefined
  readonly credentials: FakeCredentials | undefined
}

/**
 * Mount real session/tool services plus this plugin with scripted network.
 *
 * @param options - assembly options.
 * @returns the mounted harness.
 */
export async function mountHarness(options: HarnessOptions = {}): Promise<Harness> {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  const session = ctx.sessions.create(SessionId('dsh-draw-harness'))
  session.append('turn/start', { turn: 1 })
  ctx.provide('systemPrompt', { tools: () => () => undefined, section: () => () => undefined } as never)
  await ctx.plugin(ToolRuntime)

  const transport = new ScriptedTransport()
  ctx.provide('dsh-draw/transport', transport)
  if (options.attachments === true) {
    await ctx.plugin(FakeAttachmentStore)
  }
  if (options.credentials === true) {
    ctx.provide('credentials', new FakeCredentials() as never)
  }

  const plugin = await import('../src/index.ts')
  await ctx.plugin(plugin as unknown as import('@deepseek-ai/cordis').Plugin, options.config ?? {})

  const agent = makeAgent(session, { provider: 'deepseek', model: 'demo-model' })
  const attachments = ctx.get('attachments') as unknown as FakeAttachmentStore | undefined
  const credentials = ctx.get('credentials') as unknown as FakeCredentials | undefined
  return { ctx, session, agent, transport, attachments, credentials }
}

export { HttpError, credentialRef }
