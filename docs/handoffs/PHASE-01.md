# Phase 01 Handoff

## Completed
- Next.js 14 (App Router) + TypeScript strict + Tailwind 3 project.
- Playable third-person hub: WASD/arrows to move, arrows to turn the camera, Space to jump, R to reset.
- Rapier physics: static ground, buildings with colliders, dynamic capsule player.
- Follow camera with lag (removed when reduced motion is on).
- Nine zone markers (Physics Lab open; eight marked "coming soon").
- Pause (Esc) with Resume, Reset world, and Reduce motion / High contrast settings.

## Current repository state
Hub runs at `/`. Scene loads client-side only (dynamic import, ssr: false).

## Architecture decisions
- Stack deviation: React Three Fiber 8 + React 18 with WebGL. The prompt recommends React 19 + R3F WebGPU/TSL. WebGPU is deferred until the rendering phases (06 and 19), because it needs the newer R3F and React versions and a fallback test plan.
- Player position is shared through a plain module (`game/world/shared.ts`), not React state, so the per-frame loop does not re-render React.
- Keyboard state is a module (`game/input/keyboard.ts`) with held keys and consumable presses.
- Ground check: a downward raycast from the capsule centre that excludes the player's own collider.
- Pause uses Rapier's `paused` prop plus an early return in the player loop.

## Files changed
- Config: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs, vitest.config.ts, playwright.config.ts, .gitignore
- App: src/app/layout.tsx, page.tsx, globals.css
- World: src/game/world/layout.ts, shared.ts
- Input: src/game/input/keyboard.ts
- Stores: src/game/store/uiStore.ts, worldStore.ts
- Scene: src/game/scene/Scene.tsx, Hub.tsx, CameraRig.tsx, Player.tsx

## Tests
- src/game/world/layout.test.ts (nearest interactable)

## Validation results
- `npx tsc --noEmit`: pass.
- `npx vitest run`: pass.
- `npx next build`: pass.
- Production server returns 200 and serves the shell HTML.
- Not verified: the 3D scene in a real browser. Playwright's Chromium could not be downloaded in this environment (network allowlist), so movement, jumping, and the camera have not been exercised visually.

## Known issues
- Camera does not collide with walls and can clip into buildings.
- Player capsule can slide on slopes; there are no slopes yet.
- Zone markers are not interactive yet.

## Deferred work
- WebGPU renderer with WebGL fallback (phases 06 and 19).
- Camera collision (phase 07, with the character controller).

## Unexpected discoveries
- `sh` in this environment does not expand `{a,b}` braces in `mkdir`, so a brace-glob created a literal directory. Removed.

## Exact next phase
PHASE-02 (interaction framework).

## Commands
npm install
npm run dev
npm test
npm run typecheck
npm run build
