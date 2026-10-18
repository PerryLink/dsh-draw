<div align="center">

# 🎨 dsh-draw

> 🧊 **CONGELADO desde 2026-10-05** — apenas falhas reais são corrigidas. Prefira a alternativa com mais adoção indicada abaixo.
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-draw` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com)).

**Roteamento unificado de geração de imagens estáticas para o DeepSeek Harness.**

*Uma ferramenta, muitos motores — fallback ciente da saúde, resultados duráveis, uso contabilizado.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-draw)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-draw.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-draw/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-draw/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-draw?label=version)](https://github.com/PerryLink/dsh-draw/releases)
[![npm version](https://img.shields.io/npm/v/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![npm downloads](https://img.shields.io/npm/dm/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-draw?metric=downloads&lang=pt)](https://dshfind.com/pt/plugins/PerryLink/dsh-draw?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-draw
```


</div>

---


**📖 Base de conhecimento do ecossistema** — dados medidos, não marketing: [guia de desenvolvimento · dados de seleção · critérios de manutenção](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->

## Instalação e desinstalação

- **Canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-draw` — o script `prepare` compila apenas com dependências de produção.
- **Canal npm** (versões publicadas): `dsh plugin --profile web add dsh-draw`.
- **Canal tarball**: `pnpm pack` neste repositório e então `dsh plugin --profile web add ./dsh-draw-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-draw` (ou remova a linha do patch do perfil).

> Se o pnpm reportar `ERR_PNPM_IGNORED_BUILDS` para este pacote (a validação inofensiva do binário de plataforma do esbuild), adicione `allowBuilds: { esbuild: true }` ao seu `pnpm-workspace.yaml` — o CLI `dsh` imprime o trecho exato.

## What is dsh-draw?

Roteamento unificado de geração de imagens estáticas para o DeepSeek Harness.

Uma ferramenta, muitos motores — fallback ciente da saúde, resultados duráveis, uso contabilizado.

![Demonstração de terminal do dsh-draw: dsh-draw — install, then ask the agent to draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-hero.png)

![Animated terminal demo of dsh-draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-demo.gif)

*A mesma execução, animada.*

## Status de manutenção: 🧊 CONGELADO

> **Congelado em 2026-10-05. Sem novos recursos.** Este pacote continua funcionando e **não foi aposentado**, mas não recebe mais trabalho de recursos; apenas uma falha real será corrigida.

Os mantenedores consideram que nesta capacidade **já existem alternativas com melhor adoção**, então o esforço foi redirecionado. Comparação medida em 2026-10-05:

| | pacote | downloads semanais |
|---|---|---|
| **este pacote** | `dsh-draw` | 973 |
| alternativa mais adotada | [`dsh-image-gen`](https://github.com/shanliuling/dsh-image-gen) | **7,216** |
| outra alternativa | `@goodandready/dsh-image-gen` | 4,822 |

👉 **Para trabalho novo, prefira dsh-image-gen.** As instalações existentes continuam funcionando sem alterações.

*Evidência completa: `dsh-plugin-supersession-review-20261005.md`. Texto completo na seção **Maintenance status: 🧊 FROZEN** de [README.md](README.md).*

## ⭐ 如果它帮到了你

Este plugin faz parte da [família de plugins DSH](https://github.com/PerryLink) (mais de 40, todos Apache-2.0). Se for útil, **deixe uma estrela**: não desbloqueia nada, mas ajuda a próxima pessoa a encontrá-lo.

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## Comparison

![Gráfico comparativo medido do dsh-draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## Compatibilidade

| Superfície | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (compatibilidade declarada para `0.1.5-rc.2`) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Motores | Qualquer endpoint de imagens compatível com OpenAI; presets para OpenAI Images (`gpt-image-1`) e Zhipu CogView (`cogview-3-flash`) |
| Superfícies | Ferramenta host `image_generate` + cartão de resultado web + aba de ajustes de Plugins |

A metade de navegador usa o `Context` do cordis e os pacotes de cliente publicados (`dsh-client-ui-slots`, `dsh-client-ui-settings`, `dsh-client-ui-tool`, `dsh-client-locale`, `dsh-client-connection`); ela não depende mais do pacote removido `dsh-client-runtime` (o bloco de chamada de ferramenta é lido por um contrato estrutural local), então a superfície de cliente também se alinha com hosts `0.1.2-rc.1`.
0.1.2-rc.1 (adaptado em 2026-09-02): o envelope de sessão mantém seu campo ignorable apenas para compatibilidade de leitura de logs armazenados - o Session.append ainda não consegue estampá-lo, então o comportamento da porta não muda. Verificado em 2026-09-06 contra o checkout master dsh-v0.1.7-alpha.1 (cadeia completa de portas + smoke de instalação de perfil).
0.1.6-alpha.2 (adaptado em 2026-09-18): o terceiro parâmetro de `Session.append` existe apenas para tipos de superfície e é um `SurfaceIntent`, nunca um envelope `ignorable`, então o tipo não-superfície `draw/generated` também não é gravado nesta linha — a cota é contada em memória por sessão e zera ao reiniciar a sessão (ver a nota de durabilidade de cota). Verificado em 2026-09-18 (typecheck duplo + suíte completa + portas self-contained/artifacts/readme).
0.1.7-rc.2 (adaptado em 2026-10-04): o contrato de cliente `tool.call.toolview` dividiu seu owner em três estágios (`preparing` / `start` / `result`), e um cartão com chave agora é despachado enquanto os argumentos ainda chegam em streaming. Por isso o cartão de resultado também desenha sua linha em andamento para esses estágios anteriores: uma célula keyed ocupada nunca alcança a linha genérica do host, então responder a um estágio de preparação com nada deixava a linha em branco durante toda a janela de streaming. Nada mais muda: o cartão liquidado, a linha de contabilidade e o regenerar se comportam como antes. Verificado em 2026-09-23 (typecheck duplo + suíte completa + a nova porta host-contract).

## O que você ganha

O `dsh-draw` dá ao harness uma ferramenta unificada `image_generate` com parâmetros padrão (`prompt`/`size`/`count`/`quality`/`style`/`engine`) traduzidos por motor:

- **Roteamento multi-motor** — uma cadeia configurável (OpenAI Images, Zhipu CogView ou qualquer endpoint compatível com OpenAI) percorrida de cima para baixo com **fallback ciente da saúde**: falhas consecutivas colocam um motor em cooldown e o próximo motor saudável atende a chamada.
- **Resultados duráveis** — as imagens geradas são salvas como anexos do workspace (endereçadas por conteúdo, sob a política de anexos do harness) e retornadas como referências de arquivo canônicas.
- **Contabilidade de cota** — limites por sessão de chamadas de geração e bytes de imagem, dobrados a partir do registro de sessão durável e aplicados antes do gasto no motor e antes do armazenamento.
- **Credenciais como referências** — as chaves de API são nomes de variáveis de ambiente resolvidos por chamada através do seam oficial `ctx.credentials`; chaves literais nunca ficam na configuração nem nos logs.
- **Superfícies web** — um cartão de resultado na conversa (imagens, motor, cota, regenerar com um clique) e uma aba de ajustes de Plugins (cadeia de motores, estado de credenciais, sondas, limites de cota).

```text
modelo                          harness
  │ image_generate {prompt, ...} ──▶ validar ──▶ checar cota ──▶ rotear
  │                                  openai ──(falha)──▶ cogview ──▶ imagens
  │ ◀── JSON canônico + blocos de imagem (referências de anexo duráveis)
  │                       └── evento de sessão draw/generated (cota + auditoria)
```

## Início rápido

```sh
dsh plugin --profile web add github:PerryLink/dsh-draw
```

```sh
# 1. instale o bundle no seu perfil
dsh plugin --profile web add github:PerryLink/dsh-draw

# ou pelo npm (versões publicadas)
dsh plugin --profile web add dsh-draw

# 2. forneça as chaves do motor como referências de credencial (variáveis de ambiente)
#    OPENAI_API_KEY e/ou ZHIPU_API_KEY — nunca no patch do perfil

# 3. reinicie e verifique a linha
dsh --profile web --dump-config | grep -A2 'id: dsh-draw'
```

Depois peça ao agente para desenhar:

```
> Desenhe uma paisagem 1536x1024 de um farol ao entardecer, estilo vívido.
```

## Configuração

Todos os ajustes são campos `Config` do Schemastery (alteráveis pelo cordis.yml). Uma sobrescrita direcionada por id substitui a linha inteira — redeclare cada chave que precisar. O `cordis.patch.yml` documenta cada chave em linha.

| Chave | Padrão | Significado |
|---|---|---|
| `engines` | Presets OpenAI + CogView | Cadeia ordenada de motores, percorrida de cima para baixo com fallback; cada entrada: `id`, `baseUrl` (sem credenciais), `model`, `apiKeyRef` (nome de variável de ambiente), `enabled`, `sizeMap`, `qualitySupported`, `styleSupported`, `responseFormat` (`b64_json`/`url`), `imageMediaType` |
| `defaultEngine` | `openai` | Id de motor preferido pelo roteador; deve nomear um motor configurado |
| `requestTimeoutMs` | `120000` | Tempo limite HTTP por geração (1000..600000) |
| `maxImagesPerCall` | `4` | Limite de imagens por chamada (1..10) |
| `maxPromptLength` | `4000` | Limite de caracteres do prompt (1..32000) |
| `maxGenerationsPerSession` | `200` | Limite de chamadas por sessão (1..100000) |
| `maxBytesPerSession` | `209715200` | Limite de bytes de imagem por sessão (1048576..4294967296) |
| `failureThreshold` | `2` | Falhas consecutivas antes do cooldown (1..10) |
| `cooldownMs` | `60000` | Cooldown do motor após o limiar (1000..3600000) |

Exemplo de sobrescrita no patch do seu perfil:

```yaml
- insert:
    - id: dsh-draw
      name: dsh-draw
      config:
        defaultEngine: cogview
        maxImagesPerCall: 2
```

## Ferramentas e superfícies

| Superfície | Notas |
|---|---|
| `image_generate` | Parâmetros padrão; retorna JSON canônico (motor/modelo/tamanho, referências de imagem, cota, indicador de fallback, tentativas) mais blocos de imagem |
| Cartão de resultado (`tool.call.toolview`, chave `image_generate`) | Em cada estágio da chamada: uma linha em andamento enquanto os argumentos chegam, e depois de liquidada as imagens, a linha de motor/cota e regenerar com um clique (caminho completo do drawer: cota + roteamento + auditoria) |
| Aba de ajustes (Plugins → Image generation) | Cadeia de motores, estado de credenciais, definir/remover chaves de API (referências de credencial), sondas de conectividade, limites de cota |

## Permissões e dados

- **Permissões**: o plugin só faz chamadas HTTPS de saída para os endpoints de motor configurados; todo o resto é somente leitura. As únicas escritas da aba de ajustes são as chamadas de definir/remover credenciais no seam oficial `ctx.credentials`.
- **Dados**: as imagens geradas são salvas através do armazenamento de anexos oficial sob a política de anexos do harness. O uso de cota é dobrado dos eventos de sessão `draw/generated`, mais o livro auxiliar em memória em hosts que não podem registrar esses eventos — nada mais é armazenado.
- **Registro de sessão**: o evento `draw/generated` registra motor, modelo, solicitação padronizada, totais de bytes e ids de anexo — os fatos de auditoria, nunca as chaves API. O evento só é anexado quando o host conhece o tipo ou honra o envelope `ignorable` (sondado na montagem); em hosts rc.6/rc.7 e no host sem envelope `0.1.2-rc.1` (que removeu o envelope e falha fechado em tipos desconhecidos na leitura) a carga vai para o livro auxiliar em memória, então gerar imagens não faz mais a sessão recusar reabrir.

## Limites de segurança

- **Referências de credencial, nunca literais.** `apiKeyRef` nomeia uma variável de ambiente; um `baseUrl` com credenciais falha ruidosamente ao carregar.
- **Exibição saneada.** URLs, notas de sonda e texto de erro são redigidos (senhas de userinfo, valores de credencial em queries, tokens bearer, JWT) antes de qualquer exibição ou log.
- **Cota antes do gasto.** Os limites de geração e bytes são verificados antes das chamadas ao motor e antes do armazenamento; sessões esgotadas falham rápido sem gastar créditos.
- **Falha ruidosa, fallback deliberado.** Respostas malformadas geram erros estruturados; um motor com falhas é ignorado após o limiar de cooldown, e uma cadeia esgotada retorna o registro completo de tentativas em vez de fingir sucesso.

## Limitações conhecidas

- **Somente modelos de imagem.** Sem endpoints de vídeo, áudio ou edição; sem compreensão visual.
- **Compatibilidade de motores.** Os motores devem falar a forma `POST /images/generations` da OpenAI (entrega base64 ou URL); extras específicos de cada provedor ficam de fora.
- **Consciência de custo é estrutural.** O plugin conta chamadas e bytes, mas não conhece o preço dos motores — combine com `dsh-budget` para a governança de custo.
- **Durabilidade de cota em rc.6/rc.7, 0.1.2-rc.1 e 0.1.6-alpha.2.** Em hosts cujo registro de sessão não pode carregar `draw/generated` (lista estática de eventos, sem envelope `ignorable`; `0.1.2-rc.1` removeu o envelope e falha fechado em tipos de evento desconhecidos na leitura; em `0.1.6-alpha.2` o terceiro parâmetro do append existe apenas para tipos de superfície, então um evento não-superfície não pode ser marcado), a cota continua exata na sessão viva a partir do livro auxiliar em memória, mas zera ao reiniciar; a contabilidade durável retorna em hosts com uma superfície de eventos para plugins. O primeiro commit recusado avisa uma vez, então a degradação deixa de ser silenciosa.

## Desenvolvimento

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra o checkout local do harness
pnpm run typecheck:ci  # tsc contra as faces publicadas 0.1.7-rc.2 (sem paths)
pnpm test           # vitest: 19 arquivos spec (transporte roteirizado, Context/Session/ToolRuntime reais)
pnpm run build      # declarações tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # as especificações de dependências resolvem pelo registry
pnpm run verify:host-contract   # o contrato tool-view do host ainda coincide com o que este plugin declara
pnpm run verify:artifacts       # face ESM host + manifesto typert + bundle de navegador + arquivos de configuração
pnpm pack           # o tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — criador e mantenedor: roteador de motores, drawer, contabilidade de cota, vocabulário wire do Typert, metade de navegador e a documentação em cinco idiomas.
- [@Mohei-Muun](https://github.com/Mohei-Muun) — relatou a falha de carregamento do log de sessão `draw/generated` em hosts rc.7 ([#2](https://github.com/PerryLink/dsh-draw/issues/2)), que levou ao gate de eventos adaptativo.

## PerryLink DSH Plugin Family

Este projeto é um dos **87 plugins ativamente mantidos** do DeepSeek Harness da [PerryLink](https://github.com/PerryLink). O registro da família tem **95** plugins — **5 congelados**, **3 retirados** — e fica recolhido abaixo para que cada README mantenha uma primeira tela curta. Expanda para ver cada linha, com o motivo na coluna Status.

<details>
<summary>Expandir os 95 plugins</summary>

| Plugin | Uma linha | Status |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 CONGELADO — ver o README do repositório |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRADO — ver o README do repositório |
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

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
