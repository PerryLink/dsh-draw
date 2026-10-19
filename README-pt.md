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

![Diagrama de fluxo de dsh-draw: chamada → plugin → resultado.](docs/assets/dsh-draw-flow.svg)

*Visão geral do fluxo: chamada → plugin → resultado. Os exemplos abaixo usam a superfície real de comandos.*


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

### Exemplos

São os pontos de entrada reais; instale e chame um.

#### Exemplo detalhado

- `image_generate`

#### Exemplos breves



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

Este projeto faz parte da família de plugins do DeepSeek Harness da [PerryLink](https://github.com/PerryLink). O registro fica recolhido abaixo para que cada README mantenha uma primeira tela curta; expanda para ver cada linha e seu status.

<details>
<summary>Expandir todos os plugins</summary>

| Plugin | Status |
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
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver o README do repositório |

</details>

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
