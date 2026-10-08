import { describe, expect, it } from 'vitest';
import { fsmNext } from './fsm';
import { utilityChoose, utilityScores } from './utility';

describe('fsmNext', () => {
  it('patrols when far away', () => {
    expect(fsmNext('patrol', { distance: 20, health: 100 })).toBe('patrol');
  });

  it('starts chasing inside the enter range and keeps chasing inside the exit range', () => {
    expect(fsmNext('patrol', { distance: 5, health: 100 })).toBe('chase');
    expect(fsmNext('chase', { distance: 8, health: 100 })).toBe('chase');
    expect(fsmNext('chase', { distance: 10, health: 100 })).toBe('patrol');
  });

  it('flees when hurt and close', () => {
    expect(fsmNext('patrol', { distance: 8, health: 20 })).toBe('flee');
    expect(fsmNext('patrol', { distance: 5, health: 80 })).toBe('chase');
  });
});

describe('utility AI', () => {
  it('patrols when far, chases when close and healthy', () => {
    expect(utilityChoose({ distance: 20, health: 100 })).toBe('patrol');
    expect(utilityChoose({ distance: 3, health: 100 })).toBe('chase');
  });

  it('flees when close and badly hurt', () => {
    expect(utilityChoose({ distance: 3, health: 20 })).toBe('flee');
  });

  it('scores stay in a sensible range', () => {
    const s = utilityScores({ distance: 0, health: 0 });
    expect(s.chase).toBeGreaterThanOrEqual(0);
    expect(s.flee).toBeLessThanOrEqual(2);
  });
});
