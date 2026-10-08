import { create } from 'zustand';
import type { LocoState } from '@/animation/stateMachine';

// The lab's "controller": buttons set targets here, the character reads them each frame.
// Pulses are counters, so pressing the same button twice still registers.
interface AnimStoreState {
  speed: number;
  jumpPulse: number;
  attackPulse: number;
  current: LocoState;
  setSpeed(v: number): void;
  pulseJump(): void;
  pulseAttack(): void;
  setCurrent(s: LocoState): void;
}

export const useAnimStore = create<AnimStoreState>((set, get) => ({
  speed: 0,
  jumpPulse: 0,
  attackPulse: 0,
  current: 'idle',
  setSpeed: (v) => set({ speed: Math.max(0, v) }),
  pulseJump: () => set({ jumpPulse: get().jumpPulse + 1 }),
  pulseAttack: () => set({ attackPulse: get().attackPulse + 1 }),
  setCurrent: (s) => set({ current: s }),
}));
