/**
 * The keyed `image_generate` tool view: engine/quota facts and the regenerate
 * action once the call settles, and an in-flight row of its own while the
 * arguments are still arriving. The images themselves are the attachment
 * content blocks the shell already renders from the tool result, so the card
 * only adds the accounting line and the action — it never duplicates image
 * transport.
 *
 * The Host dispatches this keyed entry in EVERY stage of the call, and a keyed
 * cell that is occupied never reaches the owner fallback — so the earlier
 * stages cannot be answered with nothing without blanking the row.
 *
 * The `tool.call.toolview` SlotMap member is declared locally (mirroring the
 * harness's own ui-tool contract declaration, which its package index does not
 * re-export): when both declarations land in one program they merge.
 *
 * @module dsh-draw/client/DrawResultCard
 */

import { createElement as h, useState, type ReactElement } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { presentDrawResult, toolCallPhase, type ToolCallBlock, type ToolCallPhase } from './present.ts'

/**
 * Stage-specific tool data, mirror of the harness ui-tool contract
 * `ToolCallPhaseProps`. The Host dispatches the SAME keyed entry in every
 * stage, so the card's own contract must discriminate on `phase` exactly as
 * the Host's does — a narrower declaration here hides the preparing owner
 * rather than rejecting it (the slot is occupied for every stage).
 */
export type ToolCallPhaseProps =
  | { readonly phase: 'preparing'; readonly block: ToolCallBlock }
  | { readonly phase: 'start'; readonly block: ToolCallBlock }
  | { readonly phase: 'result'; readonly block: ToolCallBlock }

/**
 * Common owner currency declared beside the phase share, mirror of the
 * harness ui-tool contract `ToolCallCommonProps` (which the package index
 * does not re-export — keep the shape identical so the declarations merge).
 */
export interface ToolCallCommonProps {
  /** Tool call identity, stable across all stages. */
  callId: string
  /** Wire tool name and keyed dispatch value. */
  toolName: string
  /** Session workspace root for relative summaries. */
  cwd?: string
  /** Open a tool argument path through the host. */
  openFile: (path: string) => void
  /** Inspect this call in the trajectory view when available. */
  inspect?: () => void
}

/**
 * Standard owner currency for one keyed tool view: the common share plus the
 * stage share, mirroring the harness ui-tool contract `ToolCallOwnerProps`.
 */
export type ToolCallOwnerProps = ToolCallCommonProps & ToolCallPhaseProps

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
 * The keyed tool view. Dispatched by the wire tool name in EVERY stage of the
 * call, so the card owes a presentation to the in-flight stages too: returning
 * an empty node would leave the row blank, because an occupied keyed cell
 * never reaches the Host's own generic row.
 *
 * @param props - owner currency (common + stage shares), locale, and injected bindings.
 * @returns the in-flight row, or the settled result card.
 */
export function DrawResultCard(props: DrawResultCardProps): ReactElement {
  // The owner's discriminant and the block are two statements of the same fact,
  // and the block is the one the presenter reads — so the card classifies the
  // stage from the block, through the same function the presenter uses. The
  // owner's arm only breaks the tie in the impossible case of a `result` owner
  // carrying a block that is not a settled node.
  const phase = toolCallPhase(props.block)
  if (phase !== 'result') {
    const stage = props.phase === 'result' ? phase : props.phase
    return h('div', { className: 'dshdraw-inflight', 'aria-busy': 'true', 'data-phase': stage },
      h('span', { className: 'dshdraw-inflight-title' }, props.t('row.title')),
      h('span', { className: 'dshdraw-sep', 'aria-hidden': 'true' }, '·'),
      h('span', { className: 'dshdraw-inflight-summary' }, props.toolName),
      h('span', { className: 'dshdraw-inflight-state' }, props.t(inFlightKey(stage))),
    )
  }
  return h(DrawResultCardBody, props)
}

/** Locale key naming the stage of a call that has not settled yet. */
function inFlightKey(phase: ToolCallPhase): 'row.preparing' | 'row.running' {
  return phase === 'preparing' ? 'row.preparing' : 'row.running'
}

/**
 * The settled result card: engine/quota facts and the regenerate action.
 *
 * @param props - the owner at its `result` stage, locale, and injected bindings.
 * @returns the card element.
 */
function DrawResultCardBody(props: DrawResultCardProps): ReactElement {
  const { block, regenerate, t } = props
  const presented = presentDrawResult(block)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  if (presented === undefined) {
    // The Host handed this card a settled node it does not own (a foreign call
    // head after window truncation, or an error result) — nothing to add.
    return h('div', null)
  }

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
