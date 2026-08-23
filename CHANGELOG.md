# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
