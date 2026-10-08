import { create } from 'zustand';

export const PERF_COUNTS = [100, 1000, 10000, 50000] as const;
// Without instancing, each tree is a separate mesh. Cap that so the page stays usable.
export const NAIVE_CAP = 2000;

export function effectiveCount(count: number, instanced: boolean): number {
  return instanced ? count : Math.min(count, NAIVE_CAP);
}

export interface PerfMetrics {
  fps: number;
  frameMs: number;
  drawCalls: number;
  triangles: number;
}

interface PerfState extends PerfMetrics {
  count: number;
  instanced: boolean;
  setCount(n: number): void;
  setInstanced(v: boolean): void;
  setMetrics(m: PerfMetrics): void;
}

export const usePerfStore = create<PerfState>((set) => ({
  count: 1000,
  instanced: true,
  fps: 0,
  frameMs: 0,
  drawCalls: 0,
  triangles: 0,
  setCount: (n) => set({ count: n }),
  setInstanced: (v) => set({ instanced: v }),
  setMetrics: (m) => set(m),
}));
