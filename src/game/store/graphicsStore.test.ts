import { describe, expect, it } from 'vitest';
import { clamp01, useGraphicsStore } from './graphicsStore';

describe('graphics store', () => {
  it('clamps roughness and metalness to 0..1', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.4)).toBe(0.4);
    useGraphicsStore.getState().setRoughness(5);
    expect(useGraphicsStore.getState().roughness).toBe(1);
    useGraphicsStore.getState().setMetalness(-3);
    expect(useGraphicsStore.getState().metalness).toBe(0);
  });
});
