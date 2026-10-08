'use client';

import { Component, type ReactNode } from 'react';
import { logEvent } from '@/observability/log';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

// If the 3D view crashes, show a readable message and keep the lessons and panels working.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    logEvent('error', 'The 3D view failed to render', { name: error.name });
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="panel" role="alert" style={{ top: 12, left: 12, width: 'min(420px, calc(100vw - 24px))' }}>
          <p>The 3D view stopped working. The lessons and panels still work.</p>
          <button type="button" onClick={() => this.setState({ error: null })}>Try the 3D view again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
