import { useGraphicsStore } from '@/game/store/graphicsStore';
import { PERF_COUNTS, NAIVE_CAP, effectiveCount, usePerfStore } from '@/game/store/perfStore';
import { useWorldStore } from '@/game/store/worldStore';
import { ConceptCard } from './ConceptCard';

export function TerminalControls() {
  const colliderOn = useWorldStore((s) => s.wallColliderEnabled);
  const setCollider = useWorldStore((s) => s.setWallCollider);
  return (
    <>
      <p>
        <strong>Wall-01 collider: {colliderOn ? 'ON' : 'OFF'}</strong>
      </p>
      <div className="row">
        <button type="button" onClick={() => setCollider(true)} disabled={colliderOn}>
          Turn collider on
        </button>
        <button type="button" onClick={() => setCollider(false)} disabled={!colliderOn}>
          Turn collider off (break it)
        </button>
      </div>
    </>
  );
}

export function MaterialControls() {
  const roughness = useGraphicsStore((s) => s.roughness);
  const metalness = useGraphicsStore((s) => s.metalness);
  const environmentOn = useGraphicsStore((s) => s.environmentOn);
  const setRoughness = useGraphicsStore((s) => s.setRoughness);
  const setMetalness = useGraphicsStore((s) => s.setMetalness);
  const setEnvironment = useGraphicsStore((s) => s.setEnvironment);
  return (
    <>
      <label className="slider">
        Roughness {roughness.toFixed(2)}
        <input type="range" min={0} max={1} step={0.01} value={roughness} onChange={(e) => setRoughness(Number(e.target.value))} />
      </label>
      <label className="slider">
        Metalness {metalness.toFixed(2)}
        <input type="range" min={0} max={1} step={0.01} value={metalness} onChange={(e) => setMetalness(Number(e.target.value))} />
      </label>
      <label>
        <input type="checkbox" checked={environmentOn} onChange={(e) => setEnvironment(e.target.checked)} /> Environment reflections on
      </label>
      <ConceptCard id="pbr" />
      <ConceptCard id="roughness" />
      <ConceptCard id="metalness" />
      <ConceptCard id="environment-map" />
    </>
  );
}

export function PerformanceControls() {
  const count = usePerfStore((s) => s.count);
  const instanced = usePerfStore((s) => s.instanced);
  const fps = usePerfStore((s) => s.fps);
  const frameMs = usePerfStore((s) => s.frameMs);
  const drawCalls = usePerfStore((s) => s.drawCalls);
  const triangles = usePerfStore((s) => s.triangles);
  const setCount = usePerfStore((s) => s.setCount);
  const setInstanced = usePerfStore((s) => s.setInstanced);
  const shown = effectiveCount(count, instanced);

  return (
    <>
      <div className="row">
        {PERF_COUNTS.map((c) => (
          <button key={c} type="button" aria-pressed={count === c} onClick={() => setCount(c)}>
            {c.toLocaleString()} trees
          </button>
        ))}
      </div>
      <label>
        <input type="checkbox" checked={instanced} onChange={(e) => setInstanced(e.target.checked)} /> Instancing on
      </label>
      {!instanced && count > NAIVE_CAP ? (
        <p role="note">Instancing off shows at most {NAIVE_CAP.toLocaleString()} separate trees to keep this page usable.</p>
      ) : null}
      <dl>
        <dt>Trees drawn</dt>
        <dd>{shown.toLocaleString()}</dd>
        <dt>Frames per second (measured)</dt>
        <dd>{fps.toFixed(0)}</dd>
        <dt>Frame time (measured)</dt>
        <dd>{frameMs.toFixed(1)} ms</dd>
        <dt>Draw calls, last frame (measured)</dt>
        <dd>{drawCalls.toLocaleString()}</dd>
        <dt>Triangles, last frame (measured)</dt>
        <dd>{triangles.toLocaleString()}</dd>
      </dl>
      <ConceptCard id="draw-call" />
      <ConceptCard id="instancing" />
      <ConceptCard id="frame-time" />
    </>
  );
}
