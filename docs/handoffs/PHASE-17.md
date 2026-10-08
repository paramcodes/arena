# Phase 17 Handoff

## Completed
- Concept graph (src/knowledge/graph.ts): edges, prerequisites (depends_on), readyToLearn, layout by district, spaced review (1, 3, 7 days).
- Learning state per concept: unseen, seen (card opened), learned (mission containing it completed).
- Learning progress is saved in localStorage and validated with Zod on load. Corrupt or hostile data is discarded.
- Learning map panel (near the learning panel): SVG graph with colours by status, "ready to learn" list, and review buttons for concepts that are due.
- XP is not used. Progress is the state of each concept.

## Current repository state
Finishing the wall mission marks its concepts learned. Reading a card marks the concept seen. Progress survives reloads in the same browser.

## Architecture decisions
- Persistence lives in learningPersist.ts, which takes an optional storage argument so it can be tested without a browser.
- Records keyed by concept id are validated with a regex, so a stored key cannot inject anything.
- missionStore calls the learning store when a mission finishes. The learning store does not import the mission store, so there is no cycle.

## Files changed
- src/knowledge/graph.ts, graph.test.ts
- src/game/store/learningStore.ts, learningPersist.ts, learning.test.ts
- src/game/ui/LearningMapControls.tsx
- (shared: ConceptCard.tsx, missionStore.ts, layout.ts, DialogPanel.tsx)

## Tests
- graph.test.ts: edges resolve, readiness, layout uniqueness, review schedule.
- learning.test.ts: round trip, corrupt data, bad keys, no storage.

## Validation results
Unit tests pass.

## Known issues
- Only mission completion marks a concept learned. Reading a card alone does not.
- The review buttons appear when the schedule says so; there is no notification.

## Deferred work
- A review queue shown across sessions, and mastery levels beyond three states.

## Unexpected discoveries
None.

## Exact next phase
PHASE-18 (AI tutor).
