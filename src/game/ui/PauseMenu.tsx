import { useUiStore } from '@/game/store/uiStore';
import { useWorldStore } from '@/game/store/worldStore';
import { useMissionStore } from '@/missions/missionStore';

export function PauseMenu() {
  const paused = useUiStore((s) => s.paused);
  const setPaused = useUiStore((s) => s.setPaused);
  const reducedMotion = useUiStore((s) => s.reducedMotion);
  const setReducedMotion = useUiStore((s) => s.setReducedMotion);
  const highContrast = useUiStore((s) => s.highContrast);
  const setHighContrast = useUiStore((s) => s.setHighContrast);
  const resetWorld = useWorldStore((s) => s.resetWorld);
  const resetMissions = useMissionStore((s) => s.reset);
  if (!paused) return null;

  return (
    <div className="overlay">
      <section className="panel pause" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <h2 id="pause-title">Paused</h2>
        <button type="button" onClick={() => setPaused(false)}>Resume (Esc)</button>
        <button type="button" onClick={() => { resetWorld(); setPaused(false); }}>Reset world (R)</button>
        <button type="button" onClick={() => resetMissions()}>Reset mission progress</button>
        <label>
          <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} /> Reduce motion
        </label>
        <label>
          <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} /> High contrast
        </label>
      </section>
    </div>
  );
}
