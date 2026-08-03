'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Banner, Button, Spinner } from '@/components/ui';
import { IdentitySwitcher } from '@/components/IdentitySwitcher';
import { useSession } from '@/lib/session';
import { SpaProvider, useSpa } from '@/lib/spa';

const NAV = [
  { href: '/admin', label: 'Members' },
  { href: '/admin/staff', label: 'Staff & roles' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/hours', label: 'Hours & booking' },
  { href: '/admin/faq', label: 'FAQ' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { staff, loading } = useSession();
  const router = useRouter();

  if (loading) return <Spinner label="Opening the admin console" />;

  if (!staff) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold tracking-tight">Admin sign-in</h1>
        <p className="text-sm leading-relaxed text-muted">Pick an admin account to open the console.</p>
        <Button variant="primary" onClick={() => router.push('/demo')}>
          Choose an account
        </Button>
      </main>
    );
  }

  if (staff.role !== 'admin') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6">
        <Banner tone="warn" title="Support reps can’t open the admin console">
          {staff.full_name} has the support role. An admin can promote the account under Staff &amp; roles.
        </Banner>
        <Button variant="primary" onClick={() => router.push('/support')}>
          Back to the front desk
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
  const { signOut } = useSession();
  const { settings } = useSpa();
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-ink">
      <header className="sticky top-0 z-30 border-b border-line-soft bg-shell/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/admin" className="mr-2 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">Admin console</p>
            <p className="truncate text-sm font-semibold tracking-tight">
              {settings?.spa_name ?? 'Reserve My Spot'}
            </p>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/support"
              className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted hover:border-faint hover:text-text"
            >
              Front desk
            </Link>
            <IdentitySwitcher kind="staff" />
            <button
              onClick={() => signOut('staff')}
              className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted hover:border-faint hover:text-text"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {NAV.map((n) => {
            const active = n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? 'bg-accent-wash text-accent' : 'text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
