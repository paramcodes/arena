import { INTERACTABLES } from '@/game/world/layout';
import { useUiStore } from '@/game/store/uiStore';
import { AiControls, AnimationControls, MaterialControls, PerformanceControls, PhysicsControls, TerminalControls } from './LabControls';
import { SystemsControls } from './SystemsControls';

export function DialogPanel() {
  const openId = useUiStore((s) => s.openInteractionId);
  const openInteraction = useUiStore((s) => s.openInteraction);
  const item = INTERACTABLES.find((i) => i.id === openId);
  if (!item) return null;

  return (
    <section className="panel dialog" role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">{item.title}</h2>
      {item.body.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {item.kind === 'terminal' ? <TerminalControls /> : null}
      {item.kind === 'material' ? <MaterialControls /> : null}
      {item.kind === 'performance' ? <PerformanceControls /> : null}
      {item.kind === 'physics' ? <PhysicsControls /> : null}
      {item.kind === 'animation' ? <AnimationControls /> : null}
      {item.kind === 'ai' ? <AiControls /> : null}
      {item.kind === 'systems' ? <SystemsControls /> : null}
      <button type="button" onClick={() => openInteraction(null)}>Close (Esc)</button>
    </section>
  );
}
