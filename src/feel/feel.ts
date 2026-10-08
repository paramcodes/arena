// Pure feedback curves. Each one is a function of time since the hit, so it is easy to test.
import { mulberry32 } from '@/game/perf/scatter';

export const FEEL = {
  shakeSec: 0.3,
  hitStopMs: 80,
  recoilSec: 0.5,
  burstSec: 0.8,
  particleCount: 14,
  shakeIntensity: 0.25,
} as const;

// Screen shake: an offset that starts strong and fades to zero by the end.
export function shakeOffset(elapsedSec: number, durationSec: number, intensity: number): { x: number; y: number } {
  if (elapsedSec < 0 || elapsedSec >= durationSec) return { x: 0, y: 0 };
  const decay = 1 - elapsedSec / durationSec;
  return {
    x: intensity * decay * Math.sin(elapsedSec * 47),
    y: intensity * decay * Math.cos(elapsedSec * 53),
  };
}

// Recoil: the object is pushed back fast, then eases to rest.
export function recoilOffset(elapsedSec: number, amount = 0.35): number {
  if (elapsedSec < 0) return 0;
  return -amount * Math.exp(-8 * elapsedSec) * Math.min(1, elapsedSec * 30);
}

export function hitStopActive(nowMs: number, untilMs: number): boolean {
  return nowMs < untilMs;
}

export interface Burst {
  vx: number;
  vy: number;
  vz: number;
}

// Particle velocities for one burst. The same seed always gives the same burst.
export function burstVelocities(count: number, seed: number): Burst[] {
  const rnd = mulberry32(seed);
  const out: Burst[] = [];
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const speed = 1.5 + rnd() * 2.5;
    out.push({ vx: Math.cos(a) * speed, vy: 2 + rnd() * 2, vz: Math.sin(a) * speed });
  }
  return out;
}

// Ballistic position of one particle after t seconds.
export function particlePos(v: Burst, t: number): { x: number; y: number; z: number } {
  return { x: v.vx * t, y: v.vy * t - 0.5 * 9.8 * t * t, z: v.vz * t };
}
