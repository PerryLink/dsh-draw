# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
