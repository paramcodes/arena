import { describe, expect, it } from 'vitest';
import { Simulation, createState, step } from './engine';
import { createBall, gravitySystem, groundSystem } from './systems';

const systems = () => [gravitySystem(9.81), groundSystem(0.6)];

describe('step', () => {
  it('is pure: the input state is not mutated', () => {
    const s0 = createState([createBall(5)]);
    const before = JSON.stringify(s0);
    step(s0, 1 / 60, systems());
    expect(JSON.stringify(s0)).toBe(before);
  });

  it('is deterministic for the same inputs', () => {
    const run = () => {
      let s = createState([createBall(5)]);
      for (let i = 0; i < 300; i++) s = step(s, 1 / 60, systems()).state;
      return s;
    };
    expect(run()).toEqual(run());
  });

  it('advances tick and time', () => {
    const r = step(createState([createBall()]), 0.5, []);
    expect(r.state.tick).toBe(1);
    expect(r.state.time).toBeCloseTo(0.5);
  });

  it('rejects a non-positive dt', () => {
    expect(() => step(createState([createBall()]), 0, [])).toThrow();
  });

  it('a falling ball moves down and gets faster', () => {
    let s = createState([createBall(10)]);
    for (let i = 0; i < 30; i++) s = step(s, 1 / 60, systems()).state;
    const ball = s.entities['ball'];
    expect(ball.position.y).toBeLessThan(10);
    expect(ball.velocity.y).toBeLessThan(0);
  });

  it('a dropped ball bounces, then settles on the floor', () => {
    let s = createState([createBall(3)]);
    const events: string[] = [];
    for (let i = 0; i < 60 * 10; i++) {
      const r = step(s, 1 / 60, systems());
      s = r.state;
      events.push(...r.events.map((e) => e.type));
    }
    expect(events).toContain('bounce');
    expect(events).toContain('settled');
    expect(s.entities['ball'].position.y).toBe(0);
    expect(s.entities['ball'].grounded).toBe(true);
  });
});

describe('Simulation (fixed timestep controller)', () => {
  const make = () => new Simulation(createState([createBall(5)]), systems(), { fixedDt: 1 / 60 });

  it('runs about 6 fixed steps for 0.1 s of frame time', () => {
    const sim = make();
    const n = sim.update(0.1);
    expect(n).toBeGreaterThanOrEqual(5);
    expect(n).toBeLessThanOrEqual(6);
    expect(sim.state.tick).toBe(n);
  });

  it('runs about twice as many steps at 2x speed', () => {
    const sim = make();
    sim.setSpeed(2);
    const n = sim.update(1);
    expect(n).toBeGreaterThanOrEqual(118);
    expect(n).toBeLessThanOrEqual(120);
  });

  it('does not advance while paused', () => {
    const sim = make();
    sim.pause();
    expect(sim.update(1)).toBe(0);
    expect(sim.state.tick).toBe(0);
  });

  it('stepOnce advances exactly one tick and leaves the simulation paused', () => {
    const sim = make();
    sim.stepOnce();
    expect(sim.state.tick).toBe(1);
    expect(sim.paused).toBe(true);
  });

  it('reset returns to the initial state and clears history and events', () => {
    const sim = make();
    sim.update(1);
    sim.reset();
    expect(sim.state.tick).toBe(0);
    expect(sim.events).toHaveLength(0);
    expect(sim.timeline.size).toBe(1);
  });

  it('caps the number of steps per update to avoid a runaway backlog', () => {
    const sim = new Simulation(createState([createBall(5)]), systems(), { fixedDt: 1 / 60, maxStepsPerUpdate: 10 });
    expect(sim.update(60)).toBe(10);
  });

  it('keeps timeline history within its capacity', () => {
    const sim = new Simulation(createState([createBall(5)]), systems(), { fixedDt: 1 / 60, historyCapacity: 20 });
    sim.update(2);
    expect(sim.timeline.size).toBe(20);
  });

  it('rejects a non-positive speed', () => {
    expect(() => make().setSpeed(0)).toThrow();
  });
});
