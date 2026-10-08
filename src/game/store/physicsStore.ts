import { create } from 'zustand';

export const PHYSICS_RANGES = {
  gravity: [0.5, 20],
  restitution: [0, 1],
  friction: [0, 1],
} as const;

export const clampTo = (v: number, [lo, hi]: readonly [number, number]): number => Math.min(hi, Math.max(lo, v));

interface PhysicsState {
  gravity: number;        // magnitude, m/s^2, pulls down
  restitution: number;    // bounciness 0..1
  friction: number;       // grip 0..1
  dropKey: number;        // bump to drop the ball again
  rayDistance: number;    // measured by the turret's raycast, metres
  setGravity(v: number): void;
  setRestitution(v: number): void;
  setFriction(v: number): void;
  dropBall(): void;
  setRayDistance(v: number): void;
}

export const usePhysicsStore = create<PhysicsState>((set, get) => ({
  gravity: 9.81,
  restitution: 0.6,
  friction: 0.5,
  dropKey: 0,
  rayDistance: 0,
  setGravity: (v) => set({ gravity: clampTo(v, PHYSICS_RANGES.gravity) }),
  setRestitution: (v) => set({ restitution: clampTo(v, PHYSICS_RANGES.restitution) }),
  setFriction: (v) => set({ friction: clampTo(v, PHYSICS_RANGES.friction) }),
  dropBall: () => set({ dropKey: get().dropKey + 1 }),
  setRayDistance: (v) => set({ rayDistance: v }),
}));
