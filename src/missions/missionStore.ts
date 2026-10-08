import { create } from 'zustand';
import type { Mission } from '@/knowledge/schemas';
import { MISSION_BY_ID } from '@/knowledge/content/missions';
import { completeStep, isComplete, requestHint, startProgress, type MissionProgress } from './engine';

function lookup(missionId: string): Mission {
  const mission = MISSION_BY_ID.get(missionId);
  if (!mission) throw new Error(`Unknown mission "${missionId}"`);
  return mission;
}

interface MissionStoreState {
  progress: Record<string, MissionProgress>;
  unlocked: string[];
  ensure(missionId: string): void;
  complete(missionId: string, stepId: string): void;
  hint(missionId: string, stepId: string): string | null;
  reset(): void;
}

export const useMissionStore = create<MissionStoreState>((set, get) => ({
  progress: {},
  unlocked: [],

  ensure(missionId) {
    if (get().progress[missionId]) return;
    set((s) => ({ progress: { ...s.progress, [missionId]: startProgress(lookup(missionId)) } }));
  },

  complete(missionId, stepId) {
    const mission = lookup(missionId);
    const current = get().progress[missionId] ?? startProgress(mission);
    const next = completeStep(mission, current, stepId);
    if (next === current) return;
    set((s) => ({
      progress: { ...s.progress, [missionId]: next },
      unlocked: isComplete(mission, next)
        ? Array.from(new Set([...s.unlocked, ...mission.unlocks]))
        : s.unlocked,
    }));
  },

  hint(missionId, stepId) {
    const mission = lookup(missionId);
    const current = get().progress[missionId] ?? startProgress(mission);
    const result = requestHint(mission, current, stepId);
    set((s) => ({ progress: { ...s.progress, [missionId]: result.progress } }));
    return result.text;
  },

  reset() {
    set({ progress: {}, unlocked: [] });
  },
}));
