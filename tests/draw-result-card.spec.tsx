/**
 * The keyed `image_generate` tool view, rendered as markup. The card is
 * dispatched by the wire tool name in EVERY stage of the call (preparing,
 * start, result), so these specs render the real component through
 * `react-dom/server` and pin what each stage owes the user:
 *
 * - `preparing` — the rc.1 regression lock. The Host hands the card a
 *   preparing owner while the arguments stream; the card used to fall through
 *   `presentDrawResult` into an empty `div`, which blanked the whole row
 *   because an occupied keyed cell never reaches the Host's own generic
 *   fallback. It now renders its own minimal in-flight row.
 * - `start` — the same in-flight row, without the preparing wording.
 * - `result` — the settled accounting card and its regenerate action.
 *
 * @module dsh-draw/test/draw-result-card.spec
 */

import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactElement } from 'react'
import {
  DrawResultCard, type DrawResultCardProps, type ToolCallOwnerProps, type ToolCallPhaseProps,
} from '../src/client/DrawResultCard.tsx'
import { en } from '../src/client/locales.ts'
import type { RunningToolCallBlock, SettledToolResultBlock } from '../src/client/present.ts'

/** The draw namespace's translate seat, read from the shipped English dictionary. */
const t: DrawResultCardProps['t'] = ((key: keyof typeof en) => en[key]) as DrawResultCardProps['t']

/** Every owner field except the stage share; the stage supplies `phase` and `block`. */
const OWNER = {
  callId: 'call-1',
  toolName: 'image_generate',
  openFile: () => {},
  regenerate: async () => {},
} as const

/** A preparing owner: the arguments are still streaming, so there is no `kind` and no `argsRaw`. */
function preparingBlock(): RunningToolCallBlock {
  return { callId: 'call-1', name: 'image_generate', turn: 0, step: 0, time: 0 } as unknown as RunningToolCallBlock
}

/** A dispatched-but-unsettled owner: the call is running with its arguments known. */
function startedBlock(): RunningToolCallBlock {
  return {
    callId: 'call-1', name: 'image_generate', argsRaw: '{"prompt":"a cat"}', turn: 0, step: 0, time: 0,
  } as unknown as RunningToolCallBlock
}

/** A settled result owner carrying the tool-owned presentation metadata. */
function resultBlock(): SettledToolResultBlock {
  return {
    kind: 'tool-result',
    isError: false,
    call: { name: 'image_generate', argsRaw: JSON.stringify({ prompt: 'a cat', size: 'landscape' }) },
    meta: {
      engine: 'openai',
      model: 'gpt-image-1',
      fallbackUsed: false,
      images: [{ attachmentId: 'att-1', name: 'openai-1.png' }],
      quota: { generations: 1, bytes: 100 },
      limits: { maxGenerations: 200, maxBytes: 209715200 },
    },
  }
}

/**
 * Assemble a card owner at one stage. The two arms are built literally so the
 * discriminated union stays correlated (spreading a `phase`/`block` pair from a
 * variable widens the literal and loses the discriminant).
 *
 * @param vars - the stage and its block.
 * @returns the full card props.
 */
function cardProps(vars: ToolCallPhaseProps): DrawResultCardProps {
  const common = { ...OWNER, t }
  return (vars.phase === 'preparing'
    ? { ...common, phase: 'preparing', block: vars.block }
    : vars.phase === 'start'
      ? { ...common, phase: 'start', block: vars.block }
      : { ...common, phase: 'result', block: vars.block }) as unknown as DrawResultCardProps
}

/** Render the card at one stage to static markup. */
function render(vars: ToolCallPhaseProps): string {
  const element: ReactElement = DrawResultCard(cardProps(vars))
  return renderToStaticMarkup(element)
}

/**
 * Compile-time lock on the owner contract. The published
 * `@deepseek-ai/dsh-client-ui-tool` index does not re-export the tool-view
 * contract declaration (verified against the installed `0.1.7-rc.1`), which is
 * why this repository declares it locally — and that local copy is the ONLY
 * thing the two typecheck rulers see, so it can hide the Host's real currency
 * by being narrower than it. These two assertions are what a narrowing change
 * breaks at compile time:
 *
 * - a stage-shaped owner IS accepted, so the declaration admits every arm the
 *   Host dispatches;
 * - an owner with no stage discriminant is REJECTED, so dropping `phase` from
 *   the declaration (the exact shape that shipped the blank preparing row)
 *   turns the `@ts-expect-error` below into an unused-directive error.
 */
const _acceptsStageOwner: (owner: ToolCallOwnerProps) => void = () => {}
_acceptsStageOwner({
  callId: 'call-1',
  toolName: 'image_generate',
  openFile: () => {},
  phase: 'preparing',
  block: preparingBlock(),
})
// @ts-expect-error an owner without the stage discriminant must not typecheck
_acceptsStageOwner({
  callId: 'call-1',
  toolName: 'image_generate',
  openFile: () => {},
  block: preparingBlock(),
})

describe('DrawResultCard across the Host tool-call stages', () => {
  it('renders a visible in-flight row for the preparing stage (never an empty div)', () => {
    const html = render({ phase: 'preparing', block: preparingBlock() })
    // The regression: the whole row was an empty div and the Host's own
    // preparing row was unreachable behind the occupied keyed cell.
    expect(html).not.toBe('<div></div>')
    expect(html).toContain('data-phase="preparing"')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('image_generate')
    expect(html).toContain(en['row.title'])
    expect(html).toContain(en['row.preparing'])
    // No accounting facts exist yet, so the settled card must not appear.
    expect(html).not.toContain('dshdraw-card')
    expect(html).not.toContain(en['result.engine'])
    expect(html).not.toContain(en['result.regenerate'])
  })

  it('renders the same in-flight row, with the running wording, for the start stage', () => {
    const html = render({ phase: 'start', block: startedBlock() })
    expect(html).not.toBe('<div></div>')
    expect(html).toContain('data-phase="start"')
    expect(html).toContain(en['row.running'])
    expect(html).not.toContain(en['row.preparing'])
    // A dispatched call still has no result: no quota line, no regenerate.
    expect(html).not.toContain('dshdraw-card')
    expect(html).not.toContain(en['result.regenerate'])
  })

  it('renders the settled accounting card for the result stage', () => {
    const html = render({ phase: 'result', block: resultBlock() })
    expect(html).toContain('dshdraw-card')
    expect(html).toContain(`${en['result.engine']}: openai (gpt-image-1)`)
    expect(html).toContain(`${en['result.quota']}: 1/200 · 100/209715200`)
    expect(html).toContain(en['result.regenerate'])
    // The settled card replaces the in-flight row.
    expect(html).not.toContain('dshdraw-inflight')
  })

  it('does not throw for any declared stage', () => {
    expect(() => render({ phase: 'preparing', block: preparingBlock() })).not.toThrow()
    expect(() => render({ phase: 'start', block: startedBlock() })).not.toThrow()
    expect(() => render({ phase: 'result', block: resultBlock() })).not.toThrow()
  })
})
