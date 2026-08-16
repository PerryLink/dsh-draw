/**
 * The keyed `image_generate` tool result card: engine/quota facts and the
 * regenerate action. The images themselves are the attachment content blocks
 * the shell already renders from the tool result, so the card only adds the
 * accounting line and the action — it never duplicates image transport.
 *
 * The `tool.call.toolview` SlotMap member is declared locally (mirroring the
 * harness's own ui-tool contract declaration, which its package index does not
 * re-export): when both declarations land in one program they merge.
 *
 * @module dsh-draw/client/DrawResultCard
 */

import { createElement as h, useState, type ReactElement } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ToolCallBlock } from '@deepseek-ai/dsh-client-runtime/client'
import { presentDrawResult } from './present.ts'

/**
 * Standard owner currency for one keyed tool view (mirror of the harness
 * ui-tool contract `ToolCallOwnerProps`, which the package index does not
 * re-export — keep the shape identical so the declarations merge).
 */
export interface ToolCallOwnerProps {
  /** Tool call identity, stable across running and settled forms. */
  callId: string
  /** Wire tool name and keyed dispatch value. */
  toolName: string
  /** Frozen running call or settled result node. */
  block: ToolCallBlock
  /** Session workspace root for relative summaries. */
  cwd?: string
  /** Open a tool argument path through the host. */
  openFile: (path: string) => void
  /** Inspect this call in the trajectory view when available. */
  inspect?: () => void
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** Keyed atomic tool-call view, dispatched by the wire tool name. */
    'tool.call.toolview': { kind: 'keyed'; scope: 'session'; owner: ToolCallOwnerProps }
  }
}

/** Registration-side injected face: locale binding and the regenerate RPC. */
export interface DrawResultCardInjected {
  /** Re-run the generation through the host drawer; rejects on failure. */
  regenerate: (args: Record<string, unknown>) => Promise<void>
}

/** Full component props assembled by the tool-view slot renderer. */
export type DrawResultCardProps =
  PropsRuntime<'tool.call.toolview'>
  & PropsLocale<'draw'>
  & InjectFace<DrawResultCardInjected>

/**
 * The keyed tool result card.
 * @param props - owner currency, locale, and injected bindings.
 * @returns the card element.
 */
export function DrawResultCard(props: DrawResultCardProps): ReactElement {
  const { block, regenerate, t } = props
  const presented = presentDrawResult(block)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  if (presented === undefined) return h('div', null)

  const runRegenerate = async (): Promise<void> => {
    if (presented.args === undefined) return
    setBusy(true)
    setFailed(false)
    try {
      await regenerate(presented.args)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return h('div', { className: 'dshdraw-card' },
    h('div', { className: 'dshdraw-meta' },
      h('span', null, `${t('result.engine')}: ${presented.engine} (${presented.model})`),
      ...(presented.fallbackUsed ? [h('span', null, t('result.fallback'))] : []),
      h('span', null, `${t('result.quota')}: ${presented.quota.generations}/${presented.limits.maxGenerations} · ${presented.quota.bytes}/${presented.limits.maxBytes}`),
    ),
    h('div', { className: 'dshdraw-actions' },
      h('button', {
        className: 'dshdraw-button',
        type: 'button',
        disabled: busy || presented.args === undefined,
        onClick: () => { void runRegenerate() },
      }, busy ? t('result.regenerating') : t('result.regenerate')),
      ...(failed ? [h('span', { className: 'dshdraw-badge warn' }, t('result.failed'))] : []),
    ),
  )
}
