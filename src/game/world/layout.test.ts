import { describe, expect, it } from 'vitest';
import { INTERACTABLES, nearestInteractable } from './layout';

describe('nearestInteractable', () => {
  it('finds the terminal when standing next to it', () => {
    const term = INTERACTABLES.find((i) => i.id === 'collider-terminal')!;
    expect(nearestInteractable(term.position[0] + 0.5, term.position[2])?.id).toBe('collider-terminal');
  });

  it('returns null far from everything', () => {
    expect(nearestInteractable(100, 100)).toBeNull();
  });

  it('every interactable has a mission step reference or none at all', () => {
    for (const it of INTERACTABLES) {
      if (it.mission) expect(it.mission.stepId).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
