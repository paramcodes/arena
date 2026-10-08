# Production audit

Each row says what was checked and what the result is. "Not measured" means it has not been done yet, and the item is not claimed as done.

| Area | What exists | Status |
|---|---|---|
| Performance | Instancing vs separate meshes; live frame time, draw calls, triangles in the Performance panel | Tools exist. No browser measurement recorded yet. Measure before optimising. |
| Memory | Object pools for projectiles; bounded event history, snapshot history, and log buffer | Bounds are unit tested. No browser memory profile recorded. |
| Asset loading | No external files. Geometry is procedural. Environment map is generated, not downloaded | Nothing to load over the network. |
| Browser compatibility | Feature detection (Web Observatory); fallback message when no WebGL 2 | Tested with a fake window. Not run across real browsers. |
| WebGPU fallback | Renderer choice (pickRenderer) prefers WebGPU, then WebGL 2 | WebGPU renderer itself is NOT implemented. The 3D view uses WebGL 2 in every case. |
| Accessibility | Critical text in HTML outside the canvas; keyboard controls; reduced motion; high contrast; child mode with developer words behind a label | Not audited with a screen reader. Check focus order in dialogs (known gap). |
| Mobile | Nothing specific | Touch controls and responsive layout are NOT built. The panels are not designed for phones. |
| Input modes | Keyboard; gamepad left stick and A button (Gamepad API) | Gamepad is untested with real hardware. Touch is not supported. |
| Audio policy | Web Audio is detected only | No sound is played yet, so no autoplay policy is needed. |
| Security | See docs/SECURITY.md | Headers configured and tested as configuration. Not verified on the deployed host. |
| Testing | 121 unit tests (Vitest); one Playwright smoke test | The smoke test has not been run (no browser in the build environment). |
| Observability | In-memory log; error boundary; window error listeners | No remote error reporting. Logs disappear on reload. |
| Build and CI | Typecheck, test, and build in .github/workflows/ci.yml | CI has not run on GitHub yet. |

## Known gaps before launch
1. Run the Playwright smoke test and the three 3D scenes in a real browser.
2. Build the WebGPU renderer, or remove the claim that WebGPU is supported.
3. Add touch controls and a responsive layout for the panels.
4. Tighten the Content-Security-Policy (nonces instead of unsafe-inline).
5. Record a browser performance profile before tuning anything.
