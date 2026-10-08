'use client';

import { useEffect, useState } from 'react';
import { systemsLab, LAB_CONFIG } from '@/ecs/lab';
import { ConceptCard } from './ConceptCard';

type Snapshot = ReturnType<typeof systemsLab.snapshot>;

const ARENA = { w: 320, h: 160, xMin: -10, xMax: 10, yMin: -4, yMax: 4 };
const sx = (x: number) => ((x - ARENA.xMin) / (ARENA.xMax - ARENA.xMin)) * ARENA.w;
const sy = (y: number) => ARENA.h - ((y - ARENA.yMin) / (ARENA.yMax - ARENA.yMin)) * ARENA.h;

const LABEL: Record<string, string> = {
  spawner: 'Spawner',
  movement: 'Movement',
  collision: 'Collision',
  lifetime: 'Lifetime',
  health: 'Health',
};

export function SystemsControls() {
  const [snap, setSnap] = useState<Snapshot>(() => systemsLab.snapshot());
  const [running, setRunning] = useState(systemsLab.running);
  const [speed, setSpeed] = useState(systemsLab.speed);

  // The lab advances on real frame time. It keeps running while this panel is closed,
  // and the panel only paints a fresh snapshot about ten times per second.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastPaint = 0;
    const loop = (now: number) => {
      systemsLab.frame(Math.min(0.1, (now - last) / 1000));
      last = now;
      if (now - lastPaint > 100) {
        lastPaint = now;
        setSnap(systemsLab.snapshot());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleSystem = (name: string) => {
    systemsLab.toggle(name);
    setSnap(systemsLab.snapshot());
  };
  const toggleRun = () => {
    systemsLab.running = !systemsLab.running;
    setRunning(systemsLab.running);
  };
  const changeSpeed = (v: number) => {
    systemsLab.speed = v;
    setSpeed(v);
  };
  const reset = () => {
    systemsLab.init();
    setSnap(systemsLab.snapshot());
  };

  return (
    <>
      <p>Switch a system off and watch what stops working. Each one does one job.</p>
      <div className="row">
        {snap.systems.map((s) => (
          <button key={s.name} type="button" aria-pressed={s.enabled} onClick={() => toggleSystem(s.name)}>
            {LABEL[s.name] ?? s.name}: {s.enabled ? 'on' : 'off'}
          </button>
        ))}
      </div>
      <div className="row">
        <button type="button" onClick={toggleRun}>{running ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={reset}>Reset lab</button>
        <label>
          Speed{' '}
          <select value={speed} onChange={(e) => changeSpeed(Number(e.target.value))}>
            {[0.5, 1, 2].map((v) => (
              <option key={v} value={v}>{v}x</option>
            ))}
          </select>
        </label>
      </div>

      <svg
        role="img"
        aria-label={`Arena: ${snap.activeProjectiles} projectiles in flight, target at ${snap.targetHp} of ${snap.targetMax} health`}
        viewBox={`0 0 ${ARENA.w} ${ARENA.h}`}
        width="100%"
        style={{ background: '#020617', borderRadius: 8 }}
      >
        <line x1={sx(LAB_CONFIG.turret.x)} y1={sy(0)} x2={sx(LAB_CONFIG.target.x)} y2={sy(0)} stroke="#334155" strokeDasharray="4 4" />
        <rect x={sx(-8) - 6} y={sy(0) - 6} width={12} height={12} fill="#38bdf8" />
        <circle cx={sx(LAB_CONFIG.target.x)} cy={sy(0)} r={14} fill="none" stroke="#ef4444" strokeWidth={2} />
        {snap.projectilePositions.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3} fill="#fde047" />
        ))}
      </svg>

      <dl>
        <dt>Target health</dt>
        <dd>{snap.targetHp.toFixed(0)} / {snap.targetMax}</dd>
        <dt>Projectiles in flight</dt>
        <dd>{snap.activeProjectiles}</dd>
        <dt>Pool: created / reused / in use / free</dt>
        <dd>{snap.pool.created} / {snap.pool.reused} / {snap.pool.inUse} / {snap.pool.free}</dd>
        <dt>Fixed steps run</dt>
        <dd>{snap.ticks}</dd>
      </dl>

      <p>Recent events:</p>
      <ul>
        {snap.events.length === 0 ? <li>none yet</li> : null}
        {snap.events.map((e, i) => (
          <li key={i}>{e.type} (step {e.tick})</li>
        ))}
      </ul>

      <p>
        Try: turn <strong>Collision</strong> off and the shots pass through. Turn <strong>Lifetime</strong> off and spent shots never return to the pool, so the pool keeps growing. Turn <strong>Movement</strong> off and the shots freeze.
      </p>

      <ConceptCard id="game-loop" />
      <ConceptCard id="fixed-timestep" />
      <ConceptCard id="ecs" />
      <ConceptCard id="object-pool" />
      <ConceptCard id="event-bus" />
    </>
  );
}
