// scripts/loader-runner.mjs — real Loader composition runner (community
// five-layer model, layer 4). An independent process boots a real Context,
// mounts the vendored Loader with the Include builtin, reads the given
// cordis.yml (the plugin row + config), then asserts the plugin's contribution
// through the tool registry. Config is applied by the Loader, so a
// config-dependent fact proves the config in the file was honored.
//
// The plugin injects only `tools` (a registry that needs the system-prompt
// service to compose for real); this runner provides a narrow in-process face
// recording registrations, exactly as the repository's test harness does for
// its scripted transport. The heavy optional seams (transport, credentials,
// attachments, sessions) are all absent, so the drawer falls back to the
// fetch transport and the tool still registers.
//
// Usage: node scripts/loader-runner.mjs <cordis.yml>
// Exit 0 prints DSH_LOADER_RESULT <json>; a load failure (invalid config,
// default export) exits non-zero with the reason on stderr. A loader row whose
// `apply` (or config validation) threw is re-thrown from its own fiber so the
// invalid-config negation still fails on the real reason instead of on the
// downstream "tool is missing" symptom — see `rethrowFirstFailedRow` below.

import { Context } from '@deepseek-ai/cordis'
import Include from '@deepseek-ai/cordis-plugin-include'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const configArgument = process.argv[2]
if (configArgument === undefined) {
  console.error('usage: loader-runner.mjs <cordis.yml>')
  process.exit(2)
}

const configPath = resolve(configArgument)
// Resolve bare package rows from this repository's dependency tree so the
// composition works with config files written anywhere (e.g. a temp dir).
const configRequire = createRequire(resolve(import.meta.dirname, '../package.json'))

const ctx = new Context()
/** Error-severity log records, kept so a failed row's reason survives for the assertion. */
const capturedErrors = []
ctx.logger.exporter({
  levels: { default: 0 },
  export: (message) => {
    if (message.level === 'error' || message.level === 0) {
      capturedErrors.push(message.args?.[0] instanceof Error ? message.args[0] : new Error(String(message.args?.[0] ?? message.message ?? 'loader error')))
    }
  },
})
try {
  ctx.baseUrl = `${pathToFileURL(dirname(configPath)).href}/`
  const registered = []
  ctx.provide('tools', {
    register(definition) {
      registered.push(definition)
      return () => undefined
    },
    schemas() {
      return registered.map(definition => ({ name: definition.name, parameters: definition.parameters, description: definition.description }))
    },
    get(name) {
      return registered.find(definition => definition.name === name)
    },
  })
  await ctx.plugin(Loader)
  ctx.loader.internal = /** @type {any} */ ({
    version: 'v2',
    async import(specifier) {
      if (specifier.startsWith('file:')) return import(specifier)
      if (specifier.startsWith('node:')) return import(specifier)
      const absolute = /^([a-zA-Z]:)?[\\/]/u.test(specifier)
      return import(pathToFileURL(absolute ? specifier : configRequire.resolve(specifier)).href)
    },
  })
  ctx.loader.builtins.include = Include
  await ctx.loader.create({
    name: 'cordis:include',
    config: { path: pathToFileURL(configPath).href },
  })
  await ctx.loader.await()
  rethrowFirstFailedRow()

  const tool = registered.find(definition => definition.name === 'image_generate')
  if (tool === undefined) {
    throw new Error(`Loader composition: image_generate tool is missing (registered: ${registered.map(definition => definition.name).join(', ')})`)
  }
  process.stdout.write(`DSH_LOADER_RESULT ${JSON.stringify({ tool: tool.name, description: tool.description })}`)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
} finally {
  await ctx.fiber.dispose()
}

/**
 * Re-throw the first FAILED loader row's error.
 *
 * `cordis-plugin-loader` 1.0.6 dropped the failure surface `await()` had in
 * 1.0.4: the old body collected `entry._await()` outcomes and threw the single
 * failure (or an AggregateError), while 1.0.6's body only loops over
 * `_initTask || fiber.inertia` and returns as soon as there is no pending
 * task — so a row whose config validation or `apply` threw no longer makes
 * `await()` reject. `Entry._init()` does not surface it either (cordis's
 * `Fiber._reload()` catches the error, reports it through `ctx.logger.error`
 * and parks the fiber in `FiberState.FAILED`), and this composition registers
 * no exporter, so the report would vanish and the invalid-config regression
 * here would pass on the downstream symptom ("image_generate tool is missing")
 * instead of the real reason. Walking the entries restores that reason without
 * depending on the resurrected API.
 *
 * `DSH_LOADER_RUNNER_NO_RETHROW=1` disables it for re-measurement only.
 */
function rethrowFirstFailedRow() {
  if (process.env.DSH_LOADER_RUNNER_NO_RETHROW === '1') return
  const failed = []
  for (const entry of ctx.loader.entries()) {
    const fiber = entry?.fiber
    // FiberState.FAILED === 3 (const enum, erased at runtime). A failed row keeps no
    // `fiber.error` on this line, so the reason is recovered from the row's own log records.
    if (fiber?.state === 3) failed.push(capturedErrors.shift() ?? new Error(`loader row ${String(entry?.options?.name ?? '?')} failed`))
  }
  if (failed.length === 1) throw failed[0]
  if (failed.length > 1) throw new AggregateError(failed, 'loader fibers failed')
}
