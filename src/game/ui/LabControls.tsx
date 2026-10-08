import { useGraphicsStore } from '@/game/store/graphicsStore';
import { PERF_COUNTS, NAIVE_CAP, effectiveCount, usePerfStore } from '@/game/store/perfStore';
import { useWorldStore } from '@/game/store/worldStore';
import { usePhysicsStore } from '@/game/store/physicsStore';
import { useAnimStore } from '@/game/store/animationStore';
import { useAiStore } from '@/game/store/aiStore';
import { utilityScores } from '@/ai/utility';
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

export function PhysicsControls() {
  const gravity = usePhysicsStore((s) => s.gravity);
  const restitution = usePhysicsStore((s) => s.restitution);
  const friction = usePhysicsStore((s) => s.friction);
  const rayDistance = usePhysicsStore((s) => s.rayDistance);
  const setGravity = usePhysicsStore((s) => s.setGravity);
  const setRestitution = usePhysicsStore((s) => s.setRestitution);
  const setFriction = usePhysicsStore((s) => s.setFriction);
  const dropBall = usePhysicsStore((s) => s.dropBall);
  return (
    <>
      <label className="slider">
        Gravity {gravity.toFixed(2)} m/s²
        <input type="range" min={0.5} max={20} step={0.1} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} />
      </label>
      <label className="slider">
        Ball restitution (bounce) {restitution.toFixed(2)}
        <input type="range" min={0} max={1} step={0.01} value={restitution} onChange={(e) => setRestitution(Number(e.target.value))} />
      </label>
      <label className="slider">
        Ramp and ball friction {friction.toFixed(2)}
        <input type="range" min={0} max={1} step={0.01} value={friction} onChange={(e) => setFriction(Number(e.target.value))} />
      </label>
      <div className="row">
        <button type="button" onClick={() => dropBall()}>Drop ball again</button>
      </div>
      <dl>
        <dt>Turret raycast hit distance (measured)</dt>
        <dd>{rayDistance.toFixed(2)} m</dd>
      </dl>
      <ConceptCard id="restitution" />
      <ConceptCard id="friction" />
      <ConceptCard id="raycast" />
    </>
  );
}

export function AnimationControls() {
  const speed = useAnimStore((s) => s.speed);
  const current = useAnimStore((s) => s.current);
  const setSpeed = useAnimStore((s) => s.setSpeed);
  const pulseJump = useAnimStore((s) => s.pulseJump);
  const pulseAttack = useAnimStore((s) => s.pulseAttack);
  return (
    <>
      <p>
        <strong>Current state: {current}</strong>
      </p>
      <div className="row">
        <button type="button" onClick={() => setSpeed(0)} aria-pressed={speed === 0}>Stop</button>
        <button type="button" onClick={() => setSpeed(2.5)} aria-pressed={speed === 2.5}>Walk</button>
        <button type="button" onClick={() => setSpeed(6)} aria-pressed={speed === 6}>Run</button>
        <button type="button" onClick={() => pulseJump()}>Jump</button>
        <button type="button" onClick={() => pulseAttack()}>Attack</button>
      </div>
      <p>Transitions: idle → walk when moving slowly; walk → run when fast; any → jump when rising off the ground; jump or fall → land on touchdown; any → attack when pressed; attack ends after about half a second.</p>
      <ConceptCard id="animation-state-machine" />
      <ConceptCard id="crossfade" />
      <ConceptCard id="locomotion" />
    </>
  );
}

export function AiControls() {
  const mode = useAiStore((s) => s.mode);
  const health = useAiStore((s) => s.npcHealth);
  const npcState = useAiStore((s) => s.npcState);
  const distance = useAiStore((s) => s.distance);
  const setMode = useAiStore((s) => s.setMode);
  const setHealth = useAiStore((s) => s.setHealth);
  const scores = utilityScores({ distance, health });
  return (
    <>
      <div className="row">
        <button type="button" aria-pressed={mode === 'fsm'} onClick={() => setMode('fsm')}>Finite state machine</button>
        <button type="button" aria-pressed={mode === 'utility'} onClick={() => setMode('utility')}>Utility AI</button>
      </div>
      <label className="slider">
        NPC health {health}
        <input type="range" min={0} max={100} step={1} value={health} onChange={(e) => setHealth(Number(e.target.value))} />
      </label>
      <dl>
        <dt>NPC state</dt>
        <dd>{npcState}</dd>
        <dt>Distance to player (measured)</dt>
        <dd>{distance.toFixed(1)} m</dd>
        <dt>Scores (utility AI, from the current inputs)</dt>
        <dd>patrol {scores.patrol.toFixed(2)} · chase {scores.chase.toFixed(2)} · flee {scores.flee.toFixed(2)}</dd>
      </dl>
      <ConceptCard id="fsm" />
      <ConceptCard id="utility-ai" />
    </>
  );
}
