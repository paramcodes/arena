import type { Metadata } from 'next';
import './globals.css';

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
