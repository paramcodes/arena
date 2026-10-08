// Feedback timers. Written by attacks, read by the camera and the target each frame.
// Plain module state, so the render loop never waits on React.
import { FEEL } from './feel';

export interface FeelFlags {
  shake: boolean;
  hitStop: boolean;
  recoil: boolean;
  particles: boolean;
}

export const NO_FEEL: FeelFlags = { shake: false, hitStop: false, recoil: false, particles: false };

export const feelState = {
  shakeStartMs: -Infinity,
  shakeIntensity: 0,
  hitStopUntilMs: 0,
  recoilStartMs: -Infinity,
  burstStartMs: -Infinity,
  burstSeed: 1,
};

export function performAttack(flags: FeelFlags, nowMs: number = performance.now()): void {
  if (flags.shake) {
    feelState.shakeStartMs = nowMs;
    feelState.shakeIntensity = FEEL.shakeIntensity;
  }
  if (flags.hitStop) feelState.hitStopUntilMs = nowMs + FEEL.hitStopMs;
  if (flags.recoil) feelState.recoilStartMs = nowMs;
  if (flags.particles) {
    feelState.burstStartMs = nowMs;
    feelState.burstSeed += 1;
  }
}
