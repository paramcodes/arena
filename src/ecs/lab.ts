// The Systems District lab: a turret, a target, and projectiles.
// Every system can be switched off. The lab shows what each one contributes.
import { World, type EntityId } from './world';
import { EventBus } from './eventBus';
import { EntityPool } from './pool';
import { FixedStepper } from './loop';
import { collisionSystem, healthSystem, lifetimeSystem, movementSystem, type GameSystem, type SystemContext } from './systems';

// Data-driven recipe: this is the whole definition of a projectile.
export const PROJECTILE_RECIPE = {
  Transform: { x: -8, y: 0 },
  Velocity: { vx: 0, vy: 0 },
  Damage: { amount: 25 },
  Lifetime: { seconds: 2.5 },
} as const;

export const LAB_CONFIG = {
  turret: { x: -8, y: 0 },
  target: { x: 6, y: 0 },
  projectileSpeed: 9,
  spawnInterval: 0.6,
  fixedDt: 1 / 30,
} as const;

export class SystemsLab {
  world!: World;
  bus!: EventBus;
  pool!: EntityPool;
  stepper = new FixedStepper(LAB_CONFIG.fixedDt);
  systems!: GameSystem[];
  ticks = 0;
  running = true;
  speed = 1;
  private spawnTimer = 0;
  private targetId: EntityId = 0;

  constructor() {
    this.init();
  }

  init(): void {
    this.world = new World();
    this.bus = new EventBus();
    this.pool = new EntityPool(this.world, PROJECTILE_RECIPE);
    this.stepper.reset();
    this.ticks = 0;
    this.spawnTimer = 0;
    this.targetId = this.world.create({
      Transform: { ...LAB_CONFIG.target },
      Health: { hp: 100, max: 100 },
      Target: { label: 'target' },
    });
    const spawner: GameSystem = {
      name: 'spawner',
      enabled: true,
      run: ({ dt }) => {
        this.spawnTimer += dt;
        if (this.spawnTimer < LAB_CONFIG.spawnInterval) return;
        this.spawnTimer = 0;
        const tgt = this.world.get(this.targetId, 'Transform')!;
        const dx = tgt.x - LAB_CONFIG.turret.x;
        const dy = tgt.y - LAB_CONFIG.turret.y;
        const len = Math.hypot(dx, dy) || 1;
        const vx = (dx / len) * LAB_CONFIG.projectileSpeed;
        const vy = (dy / len) * LAB_CONFIG.projectileSpeed;
        this.pool.acquire({
          Transform: { ...LAB_CONFIG.turret },
          Velocity: { vx, vy },
        });
        this.bus.emit({ type: 'spawned', tick: this.ticks });
      },
    };
    this.systems = [spawner, movementSystem, collisionSystem, lifetimeSystem, healthSystem];
  }

  get system(): (name: string) => GameSystem | undefined {
    return (name) => this.systems.find((s) => s.name === name);
  }

  toggle(name: string): void {
    const s = this.system(name);
    if (s) s.enabled = !s.enabled;
  }

  // Advance by real frame time. Returns the number of fixed steps that ran.
  frame(frameDt: number): number {
    if (!this.running) return 0;
    return this.stepper.advance(frameDt * this.speed, (dt) => this.tick(dt));
  }

  tick(dt: number): void {
    this.ticks += 1;
    const ctx: SystemContext = {
      world: this.world,
      dt,
      bus: this.bus,
      tick: this.ticks,
      release: (id) => this.pool.release(id),
    };
    for (const s of this.systems) {
      if (s.enabled) s.run(ctx);
    }
  }

  snapshot() {
    const target = this.world.get(this.targetId, 'Health');
    return {
      ticks: this.ticks,
      targetHp: target?.hp ?? 0,
      targetMax: target?.max ?? 100,
      activeProjectiles: this.world.query('Transform', 'Damage').length,
      projectilePositions: this.world.query('Transform', 'Damage').map((id) => this.world.get(id, 'Transform')!),
      pool: { ...this.pool.stats, free: this.pool.available },
      systems: this.systems.map((s) => ({ name: s.name, enabled: s.enabled })),
      events: this.bus.recent(5),
    };
  }
}

// One lab per page, kept at module level so it survives the dialog closing.
export const systemsLab = new SystemsLab();
