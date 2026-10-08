import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('./security-headers.json', import.meta.url), 'utf8'));
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const securityHeaders = [...config.headers, { key: 'Content-Security-Policy', value: config.csp[env] }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
export default nextConfig;
