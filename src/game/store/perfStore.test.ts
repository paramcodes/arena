import { describe, expect, it } from 'vitest';
import { NAIVE_CAP, effectiveCount } from './perfStore';

describe('effectiveCount', () => {
  it('uses the requested count when instancing is on', () => {
    expect(effectiveCount(50000, true)).toBe(50000);
  });

  it('caps the count when instancing is off', () => {
    expect(effectiveCount(50000, false)).toBe(NAIVE_CAP);
    expect(effectiveCount(100, false)).toBe(100);
  });
});
