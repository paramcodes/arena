// Pure, seeded placement. The same seed always gives the same forest.

export interface Placement {
  x: number;
  z: number;
  scale: number;
  rotY: number;
}

export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scatterTrees(
  count: number,
  center: { x: number; z: number },
  half: number,
  seed = 7,
): Placement[] {
  const rnd = mulberry32(seed);
  const out: Placement[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: center.x + (rnd() * 2 - 1) * half,
      z: center.z + (rnd() * 2 - 1) * half,
      scale: 0.7 + rnd() * 0.6,
      rotY: rnd() * Math.PI * 2,
    });
  }
  return out;
}
