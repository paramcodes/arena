import { INTERACTABLES } from '@/game/world/layout';
import { useUiStore } from '@/game/store/uiStore';
import { useWorldStore } from '@/game/store/worldStore';

export function DialogPanel() {
  const openId = useUiStore((s) => s.openInteractionId);
  const openInteraction = useUiStore((s) => s.openInteraction);
  const colliderOn = useWorldStore((s) => s.wallColliderEnabled);
  const setCollider = useWorldStore((s) => s.setWallCollider);
  const item = INTERACTABLES.find((i) => i.id === openId);
  if (!item) return null;

  return (
    <section className="panel dialog" role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">{item.title}</h2>
      {item.body.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {item.kind === 'terminal' ? (
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
      ) : null}
      <button type="button" onClick={() => openInteraction(null)}>Close (Esc)</button>
    </section>
  );
}
