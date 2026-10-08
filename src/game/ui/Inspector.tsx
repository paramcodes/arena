import { useUiStore } from '@/game/store/uiStore';
import { useWorldStore } from '@/game/store/worldStore';
import { SimulationLab } from './SimulationLab';

const fmt = (v: readonly number[]) => v.map((n) => n.toFixed(2)).join(', ');

export function Inspector() {
  const open = useUiStore((s) => s.inspectorOpen);
  const player = useWorldStore((s) => s.player);
  const colliderOn = useWorldStore((s) => s.wallColliderEnabled);
  if (!open) return null;

  return (
    <aside className="panel inspector" aria-label="Inspector">
      <h2>Inspector</h2>
      <h3>Live world (PLAYER)</h3>
      <dl>
        <dt>position</dt>
        <dd>{fmt(player.position)}</dd>
        <dt>velocity</dt>
        <dd>{fmt(player.velocity)}</dd>
        <dt>grounded</dt>
        <dd>{String(player.grounded)}</dd>
        <dt>Wall-01 collider</dt>
        <dd>{colliderOn ? 'on' : 'off'}</dd>
      </dl>
      <SimulationLab />
    </aside>
  );
}
