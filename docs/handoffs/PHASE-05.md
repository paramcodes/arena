# Phase 05 Handoff

## Completed
- Pure simulation core: SimulationState, SimulationEntity, SimulationSystem, SimulationStep (`step`), SimulationEvent, Timeline.
- Simulation controller with fixed timestep accumulator, play, pause, step, reset, speed (0.1x to 4x).
- Two systems: gravity and ground (bounce with restitution, then settle).
- Simulation Lab in the Inspector (F3): a ball you can play, pause, step, reset, and slow down, with live state.
- Live PLAYER state in the inspector: position, velocity, grounded, wall collider.

## Current repository state
F3 opens the inspector. The lab runs independently of the 3D world.

## Architecture decisions
- Systems return new entity maps and never mutate. This makes `step` pure, so the same input always gives the same output (tested).
- The controller drops the backlog after `maxStepsPerUpdate` to avoid a spiral after a long pause.
- The lab runs its own clock, separate from Rapier, which owns the 3D world's physics.
- PLAYER has no health yet. The `health` field is present in the entity type and set to 100 for the ball. The live inspector does not show it.

## Files changed
- src/simulation/engine.ts, systems.ts, engine.test.ts
- src/game/ui/Inspector.tsx, SimulationLab.tsx

## Tests
- Pure step: input not mutated, deterministic, tick and time, rejects bad dt, falling, bounce and settle.
- Controller: steps per frame, 2x speed, pause, stepOnce, reset, step cap, history capacity, speed validation.

## Validation results
- Vitest: 37 tests in total pass (including phases 01 to 04).
- Not verified in a browser: the lab's visual update loop.

## Known issues
- The lab repaints every 100 ms, so the displayed values can lag by up to a tenth of a second.
- Events are kept as an array copy per step, which is fine at this scale but would need a ring buffer at large entity counts.

## Deferred work
- The lab is a standalone demo. Connecting the live game's physics to the engine (so the engine drives the player) is deferred. The prompt's "ECS" and "system toggle" goals are phase 11.
- Health and damage systems.

## Unexpected discoveries
None.

## Exact next phase
PHASE-06 (graphics district), and the remaining phases 06 to 19, which are not built in this pass.

## Commands
npm test
