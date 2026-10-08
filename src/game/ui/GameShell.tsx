'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { installKeyboard } from '@/game/input/keyboard';
import { useUiStore } from '@/game/store/uiStore';
import { useWorldStore } from '@/game/store/worldStore';
import { TopBar } from './TopBar';
import { MissionPanel } from './MissionPanel';
import { InteractionPrompt } from './InteractionPrompt';
import { DialogPanel } from './DialogPanel';
import { PauseMenu } from './PauseMenu';
import { Inspector } from './Inspector';

// The 3D canvas needs the browser, so it loads only on the client.
const Scene = dynamic(() => import('@/game/scene/Scene'), {
  ssr: false,
  loading: () => <div className="panel" style={{ top: 12, left: 12 }}>Loading the world…</div>,
});

export function GameShell() {
  const highContrast = useUiStore((s) => s.highContrast);
  const reducedMotion = useUiStore((s) => s.reducedMotion);

  useEffect(() => {
    const removeKeys = installKeyboard();
    const onKey = (e: KeyboardEvent) => {
      const ui = useUiStore.getState();
      if (e.code === 'Escape') {
        if (ui.openInteractionId) ui.openInteraction(null);
        else ui.togglePause();
      } else if (e.code === 'F3') {
        e.preventDefault();
        ui.toggleInspector();
      } else if (e.code === 'KeyR' && !ui.paused && !ui.openInteractionId) {
        useWorldStore.getState().resetWorld();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      removeKeys();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <main className={`app ${highContrast ? 'hc' : ''} ${reducedMotion ? 'rm' : ''}`}>
      <div className="world" role="region" aria-label="3D world. Explanations are in the side panels.">
        <Scene />
      </div>
      <TopBar />
      <MissionPanel />
      <InteractionPrompt />
      <DialogPanel />
      <PauseMenu />
      <Inspector />
    </main>
  );
}
