<div align="center">

# 🎨 dsh-draw

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
| Harness | DeepSeek Harness `0.1.0-rc.6` (compatibilidade declarada para `0.1.0-rc.6`) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Motores | Qualquer endpoint de imagens compatível com OpenAI; presets para OpenAI Images (`gpt-image-1`) e Zhipu CogView (`cogview-3-flash`) |
| Superfícies | Ferramenta host `image_generate` + cartão de resultado web + aba de ajustes de Plugins |

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
- **Dados**: as imagens geradas são salvas através do armazenamento de anexos oficial sob a política de anexos do harness. O uso de cota é dobrado dos eventos de sessão `draw/generated` — nada mais é armazenado.
- **Registro de sessão**: o evento `draw/generated` registra motor, modelo, solicitação padronizada, totais de bytes e ids de anexo — os fatos de auditoria, nunca as chaves de API.

## Limites de segurança

- **Referências de credencial, nunca literais.** `apiKeyRef` nomeia uma variável de ambiente; um `baseUrl` com credenciais falha ruidosamente ao carregar.
- **Exibição saneada.** URLs, notas de sonda e texto de erro são redigidos (senhas de userinfo, valores de credencial em queries, tokens bearer, JWT) antes de qualquer exibição ou log.
- **Cota antes do gasto.** Os limites de geração e bytes são verificados antes das chamadas ao motor e antes do armazenamento; sessões esgotadas falham rápido sem gastar créditos.
- **Falha ruidosa, fallback deliberado.** Respostas malformadas geram erros estruturados; um motor com falhas é ignorado após o limiar de cooldown, e uma cadeia esgotada retorna o registro completo de tentativas em vez de fingir sucesso.

## Limitações conhecidas

- **Somente modelos de imagem.** Sem endpoints de vídeo, áudio ou edição; sem compreensão visual.
- **Compatibilidade de motores.** Os motores devem falar a forma `POST /images/generations` da OpenAI (entrega base64 ou URL); extras específicos de cada provedor ficam de fora.
- **Consciência de custo é estrutural.** O plugin conta chamadas e bytes, mas não conhece o preço dos motores — combine com `dsh-budget` para a governança de custo.

## Desenvolvimento

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra o checkout local do harness
pnpm run typecheck:ci  # tsc contra as faces publicadas 0.1.0-rc.6 (sem paths)
pnpm test           # vitest: 77 testes, 11 suítes (transporte roteirizado, Context/Session/ToolRuntime reais)
pnpm run build      # declarações tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # as especificações de dependências resolvem pelo registry
pnpm run verify:artifacts       # face ESM host + manifesto typert + bundle de navegador + arquivos de configuração
pnpm pack           # o tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — criador e mantenedor: roteador de motores, drawer, contabilidade de cota, vocabulário wire do Typert, metade de navegador e a documentação em cinco idiomas.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors
