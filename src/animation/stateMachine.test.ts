import { describe, expect, it } from 'vitest';
import { ANIM, blendPoses, nextState, poseFor, stepMachine, type AnimMachine, type AnimInput } from './stateMachine';

const grounded = (speed: number, extra: Partial<AnimInput> = {}): AnimInput => ({
  speed, grounded: true, verticalVelocity: 0, attackRequested: false, ...extra,
});
const at = (state: AnimMachine['state'], timeInState = 0): AnimMachine => ({ state, timeInState });

describe('nextState', () => {
  it('idles when still and grounded', () => {
    expect(nextState(at('idle'), grounded(0))).toBe('idle');
  });

  it('walks at moderate speed and runs when fast', () => {
    expect(nextState(at('idle'), grounded(2))).toBe('walk');
    expect(nextState(at('walk'), grounded(6))).toBe('run');
  });

  it('jumps when rising in the air and falls when descending', () => {
    expect(nextState(at('walk'), { ...grounded(2), grounded: false, verticalVelocity: 3 })).toBe('jump');
    expect(nextState(at('jump'), { ...grounded(2), grounded: false, verticalVelocity: -1 })).toBe('fall');
  });

  it('lands after falling, and holds the land state for its duration', () => {
    expect(nextState(at('fall'), grounded(0))).toBe('land');
    expect(nextState(at('land', 0.05), grounded(0))).toBe('land');
    expect(nextState(at('land', ANIM.landTime), grounded(0))).toBe('idle');
  });

  it('starts an attack from idle and returns to movement after it ends', () => {
    expect(nextState(at('idle'), grounded(0, { attackRequested: true }))).toBe('attack');
    expect(nextState(at('attack', 0.1), grounded(0))).toBe('attack');
    expect(nextState(at('attack', ANIM.attackTime), grounded(0))).toBe('idle');
  });

  it('ignores an attack request while already attacking', () => {
    expect(nextState(at('attack', ANIM.attackTime), grounded(0, { attackRequested: true }))).toBe('idle');
  });
});

describe('stepMachine', () => {
  it('resets the timer on a state change and accumulates it otherwise', () => {
    const a = stepMachine(at('idle', 0.5), grounded(2), 0.1);
    expect(a.state).toBe('walk');
    expect(a.timeInState).toBe(0);
    const b = stepMachine(a, grounded(2), 0.1);
    expect(b.timeInState).toBeCloseTo(0.1);
  });
});

describe('poses', () => {
  it('walk and run swing the limbs in opposition', () => {
    const p = poseFor('walk', 1, 0);
    expect(p.legL).toBeCloseTo(-p.legR);
    expect(p.armL).toBeCloseTo(-p.legL);
  });

  it('run swings further than walk at the same phase', () => {
    expect(Math.abs(poseFor('run', 0.3, 0).legL)).toBeGreaterThan(Math.abs(poseFor('walk', 0.3, 0).legL));
  });

  it('blendPoses at k=0 keeps a, at k=1 gives b', () => {
    const a = poseFor('idle', 0, 0);
    const b = poseFor('jump', 0, 0);
    expect(blendPoses(a, b, 0)).toEqual(a);
    expect(blendPoses(a, b, 1)).toEqual(b);
  });
});
