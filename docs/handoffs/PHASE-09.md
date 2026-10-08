# Phase 09 Handoff

## Completed
- AI Village: one NPC that patrols, chases, or flees.
- Two decision methods, switchable in the panel:
  - Finite state machine: fixed rules with enter and exit distances (hysteresis so it does not flicker).
  - Utility AI: each option is scored and the highest wins.
- NPC health slider. Low health makes the NPC flee when close.
- Live readouts: state, measured distance to player, utility scores.
- Concept cards: FSM, utility AI.

## Current repository state
AI Village is open. The NPC's colour and label show its state. Switching method and health changes behaviour immediately.

## Architecture decisions
- Both decision methods are pure functions with unit tests. The NPC component only moves the body.
- Movement is kinematic (no physics), so the NPC walks through buildings. Documented as a known issue.
- Hysteresis on distance thresholds stops the state from flickering at the boundary.

## Files changed
- src/ai/fsm.ts, utility.ts, ai.test.ts
- src/game/scene/AiVillage.tsx
- src/game/store/aiStore.ts
- src/game/ui/LabControls.tsx (AiControls), DialogPanel.tsx, src/game/world/layout.ts (AI panel), src/knowledge/content/concepts.ts

## Tests
- ai.test.ts: FSM patrol, chase enter and exit, flee on low health. Utility choice far, near, and hurt, and score range.

## Validation results
Typecheck, unit tests, and build pass. Behaviour in the scene is not verified in a browser.

## Known issues
- The NPC ignores walls and buildings.
- No NavMesh or A* yet, so the NPC cannot route around obstacles.

## Deferred work
- A* pathfinding on a grid and a NavMesh.
- Behaviour trees and steering behaviours (in the prompt's AI list).
- The NPC cannot damage the player; health is only a parameter.

## Unexpected discoveries
- A test I wrote had the wrong expected distance (8 m is outside the 6 m chase range). The test was fixed, not the rule.

## Exact next phase
PHASE-11 (systems district). Not built yet.
