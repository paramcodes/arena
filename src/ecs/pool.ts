import { World, type ComponentSet, type EntityId } from './world';

// Object pool for entities. Released entities are disabled and reused, not destroyed.
// The recipe is plain data, so each entity type is described in one place.

function cloneSet(src: ComponentSet): ComponentSet {
  return Object.fromEntries(Object.entries(src).map(([k, v]) => [k, { ...(v as object) }])) as ComponentSet;
}

export class EntityPool {
  private free: EntityId[] = [];
  readonly stats = { created: 0, reused: 0, inUse: 0 };

  constructor(private readonly world: World, private readonly recipe: ComponentSet) {}

  acquire(overrides: ComponentSet = {}): EntityId {
    const merged: ComponentSet = { ...cloneSet(this.recipe), ...cloneSet(overrides) };
    let id = this.free.pop();
    if (id === undefined) {
      id = this.world.create(merged);
      this.stats.created += 1;
    } else {
      this.world.assign(id, merged);
      this.world.enable(id);
      this.stats.reused += 1;
    }
    this.stats.inUse += 1;
    return id;
  }

  release(id: EntityId): void {
    if (!this.world.isEnabled(id)) return; // releasing twice is a no-op
    this.world.disable(id);
    this.free.push(id);
    this.stats.inUse -= 1;
  }

  get available(): number {
    return this.free.length;
  }
}
