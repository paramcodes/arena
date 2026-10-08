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

export const clampUnit = (v: number): number => Math.max(-1, Math.min(1, v));

// Gamepad: left stick for movement, button A for jump. Returns zeros when no pad is connected.
let prevA = false;
export function readGamepad(): { x: number; y: number; jump: boolean } {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const pad = nav?.getGamepads?.()[0] ?? null;
  if (!pad) return { x: 0, y: 0, jump: false };
  const dead = (v: number) => (Math.abs(v) < 0.15 ? 0 : v);
  const a = pad.buttons[0]?.pressed ?? false;
  const jump = a && !prevA;
  prevA = a;
  return { x: dead(pad.axes[0] ?? 0), y: dead(pad.axes[1] ?? 0), jump };
}

// Touch buttons write here. The player reads it each frame, like the keyboard and gamepad.
export const touchInput = { x: 0, y: 0, jumpRequested: false, interactRequested: false };

export function takeTouchJump(): boolean {
  const v = touchInput.jumpRequested;
  touchInput.jumpRequested = false;
  return v;
}

export function takeTouchInteract(): boolean {
  const v = touchInput.interactRequested;
  touchInput.interactRequested = false;
  return v;
}
