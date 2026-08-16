# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

Report privately through GitHub's private vulnerability reporting:

**https://github.com/PerryLink/dsh-draw/security/advisories/new**

That flow keeps the report confidential while we triage, and it is the channel we watch first.

## Before you report

- **Redact sensitive data** from any logs, request dumps, or session excerpts you attach: API keys, tokens, secrets, Authorization headers, personal paths, and account identifiers. Trimmed error messages and stack traces are usually enough.
- Include, when possible: the plugin version, the harness (`dsh`) version, Node and OS versions, and the minimal steps to reproduce.

## What to expect

- **Acknowledgment**: within 5 business days.
- **Triage**: within 10 business days we confirm the issue and assess severity, or ask for more details.
- **Fix**: security fixes are prepared in a private fork, released as a patch version, and announced in the release notes.

## Disclosure and credit

- We follow coordinated disclosure: a public advisory (and CVE request where appropriate) is published once a fix ships.
- Reporters are credited in the advisory unless they ask to remain anonymous. There is no bug bounty program at this time.

## Scope

This plugin routes static-image generation to OpenAI-compatible endpoints from inside the harness. Its own guarantees:

- **API keys are credential references.** Configuration carries environment-variable names (`apiKeyRef`), never literal keys; values are resolved per call through the official `ctx.credentials` seam and never enter a log, snapshot, session event, or tool result.
- **Config rejects credential-bearing URLs.** An engine `baseUrl` embedding a username or password fails the load loudly.
- **Display surfaces are sanitized.** URLs, error text, and probe notes are redacted (userinfo passwords, credential query values, bearer tokens, JWTs) before display or logging.
- **Quota before spend.** Per-session generation and byte caps are folded from the durable session log and enforced before engine calls and before attachment storage.
- **Fail loud.** Malformed engine responses, unconfigured credentials, and failed image downloads surface as structured errors — never as silent emptiness.

Vulnerabilities in the harness itself should be reported to the official harness maintainers instead.
