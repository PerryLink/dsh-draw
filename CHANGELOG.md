# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
