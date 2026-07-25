import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/lib/session';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Reserve My Spot',
  description:
    'Premium spa members claim a spot from home instead of waiting in the lobby. Live waitlist, driving ETA, and front-desk chat.',
  applicationName: 'Reserve My Spot',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Reserve My Spot' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Reserve My Spot',
    description: 'Skip the lobby. Claim your spot before you leave the house.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#070908',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-ink text-text">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
