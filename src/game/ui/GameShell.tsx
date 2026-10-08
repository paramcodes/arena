'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { pickRenderer, probeEnvironment } from '@/web/features';
import { logEvent } from '@/observability/log';
import { ErrorBoundary } from './ErrorBoundary';
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
  const childMode = useUiStore((s) => s.childMode);
  const notice = useUiStore((s) => s.notice);
  // Null until the browser has been checked (the server cannot know, so the first paint says so).
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    setCanRender(pickRenderer(probeEnvironment()) !== 'none');
    const onError = (e: ErrorEvent) => logEvent('error', 'window error', { message: e.message.slice(0, 120) });
    const onRejection = () => logEvent('error', 'unhandled promise rejection');
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
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
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return (
    <main className={`app ${highContrast ? 'hc' : ''} ${reducedMotion ? 'rm' : ''} ${childMode ? 'child' : ''}`}>
      <div className="world" role="region" aria-label="3D world. Explanations are in the side panels.">
        {canRender === null ? (
          <div className="panel" style={{ top: 12, left: 12 }}>Checking your browser…</div>
        ) : canRender ? (
          <ErrorBoundary>
            <Scene />
          </ErrorBoundary>
        ) : (
          <div className="panel" role="status" style={{ top: 12, left: 12, width: 'min(460px, calc(100vw - 24px))' }}>
            This browser cannot show the 3D view (it has no WebGL 2). The lessons, missions, and panels still work. Open the Web observatory panel to see what is missing.
          </div>
        )}
      </div>
      <TopBar />
      <MissionPanel />
      <InteractionPrompt />
      <DialogPanel />
      <PauseMenu />
      <Inspector />
      {notice ? <div className="panel notice" role="status">{notice}</div> : null}
    </main>
  );
}
