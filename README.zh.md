<div align="center">

# 🎨 dsh-draw
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-draw`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）。

**DeepSeek Harness 的统一静态图像生成路由。**

*一个工具、多个引擎 —— 健康感知回退、结果持久、用量记账。*

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

## 兼容性

| 方面 | 状态 |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2`（声明兼容 `0.1.1-rc.2`） |
| Node | `^22.19.0 \|\| >=24.0.0` |
| 引擎 | 任意 OpenAI 兼容图像端点；内置 OpenAI Images（`gpt-image-1`）与智谱 CogView（`cogview-3-flash`）预设 |
| 界面 | Host `image_generate` 工具 + Web 结果卡片 + Plugins 设置页签 |

浏览器半边基于 cordis `Context` 与已发布的客户端包（`dsh-client-ui-slots`、`dsh-client-ui-settings`、`dsh-client-ui-tool`、`dsh-client-locale`、`dsh-client-connection`）；它不再依赖已移除的 `dsh-client-runtime` 包（工具调用块经本地结构契约读取），因此客户端接口面同样对齐 `0.1.2-alpha.5` 宿主。
0.1.2-alpha.5（2026-09-02 已适配）：会话信封保留 ignorable 字段但仅用于存量日志读取兼容——Session.append 仍无法盖章，门控行为不变。

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
# 1. 把 bundle 装进你的 profile
dsh plugin --profile web add "github:PerryLink/dsh-draw#main"

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

- **git 通道**（最新 `main`）：`dsh plugin --profile web add "github:PerryLink/dsh-draw#main"` —— `prepare` 脚本仅用生产依赖构建。
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
| 结果卡片（`tool.call.toolview`，key `image_generate`） | 图片、引擎/配额行、一键重新生成（完整 drawer 路径：配额 + 路由 + 审计） |
| 设置页签（Plugins → 图像生成） | 引擎链、凭据状态、设置/移除 API 密钥（凭据引用）、连通性探测、配额上限 |

## 权限与数据

- **权限**：插件仅对配置的引擎端点发起 HTTPS 出站请求；其余界面全部只读。设置页签唯一的写入是对官方 `ctx.credentials` 接缝的凭据设置/移除。
- **数据**：生成的图片经官方附件存储落盘，受 harness 附件策略约束。配额用量从 `draw/generated` 会话事件折叠；在无法安全落盘该事件的宿主上另加内存兜底账簿 —— 除此之外不存储任何东西。
- **会话日志**：`draw/generated` 事件记录引擎、模型、标准化请求、字节总量与附件 id —— 审计事实，绝不包含 API 密钥。仅当宿主收录该类型或支持 `ignorable` 信封时才落盘（挂载期探测）；在 rc.6/rc.7 宿主与移除信封的 `0.1.2-alpha.5` 宿主（读取时对未知类型失败关闭）上，载荷改记内存兜底账簿，生成图片不再导致会话重启后无法打开。

## 安全边界

- **凭据即引用，绝不写明文。** `apiKeyRef` 命名环境变量；`baseUrl` 内嵌凭据会在加载期大声失败。
- **展示脱敏。** URL、探测备注与错误文本在展示或写日志前脱敏（userinfo 密码、凭据查询值、bearer token、JWT）。
- **配额先于开销。** 调用与字节上限在引擎调用前与附件落盘前检查；超限会话快速失败、不烧引擎额度。
- **大声失败、刻意回退。** 畸形响应给出结构化错误；引擎达到冷却阈值后被跳过；整条链耗尽时返回完整尝试记录而非假装成功。

## 已知限制

- **仅图像模型。** 无视频、音频或编辑端点；无视觉理解。
- **引擎兼容性。** 引擎需支持 OpenAI `POST /images/generations` 形状（base64 或 URL 交付）；厂商专属扩展不在范围内。
- **成本感知是结构性的。** 插件统计调用次数与字节，但不了解引擎定价 —— 与 `dsh-budget` 配合做成本治理。
- **rc.6/rc.7 与 0.1.2-alpha.5 上的配额持久性。** 会话日志无法安全携带 `draw/generated` 的宿主（静态事件白名单、无 `ignorable` 信封；`0.1.2-alpha.5` 已移除信封并在读取时对未知事件类型失败关闭）上，配额经内存兜底账簿在活会话内保持精确，但重启后重置；宿主具备插件事件面后恢复持久记账。

## 开发

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc：src + tests，对照本地 harness checkout
pnpm run typecheck:ci  # tsc：对照已发布的 0.1.1-rc.2 类型（无 paths）
pnpm test           # vitest：107 个测试、16 个测试文件（scripted 传输、真实 Context/Session/ToolRuntime）
pnpm run build      # tsc 声明 + tsdown 打包（lib/）
pnpm run verify:self-contained  # 依赖声明全部来自 registry
pnpm run verify:artifacts       # host ESM 面 + typert manifest + 浏览器包 + 配置文件
pnpm pack           # 发布用 tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) —— 创建者与维护者：引擎路由、drawer、配额记账、Typert wire 词汇、浏览器半与五语文档。
- [@Mohei-Muun](https://github.com/Mohei-Muun) —— 报告了 rc.7 主机上 `draw/generated` 会话日志导致会话无法重载的缺陷（[#2](https://github.com/PerryLink/dsh-draw/issues/2)），推动了自适应事件门控的实现。

## PerryLink DSH Plugin Family

这是 [PerryLink](https://github.com/PerryLink) 维护的 [33 个 DeepSeek Harness 插件](https://github.com/PerryLink) 之一。如果它能帮到你，其他的也会：

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | 审批链上的第二模型自动审查，默认失败关闭 | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | 带 Web UI 侧栏、消息与中断的持久后台子代理 | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | DeepSeek Harness 的成本治理：预算、碳排与延迟一屏呈现。 | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Claude Code /rewind 等价：快照、会话 fork、一次性恢复 | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | 把 Claude Code 会话、记忆、技能与 CLAUDE.md 迁入 DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | 跨平台原生桌面控制（DeepSeek Harness），Windows 优先。 | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Web 输入框的终端式历史：方向键、Ctrl+R 搜索 | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | 数据集质量检查与引文核查（本插件可选消费的数字核查桥） | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | DeepSeek Harness 的提示注入、越狱与密钥泄露防护。 | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | 工程纪律守卫：需求质询、测试门禁、对手评审 | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | DeepSeek Harness 只读性能诊断。 | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | 面向中国公募基金的确定性研究报告 | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | 面向 DSH 的 GitHub PR/issues 集成，每次写入经审批门控 | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | 行业研究编排，经本插件的 `ctx.researchReport.assemble` 封存交付物 | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | DeepSeek Harness 的本地文档知识库。 | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | DeepSeek Harness 的本地模型（Ollama）接入。 | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | 通过语言服务器的 LSP 诊断、格式化、补全、代码操作与重命名 | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | PII 脱敏中间件：模型边界匿名化、展示层还原 | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | 只读 MCP 运行时面板：/mcp 命令 + 带状态、工具与错误的 Settings 标签页 | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | 审批门控的跨会话记忆：ctx.memory 接缝 + SQLite + 记忆工具 | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | DeepSeek Harness 的 OpenTelemetry 与 Langfuse 可观测导出器。 | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Claude Code outputStyles 等价的运行时风格切换 | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Claude Code 风格声明式 allow/deny/ask 权限规则，带审计 | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | 作为按需代理技能的插件开发知识库 | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | 可验证研究报告引擎：内容寻址证据账本与封存版本 | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | DeepSeek Harness 插件的多维质量评分。 | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | 在 Web 侧栏置顶会话，带持久排序 | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | DeepSeek Harness 的跨设备会话同步——会话存储的专用 git 镜像。 | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | 安全审计技能包：密钥扫描、依赖与供应链审查 | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | DeepSeek Harness 的语音优先会话闭环：对它说，听它答。 | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | DeepSeek Harness 插件的隔离试装冒烟。 | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | DeepSeek Harness 的厂商参数翻译与确定性 JSON 修复。 | |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors
