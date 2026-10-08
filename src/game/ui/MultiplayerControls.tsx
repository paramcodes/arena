'use client';

import { useEffect, useState } from 'react';
import { multiplayerLab, LATENCIES, type Vec2 } from '@/net/arena';
import { ConceptCard } from './ConceptCard';

type Snap = ReturnType<typeof multiplayerLab.snapshot>;
const VIEW = { w: 320, h: 160, xMin: -10, xMax: 10, yMin: -6, yMax: 6 };
const sx = (x: number) => ((x - VIEW.xMin) / (VIEW.xMax - VIEW.xMin)) * VIEW.w;
const sy = (y: number) => VIEW.h - ((y - VIEW.yMin) / (VIEW.yMax - VIEW.yMin)) * VIEW.h;

export function MultiplayerControls() {
  const [snap, setSnap] = useState<Snap>(() => multiplayerLab.snapshot());
  const [, force] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastPaint = 0;
    const loop = (now: number) => {
      multiplayerLab.frame(Math.min(0.1, (now - last) / 1000));
      last = now;
      if (now - lastPaint > 100) {
        lastPaint = now;
        setSnap(multiplayerLab.snapshot());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      multiplayerLab.dir = { x: 0, y: 0 };
    };
  }, []);

  const refresh = () => {
    setSnap(multiplayerLab.snapshot());
    force((n) => n + 1);
  };
  const hold = (x: number, y: number) => {
    multiplayerLab.dir = { x, y };
  };
  const release = () => {
    multiplayerLab.dir = { x: 0, y: 0 };
  };

  const dot = (p: Vec2, fill: string, dashed = false, r = 6) => (
    <circle cx={sx(p.x)} cy={sy(p.y)} r={r} fill={dashed ? 'none' : fill} stroke={fill} strokeWidth={dashed ? 2 : 1} strokeDasharray={dashed ? '4 3' : undefined} />
  );

  return (
    <>
      <p>Latency is the delay for a message to travel. The round trip is twice that. Change it and watch the local player and the bot.</p>
      <div className="row">
        {LATENCIES.map((ms) => (
          <button key={ms} type="button" aria-pressed={multiplayerLab.latencyMs === ms} onClick={() => { multiplayerLab.setLatency(ms); refresh(); }}>
            {ms} ms
          </button>
        ))}
      </div>
      <div className="row">
        <button type="button" aria-pressed={multiplayerLab.predictionOn} onClick={() => { multiplayerLab.predictionOn = !multiplayerLab.predictionOn; refresh(); }}>
          Prediction {multiplayerLab.predictionOn ? 'on' : 'off'}
        </button>
        <button type="button" aria-pressed={multiplayerLab.reconcileOn} onClick={() => { multiplayerLab.reconcileOn = !multiplayerLab.reconcileOn; refresh(); }}>
          Reconciliation {multiplayerLab.reconcileOn ? 'on' : 'off'}
        </button>
        <button type="button" aria-pressed={multiplayerLab.interpolationOn} onClick={() => { multiplayerLab.interpolationOn = !multiplayerLab.interpolationOn; refresh(); }}>
          Interpolation {multiplayerLab.interpolationOn ? 'on' : 'off'}
        </button>
      </div>
      <div className="row" aria-label="Move the local player">
        <button type="button" onPointerDown={() => hold(-1, 0)} onPointerUp={release} onPointerLeave={release}>Left</button>
        <button type="button" onPointerDown={() => hold(0, 1)} onPointerUp={release} onPointerLeave={release}>Up</button>
        <button type="button" onPointerDown={() => hold(0, -1)} onPointerUp={release} onPointerLeave={release}>Down</button>
        <button type="button" onPointerDown={() => hold(1, 0)} onPointerUp={release} onPointerLeave={release}>Right</button>
        <button type="button" onClick={() => { multiplayerLab.pushServer(2); refresh(); }}>Server pushes you (+2)</button>
      </div>

      <svg role="img" aria-label={`Arena. Local player at ${snap.client.x.toFixed(1)}, server at ${snap.server.x.toFixed(1)}, bot at ${snap.bot.x.toFixed(1)}.`} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} width="100%" style={{ background: '#020617', borderRadius: 8 }}>
        {dot(snap.server, '#f59e0b', true, 7)}
        {dot(snap.client, '#38bdf8')}
        {dot(snap.bot, '#22c55e')}
      </svg>
      <p>
        Solid blue: your player as you see it. Dashed orange: where the server says you are. Green: the bot, interpolated.
      </p>

      <dl>
        <dt>Round trip (ms)</dt>
        <dd>{snap.rttMs}</dd>
        <dt>Gap between you and server now (units)</dt>
        <dd>{snap.stats.lastError.toFixed(2)}</dd>
        <dt>Corrections applied</dt>
        <dd>{snap.stats.corrections}</dd>
        <dt>Inputs waiting for the server</dt>
        <dd>{snap.pending}</dd>
      </dl>

      <ConceptCard id="latency" />
      <ConceptCard id="snapshot" />
      <ConceptCard id="client-prediction" />
      <ConceptCard id="reconciliation" />
      <ConceptCard id="interpolation" />
    </>
  );
}
