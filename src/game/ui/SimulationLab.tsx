'use client';

import { useEffect, useRef, useState } from 'react';
import { Simulation, createState, type SimulationState } from '@/simulation/engine';
import { createBall, gravitySystem, groundSystem } from '@/simulation/systems';

// A standalone simulation a learner can play, pause, step, reset, and slow down.
// It runs on its own clock and does not touch the 3D world.
export function SimulationLab() {
  const simRef = useRef<Simulation | null>(null);
  const [snapshot, setSnapshot] = useState<SimulationState | null>(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const sim = new Simulation(createState([createBall(5)]), [gravitySystem(9.81), groundSystem(0.6)], { fixedDt: 1 / 60 });
    simRef.current = sim;
    setSnapshot(sim.state);

    let raf = 0;
    let last = performance.now();
    let lastPaint = 0;
    const loop = (now: number) => {
      sim.update(Math.min(0.1, (now - last) / 1000));
      last = now;
      if (now - lastPaint > 100) {
        lastPaint = now;
        setSnapshot(sim.state);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const act = (fn: (s: Simulation) => void) => {
    const sim = simRef.current;
    if (!sim) return;
    fn(sim);
    setSnapshot(sim.state);
    setPaused(sim.paused);
    setSpeed(sim.speed);
  };

  const ball = snapshot?.entities['ball'];
  const recent = simRef.current?.events.slice(-3).map((e) => e.type).join(', ') || 'none';

  return (
    <section aria-label="Simulation lab">
      <h3>Simulation lab (fixed 60 steps per second)</h3>
      <div className="row">
        <button type="button" onClick={() => act((s) => (s.paused ? s.play() : s.pause()))}>
          {paused ? 'Play' : 'Pause'}
        </button>
        <button type="button" onClick={() => act((s) => s.stepOnce())}>Step</button>
        <button type="button" onClick={() => act((s) => s.reset())}>Reset</button>
        <label>
          Speed{' '}
          <select value={speed} onChange={(e) => act((s) => s.setSpeed(Number(e.target.value)))}>
            {[0.25, 0.5, 1, 2].map((v) => (
              <option key={v} value={v}>{v}x</option>
            ))}
          </select>
        </label>
      </div>
      {snapshot && ball ? (
        <pre>
          {JSON.stringify(
            {
              tick: snapshot.tick,
              time: Number(snapshot.time.toFixed(2)),
              ball: {
                position: { y: Number(ball.position.y.toFixed(3)) },
                velocity: { y: Number(ball.velocity.y.toFixed(3)) },
                grounded: ball.grounded,
              },
            },
            null,
            2,
          )}
        </pre>
      ) : null}
      <p>Last events: {recent}</p>
    </section>
  );
}
