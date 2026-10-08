import { describe, expect, it, beforeEach } from 'vitest';
import { clearLogs, logEvent, recentLogs } from './log';

describe('logEvent', () => {
  beforeEach(() => clearLogs());

  it('keeps only the most recent entries', () => {
    for (let i = 0; i < 150; i++) logEvent('info', `event ${i}`);
    const all = recentLogs(1000);
    expect(all.length).toBe(100);
    expect(all[all.length - 1].message).toBe('event 149');
  });

  it('truncates very long messages', () => {
    logEvent('warn', 'x'.repeat(500));
    expect(recentLogs(1)[0].message.length).toBe(200);
  });
});
