/**
 * The plugin version, hardcoded beside `package.json` so the release script
 * bumps both and the version tripwire in `tests/session-events.spec.ts` trips
 * when they drift. Served in the `draw/status` snapshot so the settings panel
 * shows which plugin build runs.
 *
 * @module dsh-draw/version
 */

/** Plugin version; must equal the `version` field in `package.json`. */
export const PLUGIN_VERSION = '0.1.2'
