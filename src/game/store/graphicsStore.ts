import { create } from 'zustand';

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

interface GraphicsState {
  roughness: number;
  metalness: number;
  environmentOn: boolean;
  setRoughness(v: number): void;
  setMetalness(v: number): void;
  setEnvironment(v: boolean): void;
}

export const useGraphicsStore = create<GraphicsState>((set) => ({
  roughness: 0.3,
  metalness: 0,
  environmentOn: true,
  setRoughness: (v) => set({ roughness: clamp01(v) }),
  setMetalness: (v) => set({ metalness: clamp01(v) }),
  setEnvironment: (v) => set({ environmentOn: v }),
}));
