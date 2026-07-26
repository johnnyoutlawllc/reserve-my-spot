import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live demo',
  description:
    'Open the member app, the front desk portal, or the admin console. No account needed — the demo runs on a live database seeded with fictional members.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
