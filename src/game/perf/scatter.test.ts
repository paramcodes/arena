import { describe, expect, it } from 'vitest';
import { mulberry32, scatterTrees } from './scatter';

describe('mulberry32', () => {
  it('gives values in [0, 1) and is repeatable for a seed', () => {
    const a = mulberry32(1);
    const b = mulberry32(1);
    for (let i = 0; i < 100; i++) {
      const v = a();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      expect(v).toBe(b());
    }
  });
});

describe('scatterTrees', () => {
  it('returns the requested count, all inside the half-width box', () => {
    const center = { x: -6, z: 50 };
    const trees = scatterTrees(500, center, 9);
    expect(trees).toHaveLength(500);
    for (const t of trees) {
      expect(Math.abs(t.x - center.x)).toBeLessThanOrEqual(9);
      expect(Math.abs(t.z - center.z)).toBeLessThanOrEqual(9);
      expect(t.scale).toBeGreaterThanOrEqual(0.7);
      expect(t.scale).toBeLessThanOrEqual(1.3);
    }
  });

  it('is deterministic for the same seed', () => {
    expect(scatterTrees(50, { x: 0, z: 0 }, 5, 3)).toEqual(scatterTrees(50, { x: 0, z: 0 }, 5, 3));
  });
});
