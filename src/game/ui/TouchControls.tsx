'use client';

import { useEffect, useState } from 'react';
import { touchInput } from '@/game/input/keyboard';

// On-screen controls for touch screens. Shown only when the main pointer is coarse (a finger).
export function TouchControls() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true);
  }, []);
  if (!show) return null;

  const hold = (x: number, y: number) => () => {
    touchInput.x = x;
    touchInput.y = y;
  };
  const release = () => {
    touchInput.x = 0;
    touchInput.y = 0;
  };
  const dir = (label: string, x: number, y: number) => (
    <button type="button" aria-label={label} onPointerDown={hold(x, y)} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}>
      {label}
    </button>
  );

  return (
    <div className="touch" aria-label="Touch controls">
      <div className="dpad">
        <div />
        {dir('↑', 0, 1)}
        <div />
        {dir('←', -1, 0)}
        <div />
        {dir('→', 1, 0)}
        <div />
        {dir('↓', 0, -1)}
        <div />
      </div>
      <div className="touch-actions">
        <button type="button" aria-label="Jump" onPointerDown={() => (touchInput.jumpRequested = true)}>Jump</button>
        <button type="button" aria-label="Interact" onPointerDown={() => (touchInput.interactRequested = true)}>E</button>
      </div>
    </div>
  );
}
