// Systems announce what happened. Other code listens. Systems never call each other directly.

export interface GameEvent {
  type: string;
  tick: number;
  [key: string]: unknown;
}

type Listener = (e: GameEvent) => void;

export class EventBus {
  private listeners = new Map<string, Set<Listener>>();
  private history: GameEvent[] = [];

  constructor(private readonly capacity = 50) {}

  on(type: string, fn: Listener): () => void {
    const set = this.listeners.get(type) ?? new Set<Listener>();
    set.add(fn);
    this.listeners.set(type, set);
    return () => set.delete(fn);
  }

  emit(event: GameEvent): void {
    this.history.push(event);
    if (this.history.length > this.capacity) this.history.shift();
    this.listeners.get(event.type)?.forEach((fn) => fn(event));
  }

  recent(n = 5): GameEvent[] {
    return this.history.slice(-n);
  }

  clear(): void {
    this.history = [];
  }
}
