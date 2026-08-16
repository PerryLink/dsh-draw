# AGENTS.md

Standalone DeepSeek Harness plugin repository (`dsh-draw`). Development follows the dsh-plugin-guide skill and the official plugin contract; this file records repo-local decisions.

## Layout

- `src/index.ts` — function-plugin contract (`name`/`inject`/`Config`/`apply`; NO default export — the Loader unwraps `exports.default ?? exports`). Injects `tools`; the transport comes from the optional `dsh-draw/transport` service (test/embedding seam) or the fetch default.
- `src/config.ts` — Schemastery schema + explicit `resolveConfig` (no hidden `?? default` in `run()` paths); cross-field facts the schema cannot see (duplicate engine ids, credential-bearing baseUrls, unknown default engine, bounds) fail the load loudly. Two shipped engine presets (OpenAI Images, Zhipu CogView); user engines default to the OpenAI vocabulary.
- `src/translate.ts` — standard parameter vocabulary (`prompt`/size/count/quality/style/engine) normalized and translated per engine (size maps, quality/style gating, response format).
- `src/router.ts` — `EngineRouter`: ordered chain with engine-override promotion, consecutive-failure cooldown, disabled-engine skipping, per-attempt audit views, and read-only probes. Plain class — plugin-owned state, not a published capability.
- `src/engine.ts` — the OpenAI-compatible images adapter (`POST {baseUrl}/images/generations`, b64_json or URL delivery, structured failure phases `credential`/`request`/`parse`).
- `src/http.ts` — the injectable transport seam: `HttpRequest`/`HttpResponse`/`HttpError`, signal fusion (caller abort + per-call timeout), the fetch default, and `decodeBase64`.
- `src/drawer.ts` — the shared generation path behind the tool body and the card regenerate: normalization, prompt validation, quota checks (generations before engine spend, bytes before attachment storage), routing, durable attachment saves, and the `draw/generated` audit event.
- `src/quota.ts` — per-session quota folded from the durable session log (the log is the single source of truth; usage survives restart and fork).
- `src/session-events.ts` — `draw/generated` `SessionEventMap` member (declaration merging into `@deepseek-ai/dsh-session/types`; the parent-module augmentation does NOT reach the interface) + append/fold helpers. Append is two-argument on purpose: the pinned `0.1.0-rc.6` peers have no append-envelope option.
- `src/sanitize.ts` — display redaction: URL userinfo passwords, credential query/fragment values, header lines, bearer tokens, JWTs, environment-shaped credentials. Pure; extreme-case tests.
- `src/service.ts` — `DrawService` (`TypertRemoteService`, namespace `draw`): status snapshot, probe, credential set/unset through the official `ctx.credentials` seam, and regenerate (full drawer path). **No `@Remote` method decorators**: the rc.6 typert loader binds the `./typert` manifest invocations to same-named public methods (the dsh-mcp-panel precedent), and decorator syntax breaks the vitest transform pipeline.
- `src/wire.ts` — the wire vocabulary, its zod v4 schemas, and the single invocation-descriptor list shared verbatim by the host `./typert` manifest (`src/typert.host.ts`) and the client Remote contribution (`src/client/remote.ts`).
- `src/client/` — browser half: `$mount` the Remote contribution, register the keyed `tool.call.toolview` result card (key `image_generate`) and the `settings.plugins.tab` entry id `draw`, pure presenters in `present.ts`, inline scoped stylesheet in `styles.ts`, en/zh dictionaries. The `tool.call.toolview` SlotMap member is declared locally because the harness ui-tool package index does not re-export its contract declaration (identical shapes merge when both land).
- `tests/` — vitest; REAL `Context` + `SessionStore`/`Session`/`ToolRuntime` from the `0.1.0-rc.6` peers, scripted transport (injected through the `dsh-draw/transport` seam), a real `AttachmentStore` subclass keeping images in memory, and a fake credential provider.

## Hard rules applied here

- **Credential references only.** Config carries environment-variable names; values resolve per call through `ctx.credentials.resolve` and never enter a log, snapshot, event, or tool result. A baseUrl embedding credentials fails the load.
- **Quota is durable and log-folded.** Both axes fold the `draw/generated` events; the generation axis is checked before engine spend and the byte axis before attachment storage.
- **Fail loud, fall back deliberately.** Malformed engine responses throw structured `EngineCallError`s; the router walks the chain (credential/auth/parse failures continue, network failures respect cancellation) and a fully exhausted chain returns the complete attempt record.
- **Model-visible ⟺ logged.** The tool's canonical value is the model-visible content; the `draw/generated` audit event carries the accounting facts, and the `presentationMeta` projection exposes the value to the frozen client block.
- **Regenerate = full drawer path.** The card's regenerate goes through quota, routing, durable storage, and the audit event — never a shortcut that would bypass accounting.
- **Read-only panel.** The settings tab reads `draw/status`; the only writes are the credential set/unset calls on the official seam.
- **Sanitized display.** Everything shown to a human passes through `src/sanitize.ts`; secret values never reach a display.

## Build & checks

`typescript` + `tsdown` are regular `dependencies` (git-channel `prepare` builds with production dependencies alone); `zod` is the only bundled dependency (the wire codecs ride the host and client bundles). `scripts/prepare.mjs` wipes `lib/`, emits `lib/types` (tsc), then bundles `lib/index.js` + `lib/typert.host.js` + `lib/client.js` (tsdown; the browser bundle carries the shell's `window.__ModuleLoader__.load` handshake).

`pnpm run typecheck && pnpm run typecheck:ci && pnpm test && pnpm run build && pnpm run verify:self-contained && pnpm run verify:artifacts && pnpm pack`. The plain `typecheck` resolves the local harness checkout's fresh type faces through tsconfig `paths`; `typecheck:ci` resolves the npm-published `0.1.0-rc.6` faces (no paths) and is what CI runs — keep both green.

## Docs

- Five-language READMEs (`README.md`, `README.zh.md`, `README.es.md`, `README.pt.md`, `README.hi.md`) — keep all five in sync; the English file is the source of truth.
- GitHub topics `dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image` (mirror `package.json` keywords; the ecosystem's visibility channel is the `dsh-plugin` topic).
- License is Apache-2.0 (`LICENSE` + the package.json `license` field); `THIRD_PARTY_NOTICES.md` documents the bundled and build-time dependencies.
