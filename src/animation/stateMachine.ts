// Pure animation state machine for a locomotion character.
// Idle, walk, run, jump, fall, land, attack. The machine decides; the pose functions draw.

export type LocoState = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'land' | 'attack';

export interface AnimInput {
  speed: number;              // metres per second, horizontal
  grounded: boolean;
  verticalVelocity: number;   // positive = rising
  attackRequested: boolean;
}

export interface AnimMachine {
  state: LocoState;
  timeInState: number;        // seconds since the state was entered
}

export const ANIM = {
  landTime: 0.2,
  attackTime: 0.5,
  idleMax: 0.1,
  walkMax: 4,
} as const;

// Returns the next state. Order matters: attack and land hold for their duration first.
export function nextState(m: AnimMachine, input: AnimInput): LocoState {
  const { state, timeInState } = m;
  if (state === 'attack' && timeInState < ANIM.attackTime) return 'attack';
  if (state === 'land' && timeInState < ANIM.landTime && input.grounded) return 'land';
  if (input.attackRequested && state !== 'attack') return 'attack';
  if (!input.grounded) return input.verticalVelocity > 0 ? 'jump' : 'fall';
  if (state === 'jump' || state === 'fall') return 'land';
  if (input.speed < ANIM.idleMax) return 'idle';
  return input.speed < ANIM.walkMax ? 'walk' : 'run';
}

export function stepMachine(m: AnimMachine, input: AnimInput, dt: number): AnimMachine {
  const next = nextState(m, input);
  return next === m.state
    ? { state: m.state, timeInState: m.timeInState + dt }
    : { state: next, timeInState: 0 };
}

// Joint angles in radians. Arms and legs swing from the shoulder or hip.
export interface Pose {
  armL: number;
  armR: number;
  legL: number;
  legR: number;
}

// phase: a running clock for cyclic motion. timeInState: progress inside one-shot states.
export function poseFor(state: LocoState, phase: number, timeInState: number): Pose {
  switch (state) {
    case 'idle': {
      const s = Math.sin(phase * 2) * 0.05;
      return { armL: s, armR: -s, legL: 0, legR: 0 };
    }
    case 'walk':
    case 'run': {
      const amp = state === 'walk' ? 0.5 : 0.9;
      const freq = state === 'walk' ? 4 : 8;
      const s = Math.sin(phase * freq) * amp;
      return { armL: -s, armR: s, legL: s, legR: -s };
    }
    case 'jump':
      return { armL: -2.8, armR: -2.8, legL: 0.5, legR: 0.5 };
    case 'fall':
      return { armL: -1.2, armR: -1.2, legL: 0.3, legR: -0.3 };
    case 'land':
      return { armL: 0.3, armR: 0.3, legL: 0.8, legR: 0.8 };
    case 'attack': {
      const t = Math.min(timeInState, ANIM.attackTime);
      const armR = t < 0.15 ? -0.4 - 2.2 * (t / 0.15) : -2.6 + 3.0 * Math.min(1, (t - 0.15) / 0.35);
      return { armL: 0.2, armR, legL: 0, legR: 0 };
    }
  }
}

export function blendPoses(a: Pose, b: Pose, k: number): Pose {
  const lerp = (x: number, y: number) => x + (y - x) * k;
  return {
    armL: lerp(a.armL, b.armL),
    armR: lerp(a.armR, b.armR),
    legL: lerp(a.legL, b.legL),
    legR: lerp(a.legR, b.legR),
  };
}
