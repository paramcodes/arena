// Learning progress is saved in the browser. Everything read back is validated with Zod first.
import { z } from 'zod';

export const LearningRecordSchema = z.object({
  status: z.enum(['unseen', 'seen', 'learned']),
  lastDay: z.number().int().nonnegative(),
  reviews: z.number().int().min(0).max(10),
});
export const LearningMapSchema = z.record(z.string().regex(/^[a-z0-9-]+$/), LearningRecordSchema);

export type LearningRecord = z.infer<typeof LearningRecordSchema>;
export type LearningMap = z.infer<typeof LearningMapSchema>;

const KEY = 'gdlw.learning.v1';

export function parseLearning(raw: unknown): LearningMap {
  const parsed = LearningMapSchema.safeParse(raw);
  return parsed.success ? parsed.data : {};
}

export function loadLearning(storage: Storage | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined): LearningMap {
  if (!storage) return {};
  try {
    const text = storage.getItem(KEY);
    return text ? parseLearning(JSON.parse(text)) : {};
  } catch {
    return {};
  }
}

export function saveLearning(records: LearningMap, storage: Storage | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined): void {
  if (!storage) return;
  try {
    storage.setItem(KEY, JSON.stringify(records));
  } catch {
    // Quota exceeded or storage blocked: keep going in memory.
  }
}
