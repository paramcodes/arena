import { describe, expect, it } from 'vitest';
import { buildCsp, newNonce } from './csp';
import securityConfig from '../../security-headers.json';

const directive = (csp: string, name: string) =>
  csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? '';

describe('production policy', () => {
  const csp = buildCsp({ nonce: 'abc123', development: false });

  it('allows scripts only with this request\'s nonce', () => {
    expect(directive(csp, 'script-src')).toContain("'nonce-abc123'");
    expect(directive(csp, 'script-src')).toContain("'strict-dynamic'");
  });

  it('has no unsafe-inline or unsafe-eval for scripts', () => {
    const scripts = directive(csp, 'script-src');
    expect(scripts).not.toContain("'unsafe-inline'");
    expect(scripts).not.toContain("'unsafe-eval'");
  });

  it('allows WebAssembly compilation, which the physics engine needs', () => {
    expect(directive(csp, 'script-src')).toContain("'wasm-unsafe-eval'");
  });

  it('blocks framing, plugins, and foreign base URLs', () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it('keeps connections to this origin only', () => {
    expect(directive(csp, 'connect-src')).toBe("connect-src 'self'");
  });
});

describe('nonces', () => {
  it('differ between requests', () => {
    expect(newNonce()).not.toBe(newNonce());
    expect(newNonce().length).toBeGreaterThan(8);
  });

  it('are put into the policy exactly as given', () => {
    expect(buildCsp({ nonce: 'n1', development: false })).not.toBe(buildCsp({ nonce: 'n2', development: false }));
  });
});

describe('development policy', () => {
  it('allows eval for the dev server and websocket hot reload', () => {
    const dev = buildCsp({ nonce: 'x', development: true });
    expect(directive(dev, 'script-src')).toContain("'unsafe-eval'");
    expect(directive(dev, 'connect-src')).toContain('ws:');
  });
});

describe('static security headers', () => {
  const byKey = (key: string) => securityConfig.headers.find((h) => h.key === key)?.value;
  it('forbid framing and MIME sniffing, and turn on cross-origin isolation', () => {
    expect(byKey('X-Frame-Options')).toBe('DENY');
    expect(byKey('X-Content-Type-Options')).toBe('nosniff');
    expect(byKey('Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(byKey('Cross-Origin-Embedder-Policy')).toBe('require-corp');
  });
  it('do not set a CSP here (the middleware sets it per request)', () => {
    expect(byKey('Content-Security-Policy')).toBeUndefined();
  });
});
