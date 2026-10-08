import { INTERACTABLES } from '@/game/world/layout';
import { useUiStore } from '@/game/store/uiStore';
import { AiControls, AnimationControls, MaterialControls, PerformanceControls, PhysicsControls, TerminalControls } from './LabControls';
import { SystemsControls } from './SystemsControls';
import { MultiplayerControls } from './MultiplayerControls';
import { ObservatoryControls } from './ObservatoryControls';
import { FeelControls } from './FeelControls';
import { WorldBuilderControls } from './WorldBuilderControls';
import { LearningMapControls } from './LearningMapControls';
import { TutorControls } from './TutorControls';

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
      {item.kind === 'multiplayer' ? <MultiplayerControls /> : null}
      {item.kind === 'observatory' ? <ObservatoryControls /> : null}
      {item.kind === 'feel' ? <FeelControls /> : null}
      {item.kind === 'worldbuilder' ? <WorldBuilderControls /> : null}
      {item.kind === 'learning' ? <LearningMapControls /> : null}
      {item.kind === 'tutor' ? <TutorControls /> : null}
      <button type="button" onClick={() => openInteraction(null)}>Close (Esc)</button>
    </section>
  );
}
