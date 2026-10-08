import { create } from 'zustand';
import { SPAWN } from '../world/layout';

export interface PlayerSnapshot {
  position: [number, number, number];
  velocity: [number, number, number];
  grounded: boolean;
}

interface WorldState {
  wallColliderEnabled: boolean;
  resetSignal: number;
  player: PlayerSnapshot;
  setWallCollider(value: boolean): void;
  setPlayerSnapshot(snapshot: PlayerSnapshot): void;
  resetWorld(): void;
}

export const useWorldStore = create<WorldState>((set) => ({
  wallColliderEnabled: false,
  resetSignal: 0,
  player: { position: [SPAWN[0], SPAWN[1], SPAWN[2]], velocity: [0, 0, 0], grounded: false },
  setWallCollider: (value) => set({ wallColliderEnabled: value }),
  setPlayerSnapshot: (snapshot) => set({ player: snapshot }),
  resetWorld: () => set((s) => ({ resetSignal: s.resetSignal + 1, wallColliderEnabled: false })),
}));
