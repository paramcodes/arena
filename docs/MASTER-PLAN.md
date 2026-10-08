# Master Plan

The product: a stylized 3D browser hub where a learner plays through districts that teach game development by experiment.

Final goal: a learner with no game-dev vocabulary can say what a collider, game loop, fixed timestep, scene graph, PBR, shader, raycast, NavMesh, animation state machine, LOD, culling, ECS, multiplayer prediction, and WebGPU are, and can describe a game idea precisely enough to build it.

Path: IDEA → VOCABULARY → MENTAL MODEL → SYSTEM → PRECISE PROMPT → IMPLEMENTATION

## Phases

| Phase | Name | Done when |
|---|---|---|
| 00 | Repository contract | Docs and phase files exist and are committed. No game code. |
| 01 | Make the game world | Third-person hub is playable and feels like a tiny game. |
| 02 | Interaction framework | Prompts, inspect, markers, dialog, mission panel, pause/settings work. |
| 03 | Mission framework | Mission, Objective, Step, Hint, Completion, Reward, Unlock exist; one full mission runs. |
| 04 | Vertical slice: Collision | "The Wall That Isn't a Wall" teaches collision end to end. |
| 05 | Simulation engine | Inspectable simulation with play, pause, step, reset, speed. |
| 06 | Graphics district | Transforms, PBR, lighting, camera, shaders, WebGL/WebGPU shown through sliders and toggles. |
| 07 | Physics district | Gravity, rigid bodies, colliders, forces, impulse, friction, restitution, raycast, CCD, character controller, each playable. |
| 08 | Animation district | Clips, blending, crossfade, state machine visualized; Idle/Walk/Run/Jump/Fall/Land/Attack. |
| 09 | AI district | FSM, behavior tree, utility AI, NavMesh, A*, steering; learner switches and observes. |
| 10 | Performance district | Tree counts 100 → 50,000 with real metrics; instancing, LOD, culling, batching taught. |
| 11 | Systems district | Game loop, fixed timestep, ECS, pooling, event bus, data-driven design; systems toggleable. |
| 12 | Multiplayer arena | Latency simulator 0–300ms; snapshot, interpolation, prediction, reconciliation, rollback visualized. |
| 13 | Web observatory | JS, WebGL, WebGPU, Wasm, Workers, OffscreenCanvas, Gamepad, Pointer Lock, Web Audio, WebXR explained by the constraint each solves. |
| 14 | Game-feel lab | Juiced vs plain attack comparison with shake, hit-stop, recoil, particles, trails, sound, slow motion. |
| 15 | World-building lab | Level editor, POIs, triggers, checkpoints, spawns; procedural terrain, seeds, noise, biomes, cell streaming. |
| 16 | Child mode and accessibility | Simplified mode; keyboard, touch, gamepad, reduced motion, high contrast; developer words behind a label. |
| 17 | Learning graph | Missions connected to concepts with prerequisites, mastery, review, unlocks. |
| 18 | AI tutor | Hint, explain simply/technically, compare, quiz, generate challenge, diagnose; ordered hints. |
| 19 | Production hardening | Audit performance, memory, loading, compatibility, WebGPU fallback, a11y, mobile, audio policy, security, tests, observability. Measure before optimizing. |

Each phase is one Claude Code session. Phases do not auto-continue.

## Status (as of this build)

| Phase | Status |
|---|---|
| 00 Repository contract | Done |
| 01 Make the game world | Built; not verified in a browser |
| 02 Interaction framework | Built; not verified in a browser |
| 03 Mission framework | Built; unit tested |
| 04 Vertical slice: Collision | Built; logic unit tested; not verified in a browser |
| 05 Simulation engine | Built; unit tested |
| 06 Graphics district | Partly built: PBR material lab and environment map. Scene graph, shader, and post-processing labs not built. |
| 07–09 | Not built |
| 10 Performance district | Built: instancing vs separate meshes, measured metrics. Culling, LOD, and streaming not built. |
| 11–19 | Not built |

Known deviations from the original prompt are recorded in each phase's handoff. The biggest is that the renderer is WebGL only; WebGPU is deferred.
