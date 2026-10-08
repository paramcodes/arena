import type { EventBus } from './eventBus';
import type { EntityId, World } from './world';

export interface SystemContext {
  world: World;
  dt: number;
  bus: EventBus;
  tick: number;
  release(id: EntityId): void;
}

export interface GameSystem {
  readonly name: string;
  enabled: boolean;
  run(ctx: SystemContext): void;
}

export const movementSystem: GameSystem = {
  name: 'movement',
  enabled: true,
  run({ world, dt }) {
    for (const id of world.query('Transform', 'Velocity')) {
      const t = world.get(id, 'Transform')!;
      const v = world.get(id, 'Velocity')!;
      world.set(id, 'Transform', { x: t.x + v.vx * dt, y: t.y + v.vy * dt });
    }
  },
};

// A projectile that touches a target deals its damage and is released.
export const collisionSystem: GameSystem = {
  name: 'collision',
  enabled: true,
  run({ world, bus, tick, release }) {
    const targets = world.query('Transform', 'Health', 'Target');
    for (const p of world.query('Transform', 'Damage')) {
      const pt = world.get(p, 'Transform')!;
      for (const tgt of targets) {
        const tt = world.get(tgt, 'Transform')!;
        const h = world.get(tgt, 'Health')!;
        if (Math.hypot(pt.x - tt.x, pt.y - tt.y) < 1.2) {
          const dmg = world.get(p, 'Damage')!.amount;
          world.set(tgt, 'Health', { hp: h.hp - dmg, max: h.max });
          bus.emit({ type: 'hit', tick, amount: dmg });
          release(p);
          break;
        }
      }
    }
  },
};

export const lifetimeSystem: GameSystem = {
  name: 'lifetime',
  enabled: true,
  run({ world, dt, bus, tick, release }) {
    for (const id of world.query('Lifetime')) {
      const l = world.get(id, 'Lifetime')!;
      const remaining = l.seconds - dt;
      if (remaining <= 0) {
        bus.emit({ type: 'expired', tick });
        release(id);
      } else {
        world.set(id, 'Lifetime', { seconds: remaining });
      }
    }
  },
};

// When a target runs out of health, announce it and bring it back at full health.
export const healthSystem: GameSystem = {
  name: 'health',
  enabled: true,
  run({ world, bus, tick }) {
    for (const id of world.query('Health', 'Target')) {
      const h = world.get(id, 'Health')!;
      if (h.hp <= 0) {
        bus.emit({ type: 'destroyed', tick });
        world.set(id, 'Health', { hp: h.max, max: h.max });
      }
    }
  },
};
