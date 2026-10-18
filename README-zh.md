<div align="center">

# 🎨 dsh-draw

> 🧊 **2026-10-05 起冻结** —— 只修真实故障；优先使用下方记录的、采用率更高的替代品。
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-draw`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）。

**DeepSeek Harness 的统一静态图像生成路由。**

*一个工具、多个引擎 —— 健康感知回退、结果持久、用量记账。*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-draw)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-draw.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-zh.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-draw/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-draw/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-draw?label=version)](https://github.com/PerryLink/dsh-draw/releases)
[![npm version](https://img.shields.io/npm/v/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![npm downloads](https://img.shields.io/npm/dm/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-draw?metric=downloads&lang=zh)](https://dshfind.com/zh/plugins/PerryLink/dsh-draw?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-draw
```


</div>

---


**📖 生态实测知识库**（实测数据，不是营销）：[插件开发指南 · 选型实测数据 · 维护取舍判据](https://perrylink.github.io/dsh-plugin-guide/)。

<!-- star-cta -->

## What is dsh-draw?

DeepSeek Harness 的统一静态图像生成路由。

一个工具、多个引擎 —— 健康感知回退、结果持久、用量记账。

![dsh-draw 终端演示：dsh-draw — install, then ask the agent to draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-hero.png)

![Animated terminal demo of dsh-draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-demo.gif)

*同一次运行，动图版。*

## 维护状态：🧊 已冻结

> **2026-10-05 起冻结，不再新增功能。** 本包仍可正常使用，**没有退役**——但不再投入功能开发，只有真实故障才会修复。

维护者判定该能力面**已出现采用度更高、更值得推荐的替代方案**，因此把精力移到了别处。

| | 包 | 周下载量 |
|---|---|---|
| **本包** | `dsh-draw` | 973 |
| 更值得推荐的替代品 | [`dsh-image-gen`](https://github.com/shanliuling/dsh-image-gen) | **7,216** |
| 另一个替代品 | `@goodandready/dsh-image-gen` | 4,822 |

**为什么替代品更强。** `dsh-image-gen` 在一个插件里同时支持 Gemini、OpenAI、Seedream、DashScope，以及本地 ComfyUI。

👉 **新工作请优先使用 dsh-image-gen。** 已安装的照常可用，没有任何东西被移除。

*完整证据（含宿主版本兼容矩阵）见 `dsh-plugin-supersession-review-20261005.md`；英文版见 [README.md](README.md) 的 **Maintenance status: 🧊 FROZEN** 一节。*

## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（95 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## Comparison

![dsh-draw 的实测对比柱状图](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## 兼容性

| 方面 | 状态 |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1`（声明兼容 `0.1.5-rc.2`） |
| Node | `^22.19.0 \|\| >=24.0.0` |
| 引擎 | 任意 OpenAI 兼容图像端点；内置 OpenAI Images（`gpt-image-1`）与智谱 CogView（`cogview-3-flash`）预设 |
| 界面 | Host `image_generate` 工具 + Web 结果卡片 + Plugins 设置页签 |

浏览器半边基于 cordis `Context` 与已发布的客户端包（`dsh-client-ui-slots`、`dsh-client-ui-settings`、`dsh-client-ui-tool`、`dsh-client-locale`、`dsh-client-connection`）；它不再依赖已移除的 `dsh-client-runtime` 包（工具调用块经本地结构契约读取），因此客户端接口面同样对齐 `0.1.2-rc.1` 宿主。
0.1.2-rc.1（2026-09-02 已适配）：会话信封保留 ignorable 字段但仅用于存量日志读取兼容——Session.append 仍无法盖章，门控行为不变。已于 2026-09-06 对照 dsh-v0.1.7-alpha.1 master 检出核验（完整门禁链 + profile 安装冒烟）。
0.1.6-alpha.2（2026-09-18 已适配）：`Session.append` 的第三参仅对表面事件类型存在且为 `SurfaceIntent`，绝非 `ignorable` 信封，因此非表面的 `draw/generated` 在该线上仍不落盘——配额按会话内存计数、会话重启归零（与下方「配额持久性」一致）。已于 2026-09-18 核验（双 typecheck 尺子 + 全量测试 + self-contained/artifacts/readme 门）。
0.1.7-rc.2（2026-09-23 已适配）：客户端 `tool.call.toolview` 契约把 owner 拆成三个阶段（`preparing` / `start` / `result`），且参数仍在流式到达时就会派发带 key 的卡片。因此结果卡片现在也为这些更早的阶段渲染「进行中」行——已占用的 keyed 槽位永远不会落到宿主自带的通用行，所以对准备阶段不作回应会让整行在整个流式窗口内空白。其余行为不变：结算后的卡片、账目行与重新生成与之前完全一致。已于 2026-09-23 核验（双 typecheck 尺子 + 全量测试 + 新增 host-contract 门）。

## 你能得到什么

`dsh-draw` 给 harness 一个统一的 `image_generate` 工具，标准参数（`prompt`/`size`/`count`/`quality`/`style`/`engine`）按引擎翻译：

- **多引擎路由** —— 配置驱动的引擎链（OpenAI Images、智谱 CogView 或任意 OpenAI 兼容端点）自上而下执行，**健康感知回退**：连续失败让引擎进入冷却，由下一个健康引擎接单。
- **结果持久化** —— 生成的图片存为工作区附件（内容寻址、受 harness 附件策略约束），返回规范文件引用。
- **配额记账** —— 按会话的调用次数与图片字节上限，从持久会话日志折叠计算，引擎开销前与落盘前双重强制。
- **凭据即引用** —— 引擎 API 密钥是环境变量名，每次调用经官方 `ctx.credentials` 接缝解析；配置里绝不写明文、日志里绝不出现。
- **Web 界面** —— 会话内结果卡片（图片、引擎、配额、一键重新生成）与 Plugins 设置页签（引擎链、凭据状态、探测、配额上限）。

```text
模型                           harness
  │ image_generate {prompt, ...} ──▶ 校验 ──▶ 配额检查 ──▶ 路由
  │                                  openai ──(失败)──▶ cogview ──▶ 图片
  │ ◀── 规范 JSON + 图片块（持久附件引用）
  │                       └── draw/generated 会话事件（配额 + 审计）
```

## 快速开始

```sh
dsh plugin --profile web add github:PerryLink/dsh-draw
```

```sh
# 1. 把 bundle 装进你的 profile
dsh plugin --profile web add github:PerryLink/dsh-draw

# 或从 npm 安装（正式发布版）
dsh plugin --profile web add dsh-draw

# 2. 以凭据引用（环境变量）提供引擎密钥
#    OPENAI_API_KEY 和/或 ZHIPU_API_KEY —— 绝不写进 profile patch

# 3. 重启并核实行
dsh --profile web --dump-config | grep -A2 'id: dsh-draw'
```

然后让 agent 画图：

```
> 画一张 1536x1024 的黄昏灯塔风景，vivid 风格。
```

## 安装与卸载

- **git 通道**（最新 `main`）：`dsh plugin --profile web add github:PerryLink/dsh-draw` —— `prepare` 脚本仅用生产依赖构建。
- **npm 通道**（正式发布版）：`dsh plugin --profile web add dsh-draw`。
- **tarball 通道**：在本仓库执行 `pnpm pack`，然后 `dsh plugin --profile web add ./dsh-draw-<version>.tgz`。
- **卸载**：`dsh plugin --profile web remove dsh-draw`（或从 profile patch 中删除该行）。

> 如果 pnpm 对本包报 `ERR_PNPM_IGNORED_BUILDS`（esbuild 的平台二进制无害校验），在你的 `pnpm-workspace.yaml` 中加入 `allowBuilds: { esbuild: true }` —— `dsh` CLI 会打印确切片段。

## 配置

所有可调项都是 Schemastery `Config` 字段（可在 cordis.yml 中修改）。按 id 定向覆盖会替换整行 —— 需要重新声明每个键。`cordis.patch.yml` 内联说明了每个键。

| 键 | 默认值 | 含义 |
|---|---|---|
| `engines` | OpenAI + CogView 预设 | 有序引擎链，自上而下带回退；每项：`id`、`baseUrl`（不含凭据）、`model`、`apiKeyRef`（环境变量名）、`enabled`、`sizeMap`、`qualitySupported`、`styleSupported`、`responseFormat`（`b64_json`/`url`）、`imageMediaType` |
| `defaultEngine` | `openai` | 路由首选引擎 id；必须是已配置引擎 |
| `requestTimeoutMs` | `120000` | 每次生成 HTTP 超时（1000..600000） |
| `maxImagesPerCall` | `4` | 单次调用可生成图片上限（1..10） |
| `maxPromptLength` | `4000` | 提示词字符上限（1..32000） |
| `maxGenerationsPerSession` | `200` | 每会话生成调用上限（1..100000） |
| `maxBytesPerSession` | `209715200` | 每会话图片字节上限（1048576..4294967296） |
| `failureThreshold` | `2` | 引擎进入冷却前的连续失败次数（1..10） |
| `cooldownMs` | `60000` | 触发阈值后的冷却时长（1000..3600000） |

profile patch 中的覆盖示例：

```yaml
- insert:
    - id: dsh-draw
      name: dsh-draw
      config:
        defaultEngine: cogview
        maxImagesPerCall: 2
```

## 工具与界面

| 界面 | 说明 |
|---|---|
| `image_generate` | 标准参数；返回规范 JSON（引擎/模型/尺寸、图片引用、配额、回退标志、尝试记录）加图片内容块 |
| 结果卡片（`tool.call.toolview`，key `image_generate`） | 覆盖调用的每个阶段：参数流式到达时先显示进行中行，结算后显示图片、引擎/配额行与一键重新生成（完整 drawer 路径：配额 + 路由 + 审计） |
| 设置页签（Plugins → 图像生成） | 引擎链、凭据状态、设置/移除 API 密钥（凭据引用）、连通性探测、配额上限 |

## 权限与数据

- **权限**：插件仅对配置的引擎端点发起 HTTPS 出站请求；其余界面全部只读。设置页签唯一的写入是对官方 `ctx.credentials` 接缝的凭据设置/移除。
- **数据**：生成的图片经官方附件存储落盘，受 harness 附件策略约束。配额用量从 `draw/generated` 会话事件折叠；在无法安全落盘该事件的宿主上另加内存兜底账簿 —— 除此之外不存储任何东西。
- **会话日志**：`draw/generated` 事件记录引擎、模型、标准化请求、字节总量与附件 id —— 审计事实，绝不包含 API 密钥。仅当宿主收录该类型或支持 `ignorable` 信封时才落盘（挂载期探测）；在 rc.6/rc.7 宿主与 `0.1.2-rc.1` 线（append 无法盖章、读取时对未知类型失败关闭）上，载荷改记内存兜底账簿，生成图片不再导致会话重启后无法打开。

## 安全边界

- **凭据即引用，绝不写明文。** `apiKeyRef` 命名环境变量；`baseUrl` 内嵌凭据会在加载期大声失败。
- **展示脱敏。** URL、探测备注与错误文本在展示或写日志前脱敏（userinfo 密码、凭据查询值、bearer token、JWT）。
- **配额先于开销。** 调用与字节上限在引擎调用前与附件落盘前检查；超限会话快速失败、不烧引擎额度。
- **大声失败、刻意回退。** 畸形响应给出结构化错误；引擎达到冷却阈值后被跳过；整条链耗尽时返回完整尝试记录而非假装成功。

## 已知限制

- **仅图像模型。** 无视频、音频或编辑端点；无视觉理解。
- **引擎兼容性。** 引擎需支持 OpenAI `POST /images/generations` 形状（base64 或 URL 交付）；厂商专属扩展不在范围内。
- **成本感知是结构性的。** 插件统计调用次数与字节，但不了解引擎定价 —— 与 `dsh-budget` 配合做成本治理。
- **rc.6/rc.7、0.1.2-rc.1 与 0.1.6-alpha.2 上的配额持久性。** 会话日志无法安全携带 `draw/generated` 的宿主（静态事件白名单、无 `ignorable` 信封；`0.1.2-rc.1` 无法盖章并在读取时对未知事件类型失败关闭；`0.1.6-alpha.2` 上 append 第三参仅对表面类型存在，非表面事件无法盖章）上，配额经内存兜底账簿在活会话内保持精确，但重启后重置；宿主具备插件事件面后恢复持久记账。首次被拒的提交会告警一次，降级不再静默。

## 开发

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc：src + tests，对照本地 harness checkout
pnpm run typecheck:ci  # tsc：对照已发布的 0.1.7-rc.2 类型（无 paths）
pnpm test           # vitest：19 个 spec 文件（scripted 传输、真实 Context/Session/ToolRuntime）
pnpm run build      # tsc 声明 + tsdown 打包（lib/）
pnpm run verify:self-contained  # 依赖声明全部来自 registry
pnpm run verify:host-contract   # 宿主 tool-view 契约仍与本插件声明一致
pnpm run verify:artifacts       # host ESM 面 + typert manifest + 浏览器包 + 配置文件
pnpm pack           # 发布用 tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) —— 创建者与维护者：引擎路由、drawer、配额记账、Typert wire 词汇、浏览器半与五语文档。
- [@Mohei-Muun](https://github.com/Mohei-Muun) —— 报告了 rc.7 主机上 `draw/generated` 会话日志导致会话无法重载的缺陷（[#2](https://github.com/PerryLink/dsh-draw/issues/2)），推动了自适应事件门控的实现。

## PerryLink DSH Plugin Family

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 DeepSeek Harness 插件家族成员：**87 个活跃维护**，名册共 **95** 个，其中 **5 个已冻结**、**3 个已退役**。完整名单默认折叠，避免每个 README 的首屏被长表淹没；点击展开可查看每一行，原因见「状态」列。

<details>
<summary>展开全部 95 个插件</summary>

| 插件 | 一句话 | 状态 |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 已退役 — 见仓库 README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 已冻结 — 见仓库 README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 已冻结 — 见仓库 README |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 已冻结 — 见仓库 README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 已冻结 — 见仓库 README |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 已冻结 — 见仓库 README |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 已退役 — 见仓库 README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 已退役 — 见仓库 README |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors

### 从 DSH Desktop 市场安装

所有 PerryLink 插件均可在 DSH Desktop 内置市场中浏览：**市场 → 来源 → 添加来源 → 粘贴** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ 选中**。安装仍需通过市场的 npm 身份校验与你的确认。
