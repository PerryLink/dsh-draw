// Third ruler: catch a Host tool-view contract change that BOTH existing
// rulers miss.
//
// `pnpm run typecheck` resolves the local checkout's fresh type faces through
// tsconfig `paths`, and `pnpm run typecheck:ci` resolves the npm-published
// faces — yet neither caught the 0.1.7-rc.1 change that split the
// `tool.call.toolview` owner into a `preparing` / `start` / `result` phase
// union. Reason: this plugin declares the slot contract LOCALLY (the harness
// ui-tool package index does not re-export it) and `SlotMap` is an interface,
// so the two declarations merge and the local, narrower one becomes the
// program's authority. The Host's real union was never the thing being
// checked.
//
// This script reads the Host's own declaration text and the renderer's keyed
// dispatch, and compares them with what this repository declares and relies on:
//
//   R1  the local phase vocabulary equals the Host's `ToolCallPhaseProps` arms
//   R2  every declared phase has a presentation branch (no silent default)
//   R3  the Host still falls back ONLY for an empty keyed cell, which is why an
//       occupied cell owes its own in-flight row instead of `undefined`
//   R4  the published interface carries no dependency on the checkout
//
// R4 also defines the degradation rule: the checkout is a local development
// artifact (CI has none), so R1-R3 verify what they can without it and say so.
// Whenever the checkout IS present, every check runs and any mismatch is a
// hard failure.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const read = rel => readFileSync(path.join(root, rel), 'utf8')
const failures = []
const notes = []

/** Fail loudly (never a quiet skip) with the reason and the repair. */
const fail = message => failures.push(message)

/** The text of a union type alias, from its `=` to the first statement break. */
const unionOf = (text, name) => {
  const at = text.indexOf(`export type ${name} =`)
  if (at === -1) return undefined
  return text.slice(at, text.indexOf('\n\n', at) === -1 ? undefined : text.indexOf('\n\n', at))
}

/** The arms of a union as `phase: block` pairs, or [] when the union has none. */
const phaseArms = union => [...(union ?? '').matchAll(/phase:\s*'([^']+)'\s*;\s*readonly block:\s*([A-Za-z0-9_]+)/gu)]
  .map(match => ({ phase: match[1], block: match[2] }))

// ---------------------------------------------------------------- local side

const presentSource = read('src/client/present.ts')
const declared = []
const arrayBody = presentSource.match(/TOOL_CALL_PHASES\s*=\s*\[([^\]]*)\]/u)?.[1]
if (arrayBody === undefined) {
  fail('src/client/present.ts no longer declares the TOOL_CALL_PHASES array the phase type derives from')
} else {
  for (const match of arrayBody.matchAll(/'([^']+)'/gu)) declared.push(match[1])
  if (declared.length === 0) fail('TOOL_CALL_PHASES is empty: the phase vocabulary must name every Host stage')
  if (new Set(declared).size !== declared.length) fail(`TOOL_CALL_PHASES has duplicate entries: ${declared.join(', ')}`)
}

// R2: the presentation switch must branch on EVERY declared phase. A phase
// swept into `default` is invisible at the type level until a Host block of
// that phase arrives — which is exactly how the blank preparing row shipped.
const switchAt = presentSource.indexOf('switch (phase)', presentSource.indexOf('export function presentToolCallPhase'))
const caseLabels = []
if (switchAt === -1) {
  fail('presentToolCallPhase no longer switches on the phase: the completeness check has nothing to read')
} else {
  for (const match of presentSource.slice(switchAt).matchAll(/case\s+'([^']+)':/gu)) caseLabels.push(match[1])
  for (const phase of declared) {
    if (!caseLabels.includes(phase)) {
      fail(`presentToolCallPhase has no explicit \`case '${phase}'\`: that Host stage would be rendered by another branch's presentation`)
    }
  }
}

// The card must not answer a stage with nothing: it owes a presentation to
// every stage before `result` (an occupied keyed cell never reaches the owner
// fallback), and only a settled node the card does not own may yield an empty
// node. The stage is classified from the block by the presenter's own
// `toolCallPhase`, so this pins the two things that make the row visible.
const cardSource = read('src/client/DrawResultCard.tsx')
if (/toolCallPhase\(props\.block\)/.test(cardSource) === false) {
  fail('src/client/DrawResultCard.tsx no longer classifies the stage from the owner block through toolCallPhase')
}
if (/phase !== 'result'/.test(cardSource) === false) {
  fail("src/client/DrawResultCard.tsx no longer branches on the stage before presenting a result")
}
if (/presentDrawResult\(/.test(cardSource) === false) {
  fail('src/client/DrawResultCard.tsx no longer reads presentDrawResult')
}

// R4 is also the degradation rule: nothing shipped may point at the checkout.
const localFiles = ['src/client/present.ts', 'src/client/DrawResultCard.tsx', 'src/client/index.ts']
for (const rel of localFiles) {
  if (read(rel).includes('deepseek-harness')) {
    fail(`${rel} references the local harness checkout; the published interface must stay checkout-free`)
  }
}

// ---------------------------------------------------------------- host side

// The checkout position is a local development convention (this workspace keeps
// it beside the projects tree); the gate degrades explicitly when it is absent.
const hostRoot = process.env.DSH_HOST_CHECKOUT ?? path.resolve(root, '../../../../deepseek-harness')
const hostSlots = path.join(hostRoot, 'packages/client/ui-tool/src/client/contract/slots.ts')
const hostRenderer = path.join(hostRoot, 'packages/client/ui-renderer/src/client/scoped-slots.tsx')

if (!existsSync(hostSlots)) {
  notes.push(`host checkout not present at ${hostRoot}: R1/R3 verified locally only (CI and tarball installs have no checkout)`)
} else {
  const host = readFileSync(hostSlots, 'utf8')
  const hostArms = phaseArms(unionOf(host, 'ToolCallPhaseProps'))
  if (hostArms.length === 0) {
    fail(`cannot read \`ToolCallPhaseProps\` arms from ${hostSlots}: the Host moved or renamed the contract, so this gate can no longer see it`)
  } else {
    const hostPhases = hostArms.map(arm => arm.phase)
    if (hostPhases.join(',') !== declared.join(',')) {
      fail(
        `host tool-view phase drift: the Host declares [${hostPhases.join(', ')}] `
        + `but this repository declares [${declared.join(', ')}] — `
        + 'update TOOL_CALL_PHASES, the presentToolCallPhase switch, the local ToolCallPhaseProps, '
        + 'and the stage coverage in tests/draw-result-card.spec.tsx together',
      )
    }
    // The block each stage carries is the other half of the contract: reading
    // the wrong arm's block is what produced the blank preparing row.
    notes.push(`host owner currency: ${hostArms.map(arm => `${arm.phase}<${arm.block}>`).join(' | ')}`)
    // The card reads `phase` off a block that itself declares `phase`; if the
    // Host ever moves the discriminant into the owner instead, this notices.
    const chatTool = path.join(hostRoot, 'packages/client/ui-chat/src/client/conversation-nodes/tool.ts')
    if (existsSync(chatTool)) {
      const chat = readFileSync(chatTool, 'utf8')
      if (!/phase:\s*'preparing'/u.test(chat)) {
        fail(`${chatTool} no longer constructs a \`phase: 'preparing'\` block: the runner-stage probe in toolCallPhase reads the wrong field`)
      }
    }
  }

  // R3: the keyed dispatch reaches the owner fallback ONLY for an empty cell.
  // This is the whole reason the card cannot answer a prepared stage with
  // `undefined` — the Host's own row is unreachable behind an occupied cell.
  if (!existsSync(hostRenderer)) {
    notes.push(`host renderer not present at ${hostRenderer}: R3 not verified against the Host source`)
  } else {
    const renderer = readFileSync(hostRenderer, 'utf8')
    const keyed = renderer.match(/spec\.kind === 'keyed'[\s\S]{0,400}?\n {2}\}/u)?.[0] ?? ''
    const fallsBackOnEmptyCell = /const occupied = entries\.some\(/u.test(keyed)
      && /occupied \? deadCell\(\) : <>\{opts\?\.fallback \?\? null\}<\/>/u.test(keyed)
    if (!fallsBackOnEmptyCell) {
      fail(
        'the Host keyed dispatch no longer matches "fallback only for an empty cell": '
        + 'if an occupied cell can now reach the owner fallback, the card may return undefined again '
        + 'instead of rendering its in-flight row — re-read scoped-slots.tsx and re-decide',
      )
    } else {
      notes.push('host keyed dispatch confirmed: fallback only for an empty cell (an occupied cell owns its row)')
    }
  }
}

if (failures.length > 0) {
  console.error('host-contract failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log(`host-contract: ${declared.length} tool-view stages (${declared.join(' | ')}) declared, branched, and covered`)
for (const note of notes) console.log(`  ${note}`)
