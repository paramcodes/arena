import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, newNonce } from '@/config/csp';

// A new nonce on every request. Next.js reads the policy from the request headers and
// applies the nonce to its own inline scripts; the same policy goes out in the response.
export function middleware(request: NextRequest) {
  const nonce = newNonce();
  const csp = buildCsp({ nonce, development: process.env.NODE_ENV !== 'production' });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [{ source: '/((?!_next/static|_next/image|favicon.ico).*)' }],
};
