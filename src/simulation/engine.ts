// A small, pure, fixed-timestep simulation core.
// Systems return new entity maps. They must not mutate their inputs.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SimulationEntity {
  id: string;
  position: Vec3;
  velocity: Vec3;
  grounded: boolean;
  health: number;
}

export interface SimulationState {
  tick: number;
  time: number;
  entities: Readonly<Record<string, SimulationEntity>>;
}

export interface SimulationEvent {
  tick: number;
  type: string;
  entityId?: string;
}

export type EmitEvent = (type: string, entityId?: string) => void;

export interface SimulationSystem {
  readonly name: string;
  update(
    entities: Readonly<Record<string, SimulationEntity>>,
    dt: number,
    emit: EmitEvent,
  ): Record<string, SimulationEntity>;
}

export function createState(entities: SimulationEntity[]): SimulationState {
  return {
    tick: 0,
    time: 0,
    entities: Object.fromEntries(entities.map((e) => [e.id, e])),
  };
}

// One pure step. The input state is never changed.
export function step(
  state: SimulationState,
  dt: number,
  systems: SimulationSystem[],
): { state: SimulationState; events: SimulationEvent[] } {
  if (!(dt > 0)) throw new Error('dt must be positive');
  const tick = state.tick + 1;
  const events: SimulationEvent[] = [];
  const emit: EmitEvent = (type, entityId) => events.push({ tick, type, entityId });

  let entities: Record<string, SimulationEntity> = { ...state.entities };
  for (const system of systems) {
    entities = system.update(entities, dt, emit);
  }
  return { state: { tick, time: state.time + dt, entities }, events };
}

export class Timeline {
  private frames: SimulationState[] = [];

  constructor(private readonly capacity = 1200) {}

  push(state: SimulationState): void {
    this.frames.push(state);
    if (this.frames.length > this.capacity) this.frames.shift();
  }

  at(tick: number): SimulationState | undefined {
    return this.frames.find((f) => f.tick === tick);
  }

  get size(): number {
    return this.frames.length;
  }

  clear(): void {
    this.frames = [];
  }
}

export interface SimulationOptions {
  fixedDt?: number;
  maxStepsPerUpdate?: number;
  historyCapacity?: number;
  maxEvents?: number;
}

// Runs the pure step on a fixed clock. Frame time goes in; whole fixed steps come out.
export class Simulation {
  readonly fixedDt: number;
  readonly timeline: Timeline;
  private readonly initial: SimulationState;
  private readonly systems: SimulationSystem[];
  private readonly maxSteps: number;
  private readonly maxEvents: number;
  private current: SimulationState;
  private _events: SimulationEvent[] = [];
  private accumulator = 0;
  private _paused = false;
  private _speed = 1;

  constructor(initial: SimulationState, systems: SimulationSystem[], opts: SimulationOptions = {}) {
    this.initial = initial;
    this.systems = systems;
    this.fixedDt = opts.fixedDt ?? 1 / 60;
    this.maxSteps = opts.maxStepsPerUpdate ?? 600;
    this.maxEvents = opts.maxEvents ?? 200;
    this.timeline = new Timeline(opts.historyCapacity ?? 1200);
    this.current = initial;
    this.timeline.push(initial);
  }

  get state(): SimulationState {
    return this.current;
  }

  get events(): readonly SimulationEvent[] {
    return this._events;
  }

  get paused(): boolean {
    return this._paused;
  }

  get speed(): number {
    return this._speed;
  }

  // Feed in real frame time. Returns how many fixed steps ran.
  update(frameDt: number): number {
    if (this._paused) return 0;
    this.accumulator += Math.max(0, frameDt) * this._speed;
    let n = 0;
    while (this.accumulator >= this.fixedDt && n < this.maxSteps) {
      this.advance();
      this.accumulator -= this.fixedDt;
      n += 1;
    }
    if (n === this.maxSteps) this.accumulator = 0; // drop the backlog instead of spiralling
    return n;
  }

  advance(): void {
    const result = step(this.current, this.fixedDt, this.systems);
    this.current = result.state;
    this.timeline.push(result.state);
    this._events = [...this._events, ...result.events].slice(-this.maxEvents);
  }

  play(): void {
    this._paused = false;
  }

  pause(): void {
    this._paused = true;
  }

  stepOnce(): void {
    this._paused = true;
    this.advance();
  }

  setSpeed(speed: number): void {
    if (!(speed > 0)) throw new Error('speed must be positive');
    this._speed = Math.min(4, Math.max(0.1, speed));
  }

  reset(): void {
    this.current = this.initial;
    this.accumulator = 0;
    this._events = [];
    this.timeline.clear();
    this.timeline.push(this.initial);
  }
}
