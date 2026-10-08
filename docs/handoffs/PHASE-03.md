# Phase 03 Handoff

## Completed
- Mission model validated by Zod: Mission, Objective, Step, Hint (levels 1 to 3), Completion, Reward, Unlock.
- Pure mission engine: start, complete step (idempotent), open steps, completion, hint ladder.
- Zustand mission store keyed by mission id.
- One complete mission: "The Wall That Isn't a Wall" (3 objectives, 4 steps, hints for every step).
- Concept cards: each shown in the order plain, developer word, mechanism.
- Mission panel with checklist, hint button, reward, and unlocks (display only).

## Current repository state
MissionPanel is visible on load. Mission progress persists in memory for the session. Reset mission progress is in the pause menu.

## Architecture decisions
- XP is not used. The reward is a label and a description, per the prompt's "do not make XP the primary signal" rule.
- Content is validated at import time, so invalid content throws on startup, not in the middle of play.
- Steps can be completed in any order. The mission finishes when all steps are done.
- The hint ladder ends with concept cards, not an answer.

## Files changed
- src/knowledge/schemas.ts, schemas.test.ts
- src/knowledge/content/concepts.ts, missions.ts
- src/missions/engine.ts, engine.test.ts, missionStore.ts
- src/game/ui/MissionPanel.tsx, ConceptCard.tsx

## Tests
- schemas.test.ts: schema validation, duplicate step ids, relation enum, content references resolve.
- engine.test.ts: idempotent completion, no mutation, completion rule, unknown step, hint ladder.

## Validation results
Vitest: 14 tests pass for this phase.

## Known issues
- Mission panel is absolutely positioned and may overlap the dialog on very small screens.
- Hints are kept per step in memory; they reset on reload.

## Deferred work
- Persisting progress across reloads (needs a Zod-validated storage module; not started).
- Additional missions (the unlock "physics-lab-raycast" is a reference only).

## Unexpected discoveries
- Store keys must be the mission id, not the mission object, so a mission can be looked up from any interactable.

## Exact next phase
PHASE-04 (vertical slice: collision).

## Commands
npx vitest run src/knowledge src/missions
