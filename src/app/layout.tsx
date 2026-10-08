import type { Metadata } from 'next';
import './globals.css';

// Each response needs its own script nonce (set in src/middleware.ts), so pages cannot be pre-rendered once at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Game Development Learning World',
  description: 'Learn game development by playing with the systems.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
