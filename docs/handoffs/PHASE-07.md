# Phase 07 Handoff

## Completed
- Physics panel (Physics Lab, press E at the panel).
- Gravity slider changes the Rapier world's gravity live (range 0.5 to 20 m/s²).
- Ball restitution and ramp/ball friction sliders. Changing either restarts the drop with the new values.
- "Drop ball again" button.
- Turret raycast: a yellow line is a real physics raycast; its hit distance is measured and shown.
- Concept cards: restitution, friction, raycast.

## Current repository state
The Physics Lab now has a ramp, a bouncing ball, and a turret. Gravity affects the player too.

## Architecture decisions
- Changing a collider property (restitution, friction) remounts the body with a key. This avoids depending on whether the bindings update live.
- Gravity is a Physics prop read from a store, so the slider is the single source of truth.
- The raycast runs every frame in the render loop and the distance is written to the store at about 6 Hz.
- Not built: character controller tuning, joints, shape casts, CCD demonstration beyond the ball's ccd flag, and broad/narrow phase visualisation. These were in the prompt's physics list.

## Files changed
- src/game/scene/PhysicsDistrict.tsx
- src/game/store/physicsStore.ts, physicsStore.test.ts
- src/game/scene/Scene.tsx (gravity from store, district added)
- src/game/ui/LabControls.tsx (PhysicsControls), DialogPanel.tsx
- src/game/world/layout.ts (physics panel)
- src/knowledge/content/concepts.ts

## Tests
- physicsStore.test.ts: range clamping; dropBall key bump.
- Visual behaviour (ball bounce, ramp friction, raycast length) is not verified in a browser.

## Validation results
Typecheck, unit tests, and production build pass.

## Known issues
- Gravity at 0.5 makes the player float and feel wrong. The range is for experiments, not play.
- The ball's collider is recreated on any slider change, so its position resets.

## Deferred work
- Joints, shape casts, and a broad/narrow-phase overlay.
- Playable experiments for the character controller beyond the existing player.

## Unexpected discoveries
- `useRapier` comes from `@react-three/rapier`. R3F does not export it.

## Exact next phase
PHASE-08 (animation district).
