import { describe, expect, it } from 'vitest';
import { parseLearning, loadLearning, saveLearning } from './learningPersist';

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size; },
  } as Storage;
}

describe('learning persistence', () => {
  it('round-trips valid records', () => {
    const s = memoryStorage();
    const data = { 'game-loop': { status: 'learned' as const, lastDay: 5, reviews: 1 } };
    saveLearning(data, s);
    expect(loadLearning(s)).toEqual(data);
  });

  it('ignores corrupted or hostile stored data', () => {
    const s = memoryStorage();
    s.setItem('gdlw.learning.v1', '{"game-loop":{"status":"owned","lastDay":-1}}');
    expect(loadLearning(s)).toEqual({});
    s.setItem('gdlw.learning.v1', 'not json');
    expect(loadLearning(s)).toEqual({});
  });

  it('parseLearning rejects keys that are not concept ids', () => {
    expect(parseLearning({ '<script>': { status: 'seen', lastDay: 1, reviews: 0 } })).toEqual({});
  });

  it('works with no storage at all', () => {
    expect(loadLearning(undefined)).toEqual({});
    expect(() => saveLearning({}, undefined)).not.toThrow();
  });
});
