import { describe, expect, it } from 'vitest';
import { biomeFor, fbm, heightAt, hash2, moistureAt, valueNoise } from './noise';
import { cellKey, cellOf, visibleCells, STREAM_RADIUS } from './cells';

describe('noise', () => {
  it('is deterministic for a seed and coordinates', () => {
    expect(heightAt(42, 10.5, -3.25)).toBe(heightAt(42, 10.5, -3.25));
    expect(hash2(7, 3, 4)).toBe(hash2(7, 3, 4));
  });

  it('gives values in [0, 1] everywhere sampled', () => {
    for (let i = -20; i <= 20; i++) {
      for (let j = -20; j <= 20; j++) {
        const v = fbm(9, i * 1.37, j * 0.91, 4);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('changes with the seed', () => {
    expect(valueNoise(1, 2.5, 3.5)).not.toBe(valueNoise(2, 2.5, 3.5));
  });

  it('is continuous: neighbouring samples are close', () => {
    const a = heightAt(5, 10, 10);
    const b = heightAt(5, 10.01, 10);
    expect(Math.abs(a - b)).toBeLessThan(0.05);
  });
});

describe('biomes', () => {
  it('water is low, snow is high, forest needs moisture', () => {
    expect(biomeFor(0.1, 0.9)).toBe('water');
    expect(biomeFor(0.95, 0.1)).toBe('snow');
    expect(biomeFor(0.5, 0.9)).toBe('forest');
    expect(biomeFor(0.5, 0.1)).toBe('grass');
  });

  it('moisture is also in range', () => {
    const m = moistureAt(3, 1, 1);
    expect(m).toBeGreaterThanOrEqual(0);
    expect(m).toBeLessThanOrEqual(1);
  });
});

describe('cells', () => {
  it('floors correctly for negative coordinates', () => {
    expect(cellOf(-0.5, -4.5)).toEqual({ cx: -1, cz: -2 });
    expect(cellOf(3.99, 4)).toEqual({ cx: 0, cz: 1 });
  });

  it('streams a square of cells around the player', () => {
    const cells = visibleCells({ x: 0, z: 0 });
    const side = 2 * STREAM_RADIUS + 1;
    expect(cells).toHaveLength(side * side);
    expect(new Set(cells.map(cellKey)).size).toBe(side * side);
    expect(cells.map(cellKey)).toContain('0,0');
  });
});
