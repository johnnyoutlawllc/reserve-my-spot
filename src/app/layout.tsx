import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { SessionProvider } from '@/lib/session';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://reservemy.spot'),
  title: {
    default: 'Reserve My Spot — hold your spot at the spa before you leave home',
    template: '%s · Reserve My Spot',
  },
  description:
    'A waitlist app for premium spa memberships. Members claim a spot for Red Light Therapy, the Wave Massage bed, tanning and more, share their drive, and the front desk knows who is actually on the way.',
  applicationName: 'Reserve My Spot',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Reserve My Spot' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Reserve My Spot',
    description: 'Skip the lobby. Claim your spot before you leave the house.',
    type: 'website',
    siteName: 'Reserve My Spot',
    url: 'https://reservemy.spot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reserve My Spot',
    description: 'Skip the lobby. Claim your spot before you leave the house.',
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
        <AuthProvider>
          <SessionProvider>{children}</SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
