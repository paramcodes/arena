# Architecture

## Layers

1. **Knowledge layer** (pure TypeScript, no rendering imports): Concept, Mission, Simulation, Challenge, Evidence, Source, Skill, UserProgress. Content is data validated by Zod schemas.
2. **Simulation layer** (pure TypeScript): fixed-timestep step function over SimulationState. Entities are plain data. Inspectable and replayable. Deterministic given a seed and input history.
3. **Projection layer** (React Three Fiber, HTML overlays): reads simulation state and draws it. Holds no authoritative state.
4. **Explanation layer** (semantic HTML): lesson text, panels, hints, vocabulary. Lives outside the canvas.
5. **Tutor layer** (AI, advisory): receives current mission, concept, neighbor concepts, history, and attempts; returns hints or explanations. Output is validated and never written to canonical content.

## State

- Simulation truth: SimulationState (pure).
- UI and exploration state: Zustand.
- Persistent learner data: UserProgress, saved through one typed, Zod-validated module.

## Rendering

- Renderer: WebGPU when available, WebGL fallback. Detected at startup; the choice is logged to the debug overlay.
- Physics: Rapier via @react-three/rapier, stepped at a fixed timestep.
- Performance features (instancing, LOD, culling, cell streaming) are introduced in the districts where they are taught and used throughout the world.

## Reference anchors (re-check at implementation time)

- React Three Fiber WebGPU/TSL: https://r3f.docs.pmnd.rs/next/webgpu/overview
- Three.js manual: https://threejs.org/manual/
- Rapier: https://rapier.rs/
- React Three Rapier: https://github.com/pmndrs/react-three-rapier
- Motion: https://motion.dev/docs/react
- Phaser 4 (only if a 2D mission needs it): https://phaser.io/phaser4
- MDN WebGPU: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- MDN Pointer Lock: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
- MDN Gamepad: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
- MDN Web Audio: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Khronos glTF: https://registry.khronos.org/glTF/
- Unity Entities/ECS: https://docs.unity3d.com/Manual/com.unity.entities.html
- Unreal Gameplay Framework: https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine
