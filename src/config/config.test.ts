import { describe, expect, it } from 'vitest';
import securityConfig from '../../security-headers.json';

const byKey = (key: string) => securityConfig.headers.find((h) => h.key === key)?.value;

describe('security headers', () => {
  it('forbids framing and MIME sniffing', () => {
    expect(byKey('X-Frame-Options')).toBe('DENY');
    expect(byKey('X-Content-Type-Options')).toBe('nosniff');
    expect(byKey('Content-Security-Policy')).toContain("frame-ancestors 'none'");
  });

  it('only allows scripts and connections from this origin', () => {
    const csp = byKey('Content-Security-Policy') ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).not.toMatch(/https?:\/\/\*/);
    expect(csp).toContain("connect-src 'self'");
  });

  it('turns on cross-origin isolation so SharedArrayBuffer can be used', () => {
    expect(byKey('Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(byKey('Cross-Origin-Embedder-Policy')).toBe('require-corp');
  });
});
