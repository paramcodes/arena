// Content-Security-Policy, built per request. Scripts need a nonce that changes every time,
// so the policy is generated in middleware rather than fixed in a config file.

export interface CspOptions {
  nonce: string;
  development: boolean;
}

export function buildCsp({ nonce, development }: CspOptions): string {
  // strict-dynamic lets scripts with the nonce load the app's chunks, so chunk URLs need no allowlist.
  const scriptSrc = [`'self'`, `'nonce-${nonce}'`, `'strict-dynamic'`, `'wasm-unsafe-eval'`];
  if (development) scriptSrc.push(`'unsafe-eval'`);
  // Inline style attributes come from React, drei, and three.js overlays, and cannot carry a nonce.
  const styleSrc = [`'self'`, `'unsafe-inline'`];
  const connectSrc = [`'self'`];
  if (development) connectSrc.push('ws:', 'wss:');
  return [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc.join(' ')}`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ');
}

export function newNonce(): string {
  return btoa(crypto.randomUUID());
}
