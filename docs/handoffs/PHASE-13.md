# Phase 13 Handoff

## Completed
- Web Observatory panel (near the Web Observatory pillar). It checks ten browser features live and explains the constraint each one solves: WebGL 2, WebGPU, WebAssembly, Web Workers, OffscreenCanvas, SharedArrayBuffer, Pointer Lock, Gamepad API, Web Audio, WebXR.
- pickRenderer chooses WebGPU, then WebGL 2, then none.
- probeEnvironment reads the browser; the rules are pure and tested against a fake window.

## Current repository state
The observatory reports what this browser can do. The 3D view itself still uses WebGL 2 only.

## Architecture decisions
- Probe once when the panel opens, using a lazy state initialiser.
- SharedArrayBuffer counts as available only when the page is cross-origin isolated (the probe checks crossOriginIsolated), which matches the security headers.

## Files changed
- src/web/features.ts, features.test.ts
- src/game/ui/ObservatoryControls.tsx
- (shared: layout.ts, concepts.ts, DialogPanel.tsx)

## Tests
- features.test.ts: renderer choice, feature list, cross-origin explanation, probe with a fake window.

## Validation results
Unit tests pass.

## Known issues
- The WebGPU row can say "available" while the game still renders with WebGL. The panel says which renderer is chosen; the WebGPU renderer itself is not built.

## Deferred work
- WebGPU renderer (see AUDIT.md).

## Unexpected discoveries
None.

## Exact next phase
PHASE-14 (game-feel lab).
