<div align="center">

# 🎨 dsh-draw
- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-draw` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-draw)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-draw?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-draw?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-draw/badge)](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-draw)

**Unified static-image generation routing for DeepSeek Harness.**

*One tool, many engines — health-aware fallback, durable results, counted usage.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-draw.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-draw/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-draw/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-draw?label=version)](https://github.com/PerryLink/dsh-draw/releases)
[![npm version](https://img.shields.io/npm/v/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![npm downloads](https://img.shields.io/npm/dm/dsh-draw)](https://www.npmjs.com/package/dsh-draw)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-draw
```


</div>

---

**📖 Ecosystem knowledge base** — measured data, not marketing: [plugin development guide · plugin-selection data · maintenance criteria](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add github:PerryLink/dsh-draw` — the `prepare` script builds with production dependencies only.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-draw`.
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-draw-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-draw` (or remove the row from the profile patch).

> If pnpm reports `ERR_PNPM_IGNORED_BUILDS` for this package (esbuild's harmless platform-binary validation), add `allowBuilds: { esbuild: true }` to your `pnpm-workspace.yaml` — the `dsh` CLI prints the exact snippet.

## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（40+ 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.


## What is dsh-draw?

Unified static-image generation routing for DeepSeek Harness.

One tool, many engines — health-aware fallback, durable results, counted usage.

![Terminal demo of dsh-draw: dsh-draw — install, then ask the agent to draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-hero.png)

![Animated terminal demo of dsh-draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-demo.gif)

*The same run, animated.*

## Maintenance status: 🧊 FROZEN

> **Frozen on 2026-10-05. No new features.** This package still works, and it is not retired — but it no longer receives feature work. Only a genuine breakage will be fixed.

Maintainers treat this capability as one where **better-adopted alternatives now exist**, so effort has moved elsewhere. The comparison below was measured on 2026-10-05 and is recorded so nobody has to redo it.

| | package | weekly downloads |
|---|---|---|
| **this package** | `dsh-draw` | 973 |
| better-adopted alternative | [`dsh-image-gen`](https://github.com/shanliuling/dsh-image-gen) | **7,216** |
| another alternative | `@goodandready/dsh-image-gen` | 4,822 |

**Why the alternative leads.** `dsh-image-gen` provides Gemini, OpenAI, Seedream, DashScope and a local ComfyUI in one plugin.

**Compatibility.** declares no dsh peers, so the compatibility guard never blocks it.

👉 **For new work, prefer dsh-image-gen.** Existing installs keep working unchanged; nothing is being removed.

*Full evidence, including the host-version compatibility matrix: `dsh-plugin-supersession-review-20261005.md`.*

## Comparison

![Measured comparison chart for dsh-draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (compat declared for `0.1.5-rc.2`) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Engines | Any OpenAI-compatible images endpoint; presets for OpenAI Images (`gpt-image-1`) and Zhipu CogView (`cogview-3-flash`) |
| Surfaces | Host `image_generate` tool + web result card + Plugins settings tab |

The browser half rides the cordis `Context` and the published client packages (`dsh-client-ui-slots`, `dsh-client-ui-settings`, `dsh-client-ui-tool`, `dsh-client-locale`, `dsh-client-connection`); it no longer depends on the removed `dsh-client-runtime` package (the tool-call block is read through a local structural contract), so the client surface also lines up with `0.1.2-rc.1` hosts.
0.1.2-rc.1 (adapted 2026-09-02): the session envelope keeps its ignorable field for stored-log read compatibility only - Session.append still cannot stamp it, so audit-gate behavior is unchanged. Verified 2026-09-06 against the dsh-v0.1.7-alpha.1 master checkout (full gate chain + profile install smoke).
0.1.6-alpha.2 (adapted 2026-09-18): `Session.append`'s third parameter exists only for surface-eligible event types and is a `SurfaceIntent`, never an `ignorable` envelope, so `draw/generated` (a non-surface type) is still not written on this line — quota is counted in memory per session and resets when the session restarts, exactly as the "Quota durability" note below describes. Verified 2026-09-18 (dual typecheck rulers + the full suite + self-contained/artifacts/readme gates).
0.1.7-rc.2 (adapted 2026-10-04): the client `tool.call.toolview` contract split its owner into three stages (`preparing` / `start` / `result`), and a keyed card is now dispatched while the arguments are still streaming. The result card therefore also renders the in-flight row for those earlier stages — an occupied keyed slot never reaches the host's own generic row, so answering a prepared stage with nothing blanked the line for the whole streaming window. Nothing else changed: the settled card, the accounting line, and regenerate behave exactly as before. Verified 2026-09-23 (dual typecheck rulers + the full suite + the new host-contract gate).

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
dsh plugin --profile web add github:PerryLink/dsh-draw
```

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add github:PerryLink/dsh-draw

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

## Configuration

All tunables are Schemastery `Config` fields (changeable from cordis.yml). An id-targeted override replaces the whole row — restate every key you need. `cordis.patch.yml` documents each key inline.

| Key | Default | Meaning |
|---|---|---|
| `engines` | OpenAI + CogView presets | Ordered engine chain, walked top-down with fallback; each entry: `id`, `baseUrl` (no credentials), `model`, `apiKeyRef` (env-var name), `provider` (`openai`/`replicate`/`fal`, default `openai`), `enabled`, `sizeMap`, `qualitySupported`, `styleSupported`, `responseFormat` (`b64_json`/`url`), `imageMediaType` |
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
| Result card (`tool.call.toolview`, key `image_generate`) | In every stage of the call: an in-flight row while the arguments stream, then images, engine/quota line, and one-click regenerate once it settles (full drawer path: quota + routing + audit) |
| Settings tab (Plugins → Image generation) | Engine chain, credential status, set/remove API keys (credential references), connectivity probes, quota limits |

## Permissions & data

- **Permissions**: the plugin makes outbound HTTPS calls to the configured engine endpoints only; every other surface is read-only. The settings tab's only writes are credential set/remove calls on the official `ctx.credentials` seam.
- **Data**: generated images are saved through the official attachment store under the harness's own attachment policy. Quota usage is folded from the `draw/generated` session events, plus the in-memory fallback ledger on hosts that cannot log those events — nothing else is stored.
- **Session log**: the `draw/generated` event records engine, model, standardized request, byte totals, and attachment ids — the audit facts, never the API keys. The event is appended only when the host knows the type or honors the `ignorable` envelope (probed at mount); on rc.6/rc.7 hosts and the `0.1.2-rc.1` line (whose `Session.append` cannot stamp the marker and which fails closed on unknown types at read) the payload goes to the in-memory fallback ledger instead, so generating images can no longer make a session refuse to reopen.

## Security boundaries

- **Credential references, never literals.** `apiKeyRef` names an environment variable; a `baseUrl` embedding credentials fails the load loudly.
- **Sanitized display.** URLs, probe notes, and error text are redacted (userinfo passwords, credential query values, bearer tokens, JWTs) before any display or log.
- **Quota before spend.** Generation and byte caps are checked before engine calls and before attachment storage; exhausted sessions fail fast without spending engine credits.
- **Fail loud, fall back deliberately.** Malformed responses surface as structured errors; a failing engine is skipped after its cooldown threshold, and a fully exhausted chain returns the complete attempt record instead of pretending success.

## Known limitations

- **Image models only.** No video, audio, or edit endpoints; no vision understanding.
- **Engine compatibility.** Three vocabularies are supported through the provider seam: `openai` (the `POST /images/generations` shape), `replicate` (prediction create + poll), and `fal` (the `fal.run` queue). Provider-specific extras beyond `prompt`/size/count (e.g. seed, scheduler) are out of scope.
- **Cost awareness is structural.** The plugin counts calls and bytes but does not know engine pricing — pair with `dsh-budget` for cost governance.
- **Quota durability on rc.6/rc.7, 0.1.2-rc.1 and 0.1.6-alpha.2.** On hosts whose session log cannot carry `draw/generated` (static event whitelist, no `ignorable` envelope; `0.1.2-rc.1` cannot stamp the marker and fails closed on unknown event types at read; on `0.1.6-alpha.2` the append's third parameter is a `SurfaceIntent` for surface types only, so a non-surface event cannot be marked), quota stays exact for the live session from the in-memory fallback ledger but resets on restart; durable accounting resumes on hosts with a plugin event surface. The first refused commit warns once, so a degraded session is visible instead of silent.

## Development

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests against the local harness checkout
pnpm run typecheck:ci  # tsc against the published 0.1.7-rc.2 faces (no paths)
pnpm test           # vitest: 19 spec files (scripted transport, real Context/Session/ToolRuntime)
pnpm run build      # tsc declarations + tsdown bundles (lib/)
pnpm run verify:self-contained  # dependency specs resolve from the registry
pnpm run verify:host-contract   # the host tool-view contract still matches what this plugin declares
pnpm run verify:artifacts       # host ESM face + typert manifest + browser bundle + config files
pnpm pack           # the published tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creator and maintainer: engine router, drawer, quota accounting, Typert wire vocabulary, browser half, and the five-language docs.
- [@Mohei-Muun](https://github.com/Mohei-Muun) — reported the `draw/generated` session-log unload bug on rc.7 hosts ([#2](https://github.com/PerryLink/dsh-draw/issues/2)), which led to the adaptive event gate.

## PerryLink DSH Plugin Family

This project is one of the **87 actively maintained** DeepSeek Harness plugins from [PerryLink](https://github.com/PerryLink). The family roster is **95** plugins in total — **5 frozen**, **3 retired** — and stays collapsed below so every README keeps a short first screen. Expand it to see every row, with the reason in the Status column.

<details>
<summary>Expand all 95 plugins</summary>

| Plugin | One-liner | Status |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRED — see the repo README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 FROZEN — see the repo README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 FROZEN — see the repo README |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 FROZEN — see the repo README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 FROZEN — see the repo README |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 FROZEN — see the repo README |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRED — see the repo README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRED — see the repo README |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

### Install from the DSH Desktop Market

All PerryLink plugins are browsable in the built-in DSH Desktop Market: **Market → Sources → add source → paste** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ select it**. Installation still goes through the Market's npm-identity verification and your confirmation.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors
