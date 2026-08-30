<div align="center">

# 🎨 dsh-draw
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-draw` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com)).

**Roteamento unificado de geração de imagens estáticas para o DeepSeek Harness.**

*Uma ferramenta, muitos motores — fallback ciente da saúde, resultados duráveis, uso contabilizado.*

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

## Compatibilidade

| Superfície | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` (compatibilidade declarada para `0.1.1-rc.2`) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Motores | Qualquer endpoint de imagens compatível com OpenAI; presets para OpenAI Images (`gpt-image-1`) e Zhipu CogView (`cogview-3-flash`) |
| Superfícies | Ferramenta host `image_generate` + cartão de resultado web + aba de ajustes de Plugins |

A metade de navegador usa o `Context` do cordis e os pacotes de cliente publicados (`dsh-client-ui-slots`, `dsh-client-ui-settings`, `dsh-client-ui-tool`, `dsh-client-locale`, `dsh-client-connection`); ela não depende mais do pacote removido `dsh-client-runtime` (o bloco de chamada de ferramenta é lido por um contrato estrutural local), então a superfície de cliente também se alinha com hosts `0.1.2-alpha.1`.

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
# 1. instale o bundle no seu perfil
dsh plugin --profile web add "github:PerryLink/dsh-draw#main"

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

## Instalação e desinstalação

- **Canal git** (último `main`): `dsh plugin --profile web add "github:PerryLink/dsh-draw#main"` — o script `prepare` compila apenas com dependências de produção.
- **Canal npm** (versões publicadas): `dsh plugin --profile web add dsh-draw`.
- **Canal tarball**: `pnpm pack` neste repositório e então `dsh plugin --profile web add ./dsh-draw-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-draw` (ou remova a linha do patch do perfil).

> Se o pnpm reportar `ERR_PNPM_IGNORED_BUILDS` para este pacote (a validação inofensiva do binário de plataforma do esbuild), adicione `allowBuilds: { esbuild: true }` ao seu `pnpm-workspace.yaml` — o CLI `dsh` imprime o trecho exato.

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
| Cartão de resultado (`tool.call.toolview`, chave `image_generate`) | Imagens, linha de motor/cota, regenerar com um clique (caminho completo do drawer: cota + roteamento + auditoria) |
| Aba de ajustes (Plugins → Image generation) | Cadeia de motores, estado de credenciais, definir/remover chaves de API (referências de credencial), sondas de conectividade, limites de cota |

## Permissões e dados

- **Permissões**: o plugin só faz chamadas HTTPS de saída para os endpoints de motor configurados; todo o resto é somente leitura. As únicas escritas da aba de ajustes são as chamadas de definir/remover credenciais no seam oficial `ctx.credentials`.
- **Dados**: as imagens geradas são salvas através do armazenamento de anexos oficial sob a política de anexos do harness. O uso de cota é dobrado dos eventos de sessão `draw/generated`, mais o livro auxiliar em memória em hosts que não podem registrar esses eventos — nada mais é armazenado.
- **Registro de sessão**: o evento `draw/generated` registra motor, modelo, solicitação padronizada, totais de bytes e ids de anexo — os fatos de auditoria, nunca as chaves API. O evento só é anexado quando o host conhece o tipo ou honra o envelope `ignorable` (sondado na montagem); em hosts rc.6/rc.7 e no host sem envelope `0.1.2-alpha.1` (que removeu o envelope e falha fechado em tipos desconhecidos na leitura) a carga vai para o livro auxiliar em memória, então gerar imagens não faz mais a sessão recusar reabrir.

## Limites de segurança

- **Referências de credencial, nunca literais.** `apiKeyRef` nomeia uma variável de ambiente; um `baseUrl` com credenciais falha ruidosamente ao carregar.
- **Exibição saneada.** URLs, notas de sonda e texto de erro são redigidos (senhas de userinfo, valores de credencial em queries, tokens bearer, JWT) antes de qualquer exibição ou log.
- **Cota antes do gasto.** Os limites de geração e bytes são verificados antes das chamadas ao motor e antes do armazenamento; sessões esgotadas falham rápido sem gastar créditos.
- **Falha ruidosa, fallback deliberado.** Respostas malformadas geram erros estruturados; um motor com falhas é ignorado após o limiar de cooldown, e uma cadeia esgotada retorna o registro completo de tentativas em vez de fingir sucesso.

## Limitações conhecidas

- **Somente modelos de imagem.** Sem endpoints de vídeo, áudio ou edição; sem compreensão visual.
- **Compatibilidade de motores.** Os motores devem falar a forma `POST /images/generations` da OpenAI (entrega base64 ou URL); extras específicos de cada provedor ficam de fora.
- **Consciência de custo é estrutural.** O plugin conta chamadas e bytes, mas não conhece o preço dos motores — combine com `dsh-budget` para a governança de custo.
- **Durabilidade de cota em rc.6/rc.7 e 0.1.2-alpha.1.** Em hosts cujo registro de sessão não pode carregar `draw/generated` (lista estática de eventos, sem envelope `ignorable`; `0.1.2-alpha.1` removeu o envelope e falha fechado em tipos de evento desconhecidos na leitura), a cota continua exata na sessão viva a partir do livro auxiliar em memória, mas zera ao reiniciar; a contabilidade durável retorna em hosts com uma superfície de eventos para plugins.

## Desenvolvimento

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra o checkout local do harness
pnpm run typecheck:ci  # tsc contra as faces publicadas 0.1.1-rc.2 (sem paths)
pnpm test           # vitest: 107 testes, 16 arquivos de teste (transporte roteirizado, Context/Session/ToolRuntime reais)
pnpm run build      # declarações tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # as especificações de dependências resolvem pelo registry
pnpm run verify:artifacts       # face ESM host + manifesto typert + bundle de navegador + arquivos de configuração
pnpm pack           # o tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — criador e mantenedor: roteador de motores, drawer, contabilidade de cota, vocabulário wire do Typert, metade de navegador e a documentação em cinco idiomas.
- [@Mohei-Muun](https://github.com/Mohei-Muun) — relatou a falha de carregamento do log de sessão `draw/generated` em hosts rc.7 ([#2](https://github.com/PerryLink/dsh-draw/issues/2)), que levou ao gate de eventos adaptativo.

## PerryLink DSH Plugin Family

Este projeto é um dos [33 plugins de DeepSeek Harness](https://github.com/PerryLink) mantidos por [PerryLink](https://github.com/PerryLink). Se este ajuda você, os outros provavelmente também:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | Auto-revisão de segundo modelo na cadeia de aprovação, com falha fechada por padrão | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | Agentes filhos em segundo plano duráveis com barra lateral de UI web, mensagens e interrupção | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | Governança de custos para DeepSeek Harness: orçamentos, carbono e latência em um painel. | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Equivalente ao /rewind do Claude Code: instantâneos, bifurcações de sessão, restauração de uso único | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Migre sessões, memória, habilidades e CLAUDE.md do Claude Code para o DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | Controle de desktop nativo multiplataforma para DeepSeek Harness — Windows primeiro. | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Histórico de entrada estilo terminal para o compositor web: setas, busca Ctrl+R | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | Verificações de qualidade de datasets e verificação de citações (a ponte numérica opcional consumida aqui) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | Defesa contra injeção de prompt, jailbreak e vazamento de segredos para DeepSeek Harness. | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | Guardião de disciplina de engenharia: sabatina de requisitos, portões de teste, revisão adversária | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | Diagnóstico de desempenho só de leitura para DeepSeek Harness. | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | Relatórios de pesquisa deterministas para fundos mútuos públicos chineses | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | Integração de PR/issues do GitHub para o DSH, cada escrita controlada por aprovação | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | Orquestração de pesquisa setorial que sela as suas entregas através do `ctx.researchReport.assemble` deste plugin | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | Base de conhecimento documental local para DeepSeek Harness. | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | Integração de modelos locais (Ollama) para DeepSeek Harness. | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | Diagnósticos, formatação, autocompletar, ações de código e renomeação LSP sobre servidores de linguagem | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | Middleware de mascaramento de PII: anonimiza no limite do modelo, restaura na camada de exibição | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | Painel de tempo de execução MCP somente leitura: comando /mcp + aba Settings com status, ferramentas e erros | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | Memória entre sessões controlada por aprovação: costura ctx.memory + SQLite + ferramenta de memória | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | Exportador de observabilidade OpenTelemetry e Langfuse para DeepSeek Harness. | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Troca de estilo em tempo de execução equivalente ao outputStyles do Claude Code | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Regras de permissão declarativas allow/deny/ask estilo Claude Code com auditoria | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | Base de conhecimento de desenvolvimento de plugins como habilidade de agente sob demanda | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | Motor de relatórios de pesquisa verificáveis com evidência endereçada por conteúdo | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | Pontuação de qualidade multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | Fixe sessões na barra lateral web com ordenação durável | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | Sincronização de sessões entre dispositivos para DeepSeek Harness — um espelho git dedicado do seu armazenamento de sessões. | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | Pacote de habilidades de auditoria de segurança: varredura de segredos, revisão de dependências e cadeia de suprimentos | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | Loop de sessão com voz para DeepSeek Harness: fale e ouça a resposta. | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | Test drives isolados de instalação e smoke para plugins de DeepSeek Harness. | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | Tradução de parâmetros entre fornecedores e reparo determinístico de JSON para DeepSeek Harness. | |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors
