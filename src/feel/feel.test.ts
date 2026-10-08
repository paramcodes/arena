import { describe, expect, it } from 'vitest';
import { burstVelocities, hitStopActive, particlePos, recoilOffset, shakeOffset } from './feel';
import { performAttack, feelState, NO_FEEL } from './state';

describe('shakeOffset', () => {
  it('is zero before and after the shake', () => {
    expect(shakeOffset(-0.1, 0.3, 0.25)).toEqual({ x: 0, y: 0 });
    expect(shakeOffset(0.3, 0.3, 0.25)).toEqual({ x: 0, y: 0 });
  });

  it('starts strong and decays', () => {
    const early = Math.hypot(...Object.values(shakeOffset(0.01, 0.3, 0.25)));
    const late = Math.hypot(...Object.values(shakeOffset(0.25, 0.3, 0.25)));
    expect(early).toBeGreaterThan(late);
    expect(early).toBeLessThanOrEqual(0.25 + 1e-9);
  });
});

describe('recoil and hit stop', () => {
  it('recoil pushes back, then returns toward zero', () => {
    expect(recoilOffset(0.02)).toBeLessThan(0);
    expect(Math.abs(recoilOffset(0.5))).toBeLessThan(Math.abs(recoilOffset(0.05)));
  });

  it('hit stop is active only before its end time', () => {
    expect(hitStopActive(100, 180)).toBe(true);
    expect(hitStopActive(180, 180)).toBe(false);
  });
});

describe('particles', () => {
  it('a burst is the same for the same seed', () => {
    expect(burstVelocities(14, 3)).toEqual(burstVelocities(14, 3));
    expect(burstVelocities(14, 3)).toHaveLength(14);
  });

  it('particles fall back down under gravity', () => {
    const p = particlePos({ vx: 0, vy: 2, vz: 0 }, 1);
    expect(p.y).toBeLessThan(2);
  });
});

describe('performAttack', () => {
  it('sets only the timers whose flags are on', () => {
    feelState.shakeStartMs = -Infinity;
    feelState.recoilStartMs = -Infinity;
    performAttack({ ...NO_FEEL, recoil: true }, 1000);
    expect(feelState.recoilStartMs).toBe(1000);
    expect(feelState.shakeStartMs).toBe(-Infinity);
  });

  it('a plain attack changes nothing', () => {
    const before = { ...feelState };
    performAttack(NO_FEEL, 5000);
    expect(feelState).toEqual(before);
  });
});
