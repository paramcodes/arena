# Phase 12 Handoff

## Completed
- Multiplayer Arena lab (Network panel, near the Multiplayer Arena pillar).
- Latency selector: 0, 50, 100, 200, 300 ms one-way (round trip is twice this).
- Simulated link (src/net/link.ts) delivers messages after a delay, in order.
- Server is authoritative. Client predicts its own movement, keeps unacknowledged inputs, and reconciles on each snapshot.
- Bot is interpolated from snapshots with a 100 ms render delay. Interpolation can be turned off to show the snap.
- "Server pushes you" button moves the server player without telling the client, to show reconciliation fixing a wrong prediction.
- Prediction, reconciliation, and interpolation can each be toggled.
- Concept cards: latency, snapshot, client prediction, reconciliation, interpolation.

## Current repository state
The arena is an SVG drawn outside the 3D canvas. The lab runs on its own clock while the panel is open.

## Architecture decisions
- Time is passed in explicitly, so the link and the lab are deterministic and testable.
- Client and server use the same movement rule. Prediction therefore matches the server unless the server changes state the client does not know about (the push). The reconciliation test uses that case.
- Without prediction, the screen shows the server's state one trip old. The gap is one-way latency times speed, not the round trip. A test documents this.

## Files changed
- src/net/link.ts, arena.ts, net.test.ts
- src/game/ui/MultiplayerControls.tsx
- (shared: layout.ts, concepts.ts, DialogPanel.tsx; see the integration commit)

## Tests
- net.test.ts: link timing and order; lag without prediction; prediction ahead; correction after a push; no correction without reconciliation; arena bounds.

## Validation results
Unit tests pass. The arena has not been looked at in a browser.

## Known issues
- No rollback netcode. Rollback is in the prompt's list and is not built.
- One player and one bot only. No real network: everything runs in the same page.
- Snapshots are sent every tick (20 per second) without compression.

## Deferred work
- Lag compensation, interest management, and rollback.
- A second real client over WebSocket.

## Unexpected discoveries
- My first test expected the gap to equal the round trip. It is one-way latency times speed. The test was corrected.

## Exact next phase
PHASE-13 (web observatory).
