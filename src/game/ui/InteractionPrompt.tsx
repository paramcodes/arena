import { INTERACTABLES } from '@/game/world/layout';
import { useUiStore } from '@/game/store/uiStore';

export function InteractionPrompt() {
  const nearbyId = useUiStore((s) => s.nearbyId);
  const open = useUiStore((s) => s.openInteractionId);
  const item = INTERACTABLES.find((i) => i.id === nearbyId);
  if (!item || open) return null;
  return (
    <div className="prompt" role="status">
      Press <kbd>E</kbd>: {item.label}
    </div>
  );
}
