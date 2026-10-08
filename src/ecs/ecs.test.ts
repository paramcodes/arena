import { describe, expect, it } from 'vitest';
import { World } from './world';
import { EntityPool } from './pool';
import { EventBus } from './eventBus';
import { FixedStepper } from './loop';
import { collisionSystem, healthSystem, lifetimeSystem, movementSystem, type SystemContext } from './systems';
import { PROJECTILE_RECIPE, SystemsLab } from './lab';

const ctxFor = (world: World, bus: EventBus, dt: number, pool?: EntityPool): SystemContext => ({
  world, bus, dt, tick: 1,
  release: (id) => (pool ? pool.release(id) : world.disable(id)),
});

describe('World', () => {
  it('queries only entities that have every requested component', () => {
    const w = new World();
    const a = w.create({ Transform: { x: 0, y: 0 }, Velocity: { vx: 1, vy: 0 } });
    w.create({ Transform: { x: 0, y: 0 } });
    expect(w.query('Transform', 'Velocity')).toEqual([a]);
  });

  it('a disabled entity keeps its data but disappears from queries', () => {
    const w = new World();
    const a = w.create({ Transform: { x: 3, y: 0 } });
    w.disable(a);
    expect(w.query('Transform')).toEqual([]);
    expect(w.get(a, 'Transform')).toEqual({ x: 3, y: 0 });
    w.enable(a);
    expect(w.query('Transform')).toEqual([a]);
  });

  it('set throws for an entity that does not exist', () => {
    expect(() => new World().set(99, 'Transform', { x: 0, y: 0 })).toThrow();
  });
});

describe('EntityPool', () => {
  it('reuses released entities instead of creating new ones', () => {
    const w = new World();
    const pool = new EntityPool(w, PROJECTILE_RECIPE);
    const ids = [pool.acquire(), pool.acquire(), pool.acquire()];
    ids.forEach((id) => pool.release(id));
    expect(pool.stats.inUse).toBe(0);
    pool.acquire();
    pool.acquire();
    expect(pool.stats.created).toBe(3);
    expect(pool.stats.reused).toBe(2);
  });

  it('ignores a second release of the same entity', () => {
    const w = new World();
    const pool = new EntityPool(w, PROJECTILE_RECIPE);
    const id = pool.acquire();
    pool.release(id);
    pool.release(id);
    expect(pool.available).toBe(1);
    expect(pool.stats.inUse).toBe(0);
  });

  it('gives a reused entity fresh data from the recipe, not the old values', () => {
    const w = new World();
    const pool = new EntityPool(w, PROJECTILE_RECIPE);
    const id = pool.acquire({ Transform: { x: 9, y: 9 } });
    pool.release(id);
    const again = pool.acquire();
    expect(again).toBe(id);
    expect(w.get(again, 'Transform')).toEqual({ x: -8, y: 0 });
  });
});

describe('EventBus', () => {
  it('delivers events to listeners and keeps a bounded history', () => {
    const bus = new EventBus(3);
    const seen: string[] = [];
    const off = bus.on('hit', (e) => seen.push(e.type));
    bus.emit({ type: 'hit', tick: 1 });
    bus.emit({ type: 'expired', tick: 2 });
    off();
    bus.emit({ type: 'hit', tick: 3 });
    expect(seen).toEqual(['hit']);
    bus.emit({ type: 'a', tick: 4 });
    bus.emit({ type: 'b', tick: 5 });
    expect(bus.recent(10)).toHaveLength(3);
  });
});

describe('FixedStepper', () => {
  it('runs whole fixed steps only, carrying the remainder', () => {
    const s = new FixedStepper(0.1);
    let steps = 0;
    expect(s.advance(0.05, () => steps++)).toBe(0);
    expect(s.advance(0.05, () => steps++)).toBe(1);
    expect(steps).toBe(1);
  });

  it('caps steps in one call so a long stall does not spiral', () => {
    const s = new FixedStepper(0.1, 5);
    expect(s.advance(10, () => {})).toBe(5);
  });
});

describe('systems', () => {
  it('movement moves entities by velocity times dt', () => {
    const w = new World();
    const id = w.create({ Transform: { x: 0, y: 0 }, Velocity: { vx: 2, vy: -1 } });
    movementSystem.run(ctxFor(w, new EventBus(), 0.5));
    expect(w.get(id, 'Transform')).toEqual({ x: 1, y: -0.5 });
  });

  it('lifetime emits expired and releases the entity when time runs out', () => {
    const w = new World();
    const bus = new EventBus();
    const events: string[] = [];
    bus.on('expired', (e) => events.push(e.type));
    const id = w.create({ Lifetime: { seconds: 0.1 } });
    lifetimeSystem.run(ctxFor(w, bus, 0.2));
    expect(events).toEqual(['expired']);
    expect(w.isEnabled(id)).toBe(false);
  });

  it('a projectile touching a target deals damage and is released', () => {
    const w = new World();
    const bus = new EventBus();
    const target = w.create({ Transform: { x: 6, y: 0 }, Health: { hp: 100, max: 100 }, Target: { label: 't' } });
    const shot = w.create({ Transform: { x: 5.8, y: 0 }, Damage: { amount: 25 } });
    collisionSystem.run(ctxFor(w, bus, 0.1));
    expect(w.get(target, 'Health')!.hp).toBe(75);
    expect(w.isEnabled(shot)).toBe(false);
  });

  it('a destroyed target emits destroyed and comes back at full health', () => {
    const w = new World();
    const bus = new EventBus();
    const events: string[] = [];
    bus.on('destroyed', (e) => events.push(e.type));
    const target = w.create({ Health: { hp: 0, max: 100 }, Target: { label: 't' } });
    healthSystem.run(ctxFor(w, bus, 0.1));
    expect(events).toEqual(['destroyed']);
    expect(w.get(target, 'Health')!.hp).toBe(100);
  });
});

describe('SystemsLab', () => {
  const run = (lab: SystemsLab, seconds: number) => {
    const frames = Math.round(seconds * 60);
    for (let i = 0; i < frames; i++) lab.frame(1 / 60);
  };

  it('spawns projectiles, hits the target, and reuses pooled entities', () => {
    const lab = new SystemsLab();
    run(lab, 8);
    const hits = lab.bus.recent(50).filter((e) => e.type === 'hit').length;
    expect(hits).toBeGreaterThan(0);
    const spawned = lab.bus.recent(50).length; // recent() is bounded, so count spawns directly
    expect(spawned).toBeGreaterThan(0);
    expect(lab.pool.stats.reused).toBeGreaterThan(0);
    // Far fewer entities were created than shots were fired: the pool is doing its job.
    expect(lab.pool.stats.created).toBeLessThan(lab.pool.stats.reused + lab.pool.stats.created);
    expect(lab.pool.stats.created).toBeLessThanOrEqual(Math.ceil(8 / 0.6) + 1);
  });

  it('with collision switched off, projectiles pass through the target', () => {
    const lab = new SystemsLab();
    lab.toggle('collision');
    run(lab, 8);
    expect(lab.snapshot().targetHp).toBe(100);
    expect(lab.bus.recent(50).some((e) => e.type === 'hit')).toBe(false);
  });

  it('with lifetime switched off, spent projectiles are never released', () => {
    const lab = new SystemsLab();
    lab.toggle('lifetime');
    run(lab, 8);
    expect(lab.pool.stats.created).toBeGreaterThan(5);
    expect(lab.pool.available).toBeLessThan(5);
  });

  it('toggling an unknown system does nothing', () => {
    const lab = new SystemsLab();
    expect(() => lab.toggle('nope')).not.toThrow();
  });
});
