# Development

## Setup (established in Phase 00 and refined per phase)

- Node LTS, npm.
- Install: `npm install`
- Dev server: `npm run dev`
- Unit tests: `npm test` (Vitest)
- Interaction tests: `npm run test:e2e` (Playwright)
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`

Commands are recorded here once the scripts exist. Until Phase 01, only docs exist.

## Conventions

- TypeScript strict mode.
- One concept per module where practical.
- Content files validated with Zod at load time.
- Commit per phase: `phase-XX: <summary>`.
- Handoff written before the commit, every phase.
