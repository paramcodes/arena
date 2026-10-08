import { describe, expect, it } from 'vitest';
import { CONCEPTS } from './content/concepts';
import { buildEdges, layout, prerequisitesOf, readyToLearn, reviewDue } from './graph';
import { CONCEPT_BY_ID } from './content/concepts';

describe('concept graph', () => {
  it('every edge points at a concept that exists', () => {
    for (const e of buildEdges(CONCEPTS)) {
      expect(CONCEPT_BY_ID.has(e.from)).toBe(true);
      expect(CONCEPT_BY_ID.has(e.to)).toBe(true);
    }
  });

  it('readyToLearn offers only concepts whose prerequisites are all learned', () => {
    const fixed = CONCEPTS.find((c) => c.id === 'fixed-timestep')!;
    expect(prerequisitesOf(fixed)).toContain('game-loop');
    expect(readyToLearn(CONCEPTS, new Set())).not.toContain('fixed-timestep');
    expect(readyToLearn(CONCEPTS, new Set(['game-loop']))).toContain('fixed-timestep');
  });

  it('a learned concept is never offered again as ready', () => {
    expect(readyToLearn(CONCEPTS, new Set(['game-loop']))).not.toContain('game-loop');
  });

  it('layout gives every concept its own position', () => {
    const pos = layout(CONCEPTS);
    expect(pos.size).toBe(CONCEPTS.length);
    const keys = new Set([...pos.values()].map((p) => `${p.x},${p.y}`));
    expect(keys.size).toBe(CONCEPTS.length);
  });
});

describe('review schedule', () => {
  it('first review after 1 day, second after 3, then every 7', () => {
    expect(reviewDue(10, 0, 10)).toBe(false);
    expect(reviewDue(10, 0, 11)).toBe(true);
    expect(reviewDue(10, 1, 12)).toBe(false);
    expect(reviewDue(10, 1, 13)).toBe(true);
    expect(reviewDue(10, 9, 17)).toBe(true);
    expect(reviewDue(10, 9, 16)).toBe(false);
  });
});
