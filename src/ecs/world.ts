// A small entity-component-system world.
// An entity is just an id. Components are plain data stored per entity.
// Systems are functions that query for entities with the components they need.

export type EntityId = number;

export interface Components {
  Transform: { x: number; y: number };
  Velocity: { vx: number; vy: number };
  Damage: { amount: number };
  Lifetime: { seconds: number };
  Health: { hp: number; max: number };
  Target: { label: string };
}

export type ComponentName = keyof Components;
export type ComponentSet = Partial<Components>;

export class World {
  private nextId = 1;
  private store = new Map<EntityId, ComponentSet>();
  private disabled = new Set<EntityId>();

  create(components: ComponentSet = {}): EntityId {
    const id = this.nextId++;
    this.store.set(id, { ...components });
    return id;
  }

  destroy(id: EntityId): void {
    this.store.delete(id);
    this.disabled.delete(id);
  }

  has(id: EntityId): boolean {
    return this.store.has(id);
  }

  get<K extends ComponentName>(id: EntityId, name: K): Components[K] | undefined {
    return this.store.get(id)?.[name];
  }

  set<K extends ComponentName>(id: EntityId, name: K, value: Components[K]): void {
    const c = this.store.get(id);
    if (!c) throw new Error(`No entity ${id}`);
    c[name] = value;
  }

  assign(id: EntityId, components: ComponentSet): void {
    const c = this.store.get(id);
    if (!c) throw new Error(`No entity ${id}`);
    Object.assign(c, components);
  }

  // A disabled entity keeps its data but is hidden from queries. Pools use this.
  disable(id: EntityId): void {
    this.disabled.add(id);
  }

  enable(id: EntityId): void {
    this.disabled.delete(id);
  }

  isEnabled(id: EntityId): boolean {
    return this.store.has(id) && !this.disabled.has(id);
  }

  // Every enabled entity that has all the named components.
  query<K extends ComponentName>(...names: K[]): EntityId[] {
    const out: EntityId[] = [];
    for (const [id, c] of this.store) {
      if (this.disabled.has(id)) continue;
      if (names.every((n) => c[n] !== undefined)) out.push(id);
    }
    return out;
  }

  get activeCount(): number {
    return this.store.size - this.disabled.size;
  }
}
