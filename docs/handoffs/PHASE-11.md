# Phase 11 Handoff

## Completed
- A small ECS in pure TypeScript: World (entities as IDs, components as data, queries), with disable/enable so entities can be pooled.
- Entity pool: acquire and release, reuse counts, double-release protection, fresh data from a recipe on every reuse.
- Event bus: typed events, listeners that unsubscribe, bounded history.
- Fixed-timestep stepper: real frame time in, whole fixed steps out, capped steps after a stall.
- Five systems in fixed order: spawner, movement, collision, lifetime, health.
- Data-driven recipe for projectiles (a plain object, not code).
- Systems Lab (Systems panel, press E near the panel): an arena with a turret and a target. Each system can be toggled on or off live; the lab shows target health, projectiles in flight, pool counters, step count, and recent events.
- Concept cards: game loop, fixed timestep, ECS, object pool, event bus.

## Current repository state
The lab runs on a module-level clock, so it keeps running while the dialog is closed. Reset rebuilds the world and pool.

## Architecture decisions
- The ECS is independent of Three.js and Rapier. The arena is drawn as an SVG, outside the 3D canvas, which matches the rule that critical learning content lives in HTML.
- Systems are plain objects with an `enabled` flag, so "toggleable" is a data change, not a code change.
- A system emits events; it never calls another system. The bus is the only coupling.
- The pool keeps released entities in the world but disabled. Queries skip them. This is why pooling and queries can coexist.
- Fixed step is 1/30 s. The lab speed control scales real time before it enters the stepper, so slow motion does not change step size.

## Files changed
- src/ecs/world.ts, pool.ts, eventBus.ts, loop.ts, systems.ts, lab.ts
- src/ecs/ecs.test.ts
- src/game/ui/SystemsControls.tsx
- src/game/ui/DialogPanel.tsx, src/game/world/layout.ts (systems panel), src/knowledge/content/concepts.ts

## Tests
- ecs.test.ts (27 tests in total with the lab tests): world queries and disable, pool reuse and recipes, event bus, fixed stepper, each system's behaviour, and lab runs with collision and lifetime switched off.

## Validation results
Typecheck, unit tests (78 across the repo), and production build pass. The arena's on-screen appearance is not checked in a browser.

## Known issues
- The spawner aims straight at the target, so every shot hits when collision is on. There is no randomness or spread yet.
- The event history is bounded, so the "spawned" count shown is a recent-window count, not a total.
- The world is rebuilt by reset, so entity IDs restart from 1.

## Deferred work
- Components beyond the ones used here (for example Renderer, Input). Adding one means adding a field to the Components interface.
- Archetype or chunk storage for performance. The current Map of objects is clear but not optimised for large counts.
- Connecting the 3D game to this ECS. The hub player still uses Rapier's own bodies.
- Event bus replay and debugging tools.

## Unexpected discoveries
- Pools and queries interact: if a pooled entity stayed enabled while released, every query would see stale projectiles. Disabling on release fixes this.

## Exact next phase
PHASE-12 (multiplayer arena). Not built yet.
