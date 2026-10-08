# Phase 15 Handoff

## Completed
- World Builder panel (near the World Builder pillar).
- Seeded value noise and fractal noise (src/world/noise.ts), deterministic for a seed.
- Biomes from height and moisture: water, sand, grass, forest, rock, snow.
- Cell streaming: the world is cut into 4 m cells; cells within 3 cells of the player count as loaded (src/world/cells.ts).
- Live terrain map (SVG) around the player with loaded cells highlighted.
- Seed input and "next seed" button.
- Landmark editor: add a landmark at the player's position, remove landmarks. Landmarks are kept in memory.
- Concept cards: procedural generation, seed, world streaming.

## Current repository state
The map shows the terrain the seed would produce around the player. The 3D world is not generated from the seed yet.

## Architecture decisions
- Terrain is a function of seed and coordinates. Nothing is stored per cell, so the map can be recomputed anywhere.
- Streaming decides which cells are loaded. Nothing is loaded from disk because there is no terrain mesh yet.

## Files changed
- src/world/noise.ts, cells.ts, world.test.ts
- src/game/store/worldBuilderStore.ts
- src/game/ui/WorldBuilderControls.tsx
- (shared: layout.ts, concepts.ts, DialogPanel.tsx)

## Tests
- world.test.ts: noise determinism, range, seed dependence, continuity; biome thresholds; cell flooring for negative coordinates; streaming square size.

## Validation results
Unit tests pass.

## Known issues
- The landmarks are not drawn in the 3D world and do not persist across reloads.
- The seed does not change the 3D terrain (the hub is hand-placed).

## Deferred work
- Generating the 3D terrain from the seed, chunk meshes, and loading and unloading them with streaming.
- Level editor in 3D, and saving layouts.

## Unexpected discoveries
None.

## Exact next phase
PHASE-16 (child mode and accessibility).
