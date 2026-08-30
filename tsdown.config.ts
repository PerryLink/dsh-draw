/**
 * Build faces for dsh-draw. The node half (src/index.ts + the hand-written
 * Typert host manifest src/typert.host.ts) is the host Loader entry; the
 * browser half (src/client/index.ts) is the client bundle the client-modules
 * node half serves under /plugins/dsh-draw/client.js.
 *
 * The browser half follows the shell's client-bundle handshake exactly: a CJS
 * bundle wrapped in `window.__ModuleLoader__.load({ id, factory })`, with the
 * shell's platform modules left external (the factory's `require` answers
 * them from the frozen module table) and every other dependency inlined.
 */

import { defineConfig } from 'tsdown'

/** Plugin id: the package name, the graph row id, and the stamped bundle id must all match. */
const PLUGIN_ID = 'dsh-draw'

/**
 * Module specifiers the shell shares into the frozen browser module table
 * (packages/client/web/src/platform.ts). Any value import outside this list
 * must be inlined.
 */
const PLATFORM_EXTERNALS: readonly string[] = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
]

export default defineConfig([
  {
    name: PLUGIN_ID,
    entry: { index: 'src/index.ts', 'typert.host': 'src/typert.host.ts' },
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    dts: false,
    clean: false,
    // ESM output under a "type": "module" package must land on .js, not .mjs.
    fixedExtension: false,
    deps: {
      // Every @deepseek-ai peer resolves at runtime from the host profile.
      neverBundle: [/^node:/, /^@deepseek-ai\//],
      // zod is the only non-peer dependency: bundling it keeps the node face
      // self-contained when a profile resolves the package outside pnpm's tree.
      alwaysBundle: ['zod'],
    },
  },
  {
    name: `${PLUGIN_ID}/client`,
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: ['cjs'],
    platform: 'browser',
    dts: false,
    sourcemap: true,
    clean: false,
    deps: {
      // Platform modules stay external (the factory's `require` answers them
      // from the shell's frozen module table); every other import is inlined.
      neverBundle: [...PLATFORM_EXTERNALS],
      alwaysBundle: (id: string): boolean | undefined => (PLATFORM_EXTERNALS.includes(id) ? undefined : true),
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
    },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
])
