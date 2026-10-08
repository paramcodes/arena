// Multiplayer arena. One player is controlled locally; the server is the authority.
// The client predicts its own movement, the server sends snapshots, and the client reconciles.
// The other player (a bot) is interpolated from snapshots.
import { FixedStepper } from '@/ecs/loop';
import { SimLink } from './link';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Input {
  seq: number;
  dx: number;
  dy: number;
}

export interface Snapshot {
  x: number;
  y: number;
  bot: Vec2;
  ackSeq: number;
  atMs: number;
}

export const ARENA = { tick: 1 / 20, speed: 4, xMax: 9, yMax: 5 } as const;
export const LATENCIES = [0, 50, 100, 200, 300] as const;

// Both client and server use the same movement rule, so prediction matches
// unless the server does something the client does not know about (a push).
export function applyInput(p: Vec2, i: Input): Vec2 {
  const x = p.x + i.dx * ARENA.speed * ARENA.tick;
  const y = p.y + i.dy * ARENA.speed * ARENA.tick;
  return {
    x: Math.max(-ARENA.xMax, Math.min(ARENA.xMax, x)),
    y: Math.max(-ARENA.yMax, Math.min(ARENA.yMax, y)),
  };
}

export function botAt(tSec: number): Vec2 {
  return { x: Math.cos(tSec * 0.6) * 5, y: Math.sin(tSec * 0.6) * 4 };
}

const dist = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.y - b.y);

export class MultiplayerLab {
  nowMs = 0;
  latencyMs = 100;
  predictionOn = true;
  reconcileOn = true;
  interpolationOn = true;
  interpDelayMs = 100;
  running = true;
  dir: Vec2 = { x: 0, y: 0 };

  server: Vec2 = { x: -6, y: 0 };
  serverAck = 0;
  client: Vec2 = { x: -6, y: 0 };
  pending: Input[] = [];
  seq = 0;

  toServer = new SimLink<Input>(100);
  toClient = new SimLink<Snapshot>(100);
  private remoteBuffer: Array<{ atMs: number; p: Vec2 }> = [];
  private stepper = new FixedStepper(ARENA.tick);

  stats = { corrections: 0, lastError: 0, maxError: 0, snapshots: 0 };

  setLatency(ms: number): void {
    this.latencyMs = ms;
    this.toServer.latencyMs = ms;
    this.toClient.latencyMs = ms;
  }

  // Server-side push, for example a trap. The client does not know about it.
  pushServer(dx: number): void {
    this.server = { ...this.server, x: Math.max(-ARENA.xMax, Math.min(ARENA.xMax, this.server.x + dx)) };
  }

  frame(frameDt: number): number {
    if (!this.running) return 0;
    return this.stepper.advance(frameDt, (dt) => this.tick(dt));
  }

  tick(dt: number): void {
    this.nowMs += dt * 1000;
    const input: Input = { seq: ++this.seq, dx: this.dir.x, dy: this.dir.y };
    this.toServer.send(input, this.nowMs);
    if (this.predictionOn) {
      this.client = applyInput(this.client, input);
      this.pending.push(input);
    }

    for (const i of this.toServer.receive(this.nowMs)) {
      this.server = applyInput(this.server, i);
      this.serverAck = i.seq;
    }
    this.toClient.send(
      { x: this.server.x, y: this.server.y, bot: botAt(this.nowMs / 1000), ackSeq: this.serverAck, atMs: this.nowMs },
      this.nowMs,
    );

    for (const s of this.toClient.receive(this.nowMs)) this.onSnapshot(s);

    const err = dist(this.client, this.server);
    this.stats.lastError = err;
    this.stats.maxError = Math.max(this.stats.maxError, err);
  }

  private onSnapshot(s: Snapshot): void {
    this.stats.snapshots += 1;
    this.remoteBuffer.push({ atMs: s.atMs, p: s.bot });
    if (this.remoteBuffer.length > 120) this.remoteBuffer.shift();

    if (!this.predictionOn) {
      this.client = { x: s.x, y: s.y };
      return;
    }
    if (!this.reconcileOn) return; // keep the prediction, even if it is wrong

    // Reconcile: take the server's state, drop acknowledged inputs, replay the rest.
    this.pending = this.pending.filter((i) => i.seq > s.ackSeq);
    let p: Vec2 = { x: s.x, y: s.y };
    for (const i of this.pending) p = applyInput(p, i);
    if (dist(p, this.client) > 1e-6) this.stats.corrections += 1;
    this.client = p;
  }

  // What the bot looks like on screen. Interpolation shows it a little in the past.
  remoteView(): Vec2 {
    const buf = this.remoteBuffer;
    if (buf.length === 0) return botAt(this.nowMs / 1000);
    if (!this.interpolationOn) return buf[buf.length - 1].p;
    const renderAt = this.nowMs - this.interpDelayMs;
    let a: (typeof buf)[number] | undefined;
    let b: (typeof buf)[number] | undefined;
    for (const sample of buf) {
      if (sample.atMs <= renderAt) a = sample;
      else {
        b = sample;
        break;
      }
    }
    if (!a) return buf[0].p;
    if (!b) return a.p; // buffer ran dry: freeze on the last sample
    const k = (renderAt - a.atMs) / (b.atMs - a.atMs);
    return { x: a.p.x + (b.p.x - a.p.x) * k, y: a.p.y + (b.p.y - a.p.y) * k };
  }

  snapshot() {
    return {
      server: { ...this.server },
      client: { ...this.client },
      bot: this.remoteView(),
      pending: this.pending.length,
      rttMs: this.latencyMs * 2,
      stats: { ...this.stats },
    };
  }
}

export const multiplayerLab = new MultiplayerLab();
