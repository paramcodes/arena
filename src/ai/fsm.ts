// Finite state machine for one NPC. Pure: same inputs, same state.

export type NpcState = 'patrol' | 'chase' | 'flee';

export interface NpcInput {
  distance: number;   // metres to the player, horizontal
  health: number;     // 0..100
}

export const FSM = {
  chaseEnter: 6,
  chaseExit: 9,
  fleeHealth: 30,
  fleeEnter: 9,
  fleeExit: 12,
} as const;

export function fsmNext(current: NpcState, input: NpcInput): NpcState {
  const { distance, health } = input;
  const fleeRange = current === 'flee' ? FSM.fleeExit : FSM.fleeEnter;
  if (health < FSM.fleeHealth && distance < fleeRange) return 'flee';
  const chaseRange = current === 'chase' ? FSM.chaseExit : FSM.chaseEnter;
  if (distance < chaseRange) return 'chase';
  return 'patrol';
}
