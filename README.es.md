<div align="center">

# 🎨 dsh-draw
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-draw` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**Enrutamiento unificado de generación de imágenes estáticas para DeepSeek Harness.**

*Una herramienta, muchos motores — respaldo consciente de salud, resultados duraderos, uso contabilizado.*

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

## Compatibilidad

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `0.1.2-alpha.5` (compatibilidad declarada para `0.1.2-alpha.5`) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Motores | Cualquier endpoint de imágenes compatible con OpenAI; presets para OpenAI Images (`gpt-image-1`) y Zhipu CogView (`cogview-3-flash`) |
| Superficies | Herramienta host `image_generate` + tarjeta de resultado web + pestaña de ajustes de Plugins |

La mitad de navegador se apoya en el `Context` de cordis y en los paquetes de cliente publicados (`dsh-client-ui-slots`, `dsh-client-ui-settings`, `dsh-client-ui-tool`, `dsh-client-locale`, `dsh-client-connection`); ya no depende del paquete eliminado `dsh-client-runtime` (el bloque de llamada de herramienta se lee mediante un contrato estructural local), por lo que la superficie de cliente también encaja con hosts `0.1.2-alpha.5`.
0.1.2-alpha.5 (adaptado el 2026-09-02): el sobre de sesión conserva su campo ignorable solo para compatibilidad de lectura de logs almacenados - Session.append aún no puede estamparlo, por lo que el comportamiento de la puerta no cambia.

## Qué obtienes

`dsh-draw` le da al harness una herramienta unificada `image_generate` con parámetros estándar (`prompt`/`size`/`count`/`quality`/`style`/`engine`) traducidos por motor:

- **Enrutamiento multi-motor** — una cadena configurable (OpenAI Images, Zhipu CogView o cualquier endpoint compatible con OpenAI) recorrida de arriba abajo con **respaldo consciente de salud**: los fallos consecutivos ponen un motor en enfriamiento y el siguiente motor sano atiende la llamada.
- **Resultados duraderos** — las imágenes generadas se guardan como adjuntos del workspace (direccionados por contenido, bajo la política de adjuntos del harness) y se devuelven como referencias de archivo canónicas.
- **Contabilidad de cuota** — límites por sesión de llamadas de generación y bytes de imagen, plegados desde el registro de sesión durable y aplicados antes de gastar en el motor y antes de almacenar.
- **Credenciales como referencias** — las claves API son nombres de variables de entorno resueltas por llamada a través del seam oficial `ctx.credentials`; las claves literales nunca se guardan en la configuración ni se registran.
- **Superficies web** — una tarjeta de resultado en la conversación (imágenes, motor, cuota, regenerar con un clic) y una pestaña de ajustes de Plugins (cadena de motores, estado de credenciales, sondas, límites de cuota).

```text
modelo                          harness
  │ image_generate {prompt, ...} ──▶ validar ──▶ comprobar cuota ──▶ enrutar
  │                                  openai ──(fallo)──▶ cogview ──▶ imágenes
  │ ◀── JSON canónico + bloques de imagen (referencias de adjunto durables)
  │                       └── evento de sesión draw/generated (cuota + auditoría)
```

## Inicio rápido

```sh
# 1. instala el bundle en tu perfil
dsh plugin --profile web add "github:PerryLink/dsh-draw#main"

# o desde npm (versiones publicadas)
dsh plugin --profile web add dsh-draw

# 2. proporciona las claves del motor como referencias de credencial (variables de entorno)
#    OPENAI_API_KEY y/o ZHIPU_API_KEY — nunca en el patch del perfil

# 3. reinicia y verifica la fila
dsh --profile web --dump-config | grep -A2 'id: dsh-draw'
```

Luego pídele al agente que dibuje:

```
> Dibuja un paisaje de 1536x1024 de un faro al atardecer, estilo vívido.
```

## Instalación y desinstalación

- **Canal git** (último `main`): `dsh plugin --profile web add "github:PerryLink/dsh-draw#main"` — el script `prepare` compila solo con dependencias de producción.
- **Canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-draw`.
- **Canal tarball**: `pnpm pack` en este repositorio y luego `dsh plugin --profile web add ./dsh-draw-<version>.tgz`.
- **Desinstalar**: `dsh plugin --profile web remove dsh-draw` (o elimina la fila del parche del perfil).

> Si pnpm informa `ERR_PNPM_IGNORED_BUILDS` para este paquete (la validación inofensiva del binario de esbuild), añade `allowBuilds: { esbuild: true }` a tu `pnpm-workspace.yaml` — el CLI `dsh` imprime el fragmento exacto.

## Configuración

Todos los ajustes son campos `Config` de Schemastery (modificables desde cordis.yml). Una sobrescritura dirigida por id reemplaza toda la fila — vuelve a declarar cada clave que necesites. `cordis.patch.yml` documenta cada clave en línea.

| Clave | Por defecto | Significado |
|---|---|---|
| `engines` | Presets OpenAI + CogView | Cadena ordenada de motores, recorrida de arriba abajo con respaldo; cada entrada: `id`, `baseUrl` (sin credenciales), `model`, `apiKeyRef` (nombre de variable de entorno), `enabled`, `sizeMap`, `qualitySupported`, `styleSupported`, `responseFormat` (`b64_json`/`url`), `imageMediaType` |
| `defaultEngine` | `openai` | Id de motor preferido por el enrutador; debe nombrar un motor configurado |
| `requestTimeoutMs` | `120000` | Tiempo de espera HTTP por generación (1000..600000) |
| `maxImagesPerCall` | `4` | Límite de imágenes por llamada (1..10) |
| `maxPromptLength` | `4000` | Límite de caracteres del prompt (1..32000) |
| `maxGenerationsPerSession` | `200` | Límite de llamadas por sesión (1..100000) |
| `maxBytesPerSession` | `209715200` | Límite de bytes de imagen por sesión (1048576..4294967296) |
| `failureThreshold` | `2` | Fallos consecutivos antes del enfriamiento (1..10) |
| `cooldownMs` | `60000` | Enfriamiento del motor tras el umbral (1000..3600000) |

Ejemplo de sobrescritura en el parche de tu perfil:

```yaml
- insert:
    - id: dsh-draw
      name: dsh-draw
      config:
        defaultEngine: cogview
        maxImagesPerCall: 2
```

## Herramientas y superficies

| Superficie | Notas |
|---|---|
| `image_generate` | Parámetros estándar; devuelve JSON canónico (motor/modelo/tamaño, referencias de imagen, cuota, indicador de respaldo, intentos) más bloques de imagen |
| Tarjeta de resultado (`tool.call.toolview`, clave `image_generate`) | Imágenes, línea de motor/cuota, regenerar con un clic (ruta completa del drawer: cuota + enrutamiento + auditoría) |
| Pestaña de ajustes (Plugins → Image generation) | Cadena de motores, estado de credenciales, establecer/eliminar claves API (referencias de credencial), sondas de conectividad, límites de cuota |

## Permisos y datos

- **Permisos**: el plugin solo hace llamadas HTTPS salientes a los endpoints de motor configurados; el resto es de solo lectura. Las únicas escrituras de la pestaña de ajustes son las llamadas de establecer/eliminar credenciales en el seam oficial `ctx.credentials`.
- **Datos**: las imágenes generadas se guardan a través del almacén de adjuntos oficial bajo la política de adjuntos del harness. El uso de cuota se pliega desde los eventos de sesión `draw/generated`, más el libro auxiliar en memoria en hosts que no pueden registrar esos eventos — nada más se almacena.
- **Registro de sesión**: el evento `draw/generated` registra motor, modelo, solicitud estandarizada, totales de bytes e ids de adjunto — los hechos de auditoría, nunca las claves API. El evento solo se añade cuando el host conoce el tipo o admite el sobre `ignorable` (sondeado al montar); en hosts rc.6/rc.7 y en el host sin sobre `0.1.2-alpha.5` (que eliminó el sobre y falla cerrado en tipos desconocidos al leer) la carga va al libro auxiliar en memoria, de modo que generar imágenes ya no hace que la sesión se niegue a reabrirse.

## Límites de seguridad

- **Referencias de credencial, nunca literales.** `apiKeyRef` nombra una variable de entorno; un `baseUrl` con credenciales falla ruidosamente al cargar.
- **Visualización saneada.** URLs, notas de sonda y texto de error se redactan (contraseñas de userinfo, valores de credencial en queries, tokens bearer, JWT) antes de mostrarse o registrarse.
- **Cuota antes de gastar.** Los límites de generación y bytes se comprueban antes de las llamadas al motor y antes del almacenamiento; las sesiones agotadas fallan rápido sin gastar créditos.
- **Fallo ruidoso, respaldo deliberado.** Las respuestas malformadas dan errores estructurados; un motor que falla se omite tras su umbral de enfriamiento, y una cadena agotada devuelve el registro completo de intentos en lugar de fingir éxito.

## Limitaciones conocidas

- **Solo modelos de imagen.** Sin endpoints de vídeo, audio o edición; sin comprensión visual.
- **Compatibilidad de motores.** Los motores deben hablar la forma `POST /images/generations` de OpenAI (entrega base64 o URL); los extras específicos de cada proveedor quedan fuera.
- **La conciencia de coste es estructural.** El plugin cuenta llamadas y bytes pero no conoce el precio de los motores — combínalo con `dsh-budget` para la gobernanza de coste.
- **Durabilidad de cuota en rc.6/rc.7 y 0.1.2-alpha.5.** En hosts cuyo registro de sesión no puede llevar `draw/generated` (lista blanca estática de eventos, sin sobre `ignorable`; `0.1.2-alpha.5` eliminó el sobre y falla cerrado en tipos de evento desconocidos al leer), la cuota sigue exacta en la sesión viva desde el libro auxiliar en memoria pero se reinicia al reiniciar; la contabilidad duradera vuelve en hosts con una superficie de eventos para plugins.

## Desarrollo

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests contra el checkout local del harness
pnpm run typecheck:ci  # tsc contra las caras publicadas 0.1.2-alpha.5 (sin paths)
pnpm test           # vitest: 107 tests, 16 archivos de prueba (transporte guionado, Context/Session/ToolRuntime reales)
pnpm run build      # declaraciones tsc + bundles tsdown (lib/)
pnpm run verify:self-contained  # las especificaciones de dependencias resuelven desde el registry
pnpm run verify:artifacts       # cara ESM host + manifiesto typert + bundle de navegador + archivos de configuración
pnpm pack           # el tarball publicado
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creador y mantenedor: enrutador de motores, drawer, contabilidad de cuota, vocabulario wire de Typert, mitad de navegador y la documentación en cinco idiomas.
- [@Mohei-Muun](https://github.com/Mohei-Muun) — informó del fallo de carga del registro de sesión `draw/generated` en hosts rc.7 ([#2](https://github.com/PerryLink/dsh-draw/issues/2)), que condujo a la puerta de eventos adaptativa.

## PerryLink DSH Plugin Family

Este proyecto es uno de los [33 complementos de DeepSeek Harness](https://github.com/PerryLink) mantenidos por [PerryLink](https://github.com/PerryLink). Si este te ayuda, probablemente los demás también:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | Auto-revisión de segundo modelo en la cadena de aprobación, con cierre en fallo por defecto | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | Agentes hijos en segundo plano durables con barra lateral de UI web, mensajería e interrupción | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | Gobernanza de costes para DeepSeek Harness: presupuestos, carbono y latencia en un panel. | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Equivalente a /rewind de Claude Code: instantáneas, bifurcaciones de sesión, restauración de un solo uso | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Migra sesiones, memoria, habilidades y CLAUDE.md de Claude Code a DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | Control de escritorio nativo multiplataforma para DeepSeek Harness — Windows primero. | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Historial de entrada estilo terminal para el compositor web: flechas, búsqueda Ctrl+R | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | Comprobaciones de calidad de datasets y verificación de citas (el puente numérico opcional consumido aquí) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | Defensa contra inyección de prompts, jailbreak y fuga de secretos para DeepSeek Harness. | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | Guardián de disciplina de ingeniería: interrogatorio de requisitos, puertas de pruebas, revisión adversaria | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | Diagnóstico de rendimiento de solo lectura para DeepSeek Harness. | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | Informes de investigación deterministas para fondos mutuos públicos chinos | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | Integración de PR/issues de GitHub para DSH, cada escritura controlada por aprobación | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | Orquestación de investigación sectorial que sella sus entregables mediante el `ctx.researchReport.assemble` de este plugin | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | Base de conocimiento documental local para DeepSeek Harness. | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | Integración de modelos locales (Ollama) para DeepSeek Harness. | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | Diagnósticos, formato, autocompletado, acciones de código y renombrado LSP sobre servidores de lenguaje | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | Middleware de enmascaramiento de PII: anonimiza en el límite del modelo, restaura en la capa de visualización | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | Panel de tiempo de ejecución MCP de solo lectura: comando /mcp + pestaña Settings con estado, herramientas y errores | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | Memoria entre sesiones controlada por aprobación: costura ctx.memory + SQLite + herramienta de memoria | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | Exportador de observabilidad OpenTelemetry y Langfuse para DeepSeek Harness. | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Cambio de estilo en tiempo de ejecución equivalente a outputStyles de Claude Code | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Reglas de permisos declarativas allow/deny/ask estilo Claude Code con auditoría | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | Base de conocimiento de desarrollo de plugins como habilidad de agente bajo demanda | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | Motor de informes de investigación verificables con evidencia direccionada por contenido | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | Puntuación de calidad multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | Fija sesiones en la barra lateral web con orden durable | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | Sincronización de sesiones entre dispositivos para DeepSeek Harness — un espejo git dedicado de tu almacén de sesiones. | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | Paquete de habilidades de auditoría de seguridad: escaneo de secretos, revisión de dependencias y cadena de suministro | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | Bucle de sesión con voz para DeepSeek Harness: háblale y escucha su respuesta. | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | Pruebas de instalación y humo aisladas para plugins de DeepSeek Harness. | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | Traducción de parámetros entre proveedores y reparación determinista de JSON para DeepSeek Harness. | |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
