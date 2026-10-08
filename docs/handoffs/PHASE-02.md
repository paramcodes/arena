# Phase 02 Handoff

## Completed
- Interaction prompt ("Press E: …") when near an interactable.
- Interactables: a welcome sign and a Physics Lab terminal. E opens a dialog; Esc or E closes it.
- World-space markers: interactables glow and show their label when you are near them.
- Dialog panel (semantic HTML outside the canvas) with the terminal's collider on/off controls.
- Top bar with pause and inspector buttons and a visible key-help line.
- Mission panel shell (shown in phase 03).

## Current repository state
GameShell composes the 3D scene with HTML panels. All critical text is in HTML.

## Architecture decisions
- Movement is locked while a dialog is open; the world keeps running.
- The nearest interactable is computed in the player loop and written to a store only when it changes, so the UI does not re-render every frame.
- "Quest marker" from the prompt is covered by the in-world label. A separate quest-marker object is deferred.
- "Mission panel" is delivered in phase 03.

## Files changed
- src/game/ui/GameShell.tsx, TopBar.tsx, InteractionPrompt.tsx, DialogPanel.tsx, PauseMenu.tsx

## Tests
Covered by layout.test.ts (nearest interactable). Dialog and prompt have no unit tests; they will be covered by Playwright once a browser is available.

## Validation results
Typecheck and build pass. Interaction not exercised in a browser (see phase 01).

## Known issues
- Dialog has no focus trap. Focus is not moved into it when it opens.
- Escape closes the dialog first, then toggles pause on the next press.

## Deferred work
- Focus management for the dialog.
- Settings beyond reduce motion and high contrast.

## Unexpected discoveries
None.

## Exact next phase
PHASE-03 (mission framework).

## Commands
npm run dev
