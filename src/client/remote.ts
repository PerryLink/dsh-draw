/**
 * The client-side Remote face of the `draw` namespace: the hand-written
 * `TypertRemoteContribution` mounted through `ctx.remote.$mount`, plus the
 * declaration merging that types `ctx.remote.draw`. The descriptor list is
 * shared with the host `./typert` manifest (`../wire.ts`), so the two faces
 * can never drift.
 *
 * @module dsh-draw/client/remote
 */

import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import { DRAW_INVOCATIONS } from '../wire.ts'
import type { CredentialActionResult, DrawProbeResult, DrawRegenerateResult, DrawStatusSnapshot } from '../wire.ts'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$draw {
    /** Read the panel snapshot (engines, health, credentials, quota). */
    status: () => Promise<RemoteResult<DrawStatusSnapshot>>
    /** Probe one engine's connectivity. */
    probe: (engineId: string) => Promise<RemoteResult<DrawProbeResult>>
    /** Store one API key under the engine's credential reference. */
    setCredential: (engineId: string, value: string) => Promise<RemoteResult<CredentialActionResult>>
    /** Remove a stored API key. */
    unsetCredential: (engineId: string) => Promise<RemoteResult<CredentialActionResult>>
    /** Re-run a generation from the result card (full drawer path). */
    regenerate: (sessionId: string, args: Record<string, unknown>) => Promise<RemoteResult<DrawRegenerateResult>>
  }
  interface TypertRemoteMap {
    'draw/status': () => Promise<RemoteResult<DrawStatusSnapshot>>
    'draw/probe': (engineId: string) => Promise<RemoteResult<DrawProbeResult>>
    'draw/setCredential': (engineId: string, value: string) => Promise<RemoteResult<CredentialActionResult>>
    'draw/unsetCredential': (engineId: string) => Promise<RemoteResult<CredentialActionResult>>
    'draw/regenerate': (sessionId: string, args: Record<string, unknown>) => Promise<RemoteResult<DrawRegenerateResult>>
  }
  interface TypertRemoteNamespaceMap {
    draw: TypertRemoteNamespace$draw
  }
}

/** The client Remote contribution for the `draw` namespace. */
export const DRAW_REMOTE = Object.freeze({
  package: 'dsh-draw',
  descriptors: DRAW_INVOCATIONS,
} satisfies TypertRemoteContribution)
