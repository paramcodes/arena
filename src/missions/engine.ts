import type { Mission, Step } from '@/knowledge/schemas';

// Pure mission logic. No React, no stores. Every function returns new progress.

export interface MissionProgress {
  missionId: string;
  completedSteps: string[];
  hintLevels: Record<string, number>;
}

export interface HintResult {
  progress: MissionProgress;
  text: string | null;   // null when the ladder is used up
  exhausted: boolean;
}

export function startProgress(mission: Mission): MissionProgress {
  return { missionId: mission.id, completedSteps: [], hintLevels: {} };
}

export function allSteps(mission: Mission): Array<{ objectiveId: string; step: Step }> {
  return mission.objectives.flatMap((o) => o.steps.map((step) => ({ objectiveId: o.id, step })));
}

function requireStep(mission: Mission, stepId: string): Step {
  const found = allSteps(mission).find((x) => x.step.id === stepId);
  if (!found) throw new Error(`Unknown step "${stepId}" in mission "${mission.id}"`);
  return found.step;
}

export function isStepDone(progress: MissionProgress, stepId: string): boolean {
  return progress.completedSteps.includes(stepId);
}

export function completeStep(mission: Mission, progress: MissionProgress, stepId: string): MissionProgress {
  requireStep(mission, stepId);
  if (progress.completedSteps.includes(stepId)) return progress; // idempotent, same object back
  return { ...progress, completedSteps: [...progress.completedSteps, stepId] };
}

export function isComplete(mission: Mission, progress: MissionProgress): boolean {
  return allSteps(mission).every(({ step }) => isStepDone(progress, step.id));
}

export function openSteps(mission: Mission, progress: MissionProgress): Step[] {
  return allSteps(mission)
    .filter(({ step }) => !isStepDone(progress, step.id))
    .map(({ step }) => step);
}

// Hints go out in order: level 1, then 2, then 3. After the last one, the caller shows the explanation.
export function requestHint(mission: Mission, progress: MissionProgress, stepId: string): HintResult {
  const step = requireStep(mission, stepId);
  const hints = [...step.hints].sort((a, b) => a.level - b.level);
  const shown = progress.hintLevels[stepId] ?? 0;
  if (shown >= hints.length) {
    return { progress, text: null, exhausted: true };
  }
  return {
    progress: { ...progress, hintLevels: { ...progress.hintLevels, [stepId]: shown + 1 } },
    text: hints[shown].text,
    exhausted: false,
  };
}
