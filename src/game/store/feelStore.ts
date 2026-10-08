import { create } from 'zustand';
import { NO_FEEL, type FeelFlags } from '@/feel/state';

interface FeelStoreState extends FeelFlags {
  attacks: number;
  toggle(key: keyof FeelFlags): void;
  countAttack(): void;
}

export const useFeelStore = create<FeelStoreState>((set, get) => ({
  ...NO_FEEL,
  shake: true,
  hitStop: true,
  recoil: true,
  particles: true,
  attacks: 0,
  toggle: (key) => set({ [key]: !get()[key] } as Partial<FeelStoreState>),
  countAttack: () => set({ attacks: get().attacks + 1 }),
}));
