import { create } from 'zustand';

interface UiState {
  paused: boolean;
  inspectorOpen: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  childMode: boolean;
  notice: string | null;
  setChildMode(value: boolean): void;
  notify(message: string): void;
  nearbyId: string | null;
  openInteractionId: string | null;
  setPaused(value: boolean): void;
  togglePause(): void;
  toggleInspector(): void;
  setReducedMotion(value: boolean): void;
  setHighContrast(value: boolean): void;
  setNearby(id: string | null): void;
  openInteraction(id: string | null): void;
}

export const useUiStore = create<UiState>((set, get) => ({
  paused: false,
  inspectorOpen: false,
  reducedMotion: false,
  highContrast: false,
  childMode: false,
  notice: null,
  setChildMode: (value) => set({ childMode: value }),
  notify: (message) => {
    set({ notice: message });
    setTimeout(() => {
      if (get().notice === message) set({ notice: null });
    }, 4000);
  },
  nearbyId: null,
  openInteractionId: null,
  setPaused: (value) => set({ paused: value }),
  togglePause: () => set({ paused: !get().paused }),
  toggleInspector: () => set({ inspectorOpen: !get().inspectorOpen }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setHighContrast: (value) => set({ highContrast: value }),
  setNearby: (id) => set({ nearbyId: id }),
  openInteraction: (id) => set({ openInteractionId: id }),
}));
