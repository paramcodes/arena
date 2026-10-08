# Phase 19 Handoff

## Completed
- Error boundary around the 3D view, with a message and a retry. The lessons and panels keep working.
- Browser check on load: if no renderer is available, the 3D view is replaced by an explanation and the rest of the app works.
- Security headers in security-headers.json, applied by next.config.mjs. Content-Security-Policy, framing denied, MIME sniffing blocked, referrer and permissions policies, and cross-origin isolation (needed for SharedArrayBuffer).
- In-memory event log (src/observability/log.ts) fed by the error boundary and window error listeners. Nothing is sent off the device.
- CI workflow (.github/workflows/ci.yml): typecheck, test, build.
- docs/SECURITY.md and docs/AUDIT.md.
- Bundle fix: the shared player position is now plain numbers, so three.js is no longer in the home page bundle. First-load JS went from about 300 kB to about 129 kB.

## Current repository state
Full build passes. `npm run check` runs typecheck, tests, and build.

## Architecture decisions
- Security headers are data (JSON) read by next.config.mjs, and a test reads the same file. A header change that breaks the policy fails the test.
- Cross-origin isolation is on. Any cross-origin asset must send CORP headers. The app has none, so nothing breaks today.
- The 3D view is wrapped, not the whole app, so a crash in the 3D code does not take down the mission and lesson panels.

## Files changed
- src/observability/log.ts, log.test.ts
- src/game/ui/ErrorBoundary.tsx
- src/game/ui/GameShell.tsx (browser check, error listeners, boundary)
- security-headers.json, next.config.mjs
- src/config/config.test.ts
- .github/workflows/ci.yml
- docs/SECURITY.md, docs/AUDIT.md
- src/game/world/shared.ts (plain numbers), Player.tsx, CameraRig.tsx (use the new shape)
- package.json ("check" script)

## Tests
- log.test.ts: bounded history, truncation.
- config.test.ts: framing denied, CSP limits, cross-origin isolation headers.
- Full suite: 126 tests.

## Validation results
- `npm run typecheck`: pass.
- `npm test`: 126 pass.
- `npm run build`: pass.
- Not verified: the browser behaviour of any 3D scene; the Playwright smoke test; the CI run; the headers on a deployed host.

## Known issues
- CSP allows unsafe-inline and unsafe-eval for scripts. Needed by Next.js today; should be tightened with nonces.
- The WebGPU renderer is not built (see AUDIT.md).
- Touch is not supported and the layout is not responsive.

## Deferred work
- Everything listed under "Known gaps before launch" in docs/AUDIT.md.

## Unexpected discoveries
- A static import of a shared module that used three.js pulled the whole library into the home page bundle. Moving the shared data to plain numbers fixed it.

## Exact next phase
None. The prompt's phases are all built. Remaining work is the launch checklist in docs/AUDIT.md.

## Commands
npm run check
