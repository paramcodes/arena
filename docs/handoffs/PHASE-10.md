# Phase 10 Handoff

## Completed
- Performance Mine is open. A panel lets you choose 100, 1,000, 10,000, or 50,000 trees.
- Instancing toggle: one InstancedMesh (one draw call) vs. one mesh per tree. Separate trees are capped at 2,000 so the page stays usable.
- Measured values, updated about twice a second: frames per second, frame time, draw calls and triangles from the last frame (from the renderer's own counters).
- Concept cards: draw call, instancing, frame time.
- Tree placement is seeded and deterministic (src/game/perf/scatter.ts).

## Current repository state
The panel reads from the renderer. The numbers are real, not simulated. They depend on the browser and machine.

## Architecture decisions
- Metrics are measured in the render loop (PerfProbe) and written to a store, not computed from a model.
- Draw calls and triangles come from `gl.info.render`, read in useFrame. They describe the last rendered frame.
- The separate-mesh mode is capped, not removed, because the cap is itself the lesson. The UI says so.
- Only the listed counts are offered. Frustum culling, LOD, and batching are not yet demonstrated. They are in the concept list for later.

## Files changed
- src/game/scene/PerformanceLab.tsx (lab + PerfProbe)
- src/game/store/perfStore.ts, perfStore.test.ts
- src/game/perf/scatter.ts, scatter.test.ts
- src/game/ui/LabControls.tsx (PerformanceControls)
- src/game/world/layout.ts (performance panel, Performance Mine open)

## Tests
- perfStore.test.ts: effective count with and without instancing.
- scatter.test.ts: seeded RNG range and repeatability, bounds, count, determinism.

## Validation results
Typecheck and unit tests pass (43 total in the repo). Not verified in a browser: whether 50,000 instanced trees hold a usable frame rate on a given GPU. That needs a real measurement.

## Known issues
- Frame time includes time spent outside the GPU, such as vsync. On a 60 Hz display the numbers may plateau near 16.7 ms even when the scene is cheap.
- Triangles are counted for the last frame only; the value is not averaged.

## Deferred work
- Frustum culling, LOD, and cell streaming demonstrations (later performance and world-building phases).
- Visible overdraw view.

## Unexpected discoveries
- R3F recreates an instancedMesh when its args change, so the instance count is set through args and the matrices are written in a layout effect that depends on the placements.

## Exact next phase
PHASE-11 (systems district). Not built in this pass.
