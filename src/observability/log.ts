// In-memory event log. Nothing is sent off the device. Entries carry only primitive values.
export type LogLevel = 'info' | 'warn' | 'error';
export type LogData = Record<string, string | number | boolean>;

export interface LogEntry {
  at: number;
  level: LogLevel;
  message: string;
  data?: LogData;
}

const MAX_ENTRIES = 100;
const entries: LogEntry[] = [];

export function logEvent(level: LogLevel, message: string, data?: LogData): void {
  entries.push({ at: Date.now(), level, message: message.slice(0, 200), data });
  if (entries.length > MAX_ENTRIES) entries.shift();
  if (level === 'error' && typeof console !== 'undefined') {
    console.error(`[gdlw] ${message}`, data ?? '');
  }
}

export function recentLogs(n = 20): LogEntry[] {
  return entries.slice(-n);
}

export function clearLogs(): void {
  entries.length = 0;
}
