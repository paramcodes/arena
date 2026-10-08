import { useUiStore } from '@/game/store/uiStore';

export function TopBar() {
  const togglePause = useUiStore((s) => s.togglePause);
  const toggleInspector = useUiStore((s) => s.toggleInspector);
  return (
    <header className="panel topbar">
      <h1>Game Development Learning World</h1>
      <div className="row">
        <button type="button" onClick={togglePause} aria-keyshortcuts="Escape">Pause (Esc)</button>
        <button type="button" onClick={toggleInspector} aria-keyshortcuts="F3">Inspector (F3)</button>
      </div>
      <p className="help">
        Move: <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>↑</kbd> <kbd>↓</kbd> · Turn camera: <kbd>←</kbd> <kbd>→</kbd> ·
        Jump: <kbd>Space</kbd> · Interact: <kbd>E</kbd> · Reset: <kbd>R</kbd>
      </p>
    </header>
  );
}
