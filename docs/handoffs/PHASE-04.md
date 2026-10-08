# Phase 04 Handoff

## Completed
- Physics Lab with a visible wall (always drawn) and a collider that exists only when turned on.
- Terminal lets the learner turn the collider on or off ("break it").
- When on, a cyan wireframe shows the invisible collision shape.
- Mission steps are proven by the world:
  - walk-through: crossing the wall with the collider off
  - read-terminal: pressing E at the terminal
  - enable-collider: collider on
  - bump-wall: standing against the front face with the collider on
- Wall signals are a pure function (`src/missions/wallWatch.ts`), tested without the 3D scene.

## Current repository state
The mission can be completed end to end in the browser, in principle. Not yet confirmed by an automated run (see validation).

## Architecture decisions
- The collider is conditionally rendered as a child of a fixed RigidBody. It is added and removed by React, so no physics world rebuild is needed.
- The wireframe shows the collider shape so the learner can see what is invisible.
- `bump-wall` uses a 0.8 m window in front of the face, which matches a 0.4 m player radius.

## Files changed
- src/game/scene/PhysicsLab.tsx
- src/missions/wallWatch.ts, wallWatch.test.ts
- e2e/smoke.spec.ts

## Tests
- wallWatch.test.ts: back-face crossing, no crossing outside span, bump near front, enable-collider on, no walk-through with collider on.
- e2e/smoke.spec.ts: hub loads, pause and resume. Not run (no browser in this environment).

## Validation results
- Unit tests pass.
- Not verified in a browser: whether the player physically passes through the wall when the collider is off, and is stopped when it is on. The logic is correct by construction, but it needs a real run to confirm.

## Known issues
- If the player is inside the wall when the collider is turned on, they may be pushed out unpredictably.
- The wall's visible mesh is not coloured to show "solid" vs "ghost"; only the wireframe shows the change.

## Deferred work
- Break mode and fix mode as separate flows (the terminal toggles both ways for now).
- Hint ladder for "break it" (no step for it yet).
- Challenge after the mission.

## Unexpected discoveries
None.

## Exact next phase
PHASE-05 (simulation engine).

## Commands
npm test
npm run test:e2e   (needs Chromium installed by `npx playwright install chromium`)
