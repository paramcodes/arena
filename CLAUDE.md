# CLAUDE.md — Game Development Learning World

## What this project is

A game-like web learning world that teaches game development by letting the learner play with the systems. A stylized 3D hub links to "districts" (Graphics, Physics, Animation, AI, Performance, Systems, Multiplayer, Web Platform, Game Feel, World Building). Each district teaches through experiments, not text.

Target learners: complete beginners, frontend developers moving into 3D, programmers learning real-time systems, and children with no technical vocabulary.

Core principle: do not build a course with game decorations. Build a small game whose mechanics teach the concepts.

## Learning loop (every lesson follows this)

experience → problem → curiosity → explanation → experiment → challenge → unlock → recall

## Session protocol (mandatory)

Every Claude Code session follows this order:

1. Read this file (CLAUDE.md).
2. Read ONLY the current phase file in `docs/phases/PHASE-XX.md`.
3. Read the previous handoff in `docs/handoffs/` only if needed.
4. Inspect the relevant code.
5. Implement ONLY this phase. Do not start the next phase.
6. Run tests (`npm test`, and Playwright where interaction matters).
7. Do manual interaction validation where appropriate.
8. Write `docs/handoffs/PHASE-XX.md` using `docs/HANDOFF-TEMPLATE.md`.
9. Commit with message `phase-XX: <short summary>`.
10. STOP. Never automatically continue into the next phase.

Out-of-scope ideas go in `docs/future.md`, not into the code.

## Stack

- Next.js, React, TypeScript (strict), Tailwind CSS
- React Three Fiber, Three.js, @react-three/drei, @react-three/rapier
- Motion (UI and game-feel animation), Zustand (UI/exploration state only), Zod (validate data at boundaries)
- SVG / Canvas; D3 only for real quantitative simulations or charts
- Web Audio API
- Vitest (unit), Playwright (interaction)

Rules:
- Support WebGPU when available, fall back to WebGL. Never make WebGPU mandatory.
- Do NOT add Phaser by default. Only for a dedicated 2D mission, and never for the primary 3D world.
- Do NOT add Sigma.js or other WebGL graph libraries until a measured need exists.

## Architecture rules

- Canonical knowledge is independent of rendering. Entities: Concept, Mission, Simulation, Challenge, Evidence, Source, Skill, UserProgress.
- Concepts relate through: prerequisite, causes, mitigates, alternative, depends_on, observed_by.
- Rendering is a projection of simulation state. Simulation is the execution layer. AI is advisory.
- Zustand holds UI and exploration state, never the canonical simulation truth.
- Validate all external data (content files, saved progress, AI output) with Zod.
- The world uses the concepts it teaches (instancing for repeated scenery, LOD for distant objects, pooling for projectiles/effects, cell streaming for the world). Do not teach a concept with a fake version of it.

## Learning content rules

- Never begin a lesson with jargon. Reveal in this order: experience → plain language → technical name → deeper mechanism.
- Critical learning information lives in semantic HTML outside the canvas. The 3D canvas provides spatial experience; HTML provides readable, accessible explanation.
- Child mode uses simple language, large controls, minimal reading, and reveals technical terms only behind a "Developer word" label.
- Every mission must satisfy: can I interact with it, break it, see what changed, restore it, explain why it changed, and name the developer concept afterward? If not, improve the mission.
- Each major system gets a BREAK IT mode and a FIX IT flow (Symptom → Hypothesis → Evidence → Verification → Fix → Result).
- AI-generated content must not silently become canonical content. The AI tutor gives hints in order (Hint 1 → Hint 2 → Hint 3 → Explanation) and does not give answers immediately.
- XP is never the primary learning signal. Reward experimentation and understanding (mastery, review, unlocks).
- Debug overlay values must be real measurements where available. Label simulated metrics as "simulated".

## Code and file rules

- When writing code, always state the exact file path it belongs in.
- Prefer small, named modules over large files.
- No browser storage APIs in anything that must persist across environments without a stated reason; progress persistence goes through a single typed, Zod-validated module.
- Do not add dependencies not listed in the stack without recording the reason in the handoff.
- Re-check library versions and browser support at implementation time (see the anchors in `docs/ARCHITECTURE.md`). Do not rely on memory for APIs.

## Testing expectations

- Pure logic (simulation step, state transitions, Zod schemas, mission completion) → Vitest.
- Every mission's happy path and its break/fix path → Playwright.
- Performance claims must come from measurement, not assumption.

## Documents

- `docs/MASTER-PLAN.md`: phases, goals, and the definition of success for each.
- `docs/ARCHITECTURE.md`: system design, stack decisions, data model, rendering pipeline.
- `docs/DOMAIN.md`: the concept vocabulary and how concepts relate.
- `docs/DEVELOPMENT.md`: setup, commands, conventions.
- `docs/HANDOFF-TEMPLATE.md`: template for end-of-phase handoffs.
- `docs/future.md`: out-of-scope ideas.
- `docs/phases/`: one file per phase (PHASE-00 to PHASE-19).
- `docs/handoffs/`: one handoff per completed phase.
