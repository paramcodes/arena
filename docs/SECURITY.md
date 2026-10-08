# Security

## Scope
A static, client-side web app. There is no server code, no accounts, no payments, and no user uploads.

## Data
- Learning progress is saved in the browser's localStorage under one key. Everything read back is validated with Zod (src/game/store/learningPersist.ts). Invalid data is discarded.
- Nothing is sent to a server. There is no analytics. Log entries stay in memory (src/observability/log.ts) and contain only short primitive values.

## Headers (security-headers.json, applied by next.config.mjs)
- Content-Security-Policy restricts scripts, styles, fonts, images, workers, and connections to this origin. `frame-ancestors 'none'` prevents embedding.
- `'unsafe-inline'` and `'unsafe-eval'` are allowed for scripts because Next.js needs them for hydration and development. Tighten this with nonces before public launch.
- X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, and a restrictive Permissions-Policy.
- Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy enable cross-origin isolation. This is needed for SharedArrayBuffer. It also means any cross-origin resource must send CORP headers, so add only same-origin assets or assets that send them.

## Dependencies
- Run `npm audit` before each release. Review each finding; do not apply blind upgrades.

## Reporting
Report issues privately to the maintainer. Do not open a public issue for a vulnerability.
