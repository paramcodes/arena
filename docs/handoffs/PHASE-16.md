# Phase 16 Handoff

## Completed
- Child mode toggle in the pause menu. It makes text and buttons larger and puts developer words behind a "Developer word" label on every concept card.
- Gamepad: left stick moves, A jumps (edge-triggered). Zeros when no pad is connected.
- Safe failure: falling out of the world puts the player back at the start with a message, and R resets the world.
- Notice panel for short messages, which clears itself after four seconds.
- Keyboard controls were already in place; reduced motion and high contrast from earlier phases are unchanged.

## Current repository state
Child mode changes presentation only. The mission and concept content is the same.

## Architecture decisions
- Child mode is a CSS class plus a switch in ConceptCard, so it does not fork the content.
- Gamepad is read each frame in Player and merged with keyboard axes.
- The fall check runs before movement, so a player who falls cannot keep moving.

## Files changed
- src/game/input/keyboard.ts (readGamepad, clampUnit)
- src/game/scene/Player.tsx (fall respawn, gamepad)
- src/game/store/uiStore.ts (childMode, notice)
- src/game/ui/PauseMenu.tsx, ConceptCard.tsx, GameShell.tsx (notice)
- src/app/globals.css (child mode styles, notice)

## Tests
No new unit tests for gamepad (needs a Gamepad object). Covered by manual review only.

## Validation results
Typecheck and unit tests pass.

## Known issues
- Touch support is not built.
- The gamepad path is untested with real hardware.
- Child mode does not simplify the mission text.

## Deferred work
- Touch controls and a responsive layout.
- Simpler mission wording for child mode.

## Unexpected discoveries
None.

## Exact next phase
PHASE-17 (learning graph).
