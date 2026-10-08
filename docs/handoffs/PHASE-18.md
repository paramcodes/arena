# Phase 18 Handoff

## Completed
- Tutor panel (near the tutor pillar). Requests: hint, explain simply, explain technically, compare, quiz me, check my answer.
- Hints come one at a time in order: a question, then the developer word, then a comparison with a related concept. The explanation comes after the third hint.
- "Check my answer" matches the learner's words against keywords from the concept's plain sentence and mechanism.

## Current repository state
The tutor answers from the concept content only. Nothing is generated at run time and nothing is saved as course content.

## Architecture decisions
- This is a rule-based tutor, not a language model. The prompt's "AI tutor" is served by scripted replies built from canonical content. A real model would need an API, a privacy review, and a rule that its output is never saved as course content.
- Replies are pure functions of the concept and the hint count, so they are tested.

## Files changed
- src/tutor/tutor.ts, tutor.test.ts
- src/game/ui/TutorControls.tsx
- (shared: layout.ts, DialogPanel.tsx)

## Tests
- tutor.test.ts: hint ladder order and no early reveal; explanations; compare with and without a neighbour; diagnose with empty, matching, and wrong answers.

## Validation results
Unit tests pass.

## Known issues
- Keyword matching is crude. An answer can be marked "close" without understanding the idea.
- Diagnose gives a hint, not a diagnosis of the misunderstanding.

## Deferred work
- A real model for free-text answers, with the constraints above.

## Unexpected discoveries
- The first keyword rule only used the plain sentence and missed good answers that used the mechanism's words. Both sentences are used now.

## Exact next phase
PHASE-19 (production hardening).
