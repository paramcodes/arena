import { create } from 'zustand';

export interface Poi {
  id: number;
  name: string;
  x: number;
  z: number;
}

interface WorldBuilderState {
  seed: number;
  pois: Poi[];
  nextId: number;
  setSeed(seed: number): void;
  addPoi(name: string, x: number, z: number): void;
  removePoi(id: number): void;
}

export const usePoiStore = create<WorldBuilderState>((set, get) => ({
  seed: 1234,
  pois: [],
  nextId: 1,
  setSeed: (seed) => set({ seed: Math.floor(seed) >>> 0 }),
  addPoi: (name, x, z) => {
    const id = get().nextId;
    set({ pois: [...get().pois, { id, name: name.trim() || `POI ${id}`, x, z }], nextId: id + 1 });
  },
  removePoi: (id) => set({ pois: get().pois.filter((p) => p.id !== id) }),
}));
