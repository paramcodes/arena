// A simulated network link. Messages arrive after a fixed delay, in order.
// Time is passed in explicitly, so the link is deterministic and testable.
export interface Packet<T> {
  deliverAt: number;
  payload: T;
}

export class SimLink<T> {
  private queue: Packet<T>[] = [];

  constructor(public latencyMs: number) {}

  send(payload: T, nowMs: number): void {
    this.queue.push({ deliverAt: nowMs + this.latencyMs, payload });
  }

  receive(nowMs: number): T[] {
    const ready: T[] = [];
    const rest: Packet<T>[] = [];
    for (const p of this.queue) {
      if (p.deliverAt <= nowMs) ready.push(p.payload);
      else rest.push(p);
    }
    this.queue = rest;
    return ready;
  }

  get inFlight(): number {
    return this.queue.length;
  }
}
