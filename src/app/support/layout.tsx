'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge, Button, Spinner } from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import { useSession } from '@/lib/session';
import { SpaProvider, useSpa } from '@/lib/spa';
import type { ChatThread } from '@/lib/types';
import { NotificationBell } from '@/components/NotificationBell';

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const { staff, loading } = useSession();
  const router = useRouter();

  if (loading) return <Spinner label="Opening the front desk" />;

  if (!staff) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold tracking-tight">Front desk sign-in</h1>
        <p className="text-sm leading-relaxed text-muted">
          Pick a support rep or admin account to open the desk portal.
        </p>
        <Button variant="primary" onClick={() => router.push('/demo')}>
          Choose an account
        </Button>
      </main>
    );
  }

  return (
    <SpaProvider>
      <Shell>{children}</Shell>
    </SpaProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { staff, signOut } = useSession();
  const { settings } = useSpa();
  const pathname = usePathname();
  const { rows: threads } = useLiveTable<ChatThread>('rms_chat_threads');
  const unread = threads.reduce((n, t) => n + t.unread_staff, 0);

  const nav = [
    { href: '/support', label: 'Room board' },
    { href: '/support/chat', label: 'Member chat', badge: unread },
  ];

  return (
    <div className="min-h-dvh bg-ink">
      <header className="sticky top-0 z-30 border-b border-line-soft bg-shell/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/support" className="mr-2 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">Front desk</p>
            <p className="truncate text-sm font-semibold tracking-tight">
              {settings?.spa_name ?? 'Reserve My Spot'}
            </p>
          </Link>

          <nav className="flex items-center gap-1">
            {nav.map((n) => {
              const active = n.href === '/support' ? pathname === '/support' : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    active ? 'bg-accent-wash text-accent' : 'text-muted hover:bg-surface-2 hover:text-text'
                  }`}
                >
                  {n.label}
                  {n.badge ? <Badge tone="accent">{n.badge}</Badge> : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            {staff?.role === 'admin' ? (
              <Link
                href="/admin"
                className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted hover:border-faint hover:text-text"
              >
                Admin
              </Link>
            ) : null}
            <span className="hidden text-right sm:block">
              <span className="block text-[13px] font-medium leading-tight">{staff?.full_name}</span>
              <span className="block text-[10px] uppercase tracking-wider text-faint">{staff?.role}</span>
            </span>
            <button
              onClick={() => signOut('staff')}
              className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted hover:border-faint hover:text-text"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
