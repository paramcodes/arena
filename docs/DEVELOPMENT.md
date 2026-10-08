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
