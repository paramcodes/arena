import { describe, expect, it } from 'vitest';
import { CONCEPT_BY_ID } from '@/knowledge/content/concepts';
import { tutorReply } from './tutor';

const fixed = CONCEPT_BY_ID.get('fixed-timestep')!;
const loop = CONCEPT_BY_ID.get('game-loop')!;

describe('tutor hint ladder', () => {
  it('first hint is a question and does not reveal the mechanism', () => {
    const r = tutorReply('hint', fixed, { hintsGiven: 0 });
    expect(r.text).toContain('Think about');
    expect(r.text).not.toContain(fixed.mechanism);
    expect(r.nextHintLevel).toBe(1);
  });

  it('hints get more specific in order, then the explanation comes last', () => {
    const h2 = tutorReply('hint', fixed, { hintsGiven: 1 });
    expect(h2.text).toContain(fixed.technical);
    const h3 = tutorReply('hint', fixed, { hintsGiven: 2, neighbour: loop });
    expect(h3.text).toContain(loop.name);
    const done = tutorReply('hint', fixed, { hintsGiven: 3 });
    expect(done.text).toContain(fixed.mechanism);
  });
});

describe('tutor explanations', () => {
  it('explain simply gives the plain words, technically gives the developer word and mechanism', () => {
    expect(tutorReply('explain-simply', fixed, { hintsGiven: 0 }).text).toBe(fixed.plain);
    expect(tutorReply('explain-technically', fixed, { hintsGiven: 0 }).text).toContain(fixed.mechanism);
  });

  it('compare needs a neighbour and says so when there is none', () => {
    expect(tutorReply('compare', fixed, { hintsGiven: 0 }).text).toMatch(/no closely related/i);
    expect(tutorReply('compare', fixed, { hintsGiven: 0, neighbour: loop }).text).toContain(loop.name);
  });
});

describe('tutor diagnose', () => {
  it('asks for an answer when none was given', () => {
    expect(tutorReply('diagnose', fixed, { hintsGiven: 0, answer: '   ' }).text).toMatch(/type an answer/i);
  });

  it('accepts an answer that uses the key ideas', () => {
    const answer = 'It runs in equal steps, so results do not depend on the frame rate.';
    expect(tutorReply('diagnose', fixed, { hintsGiven: 0, answer }).text).toMatch(/close/i);
  });

  it('gives a hint for an answer that misses the idea', () => {
    expect(tutorReply('diagnose', fixed, { hintsGiven: 0, answer: 'pizza' }).text).toMatch(/not quite/i);
  });
});
