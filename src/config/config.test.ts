import { describe, expect, it } from 'vitest';
import securityConfig from '../../security-headers.json';

const byKey = (key: string) => securityConfig.headers.find((h) => h.key === key)?.value;
const prodCsp = securityConfig.csp.production;

describe('security headers', () => {
  it('forbids framing and MIME sniffing', () => {
    expect(byKey('X-Frame-Options')).toBe('DENY');
    expect(byKey('X-Content-Type-Options')).toBe('nosniff');
    expect(prodCsp).toContain("frame-ancestors 'none'");
  });

  it('only allows scripts and connections from this origin', () => {
    expect(prodCsp).toContain("default-src 'self'");
    expect(prodCsp).not.toMatch(/https?:\/\/\*/);
    expect(prodCsp).toContain("connect-src 'self'");
  });

  it('production does not allow eval in scripts (only the dev server needs it)', () => {
    expect(prodCsp).not.toContain("'unsafe-eval'");
  });

  it('production allows WebAssembly compilation, which the physics engine needs', () => {
    // Regression: removing unsafe-eval also blocked Rapier's WebAssembly and crashed the 3D view.
    expect(prodCsp).toContain("'wasm-unsafe-eval'");
    expect(securityConfig.csp.development).toContain('unsafe-eval');
  });

  it('turns on cross-origin isolation so SharedArrayBuffer can be used', () => {
    expect(byKey('Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(byKey('Cross-Origin-Embedder-Policy')).toBe('require-corp');
  });
});
