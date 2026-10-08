import { describe, expect, it } from 'vitest';
import { WALL_MISSION } from '@/knowledge/content/missions';
import { completeStep, isComplete, openSteps, requestHint, startProgress } from './engine';

const m = WALL_MISSION;

describe('mission engine', () => {
  it('starts with nothing done and all steps open', () => {
    const p = startProgress(m);
    expect(isComplete(m, p)).toBe(false);
    expect(openSteps(m, p).length).toBe(4);
  });

  it('completing a step is idempotent and returns the same object when nothing changes', () => {
    const p1 = completeStep(m, startProgress(m), 'walk-through');
    const p2 = completeStep(m, p1, 'walk-through');
    expect(p2).toBe(p1);
    expect(p1.completedSteps).toEqual(['walk-through']);
  });

  it('does not mutate the input progress', () => {
    const p = startProgress(m);
    completeStep(m, p, 'walk-through');
    expect(p.completedSteps).toEqual([]);
  });

  it('completes the mission only when every step is done', () => {
    let p = startProgress(m);
    for (const id of ['walk-through', 'read-terminal', 'enable-collider']) p = completeStep(m, p, id);
    expect(isComplete(m, p)).toBe(false);
    p = completeStep(m, p, 'bump-wall');
    expect(isComplete(m, p)).toBe(true);
  });

  it('throws on unknown step ids', () => {
    expect(() => completeStep(m, startProgress(m), 'nope')).toThrow(/Unknown step/);
  });

  it('serves hints in order and then reports exhaustion', () => {
    const step = 'walk-through';
    let p = startProgress(m);
    const r1 = requestHint(m, p, step);
    expect(r1.text).toBe('Walk straight toward the pale wall.');
    p = r1.progress;
    const r2 = requestHint(m, p, step);
    expect(r2.text).toContain('Keep walking');
    p = r2.progress;
    const r3 = requestHint(m, p, step);
    expect(r3.text).toContain('collider');
    p = r3.progress;
    const r4 = requestHint(m, p, step);
    expect(r4.text).toBeNull();
    expect(r4.exhausted).toBe(true);
  });
});
