/**
 * `dsh-draw`, browser half: mounts the `draw` Remote contribution, registers
 * the keyed `image_generate` result card (`tool.call.toolview`, key
 * `image_generate`), and registers the Plugins settings tab (`settings.plugins.tab`,
 * id `draw`). All data arrives through the `remote.draw` namespace; the card
 * and the tab hold no state beyond their local forms.
 *
 * @module dsh-draw/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the 'settings.plugins.tab' SlotMap declaration into this
// program so the tab registration typechecks against the real declaration.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { DrawResultCard, type DrawResultCardInjected } from './DrawResultCard.tsx'
import { DrawSettingsTab, type DrawSettingsTabInjected } from './DrawSettingsTab.tsx'
import { en, zh, type DrawLocaleKey } from './locales.ts'
import { presentDrawPanel } from './present.ts'
import { DRAW_REMOTE } from './remote.ts'
import { installDrawStyles } from './styles.ts'
import type { CredentialActionResult, DrawProbeResult, DrawRegenerateResult, DrawStatusSnapshot } from '../wire.ts'

export type { DrawResultCardInjected, DrawResultCardProps } from './DrawResultCard.tsx'
export type { DrawSettingsTabInjected, DrawSettingsTabProps } from './DrawSettingsTab.tsx'
export type { DrawLocaleKey } from './locales.ts'
export { presentDrawPanel, presentDrawResult, type PresentedDrawPanel, type PresentedDrawResult, type PresentedEngineRow } from './present.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Image-generation card and panel copy. */
    'draw': DrawLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'draw'

/** Plugin name: matches the package name, the graph row id, and the bundle id. */
export const name = 'dsh-draw'

/** Services the browser half reads; `remote.draw` appears once the contribution mounts. */
export const inject = ['slots', 'locale', 'remote', 'sessions']

/**
 * Browser plugin body: dictionaries, the scoped stylesheet, the Remote
 * contribution mount, the result card, and the settings tab registration.
 *
 * @param ctx - client root context.
 */
export async function apply(ctx: ClientContext): Promise<void> {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-draw: dictionaries')
  ctx.effect(() => installDrawStyles(), 'dsh-draw: stylesheet')

  // $mount registers the 'remote.draw' namespace service and owns its
  // removal for this fiber's lifetime.
  await ctx.remote.$mount(DRAW_REMOTE)

  ctx.inject(['remote.draw'], (scope) => {
    const t = scope.locale.bind(NS)
    const unwrap = <T>(result: RemoteResult<T>, method: string): T => {
      if (!result.ok) {
        throw new Error(`draw.${method} failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value
    }

    scope.slots.inject('tool.call.toolview', () => scope.slots.register({
      name: 'tool.call.toolview',
      key: 'image_generate',
      locale: NS,
      inject: (): DrawResultCardInjected => ({
        regenerate: async (args) => {
          const sessionId = currentSessionId(scope.get('sessions'))
          if (sessionId === undefined) throw new Error('no active session — cannot regenerate')
          unwrap<DrawRegenerateResult>(await scope.remote.draw.regenerate(sessionId, args), 'regenerate')
        },
      }),
    }, DrawResultCard))

    scope.slots.inject('settings.plugins.tab', () => scope.slots.register({
      name: 'settings.plugins.tab',
      id: 'draw',
      order: 40,
      label: () => t('tab'),
      locale: NS,
      inject: (): DrawSettingsTabInjected => ({
        status: async () => presentDrawPanel(unwrap<DrawStatusSnapshot>(await scope.remote.draw.status(), 'status')),
        probe: async (engineId) => {
          const result = unwrap<DrawProbeResult>(await scope.remote.draw.probe(engineId), 'probe')
          return result.note
        },
        setCredential: async (engineId, value) => {
          const result = unwrap<CredentialActionResult>(await scope.remote.draw.setCredential(engineId, value), 'setCredential')
          return result.note
        },
        unsetCredential: async (engineId) => {
          const result = unwrap<CredentialActionResult>(await scope.remote.draw.unsetCredential(engineId), 'unsetCredential')
          return result.note
        },
      }),
    }, DrawSettingsTab))
  })
}

/**
 * Read the current session id from the sessions store face (structural:
 * the store shape differs across harness lines, so only the leaf is read).
 */
function currentSessionId(sessions: unknown): string | undefined {
  try {
    const list = (sessions as { list?: unknown } | null)?.list
    if (typeof list !== 'object' || list === null) return undefined
    const getSnapshot = (list as { getSnapshot?: unknown }).getSnapshot
    if (typeof getSnapshot !== 'function') return undefined
    const current = (getSnapshot as () => { current?: unknown })().current
    return typeof current === 'string' ? current : undefined
  } catch {
    return undefined
  }
}
