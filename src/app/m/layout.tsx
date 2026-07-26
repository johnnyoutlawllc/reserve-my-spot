'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Spinner } from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import { useSession } from '@/lib/session';
import { SpaProvider, useSpa } from '@/lib/spa';
import type { ChatThread, WaitlistEntry } from '@/lib/types';
import { LIVE_STATUSES } from '@/lib/types';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { member, loading } = useSession();
  const router = useRouter();

  if (loading) return <Spinner label="Opening your app" />;

  if (!member) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold tracking-tight">Pick a member to continue</h1>
        <p className="text-sm leading-relaxed text-muted">
          The demo has no passwords. Choose which seeded member you want to be and the app opens as them.
        </p>
        <Button variant="primary" onClick={() => router.push('/demo')}>
          Choose a member
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

const TABS = [
  {
    href: '/m',
    label: 'Book',
    icon: (
      <path d="M4 6.5h16M4 12h16M4 17.5h10" strokeLinecap="round" />
    ),
  },
  {
    href: '/m/spot',
    label: 'My Spot',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: '/m/ask',
    label: 'Ask',
    icon: (
      <path
        d="M20 12.5c0 3.9-3.6 7-8 7-.9 0-1.8-.1-2.6-.4L4.5 21l1.2-3.4A6.7 6.7 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z"
        strokeLinecap="round"
      />
    ),
  },
  {
    href: '/m/faq',
    label: 'FAQ',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.6 9.4a2.4 2.4 0 1 1 3.4 2.2c-.6.3-1 .9-1 1.6v.3M12 16.6h.01" strokeLinecap="round" />
      </>
    ),
  },
];

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { member, signOut } = useSession();
  const { settings } = useSpa();
  const { rows: waitlist } = useLiveTable<WaitlistEntry>('rms_waitlist');
  const { rows: threads } = useLiveTable<ChatThread>('rms_chat_threads');

  const activeSpots = waitlist.filter(
    (e) => e.member_id === member?.id && LIVE_STATUSES.includes(e.status),
  ).length;
  const unread = threads
    .filter((t) => t.member_id === member?.id)
    .reduce((sum, t) => sum + t.unread_member, 0);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-shell">
      <header className="sticky top-0 z-30 border-b border-line-soft bg-shell/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-accent">
              {settings?.spa_name ?? 'Reserve My Spot'}
            </p>
            <p className="truncate text-[15px] font-semibold tracking-tight">
              Hi, {member?.full_name.split(' ')[0]}
            </p>
          </div>
          <button
            onClick={() => signOut('member')}
            className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted hover:border-faint hover:text-text"
          >
            Switch user
          </button>
        </div>
      </header>

      <main className="grow px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line-soft bg-shell/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur">
        <ul className="grid grid-cols-4">
          {TABS.map((tab) => {
            const active = tab.href === '/m' ? pathname === '/m' : pathname.startsWith(tab.href);
            const badge = tab.href === '/m/spot' ? activeSpots : tab.href === '/m/ask' ? unread : 0;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                    active ? 'text-accent' : 'text-faint hover:text-muted'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="size-5"
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </svg>
                  {tab.label}
                  {badge > 0 ? (
                    <span className="absolute right-[22%] top-1.5 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-ink">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
