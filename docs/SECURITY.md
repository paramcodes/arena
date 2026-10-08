# Security

## Scope
A static, client-side web app. There is no server code, no accounts, no payments, and no user uploads.

## Data
- Learning progress is saved in the browser's localStorage under one key. Everything read back is validated with Zod (src/game/store/learningPersist.ts). Invalid data is discarded.
- Nothing is sent to a server. There is no analytics. Log entries stay in memory (src/observability/log.ts) and contain only short primitive values.

## Headers
- Content-Security-Policy is built per request in `src/config/csp.ts` and sent by `src/middleware.ts`. Each response gets a fresh nonce; scripts must carry it. `strict-dynamic` lets the nonced bootstrap script load the app's chunks.
- Production scripts: no `unsafe-inline`, no `unsafe-eval`. `wasm-unsafe-eval` is allowed because the physics engine compiles WebAssembly. Development adds `unsafe-eval` and websocket hot reload.
- Styles keep `unsafe-inline`. React, drei, and three.js set inline `style` attributes, which cannot carry a nonce. This is the remaining inline allowance.
- The root layout is dynamic (`force-dynamic`), because a nonce must be generated per request. Pages are no longer pre-rendered at build time.
- Static headers (`security-headers.json`): X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, a restrictive Permissions-Policy, and cross-origin isolation (Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy), which SharedArrayBuffer needs. Any cross-origin resource must send CORP headers.
- Tests in `src/config/csp.test.ts` check the policy. The browser suite checks that the app loads with no console errors under it.

## Dependencies
- Run `npm audit` before each release. Review each finding; do not apply blind upgrades.

## Reporting
Report issues privately to the maintainer. Do not open a public issue for a vulnerability.
