// Seeded value noise and fractal noise. Pure: the same seed and coordinates always give the same height.

export function hash2(seed: number, x: number, y: number): number {
  let h = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(x | 0, 0xc2b2ae35) ^ Math.imul(y | 0, 0x27d4eb2f);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

export function valueNoise(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const v00 = hash2(seed, x0, y0);
  const v10 = hash2(seed, x0 + 1, y0);
  const v01 = hash2(seed, x0, y0 + 1);
  const v11 = hash2(seed, x0 + 1, y0 + 1);
  const a = v00 + (v10 - v00) * sx;
  const b = v01 + (v11 - v01) * sx;
  return a + (b - a) * sy;
}

// Several octaves of noise added together. Each octave adds finer detail. Result is in [0, 1].
export function fbm(seed: number, x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(seed + o * 31, x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

export function heightAt(seed: number, x: number, z: number): number {
  return fbm(seed, x * 0.08, z * 0.08, 4);
}

export function moistureAt(seed: number, x: number, z: number): number {
  return fbm(seed + 101, x * 0.06, z * 0.06, 3);
}

export type Biome = 'water' | 'sand' | 'grass' | 'forest' | 'rock' | 'snow';

export const BIOME_COLOR: Record<Biome, string> = {
  water: '#1d4ed8',
  sand: '#fde68a',
  grass: '#86efac',
  forest: '#15803d',
  rock: '#78716c',
  snow: '#f8fafc',
};

export function biomeFor(height: number, moisture: number): Biome {
  if (height < 0.3) return 'water';
  if (height < 0.36) return 'sand';
  if (height > 0.85) return 'snow';
  if (height > 0.72) return 'rock';
  return moisture > 0.55 ? 'forest' : 'grass';
}
