import { describe, expect, it } from 'vitest';
import { wallStepSignals } from './wallWatch';

const wall = { cx: -18, cz: -12, hx: 3, hz: 0.3 };
// front face z = -11.7, back face z = -12.3

describe('wallStepSignals', () => {
  it('reports walk-through when crossing the back face with the collider off', () => {
    expect(wallStepSignals({ x: -18, z: -12.0 }, { x: -18, z: -12.4 }, wall, false)).toEqual(['walk-through']);
  });

  it('does not report walk-through while still in front of the wall', () => {
    expect(wallStepSignals({ x: -18, z: -10 }, { x: -18, z: -10.5 }, wall, false)).toEqual([]);
  });

  it('does not report walk-through when the player is outside the wall span', () => {
    expect(wallStepSignals({ x: -30, z: -12.0 }, { x: -30, z: -12.4 }, wall, false)).toEqual([]);
  });

  it('reports bump-wall when standing against the front face with the collider on', () => {
    const out = wallStepSignals({ x: -18, z: -10 }, { x: -18, z: -11.2 }, wall, true);
    expect(out).toContain('bump-wall');
    expect(out).toContain('enable-collider');
  });

  it('reports enable-collider whenever the collider is on, even far away', () => {
    expect(wallStepSignals({ x: 0, z: 0 }, { x: 0, z: 0 }, wall, true)).toEqual(['enable-collider']);
  });

  it('never reports walk-through with the collider on', () => {
    expect(wallStepSignals({ x: -18, z: -12.0 }, { x: -18, z: -12.4 }, wall, true)).not.toContain('walk-through');
  });
});
