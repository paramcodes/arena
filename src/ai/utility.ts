// Utility AI: score every option, pick the highest. Compare with fsm.ts, which uses fixed rules.
import type { NpcInput, NpcState } from './fsm';

export interface UtilityScores {
  patrol: number;
  chase: number;
  flee: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function utilityScores(input: NpcInput): UtilityScores {
  const nearness = clamp01(1 - input.distance / 12);   // closer player, higher score
  const hurt = clamp01(1 - input.health / 100);          // lower health, higher score
  return {
    patrol: 0.3,                                         // always a reasonable default
    chase: nearness * (1.2 - hurt * 0.6),                // eager when close, less so when hurt
    flee: hurt * nearness * 1.5 + (input.health < 30 ? 0.2 : 0),
  };
}

export function utilityChoose(input: NpcInput): NpcState {
  const s = utilityScores(input);
  // Ties go to patrol, so the NPC stays calm when nothing is clearly better.
  let best: NpcState = 'patrol';
  let bestScore = s.patrol;
  if (s.chase > bestScore) { best = 'chase'; bestScore = s.chase; }
  if (s.flee > bestScore) { best = 'flee'; }
  return best;
}
