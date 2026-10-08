import { create } from 'zustand';
import type { NpcState } from '@/ai/fsm';

interface AiStoreState {
  mode: 'fsm' | 'utility';
  npcHealth: number;
  npcState: NpcState;
  distance: number;
  setMode(m: 'fsm' | 'utility'): void;
  setHealth(h: number): void;
  setNpcState(s: NpcState): void;
  setDistance(d: number): void;
}

export const useAiStore = create<AiStoreState>((set) => ({
  mode: 'fsm',
  npcHealth: 100,
  npcState: 'patrol',
  distance: 99,
  setMode: (m) => set({ mode: m }),
  setHealth: (h) => set({ npcHealth: Math.min(100, Math.max(0, h)) }),
  setNpcState: (s) => set({ npcState: s }),
  setDistance: (d) => set({ distance: d }),
}));
