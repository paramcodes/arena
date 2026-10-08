import { describe, expect, it } from 'vitest';
import { PHYSICS_RANGES, clampTo, usePhysicsStore } from './physicsStore';

describe('physics store', () => {
  it('clamps values into their ranges', () => {
    expect(clampTo(-5, PHYSICS_RANGES.restitution)).toBe(0);
    expect(clampTo(3, PHYSICS_RANGES.restitution)).toBe(1);
    usePhysicsStore.getState().setGravity(100);
    expect(usePhysicsStore.getState().gravity).toBe(20);
  });

  it('dropBall changes the key so the ball remounts', () => {
    const before = usePhysicsStore.getState().dropKey;
    usePhysicsStore.getState().dropBall();
    expect(usePhysicsStore.getState().dropKey).toBe(before + 1);
  });
});
