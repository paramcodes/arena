// Keyboard state kept outside React so the game loop can read it every frame.
const held = new Set<string>();
const pending = new Set<string>();
const GAME_KEYS = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

export function installKeyboard(target: Window = window): () => void {
  const onDown = (e: KeyboardEvent) => {
    if (!held.has(e.code)) pending.add(e.code);
    held.add(e.code);
    if (GAME_KEYS.has(e.code)) e.preventDefault();
  };
  const onUp = (e: KeyboardEvent) => held.delete(e.code);
  const onBlur = () => held.clear();
  target.addEventListener('keydown', onDown);
  target.addEventListener('keyup', onUp);
  target.addEventListener('blur', onBlur);
  return () => {
    target.removeEventListener('keydown', onDown);
    target.removeEventListener('keyup', onUp);
    target.removeEventListener('blur', onBlur);
    held.clear();
    pending.clear();
  };
}

export function isHeld(code: string): boolean {
  return held.has(code);
}

// True once per key press. Reading it consumes the press.
export function consumePress(code: string): boolean {
  if (pending.has(code)) {
    pending.delete(code);
    return true;
  }
  return false;
}
