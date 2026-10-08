import { describe, expect, it } from 'vitest';
import { SimLink } from './link';
import { MultiplayerLab } from './arena';

describe('SimLink', () => {
  it('delivers a message only after its latency has passed, in order', () => {
    const link = new SimLink<string>(200);
    link.send('a', 0);
    link.send('b', 50);
    expect(link.receive(199)).toEqual([]);
    expect(link.receive(200)).toEqual(['a']);
    expect(link.receive(250)).toEqual(['b']);
    expect(link.inFlight).toBe(0);
  });
});

const run = (lab: MultiplayerLab, seconds: number) => {
  for (let i = 0; i < Math.round(seconds * 60); i++) lab.frame(1 / 60);
};

describe('MultiplayerLab', () => {
  it('without prediction the screen shows the server state one trip old (speed x one-way latency)', () => {
    const lab = new MultiplayerLab();
    lab.setLatency(200);
    lab.predictionOn = false;
    lab.dir = { x: 1, y: 0 };
    run(lab, 2);
    const s = lab.snapshot();
    // Speed 4 units/s, one-way latency 0.2 s: about 0.8 units behind.
    expect(s.server.x - s.client.x).toBeGreaterThan(0.5);
    expect(s.server.x - s.client.x).toBeLessThan(1.2);
  });

  it('with prediction the local player moves immediately, ahead of the server', () => {
    const withPred = new MultiplayerLab();
    withPred.setLatency(200);
    withPred.dir = { x: 1, y: 0 };
    run(withPred, 1);
    const noPred = new MultiplayerLab();
    noPred.setLatency(200);
    noPred.predictionOn = false;
    noPred.dir = { x: 1, y: 0 };
    run(noPred, 1);
    expect(withPred.snapshot().client.x).toBeGreaterThan(noPred.snapshot().client.x + 1);
  });

  it('a server push is corrected by reconciliation', () => {
    const lab = new MultiplayerLab();
    lab.setLatency(100);
    run(lab, 0.5);
    lab.pushServer(2);
    run(lab, 1);
    const s = lab.snapshot();
    expect(Math.abs(s.client.x - s.server.x)).toBeLessThan(1e-6);
    expect(lab.stats.corrections).toBeGreaterThan(0);
  });

  it('without reconciliation the same push leaves the client wrong', () => {
    const lab = new MultiplayerLab();
    lab.setLatency(100);
    lab.reconcileOn = false;
    run(lab, 0.5);
    lab.pushServer(2);
    run(lab, 1);
    const s = lab.snapshot();
    expect(Math.abs(s.client.x - s.server.x)).toBeGreaterThan(1.5);
  });

  it('movement stays inside the arena', () => {
    const lab = new MultiplayerLab();
    lab.setLatency(0);
    lab.dir = { x: 1, y: 0 };
    run(lab, 10);
    expect(lab.snapshot().server.x).toBeLessThanOrEqual(9);
  });
});
