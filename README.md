<div align="center">

# 🎨 dsh-draw
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-draw)

**Unified static-image generation routing for DeepSeek Harness.**

*One tool, many engines — health-aware fallback, durable results, counted usage.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-draw/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-draw/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-draw?label=version)](https://github.com/PerryLink/dsh-draw/releases)
[![npm version](https://img.shields.io/npm/v/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![npm downloads](https://img.shields.io/npm/dm/dsh-draw)](https://www.npmjs.com/package/dsh-draw)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` (compat declared for `0.1.1-rc.2`) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Engines | Any OpenAI-compatible images endpoint; presets for OpenAI Images (`gpt-image-1`) and Zhipu CogView (`cogview-3-flash`) |
| Surfaces | Host `image_generate` tool + web result card + Plugins settings tab |

## What you get

`dsh-draw` gives the harness one unified `image_generate` tool with standard parameters (`prompt`/`size`/`count`/`quality`/`style`/`engine`) that are translated per engine:

- **Multi-engine routing** — a config-driven chain (OpenAI Images, Zhipu CogView, or any OpenAI-compatible endpoint) walked top-down with **health-aware fallback**: consecutive failures push an engine into cooldown, and the next healthy engine serves the call.
- **Durable results** — generated images are saved as workspace attachments (content-addressed, under the harness's attachment policy) and returned as canonical file references.
- **Quota accounting** — per-session caps on generation calls and image bytes, folded from the durable session log and enforced before engine spend and before storage.
- **Credentials as references** — engine API keys are environment-variable names resolved per call through the official `ctx.credentials` seam; literal keys are never stored in configuration and never logged.
- **Web surfaces** — an in-conversation result card (images, engine, quota, one-click regenerate) and a Plugins settings tab (engine chain, credential status, probes, quota limits).

```text
model                           harness
  │ image_generate {prompt, ...} ──▶ validate ──▶ quota check ──▶ router
  │                                  openai ──(fail)──▶ cogview ──▶ images
  │ ◀── canonical JSON + image blocks (durable attachment refs)
  │                       └── draw/generated session event (quota + audit)
```

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-draw#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-draw

# 2. provide the engine keys as credential references (environment variables)
#    OPENAI_API_KEY and/or ZHIPU_API_KEY — never in the profile patch

# 3. restart and verify the row
dsh --profile web --dump-config | grep -A2 'id: dsh-draw'
```

Then ask the agent to draw:

```
> Draw a 1536x1024 landscape of a lighthouse at dusk, vivid style.
```

## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add "github:PerryLink/dsh-draw#main"` — the `prepare` script builds with production dependencies only.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-draw`.
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-draw-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-draw` (or remove the row from the profile patch).

> If pnpm reports `ERR_PNPM_IGNORED_BUILDS` for this package (esbuild's harmless platform-binary validation), add `allowBuilds: { esbuild: true }` to your `pnpm-workspace.yaml` — the `dsh` CLI prints the exact snippet.

## Configuration

All tunables are Schemastery `Config` fields (changeable from cordis.yml). An id-targeted override replaces the whole row — restate every key you need. `cordis.patch.yml` documents each key inline.

| Key | Default | Meaning |
|---|---|---|
| `engines` | OpenAI + CogView presets | Ordered engine chain, walked top-down with fallback; each entry: `id`, `baseUrl` (no credentials), `model`, `apiKeyRef` (env-var name), `enabled`, `sizeMap`, `qualitySupported`, `styleSupported`, `responseFormat` (`b64_json`/`url`), `imageMediaType` |
| `defaultEngine` | `openai` | Engine id the router prefers; must name a configured engine |
| `requestTimeoutMs` | `120000` | Per-generation HTTP timeout (1000..600000) |
| `maxImagesPerCall` | `4` | Cap on images one call may produce (1..10) |
| `maxPromptLength` | `4000` | Prompt length cap in characters (1..32000) |
| `maxGenerationsPerSession` | `200` | Per-session generation-call cap (1..100000) |
| `maxBytesPerSession` | `209715200` | Per-session image-byte cap (1048576..4294967296) |
| `failureThreshold` | `2` | Consecutive failures before an engine enters cooldown (1..10) |
| `cooldownMs` | `60000` | Engine cooldown after the threshold trips (1000..3600000) |

Example override in your profile patch:

```yaml
- insert:
    - id: dsh-draw
      name: dsh-draw
      config:
        defaultEngine: cogview
        maxImagesPerCall: 2
```

## Tools & surfaces

| Surface | Notes |
|---|---|
| `image_generate` | Standard parameters; returns canonical JSON (engine/model/size, image references, quota, fallback flag, attempts) plus image content blocks |
| Result card (`tool.call.toolview`, key `image_generate`) | Images, engine/quota line, one-click regenerate (full drawer path: quota + routing + audit) |
| Settings tab (Plugins → Image generation) | Engine chain, credential status, set/remove API keys (credential references), connectivity probes, quota limits |

## Permissions & data

- **Permissions**: the plugin makes outbound HTTPS calls to the configured engine endpoints only; every other surface is read-only. The settings tab's only writes are credential set/remove calls on the official `ctx.credentials` seam.
- **Data**: generated images are saved through the official attachment store under the harness's own attachment policy. Quota usage is folded from the `draw/generated` session events, plus the in-memory fallback ledger on hosts that cannot log those events — nothing else is stored.
- **Session log**: the `draw/generated` event records engine, model, standardized request, byte totals, and attachment ids — the audit facts, never the API keys. The event is appended only when the host knows the type or honors the `ignorable` envelope (probed at mount); on rc.6/rc.7 hosts the payload goes to the in-memory fallback ledger instead, so generating images can no longer make a session refuse to reopen.

## Security boundaries

- **Credential references, never literals.** `apiKeyRef` names an environment variable; a `baseUrl` embedding credentials fails the load loudly.
- **Sanitized display.** URLs, probe notes, and error text are redacted (userinfo passwords, credential query values, bearer tokens, JWTs) before any display or log.
- **Quota before spend.** Generation and byte caps are checked before engine calls and before attachment storage; exhausted sessions fail fast without spending engine credits.
- **Fail loud, fall back deliberately.** Malformed responses surface as structured errors; a failing engine is skipped after its cooldown threshold, and a fully exhausted chain returns the complete attempt record instead of pretending success.

## Known limitations

- **Image models only.** No video, audio, or edit endpoints; no vision understanding.
- **Engine compatibility.** Engines must speak the OpenAI `POST /images/generations` shape (base64 or URL delivery); provider-specific extras are out of scope.
- **Cost awareness is structural.** The plugin counts calls and bytes but does not know engine pricing — pair with `dsh-budget` for cost governance.
- **Quota durability on rc.6/rc.7.** On hosts whose session log cannot carry `draw/generated` (static event whitelist, no `ignorable` envelope), quota stays exact for the live session from the in-memory fallback ledger but resets on restart; durable accounting resumes on hosts with a plugin event surface.

## Development

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests against the local harness checkout
pnpm run typecheck:ci  # tsc against the published 0.1.1-rc.2 faces (no paths)
pnpm test           # vitest: 107 tests, 16 test files (scripted transport, real Context/Session/ToolRuntime)
pnpm run build      # tsc declarations + tsdown bundles (lib/)
pnpm run verify:self-contained  # dependency specs resolve from the registry
pnpm run verify:artifacts       # host ESM face + typert manifest + browser bundle + config files
pnpm pack           # the published tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creator and maintainer: engine router, drawer, quota accounting, Typert wire vocabulary, browser half, and the five-language docs.

## PerryLink DSH Plugin Family

This project is one of the [29 DeepSeek Harness plugins](https://github.com/PerryLink) maintained by [PerryLink](https://github.com/PerryLink). If this one helps you, the others likely will too:

| Plugin | One-liner |
|---|---|
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | Second-model auto-review on the approval chain, fail-closed by default |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Durable background child agents with a Web UI sidebar, messaging and interrupt |
| [dsh-budget](https://github.com/PerryLink/dsh-budget) | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH |
| [dsh-click](https://github.com/PerryLink/dsh-click) | Cross-platform native desktop control for DeepSeek Harness — Windows first. |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Terminal-style input history for the web composer: arrows, Ctrl+R search |
| [dsh-defend](https://github.com/PerryLink/dsh-defend) | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | Engineering-discipline guard: requirements grill, test gates, adversary review |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. |
| [dsh-fast](https://github.com/PerryLink/dsh-fast) | Read-only performance diagnostics for DeepSeek Harness. |
| [dsh-github](https://github.com/PerryLink/dsh-github) | GitHub PR/issues integration for DSH, every write gated by approval |
| [dsh-library](https://github.com/PerryLink/dsh-library) | Local document knowledge base for DeepSeek Harness. |
| [dsh-local-ai](https://github.com/PerryLink/dsh-local-ai) | Local-model (Ollama) integration for DeepSeek Harness. |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | LSP diagnostics, formatting, completion, code actions and rename over language servers |
| [dsh-mask](https://github.com/PerryLink/dsh-mask) | PII masking middleware for DeepSeek Harness — anonymize personal data before it reaches the model, restore it at the display layer. |
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |
| [dsh-observe](https://github.com/PerryLink/dsh-observe) | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-equivalent runtime style switching |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-style declarative allow/deny/ask permission rules with audit |
| [dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide) | Plugin-development knowledge base as an on-demand agent skill |
| [dsh-score](https://github.com/PerryLink/dsh-score) | Multi-dimensional quality scoring for DeepSeek Harness plugins. |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Pin sessions in the Web sidebar with durable ordering |
| [dsh-session-sync](https://github.com/PerryLink/dsh-session-sync) | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | Security-audit skill pack: secret scan, dependency and supply-chain review |
| [dsh-talk](https://github.com/PerryLink/dsh-talk) | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |
| [dsh-test-drive](https://github.com/PerryLink/dsh-test-drive) | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |
| [dsh-translate](https://github.com/PerryLink/dsh-translate) | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors
