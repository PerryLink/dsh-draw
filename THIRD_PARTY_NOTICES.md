# Third-party notices

`dsh-draw` bundles no third-party source code; all TypeScript/JavaScript
sources in this repository are original works by the dsh-draw contributors,
licensed under Apache-2.0 (see `LICENSE`).

The package depends on the following software. The published tarball bundles
only `zod` (the wire codec library inlined into the host and client bundles);
everything else is install-time:

| Package | Version range | License | Purpose |
|---|---|---|---|
| [zod](https://github.com/colinhacks/zod) | `^4.4.3` | MIT | Wire codecs shared by the host and client Typert faces (bundled into `lib/`) |
| [tsdown](https://github.com/rolldown/tsdown) | `^0.22.14` | MIT | Build-time bundling of `lib/` (a regular dependency so the git-install channel's `prepare` script can build) |
| [typescript](https://github.com/microsoft/TypeScript) | `^7.0.2` | Apache-2.0 | Build-time declaration emission (`lib/types/`) |
| [@deepseek-ai/cordis](https://www.npmjs.com/package/@deepseek-ai/cordis) | `^4.0.1` (peer) | See package | The plugin runtime |
| [@deepseek-ai/schemastery](https://www.npmjs.com/package/@deepseek-ai/schemastery) | `^3.18.0` (peer) | See package | Configuration schema |
| `@deepseek-ai/dsh-*` peers | `0.1.0-rc.6` (peer) | See packages | Official harness seams (`dsh-tools`, `dsh-session`, `dsh-attachment`, `dsh-credentials`, `dsh-llm`, `dsh-brand`, `dsh-typert-protocol`) |

At runtime the plugin only talks to the image-generation endpoints the user
configures and to the harness services listed as peerDependencies.
