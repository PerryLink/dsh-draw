# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Changed

- Host pins move to `0.1.7-rc.2`; re-verified against that host line. Every `@deepseek-ai/dsh-*` dev/test dependency now pins `0.1.7-rc.2`, the `dshWorkshop.compatibility.dshVersions` timeline appends `0.1.7-rc.2`, and the compatibility baseline in every README records the `dsh-v0.1.7-rc.2` host. The declared host ranges (`engines.dsh` and the `peerDependencies` union) are deliberately **unchanged** — they already admit `0.1.7-rc.2`, and a range is what the manifest accepts, not what has been tested.

## [0.2.17] - 2026-09-23

### Fixed

- The result card is visible again while the call is still arriving. Harness `0.1.7-rc.1` split the client `tool.call.toolview` owner into three stages — `preparing`, `start`, `result` — and dispatches the **same keyed entry in all three**, so an `image_generate` card now receives a *preparing* owner whose block is an ordinary object with no `kind` and no `argsRaw`. The card's only guard was `'kind' in block`, so `presentDrawResult` returned `undefined` and the card rendered an empty `div`. Nothing threw, which is why it read as a cosmetic oddity rather than a crash: **the row was blank for the entire argument-streaming window.** The card now renders its own in-flight row for the stages before `result` — tool name plus a localized preparing/running label — because returning nothing cannot delegate to the host: a keyed cell that is *occupied* never reaches the owner fallback (the renderer falls back only for an empty cell), so an empty answer blanks the line instead of restoring the host's own generic row. The settled card, its accounting line, and regenerate are unchanged.

### Added

- `scripts/verify-host-contract.mjs` (`pnpm run verify:host-contract`), a third ruler beside the two typechecks, wired into CI and the release gate. Both typechecks were green through this whole regression: this repository declares the tool-view contract **locally** (the harness ui-tool package index does not re-export it — re-verified against the installed `0.1.7-rc.1`) and `SlotMap` is an interface, so the two declarations merge and the local, narrower one becomes the program's authority; the host's real union was never the thing being checked. The new gate reads the host's own `ToolCallPhaseProps` declaration and the renderer's keyed dispatch and fails loudly when they no longer match what this plugin declares and relies on. It also pins the assumption the fix rests on ("the fallback is reachable only for an empty cell"), so a future host that changes that naming fails here instead of silently re-blanking the row. The checkout is a local development artifact, so when it is absent (CI, tarball installs) the gate verifies what it can without it; whenever it *is* present, every check runs.

### Changed

- Move the `@deepseek-ai/dsh-*` dev/test pins to `0.1.7-rc.1`, record `0.1.7-rc.1` in `dshWorkshop.compatibility.dshVersions`, and point the CI step label and the weekly Compat workflow at the same line. The declared `engines.dsh` / `peerDependencies` bands are unchanged — the `|| >=0.1.7-0 <0.2.0` arm added in 0.2.16 already admits this prerelease, so no supported host line is dropped and no range is narrowed.
- The browser-half component specs are the first `.tsx` specs in this repo, so `vitest.config.ts` now includes `tests/**/*.spec.{ts,tsx}`. The previous pattern silently skipped them; a spec file that never runs is worse than no spec file. `@types/react-dom` joins `devDependencies` for the `react-dom/server` render face (no runtime dependency is added — `react-dom` was already a devDependency).
- The local `ToolCallOwnerProps` in `src/client/DrawResultCard.tsx` is the host's phase discriminant union again (`common & ToolCallPhaseProps`), split into an exported `ToolCallPhaseProps` and `ToolCallCommonProps` exactly as the harness declares them, and a spec assertion now rejects an owner with no `phase`.

## [0.2.16] - 2026-09-23

### Fixed

- The `Config` face compiles against the checkout ruler again. `pnpm run typecheck` failed with TS2375 at the `export const Config: z<Config>` annotation; reported at the top level as an `exactOptionalPropertyTypes` mismatch, the chain ended in `Type 'SchemaOutput<string, Mode>' is not assignable to type 'string'` / `Type 'Volatile<string>' is not assignable to type 'string'` — even though this schema never calls `.volatile()`. Root cause: the installed schema generation and the compile ruler disagreed. `@deepseek-ai/schemastery` was held on a line with no `Mode` type parameter and no `volatile()` at all, while the checkout ruler (tsconfig `paths`) pulled the newer `vendor/schemastery` into the same program through the aliased `@deepseek-ai/cordis` and `@deepseek-ai/dsh-client-*` faces. Two conflicting declarations of the same global `Schemastery` namespace merged, and the newer `default(value)` signature leaked `Volatile<T>` out of the still-unresolved `Mode` of the older interface. The `Volatile` face was therefore an artifact of two Schemastery copies in one program, not a property of this schema — which is why the same source compiled cleanly under `typecheck:ci` (single Schemastery copy) all along. Putting the whole dependency line on the `0.1.7-alpha.2` ruler leaves a single Schemastery generation in play. **No source change was required**: every field of this schema is genuinely NOT volatile, and the plain `Config` interface is already exactly what the schema produces. No cast was introduced, no assertion was weakened, and no field gained or lost a `.volatile()` mark, so the Host's generated settings form and the config-file format are unchanged.

### Changed

- Move the `@deepseek-ai/dsh-*` dev/test pins to `0.1.7-alpha.2`, and the `@deepseek-ai/schemastery` / `@deepseek-ai/cordis` dev carets to the versions that line declares, so one Schemastery generation is in the program.
- Every declared host range — `engines.dsh` and the twelve `peerDependencies` bands — gains the `|| >=0.1.7-0 <0.2.0` arm, so the bands now admit the `0.1.7` prerelease line. Under semver's prerelease rule a range whose only prerelease comparators sit on earlier version tuples cannot admit a later alpha, so the previous three-clause form excluded the very host this release targets. The `peerDependencies` carets for cordis and schemastery already admitted the installed versions and are unchanged. No existing arm was removed or narrowed.
- `dshWorkshop.compatibility.dshVersions` gains `0.1.7-alpha.2`, and all five READMEs name the verified line.
- The compat workflow now installs the `0.1.7-alpha.2` host instead of `0.1.6-alpha.2`, so the scheduled end-to-end run exercises the line this package declares.

## [0.2.15] - 2026-09-18

### Fixed

- The result card's regenerate no longer reads the removed `SessionListState.current`: on the 0.1.6 line that field is gone, so the read returned `undefined` forever and regenerate failed (or silently lost the session scope). The card now takes the session the main view retains (`retainedBy.mainView > 0`), the same rule the upstream session store applies, and keeps the guard that reports "no active session" instead of acting on an unknown one. The old `current` field is never read again.
- The scoped stylesheet is ownership-counted. It used to hand back a no-op disposer when the node already existed, so unmounting the mount that created it removed the sheet out from under any other live mount (styles-lost window); it also never removed an orphaned node. The sheet now stays while any mount is alive and the last unmount removes it.
- `DrawService` mounts through an effect registered before the await, so a disposal while the Remote service is still mounting unwinds it instead of leaving a half-applied mount; the success log no longer claims a mount that was already torn down, and a real mount failure still propagates.
- The session-event gate records the mount-time probe result and warns once on the first refused commit. The degradation (quota falls back to the in-memory ledger) used to be completely silent.

### Changed

- Carry both Typert strict-codec faces on the wire descriptors: the published `schema` field (0.1.5-rc.2 line) and the `create` factory the 0.1.6-alpha.1 checkout materializes lazily on first use. Both typecheck rulers stay green.
- Declare `dsh.manifestVersion: 1` and the canonical three-clause `engines.dsh` range. The compatibility notes now state the `0.1.6-alpha.2` behavior explicitly: `draw/generated` is not written on that line (the append's third parameter is a `SurfaceIntent` for surface types only), quota is counted in memory per session and resets on restart.

## [0.2.14] - 2026-09-12

### Fixed

- Read the plugin version from `src/version.ts` in the assembly spec instead of hardcoding it, so a release commit no longer turns CI red. Re-releases 0.2.13, whose tag CI failed on the stale literal.

## [0.2.13] - 2026-09-12

### Changed

- Rename the four translated READMEs to `README-<lang>.md`. npm selects the package-page readme as the first markdown file matching its `{README,README.*}` glob (`@npmcli/package-json`, publish path), and that glob order puts `README.<lang>.md` ahead of `README.md` — so npm was serving the Simplified-Chinese file for this package too (measured on 15/15 sampled packages of the family). The new names sit outside the glob, so the English source is served again. No content changed apart from the language-switcher link each translation holds to its siblings, and the repo readme gate still passes. Takes effect with the next release; an already-published version cannot gain a corrected readme retroactively.
- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.2` line and record `0.1.5-rc.2` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.2`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

### Fixed

- The release workflow claimed provenance but never passed the flag: it runs `npm publish --access public`, and npm only attests a token-based publish when `--provenance` is given explicitly. The publish step is now `npm publish --access public --provenance`, matching `dsh-github` and `dsh-plugin-guide`. Takes effect from the next release; an already-published version cannot gain attestations retroactively.
## [0.2.12] - 2026-09-10

### Fixed

- The monthly **Endpoint liveness** workflow never probed anything: `actions/setup-node@v5`
  auto-enables package-manager caching from `package.json#packageManager` (pnpm here), so the
  step failed with `Unable to locate executable file: pnpm` and the probe step was skipped on
  every scheduled run (observed on the 2026-09-01 run). The job only runs `node`, so the
  automatic cache is now disabled with `package-manager-cache: false` instead of installing a
  package manager it does not use.
## [0.2.11] - 2026-09-10

### Changed

- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.1` line and record `0.1.5-rc.1` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.1`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-rc.1` (verified 2026-09-10).

## [0.2.10] - 2026-09-09

### Changed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` and pin the dev/test dependencies to the published `0.1.5-alpha.1` line: adaptation to DeepSeek Harness `dsh-v0.1.5-alpha.1` (session format V3, `ctx.agent` removal, `Inbox` type-only interface); runtime behavior is unchanged for every supported host line.
- Record `0.1.5-alpha.1` in `dshWorkshop.compatibility.dshVersions`.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-alpha.1` (verified 2026-09-09).

## [0.2.9] - 2026-09-07

### Docs

- Fix the DSH plugin badge URL: shields.io rejects the four-segment static badge form with "404 badge not found"; the label now uses the documented double-dash form (`dsh--plugin`), rendering identically; no behavior change.


## [0.2.8] - 2026-09-07

### Fixed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0`: the older `>=0.1.0-rc.8 <0.2.0` band resolved to only the `0.1.0-rc.8` prerelease under registry-driven resolution and broke fresh tarball installs; no behavior change.

### Docs

- Refresh the five-language README support-version wording: the verified GitHub tag `dsh-v0.1.3-alpha.1` now leads the compatibility claim, while npm `0.1.2-rc.1` stays the published dependency-pin line (peers `>=0.1.2-rc.1 <0.2.0`); no behavior change.


## [0.2.7] - 2026-09-04

### Fixed

- Carry the release version through `src/version.ts` and the status test: the 0.2.6 stamp only bumped `package.json`, so CI's version tripwire (`PLUGIN_VERSION === pkg.version`) failed and 0.2.6 was never published; 0.2.7 repackages the same changes with every carrier aligned.

### Changed

- Align the devDependency pins to the published dsh `0.1.2-rc.1` line, move the compat CI harness probes from `0.1.1-rc.2` to `0.1.2-rc.1`, and re-verify the adaptation claims.
- Refresh the session-log audit facts in the five-language READMEs and AGENTS.md: the `0.1.2-rc.1` line keeps the `ignorable` field on the stored-log envelope but its `Session.append` third argument is a `SurfaceIntent`, so the marker can still not be stamped and the gate keeps degrading to the fallback ledger (behavior unchanged).
- Note that outbound engine calls ride the host's configured HTTP proxy from `0.1.2-rc.1` (default direct connection unchanged).

## [0.2.5] - 2026-09-02

### Docs

- Sync the five-language READMEs to the 0.1.2-alpha.5 facts; no behavior change.

## [0.2.4] - 2026-09-02

### Changed

- Align the devDependency pins to the published dsh 0.1.2-alpha.5 line and re-verify the adaptation claims; no behavior change.

## [0.2.3] - 2026-09-01

### Changed

- Align the devDependency pins to the published dsh `0.1.2-alpha.3` line (17 `@deepseek-ai/dsh-*` packages) and align `cordis`/`schemastery` to `^4.0.2`/`^3.18.2`. The `draw/generated` gate behavior is unchanged on `0.1.2-alpha.3` (`Session.append` still cannot stamp the `ignorable` marker); the five-language READMEs record the alpha.3 fact.

### Changed

- Align devDeps pins to the published dsh 0.1.2-alpha.2 line (0.1.1-rc.2 -> 0.1.2-alpha.2); no behavior change to envelope/gating semantics.

## [0.2.2] - 2026-08-30

### Changed

- **Client dependency-surface migration.** The browser half no longer
  type-imports the removed `@deepseek-ai/dsh-client-runtime` package: it
  rides the cordis `Context` plus the published client packages, and the
  frozen tool-call block is read through a local structural contract (the
  published `0.1.1-rc.2` line keeps the block union in the removed runtime
  package, and the unreleased `0.1.2-alpha.1` host owns it in the
  unpublished `dsh-client-ui-chat`). The tsdown external list and the
  tsconfig paths drop the runtime entries; peers, devDeps, and the client
  inject manifest drop `dsh-client-runtime`.
- **Envelope-less host calibration.** The session-event gate docs now cover
  `0.1.2-alpha.1`, which removed the `ignorable` envelope and fails closed
  on unknown event types at read: the probe reports no support there and
  every `draw/generated` commit degrades to the in-memory fallback ledger
  (already the fail-safe behavior).
- Tests derive the call-id brand from the `dsh-tools` execution contract
  (`tests/call-id.ts`) instead of importing `CallId` from `dsh-llm`, which
  host master renamed to `ToolCallId`.

## [0.2.1] - 2026-08-27

### Fixed

- Declare the web-client inject packages (`@deepseek-ai/dsh-client-connection`,
  `@deepseek-ai/dsh-client-locale`, `@deepseek-ai/dsh-client-runtime`,
  `@deepseek-ai/dsh-client-ui-settings`, `@deepseek-ai/dsh-client-ui-slots`,
  `@deepseek-ai/dsh-client-ui-tool`) as optional peerDependencies so the
  bundle composition is explicit and standalone installs stay clean.

## [0.2.0] - 2026-08-26

### Added

- Pluggable engine provider seam (Replicate / fal.ai).

## [0.1.3] - 2026-08-23

### Added

- Presenter pure-function suite (`tests/present.spec.ts`, 11 tests): `presentDrawResult` and `presentDrawPanel` are pinned directly on their arguments — settled/error/foreign/null-call-head blocks, meta fallbacks, regenerate-args parsing, engine-row projection, and the cooldown flag.

### Changed

- `presentDrawPanel` now takes an optional `now` clock (default `Date.now`) so the cooldown flag is a pure function of its inputs and testable without fake timers; the `image_generate` tool surface and the settings tab are unchanged.

### Fixed

- The five-language README "Development" section reported a stale `77 tests, 11 suites`; it now matches the actual `107 tests, 16 test files`.
- `src/version.ts` referenced a non-existent `tests/version.spec.ts`; the comment now names the real tripwire (`tests/session-events.spec.ts`).

## [0.1.2] - 2026-08-22

### Changed

- Upgraded every `@deepseek-ai/dsh-*` devDependency to `0.1.1-rc.2` and the `dshWorkshop.compatibility.dshVersions` declaration to `0.1.1-rc.2` (rc.2 compatibility release); peers stay `>=0.1.0-rc.8 <0.2.0` and `@deepseek-ai/cordis` stays `^4.0.1`.
- Re-verified the rc.2 credential read/write surface (`resolve`/`describe`/`set`/`unset`) and the attachment `saveImage`/`ImageAttachmentRef`/`ImageAttachmentLimits` face; both remain source-compatible, so no plugin code changes were required.
- The monthly compat workflow now installs and smokes against DeepSeek Harness `0.1.1-rc.2`.

## [0.1.1] - 2026-08-21

### Changed

- Upgraded every `@deepseek-ai/dsh-*` peer to `>=0.1.0-rc.8 <0.2.0` and every devDependency to `0.1.0-rc.8` (rc.8 compatibility release); `@deepseek-ai/cordis` stays at `^4.0.1`.
- `tests/harness.ts` pins the rc.8 `ImageAttachmentLimits` face (adds `maxImageDimension`).

### Fixed

- Sessions that used image generation no longer refuse to reopen on rc.6/rc.7 hosts (issue #2). `draw/generated` is declared only by this package, so it sits outside the host's static `KNOWN_SESSION_EVENT_TYPES` whitelist, and those hosts' `Session.append` cannot stamp the `ignorable` envelope — every generated image left the log unloadable after restart with `SessionFormatUnsupportedError`. The append now goes through an adaptive gate (`src/event-gate.ts`): the event is logged only when the host knows the type or a mount-time probe on a detached `SessionStore` proves envelope support. On gated hosts the accounting payload rides a new in-memory fallback ledger (WeakMap-keyed by session), so quota stays exact for the live session and the log stays reloadable; durable, log-folded accounting resumes on hosts with a plugin event surface.
- Regression coverage: `tests/event-gate.spec.ts` pins the gate decisions, the rc.6 probe reading, fallback-ledger quota accounting, and the append-failure degradation; the assembly regenerate test now asserts the rc.6-safe behavior (clean log, exact quota).

## [0.1.0] - 2026-08-16

- Initial release: unified image_generate tool with config-driven engine routing, health-aware fallback, durable attachments, per-session quota accounting, and credential-reference key storage.

### Added

- Unified `image_generate` tool: standard parameters (prompt/size/count/quality/style/engine) translated per engine; canonical value carries durable attachment references plus quota and routing facts; render embeds the images as attachment content blocks.
- Config-driven engine chain with two shipped presets (OpenAI Images `gpt-image-1`, Zhipu CogView `cogview-3-flash`) and any OpenAI-compatible endpoint; per-engine size maps, quality/style support, response format, and media type.
- Health-aware fallback router: chain order with engine-override promotion, consecutive-failure cooldown, disabled-engine skipping, and per-attempt audit views.
- Per-session quota accounting folded from the durable `draw/generated` session event (generation calls + image bytes), enforced before engine spend and before attachment storage.
- `draw` Typert Remote service (`draw/status`, `draw/probe`, `draw/setCredential`, `draw/unsetCredential`, `draw/regenerate`) with a hand-written host `./typert` manifest shared with the client Remote contribution.
- Browser half: keyed `tool.call.toolview` result card (engine/quota facts + regenerate action) and a Plugins settings tab (engine chain, credential references, probes, quota limits).
- API keys stay credential references (environment-variable names) resolved per call through the official `ctx.credentials` seam — values are never logged or snapshotted.

### Changed

- `HttpRequest.body` carries `Uint8Array<ArrayBuffer>`; the fetch transport spreads optional headers/body so `exactOptionalPropertyTypes` holds.
- `Session.append` uses the two-argument form (the pinned `0.1.0-rc.6` peers have no append-envelope option).

### Fixed

- `translateRequest` defaults `size`/`count` for engines reached with a normalized request missing them.
