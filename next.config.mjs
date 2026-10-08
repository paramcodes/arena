import { readFileSync } from 'node:fs';

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
