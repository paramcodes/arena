import { readFileSync } from 'node:fs';

// Static headers only. The Content-Security-Policy is set per request in src/middleware.ts,
// because it needs a fresh nonce. Two policies on one response would both be enforced.
const securityHeaders = JSON.parse(readFileSync(new URL('./security-headers.json', import.meta.url), 'utf8')).headers;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
export default nextConfig;
