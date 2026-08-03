'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge, Button, Card } from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import { useSession } from '@/lib/session';
import type { Member, Service, Settings, Staff } from '@/lib/types';

type Lane = 'member' | 'support' | 'admin' | 'split';

const LANES: {
  key: Lane;
  title: string;
  blurb: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'member',
    title: 'Member app',
    blurb:
      'What a premium member sees on their phone. Pick a service, watch the live wait, share location so the desk holds your spot.',
    cta: 'Open as member',
    href: '/m',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
        <rect x="6" y="2.5" width="12" height="19" rx="3" />
        <path d="M10.5 5.5h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'support',
    title: 'Front desk portal',
    blurb:
      'Incoming requests, the live room board, and every member’s driving ETA. Accept, call up, bump, or release a spot.',
    cta: 'Open as support rep',
    href: '/support',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
        <path d="M4 18h16M6 18V9.5a6 6 0 0 1 12 0V18" strokeLinecap="round" />
        <path d="M9 13h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'admin',
    title: 'Admin console',
    blurb:
      'Memberships and dates, staff roles, the service menu, store hours, the online booking window, and the FAQ.',
    cta: 'Open as admin',
    href: '/admin',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2.5v3M12 18.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'split',
    title: 'Member and front desk together',
    blurb:
      'Both screens on one page, side by side on a desktop and stacked on a phone. Drag the bar to resize, hide either side, and watch a request land at the desk as you make it.',
    cta: 'Open both views',
    href: '/demo/split',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="M12 4.5v15" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { signIn, signOut, member: signedInMember, staff: signedInStaff } = useSession();

  const { rows: members } = useLiveTable<Member>('rms_members', {
    order: { column: 'full_name' },
  });
  const { rows: staff } = useLiveTable<Staff>('rms_staff', {
    order: { column: 'full_name' },
  });
  const { rows: services } = useLiveTable<Service>('rms_services', { order: { column: 'sort_order' } });
  const { rows: settingsRows } = useLiveTable<Settings>('rms_settings');
  const settings = settingsRows[0];

  // Pick a sensible default identity per lane so the buttons drop you straight
  // into the app. You can swap to anyone else from the switcher in the top bar.
  function defaultFor(lane: Lane): Member | Staff | undefined {
    if (lane === 'member') return members.find((m) => m.is_active) ?? members[0];
    if (lane === 'admin') return staff.find((s) => s.role === 'admin');
    return staff.find((s) => s.role === 'support'); // support, and the desk half of split
  }

  function readyFor(lane: Lane) {
    if (lane === 'split') return Boolean(defaultFor('member') && defaultFor('support'));
    return Boolean(defaultFor(lane));
  }

  function enter(l: (typeof LANES)[number]) {
    if (l.key === 'split') {
      const asMember = defaultFor('member');
      const atDesk = defaultFor('support');
      if (!asMember || !atDesk) return;
      // Split needs both seats filled at once. Anyone already signed in keeps
      // their identity so the pair you picked earlier is the pair you see.
      if (!signedInMember) signIn({ kind: 'member', id: asMember.id });
      if (!signedInStaff) signIn({ kind: 'staff', id: atDesk.id });
      router.push(l.href);
      return;
    }
    const pick = defaultFor(l.key);
    if (!pick) return; // data still loading; the button is disabled until it lands
    signIn({ kind: l.key === 'member' ? 'member' : 'staff', id: pick.id });
    router.push(l.href);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:pt-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-faint transition-colors hover:text-text"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to reservemy.spot
      </Link>

      <header className="mt-6 max-w-2xl">
        <Badge tone="accent">Live demo</Badge>
        <h1 className="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          Take the whole product for a spin.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          This is the real application, running against a live database seeded with fictional members. Premium
          spa members claim a spot before they leave the house; the front desk sees the request the instant it
          lands, along with the member’s live driving ETA, so a spot is held for someone genuinely on the way,
          and released when they aren’t.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-faint">
          No account needed. Pick any identity below and you are in.
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { k: 'Services live', v: services.filter((s) => s.is_active).length },
          { k: 'Members seeded', v: members.length },
          { k: 'Spa', v: settings?.spa_name ?? '-' },
        ].map((s) => (
          <Card key={s.k} className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">{s.k}</p>
            <p className="mt-1 truncate text-lg font-semibold tracking-tight">{s.v}</p>
          </Card>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">Pick a seat</h2>
        <p className="mt-1.5 text-sm text-muted">
          Three surfaces, one live database. Member and staff sign-ins are kept separate, so you can be a
          member in one tab and the front desk in another and watch them talk to each other. Or take the
          last card and get both on one screen.
        </p>

        {signedInMember || signedInStaff ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {signedInMember ? (
              <SignedInChip
                label={`Member · ${signedInMember.full_name}`}
                onOpen={() => router.push('/m')}
                onOut={() => signOut('member')}
              />
            ) : null}
            {signedInStaff ? (
              <SignedInChip
                label={`${signedInStaff.role === 'admin' ? 'Admin' : 'Support'} · ${signedInStaff.full_name}`}
                onOpen={() => router.push(signedInStaff.role === 'admin' ? '/admin' : '/support')}
                onOut={() => signOut('staff')}
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANES.map((l) => {
            const ready = readyFor(l.key);
            return (
              <Card key={l.key} className="flex flex-col p-5">
                <div className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-wash text-accent">
                  {l.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{l.title}</h3>
                <p className="mt-2 grow text-[13px] leading-relaxed text-muted">{l.blurb}</p>
                <Button
                  variant="primary"
                  className="mt-5"
                  disabled={!ready}
                  onClick={() => enter(l)}
                >
                  {ready ? l.cta : 'Loading…'}
                </Button>
              </Card>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-faint">
          You drop straight in as a seeded identity. Switch to anyone else from the menu in the top bar.
        </p>
      </section>

      <footer className="mt-14 border-t border-line-soft pt-6 text-xs leading-relaxed text-faint">
        <p>
          Demo build. Seeded members and staff are fictional, and front desk actions write to a live shared
          database, so anything you do here is visible to anyone else with the link.
        </p>
        <p className="mt-2">
          <a href="https://69.studio" className="text-muted underline decoration-line hover:text-accent">
            A 69.studio project
          </a>
        </p>
      </footer>
    </main>
  );
}

function SignedInChip({
  label,
  onOpen,
  onOut,
}: {
  label: string;
  onOpen: () => void;
  onOut: () => void;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent-wash py-1 pl-3 pr-1 text-[12px] text-accent">
      <button onClick={onOpen} className="font-medium hover:underline">
        {label}
      </button>
      <button
        onClick={onOut}
        aria-label={`Sign out ${label}`}
        className="flex size-5 items-center justify-center rounded-full text-accent/60 hover:bg-accent/15 hover:text-accent"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}
