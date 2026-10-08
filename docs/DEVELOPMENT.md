# Development

## Setup (established in Phase 00 and refined per phase)

- Node LTS, npm.
- Install: `npm install`
- Dev server: `npm run dev`
- Unit tests: `npm test` (Vitest)
- Interaction tests: `npm run test:e2e` (Playwright)
- Typecheck: `npm run typecheck`

Playwright tests need a browser: `npx playwright install chromium` once, then `npm run test:e2e`.

## Conventions

- TypeScript strict mode.
- One concept per module where practical.
- Content files validated with Zod at load time.
- Commit per phase: `phase-XX: <summary>`.
- Handoff written before the commit, every phase.

## One-line check

`npm run check` runs typecheck, unit tests, and the production build (the same steps as CI).

## Browser tests

`e2e/` holds five Playwright tests that run in a real Chromium: the hub, walking through the wall, the instancing draw-call comparison, pause, and the smoke test.
Run `npm run build` first, then `CHROME_PATH=/path/to/chromium npm run test:e2e`. If CHROME_PATH is not set, Playwright uses its own downloaded browser.
Walking tests read the player's position from the Inspector (F3), so they work at any frame rate.
