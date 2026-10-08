import { describe, expect, it } from 'vitest';
import { ConceptSchema, MissionSchema } from './schemas';
import { CONCEPTS, CONCEPT_BY_ID } from './content/concepts';
import { MISSIONS, WALL_MISSION_ID } from './content/missions';

describe('ConceptSchema', () => {
  it('accepts a valid concept', () => {
    const c = ConceptSchema.parse({ id: 'x', name: 'X', plain: 'p', technical: 't', mechanism: 'm', district: 'd' });
    expect(c.related).toEqual([]);
  });

  it('rejects ids with capitals or spaces', () => {
    expect(() => ConceptSchema.parse({ id: 'Bad Id', name: 'X', plain: 'p', technical: 't', mechanism: 'm', district: 'd' })).toThrow();
  });

  it('rejects unknown relation types', () => {
    expect(() =>
      ConceptSchema.parse({
        id: 'x', name: 'X', plain: 'p', technical: 't', mechanism: 'm', district: 'd',
        related: [{ id: 'y', relation: 'loves' }],
      }),
    ).toThrow();
  });
});

describe('MissionSchema', () => {
  const base = {
    id: 'm', title: 'M', district: 'd', intro: 'i', concepts: ['collider'],
    reward: { label: 'r', description: 'd' },
  };

  it('rejects duplicate step ids across objectives', () => {
    expect(() =>
      MissionSchema.parse({
        ...base,
        objectives: [
          { id: 'a', text: 'a', steps: [{ id: 's', text: 's' }] },
          { id: 'b', text: 'b', steps: [{ id: 's', text: 's' }] },
        ],
      }),
    ).toThrow(/duplicate step id/);
  });

  it('requires at least one objective', () => {
    expect(() => MissionSchema.parse({ ...base, objectives: [] })).toThrow();
  });
});

describe('shipped content', () => {
  it('loads and every concept reference resolves', () => {
    expect(CONCEPTS.length).toBeGreaterThan(0);
    for (const m of MISSIONS) {
      for (const c of m.concepts) expect(CONCEPT_BY_ID.has(c)).toBe(true);
    }
  });

  it('wall mission is present with its three objectives', () => {
    const wall = MISSIONS.find((m) => m.id === WALL_MISSION_ID);
    expect(wall?.objectives).toHaveLength(3);
  });

  it('every concept related id exists', () => {
    for (const c of CONCEPTS) {
      for (const r of c.related) expect(CONCEPT_BY_ID.has(r.id)).toBe(true);
    }
  });
});
