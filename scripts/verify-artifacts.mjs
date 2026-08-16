// Verify the built artifacts after `pnpm run build`: the host ESM face must
// import under plain Node, the hand-written Typert host manifest must be
// present, the browser client bundle must carry the ModuleLoader handshake,
// and the shipped config files must exist.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const required = [
  'lib/index.js',
  'lib/typert.host.js',
  'lib/client.js',
  'lib/types/index.d.ts',
  'lib/types/client/index.d.ts',
  'cordis.patch.yml',
]
for (const rel of required) {
  if (!existsSync(path.join(root, rel))) throw new Error(`missing artifact: ${rel}`)
}

// 1. Syntax-check the host bundle (plain Node parse; no execution).
execFileSync(process.execPath, ['--check', path.join(root, 'lib/index.js')], { stdio: 'inherit' })

// 2. The ESM host face must import under plain Node (no tsx, no checkout paths).
const index = await import(pathToFileURL(path.join(root, 'lib/index.js')).href)
if (typeof index.apply !== 'function' || index.name !== 'dsh-draw' || !Array.isArray(index.inject)) {
  throw new Error('lib/index.js exports an unexpected plugin face')
}

// 3. The Typert host manifest must export the invocation list.
const typert = await import(pathToFileURL(path.join(root, 'lib/typert.host.js')).href)
if (!Array.isArray(typert.TYPERT?.invocations) || typert.TYPERT.invocations.length === 0) {
  throw new Error('lib/typert.host.js exports an unexpected TYPERT manifest')
}

// 4. The browser bundle must carry the shell's ModuleLoader handshake.
const client = readFileSync(path.join(root, 'lib/client.js'), 'utf8')
if (!client.includes('window.__ModuleLoader__.load')) {
  throw new Error('lib/client.js is not the wrapped browser client bundle')
}

console.log('artifacts OK: syntax + ESM import + typert manifest + browser bundle + config files')
