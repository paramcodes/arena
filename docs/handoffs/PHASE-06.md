# Phase 06 Handoff

## Completed
- Graphics Forest is open. A lab with one orange sphere and a material panel (near the lab, press E).
- Material panel sliders: roughness and metalness (clamped 0 to 1), environment reflections on/off.
- Environment map: generated from three.js's RoomEnvironment through PMREMGenerator. It needs no network download.
- Concept cards: PBR, roughness, metalness, environment map.

## Current repository state
The material panel changes the sphere live. With environment off and metalness high, the sphere looks nearly black, which is the lesson.

## Architecture decisions
- The environment map is generated in code, not loaded from a CDN. The lab works offline and the build has no network dependency.
- Material values live in a Zustand store, not in React state inside the mesh, so the sliders and the mesh stay in sync.
- Scene graph, shaders, WebGL vs WebGPU: concept content is written but there is no separate lab for them yet. The renderer is WebGL (see the phase 01 handoff).

## Files changed
- src/game/scene/GraphicsLab.tsx
- src/game/store/graphicsStore.ts, graphicsStore.test.ts
- src/game/ui/LabControls.tsx (MaterialControls)
- src/game/ui/DialogPanel.tsx (switch on interactable kind)
- src/game/world/layout.ts (material panel, Graphics Forest open)
- src/knowledge/content/concepts.ts (pbr, roughness, metalness, environment-map)
- src/game/scene/Scene.tsx

## Tests
- graphicsStore.test.ts: clamp rules.
- Visual result (sphere changes with sliders) is not verified in a browser.

## Validation results
Typecheck and unit tests pass. Build status is recorded in the phase 10 handoff.

## Known issues
- Only one sphere. A comparison row with several roughness/metalness values would make the lesson clearer.
- Shadows are on the lab's objects but the main directional light is not set up for shadow maps, so they may not appear.

## Deferred work
- Scene graph, shader, post-processing labs (phase 06 covers PBR and the environment only).
- WebGPU path (phases 06 and 19 in the prompt).

## Unexpected discoveries
- three r169's RoomEnvironment typings resolve without extra setup.

## Exact next phase
PHASE-07 (physics district). Not built in this pass.
