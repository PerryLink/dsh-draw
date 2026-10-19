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

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 DeepSeek Harness 插件家族成员。完整名单默认折叠，避免每个 README 的首屏被长表淹没；点击展开可查看每一行及其状态。

<details>
<summary>展开全部插件</summary>

| 插件 | 状态 |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 已退役 — 见仓库 README |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 已退役 — 见仓库 README |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 已退役 — 见仓库 README |

</details>

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors

### 从 DSH Desktop 市场安装

所有 PerryLink 插件均可在 DSH Desktop 内置市场中浏览：**市场 → 来源 → 添加来源 → 粘贴** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ 选中**。安装仍需通过市场的 npm 身份校验与你的确认。
