# Production audit

Each row says what was checked and what the result is. "Not measured" means it has not been done yet, and the item is not claimed as done.

| Area | What exists | Status |
|---|---|---|
| Performance | Instancing vs separate meshes; live frame time, draw calls, triangles in the Performance panel | Draw calls measured in headless Chromium: instanced draw calls stayed at 34 from 100 to 50,000 trees; separate meshes are culled out of view. Frame times NOT measured (software renderer, not representative). |
| Memory | Object pools for projectiles; bounded event history, snapshot history, and log buffer | Bounds are unit tested. No browser memory profile recorded. |
| Asset loading | No external files. Geometry is procedural. Environment map is generated, not downloaded | Nothing to load over the network. |
| Browser compatibility | Feature detection (Web Observatory); fallback message when no WebGL 2 | Checked in headless Chromium (WebGL 2 available). Not yet run in Firefox or Safari. |
| WebGPU fallback | Observatory reports WebGPU; the game renders with WebGL 2 | WebGPU renderer is NOT implemented. Open item. |
| Accessibility | Critical text in HTML outside the canvas; keyboard controls; reduced motion; high contrast; child mode with developer words behind a label | Not audited with a screen reader. Check focus order in dialogs (known gap). |
| Mobile | On-screen touch controls (d-pad, jump, interact) on touch screens; panels stack on narrow screens | Checked in headless Chromium with a phone-sized viewport: controls visible, forward button moves the player. Not tested on a real phone. |
| Input modes | Keyboard; gamepad left stick and A button; touch d-pad | Touch verified in headless Chromium. Gamepad untested with real hardware. |
| Audio policy | Web Audio is detected only | No sound is played yet, so no autoplay policy is needed. |
| Security | See docs/SECURITY.md | Per-request nonce policy: no unsafe-inline or unsafe-eval for scripts in production. Styles keep unsafe-inline (inline style attributes). Verified in headless Chromium with no console errors. Not verified on the deployed host. |
| Testing | 134 unit tests (Vitest); 5 browser tests (Playwright, headless Chromium) | All pass locally. CI runs both in separate jobs (browser job not yet run on GitHub). |
| Observability | In-memory log; error boundary; window error listeners | No remote error reporting. Logs disappear on reload. |
| Build and CI | Typecheck, unit tests, build; then browser tests in a separate job, with the report uploaded on failure (.github/workflows/ci.yml) | Not yet run on GitHub. |

## Known gaps before launch
1. Build the WebGPU renderer, or keep the observatory's honest "not used" wording.
2. Record frame times on real GPU hardware (headless software rendering is not representative).
3. Test in Firefox and Safari, and on a real phone.
4. The CI browser job (.github/workflows/ci.yml) is written and runs the same command that passes locally. It has not run on GitHub yet. The first GitHub run is the check. Headless runners use SwiftShader for WebGL, so timings may differ.
