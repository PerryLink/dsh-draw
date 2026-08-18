/**
 * Real Loader composition + built-artifact + export-contract suite (community
 * five-layer model, layer 4). An independent process mounts the vendored
 * Loader over a cordis.yml with the plugin row + config, proving module
 * unwrapping and config schema application. It also carries the invalid-config
 * regressions and the function-plugin namespace contract (no default export)
 * against the built `lib/index.js`.
 * @module dsh-draw/tests/composition.spec
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as plugin from '../src/index.ts'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runner = join(repositoryRoot, 'scripts', 'loader-runner.mjs')
const builtEntry = join(repositoryRoot, 'lib', 'index.js')

/** One cordis.yml: just the plugin row with config. */
function configFor(pluginRow: string, configLines: string[] = []): string {
  return [
    `- name: ${JSON.stringify(pluginRow)}`,
    ...(configLines.length > 0 ? ['  config:', ...configLines.map(line => `    ${line}`)] : []),
    '',
  ].join('\n')
}

function run(command: string, args: string[], cwd: string, shell = false, timeout = 120_000) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env },
    timeout,
    shell,
  })
  if (result.error !== undefined) throw result.error
  return { status: result.status, stdout: result.stdout, stderr: result.stderr }
}

const temporaryRoot = mkdtempSync(join(tmpdir(), 'dsh-draw-loader-'))

beforeAll(() => {
  const build = run('pnpm', ['run', 'build'], repositoryRoot, process.platform === 'win32')
  if (build.status !== 0) {
    throw new Error(`pnpm run build failed (${String(build.status)})\nstdout:\n${build.stdout}\nstderr:\n${build.stderr}`)
  }
}, 180_000)

afterAll(() => {
  rmSync(temporaryRoot, { recursive: true, force: true })
})

describe('function-plugin contract', () => {
  it('carries no default export and the Loader unwrap round-trips the namespace', () => {
    expect('default' in plugin).toBe(false)
    expect(plugin.name).toBe('dsh-draw')
    expect(plugin.inject).toEqual(['tools'])
    expect(typeof plugin.apply).toBe('function')
    expect(plugin.Config).toBeDefined()
    const loader = Object.create(Loader.prototype)
    const unwrapped = loader.unwrapExports(plugin)
    expect(unwrapped).toBe(plugin)
    expect(unwrapped.name).toBe('dsh-draw')
  })
})

describe('real Loader composition', () => {
  it('registers image_generate and applies the config through the Loader', () => {
    const configPath = join(temporaryRoot, 'valid.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href, ['maxPromptLength: 7777']))
    const evidence = run(process.execPath, [runner, configPath], repositoryRoot)
    expect(evidence.status, `stdout:\n${evidence.stdout}\nstderr:\n${evidence.stderr}`).toBe(0)
    expect(evidence.stdout).toMatch(/DSH_LOADER_RESULT/u)
    const marker = evidence.stdout.match(/DSH_LOADER_RESULT (.+)$/mu)
    const summary = JSON.parse(marker![1]!) as { tool: string; description: string }
    expect(summary.tool).toBe('image_generate')
    expect(summary.description).toContain('7777')
  })

  it('rejects an unknown defaultEngine through the Loader', () => {
    const configPath = join(temporaryRoot, 'invalid-default-engine.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href, ['defaultEngine: nope']))
    const evidence = run(process.execPath, [runner, configPath], repositoryRoot)
    expect(evidence.status, `invalid config unexpectedly mounted:\n${evidence.stderr}`).not.toBe(0)
    expect(evidence.stderr).toMatch(/defaultEngine|does not name a configured engine/u)
  })

  it('rejects a malformed sizeMap through the Loader schema', () => {
    const configPath = join(temporaryRoot, 'invalid-size-map.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href, [
      'engines:',
      '  - id: test',
      "    baseUrl: 'https://example.com/v1'",
      '    model: m',
      '    apiKeyRef: TEST_KEY',
      '    sizeMap:',
      "      square: ''",
      "      landscape: '1'",
      "      portrait: '1'",
      "      auto: '1'",
    ]))
    const evidence = run(process.execPath, [runner, configPath], repositoryRoot)
    expect(evidence.status, `invalid config unexpectedly mounted:\n${evidence.stderr}`).not.toBe(0)
  })
})
