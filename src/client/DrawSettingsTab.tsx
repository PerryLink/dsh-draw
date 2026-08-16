/**
 * The Plugins settings tab for dsh-draw: engine chain, credential references
 * (set/remove through the host's credential seam), probe button, and quota
 * limits. Read-only except the credential actions; all data arrives through
 * the `draw` Remote namespace.
 *
 * @module dsh-draw/client/DrawSettingsTab
 */

import { createElement as h, useEffect, useState, type ReactElement, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { PresentedDrawPanel } from './present.ts'

/** Registration-side injected face: the panel RPCs (RemoteResult already unwrapped). */
export interface DrawSettingsTabInjected {
  /** Read the panel snapshot. */
  status: () => Promise<PresentedDrawPanel>
  /** Probe one engine's connectivity. */
  probe: (engineId: string) => Promise<string>
  /** Store one API key under the engine's credential reference. */
  setCredential: (engineId: string, value: string) => Promise<string>
  /** Remove a stored API key. */
  unsetCredential: (engineId: string) => Promise<string>
}

/** Full component props assembled by the Settings slot renderer. */
export type DrawSettingsTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'draw'>
  & InjectFace<DrawSettingsTabInjected>

/**
 * The settings tab element.
 * @param props - locale and injected bindings.
 * @returns the tab element.
 */
export function DrawSettingsTab(props: DrawSettingsTabProps): ReactElement {
  const { t, status, probe, setCredential, unsetCredential } = props
  const [panel, setPanel] = useState<PresentedDrawPanel | undefined>(undefined)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [keys, setKeys] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    const load = async (): Promise<void> => {
      try {
        const snapshot = await status()
        if (alive) setPanel(snapshot)
      } catch {
        // Panel load failure keeps the previous snapshot; the rows stay usable.
      }
    }
    void load()
    return () => {
      alive = false
    }
  }, [status])

  const act = async (engineId: string, run: () => Promise<string>): Promise<void> => {
    setNotes(current => ({ ...current, [engineId]: '' }))
    try {
      const note = await run()
      setNotes(current => ({ ...current, [engineId]: note }))
    } catch (error) {
      setNotes(current => ({ ...current, [engineId]: `failed: ${error instanceof Error ? error.message : String(error)}` }))
    } finally {
      try {
        const snapshot = await status()
        setPanel(snapshot)
      } catch {
        // Refresh failure keeps the previous snapshot.
      }
    }
  }

  if (panel === undefined) return h('div', { className: 'dshdraw-panel' }, t('tab.engines'))

  const engineCards: ReactNode[] = []
  for (const engine of panel.engines) {
    const headerChildren: ReactNode[] = [engine.id]
    if (engine.preferred) headerChildren.push(h('span', { key: 'p', className: 'dshdraw-badge ok' }, t('tab.preferred')))
    if (!engine.enabled) headerChildren.push(h('span', { key: 'd', className: 'dshdraw-badge warn' }, t('tab.disabled')))

    const keyActions: ReactNode[] = []
    if (engine.credentialWritable) {
      keyActions.push(h('input', {
        key: 'input',
        className: 'dshdraw-input',
        type: 'password',
        placeholder: t('tab.setKey'),
        value: keys[engine.id] ?? '',
        onChange: (event: { target: { value: string } }) => setKeys(current => ({ ...current, [engine.id]: event.target.value })),
      }))
      keyActions.push(h('button', {
        key: 'set',
        className: 'dshdraw-button',
        type: 'button',
        onClick: () => {
          void act(engine.id, async () => {
            const note = await setCredential(engine.id, keys[engine.id] ?? '')
            setKeys(current => ({ ...current, [engine.id]: '' }))
            return note
          })
        },
      }, t('tab.setKey')))
      if (engine.credentialConfigured) {
        keyActions.push(h('button', {
          key: 'remove',
          className: 'dshdraw-button',
          type: 'button',
          onClick: () => { void act(engine.id, () => unsetCredential(engine.id)) },
        }, t('tab.removeKey')))
      }
    }

    const healthChildren: ReactNode[] = []
    healthChildren.push(h('label', null, t('tab.health')))
    if (engine.coolingDown) {
      healthChildren.push(h('span', { className: 'dshdraw-badge warn' }, `cooldown (${engine.consecutiveFailures})`))
    } else if (engine.consecutiveFailures === 0) {
      healthChildren.push(h('span', { className: 'dshdraw-badge ok' }, t('tab.healthOk')))
    } else {
      healthChildren.push(h('span', { className: 'dshdraw-badge warn' }, `${t('tab.healthError')} (${engine.consecutiveFailures})`))
    }
    if (engine.lastError !== null) healthChildren.push(h('span', { key: 'err' }, engine.lastError))
    healthChildren.push(h('button', {
      key: 'probe',
      className: 'dshdraw-button',
      type: 'button',
      onClick: () => { void act(engine.id, () => probe(engine.id)) },
    }, t('tab.probe')))

    const engineChildren: ReactNode[] = [
      h('h4', null, ...headerChildren),
      h('div', { className: 'dshdraw-row' }, h('label', null, t('tab.engines')), h('span', null, `${engine.model} @ ${engine.baseUrl}`)),
      h('div', { className: 'dshdraw-row' },
        h('label', null, t('tab.keyRef')),
        h('span', null, engine.apiKeyRef),
        h('span', { className: engine.credentialConfigured ? 'dshdraw-badge ok' : 'dshdraw-badge warn' },
          engine.credentialConfigured ? t('tab.credentialSet') : t('tab.credentialMissing')),
      ),
    ]
    if (keyActions.length > 0) engineChildren.push(h('div', { className: 'dshdraw-row' }, ...keyActions))
    engineChildren.push(h('div', { className: 'dshdraw-row' }, ...healthChildren))
    const note = notes[engine.id]
    if (note !== undefined && note !== '') engineChildren.push(h('div', { className: 'dshdraw-row' }, note))
    engineCards.push(h('div', { key: engine.id, className: 'dshdraw-engine' }, ...engineChildren))
  }

  return h('div', { className: 'dshdraw-panel' },
    h('div', { className: 'dshdraw-row' },
      h('span', null, `${t('tab.quotaCalls')}: ${panel.quota.maxGenerationsPerSession}`),
      h('span', null, `${t('tab.quotaBytes')}: ${panel.quota.maxBytesPerSession}`),
      h('span', null, `timeout: ${panel.requestTimeoutMs} ms`),
      h('span', null, `max: ${panel.maxImagesPerCall}`),
    ),
    ...engineCards,
  )
}
