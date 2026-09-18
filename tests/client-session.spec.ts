/**
 * Browser-half regression locks: the current-session read (B5 — the removed
 * `SessionListState.current`) and the stylesheet ownership counter (the
 * styles-lost window / leaked node pair).
 * @module dsh-draw/test/client-session.spec
 */

import { afterEach, describe, expect, it } from 'vitest'
import { currentSessionId } from '../src/client/index.ts'
import { installDrawStyles } from '../src/client/styles.ts'

/** A sessions face shaped like the 0.1.6 client store (list observable + byId). */
function sessionsWith(byId: unknown): unknown {
  return { list: { getSnapshot: () => ({ byId }) } }
}

describe('currentSessionId (B5: SessionListState.current is gone)', () => {
  it('returns the session the main view retains', () => {
    expect(currentSessionId(sessionsWith({
      a: { id: 'a', retainedBy: { mainView: 0 } },
      b: { id: 'b', retainedBy: { mainView: 2 } },
    }))).toBe('b')
  })

  it('never reads the removed `current` field', () => {
    // The old shape: a `current` string with no retention information. Reading
    // it would resurrect the silent degradation the B5 fix removed.
    expect(currentSessionId(sessionsWith({ a: { id: 'a', current: true } }))).toBeUndefined()
    expect(currentSessionId({ list: { getSnapshot: () => ({ current: 'legacy-id' }) } })).toBeUndefined()
  })

  it('stays guarded on malformed or absent faces', () => {
    expect(currentSessionId(undefined)).toBeUndefined()
    expect(currentSessionId({})).toBeUndefined()
    expect(currentSessionId({ list: null })).toBeUndefined()
    expect(currentSessionId({ list: {} })).toBeUndefined()
    expect(currentSessionId({ list: { getSnapshot: () => { throw new Error('boom') } } })).toBeUndefined()
    expect(currentSessionId(sessionsWith(null))).toBeUndefined()
  })

  it('ignores entries whose retention is present but not a positive number', () => {
    expect(currentSessionId(sessionsWith({
      a: { id: 'a', retainedBy: { mainView: 'yes' } },
      b: { retainedBy: { mainView: 1 } },
      c: { id: 'c', retainedBy: { mainView: 1 } },
    }))).toBe('c')
  })
})

describe('installDrawStyles ownership counter', () => {
  const nodes: Array<{ id: string; textContent: string; remove: () => void }> = []
  const head = {
    append: (node: { id: string; textContent: string; remove: () => void }) => {
      nodes.push(node)
    },
  }

  afterEach(() => {
    nodes.length = 0
    delete (globalThis as { document?: unknown }).document
  })

  function installDocument(): void {
    const document = {
      head,
      createElement: () => {
        const node = {
          id: '',
          textContent: '',
          remove: () => {
            const index = nodes.indexOf(node)
            if (index >= 0) nodes.splice(index, 1)
          },
        }
        return node
      },
      getElementById: (id: string) => nodes.find(node => node.id === id) ?? null,
    }
    ;(globalThis as { document?: unknown }).document = document
  }

  it('keeps the sheet while any mount is live and removes it on the last unmount', () => {
    installDocument()
    const first = installDrawStyles()
    expect(nodes).toHaveLength(1)
    const second = installDrawStyles()
    expect(nodes).toHaveLength(1) // one shared node, not a duplicate
    first()
    // The first unmount must NOT take the sheet away from the live second mount.
    expect(nodes).toHaveLength(1)
    second()
    expect(nodes).toHaveLength(0)
  })

  it('is idempotent per disposer and re-installs after a full teardown', () => {
    installDocument()
    const dispose = installDrawStyles()
    dispose()
    dispose()
    expect(nodes).toHaveLength(0)
    const again = installDrawStyles()
    expect(nodes).toHaveLength(1)
    again()
    expect(nodes).toHaveLength(0)
  })
})
