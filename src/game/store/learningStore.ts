import { create } from 'zustand';
import { REVIEW_DAYS } from '@/knowledge/graph';
import { loadLearning, saveLearning, type LearningRecord, type LearningMap } from './learningPersist';

export const dayNumber = (ms: number = Date.now()): number => Math.floor(ms / 86_400_000);

interface LearningState {
  records: LearningMap;
  markSeen(id: string, day?: number): void;
  markLearned(id: string, day?: number): void;
  markReviewed(id: string, day?: number): void;
  reset(): void;
}

const blank = (day: number): LearningRecord => ({ status: 'unseen', lastDay: day, reviews: 0 });

export const useLearningStore = create<LearningState>((set, get) => ({
  records: loadLearning(),
  markSeen(id, day = dayNumber()) {
    const r = get().records[id] ?? blank(day);
    if (r.status !== 'unseen') return;
    set({ records: { ...get().records, [id]: { ...r, status: 'seen', lastDay: day } } });
  },
  markLearned(id, day = dayNumber()) {
    const r = get().records[id] ?? blank(day);
    if (r.status === 'learned') return;
    set({ records: { ...get().records, [id]: { ...r, status: 'learned', lastDay: day } } });
  },
  markReviewed(id, day = dayNumber()) {
    const r = get().records[id];
    if (!r || r.status !== 'learned') return;
    const reviews = Math.min(r.reviews + 1, REVIEW_DAYS.length);
    set({ records: { ...get().records, [id]: { ...r, reviews, lastDay: day } } });
  },
  reset() {
    set({ records: {} });
  },
}));

// Save whenever the records change. Failures (for example private browsing) are ignored: learning still works in memory.
useLearningStore.subscribe((state) => saveLearning(state.records));
