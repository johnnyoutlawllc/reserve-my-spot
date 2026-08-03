import Link from 'next/link';
import { AuthButton, Mark, SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ServiceIcon } from '@/components/ServiceIcon';

export const metadata = {
  title: 'Reserve My Spot · Hold your spot at the spa before you leave home',
  description:
    'A waitlist app for premium spa memberships. Members claim a spot for Red Light Therapy, the Wave Massage bed, tanning and more, share their drive, and the front desk knows who is actually on the way.',
};

/* ------------------------------------------------------------------ content */

const SERVICES = [
  { icon: 'redlight', name: 'Red Light Therapy', note: 'Panel time by the session' },
  { icon: 'wave', name: 'Wave Massage Bed', note: 'The one with the line' },
  { icon: 'tanning', name: 'Tanning Beds', note: 'Every level, every bed' },
  { icon: 'sauna', name: 'Infrared Sauna', note: 'Rooms and pods' },
  { icon: 'cryo', name: 'Cryotherapy', note: 'Single-chamber turns' },
  { icon: 'compression', name: 'Compression', note: 'Boots and recovery chairs' },
  { icon: 'salt', name: 'Halotherapy', note: 'Salt room seats' },
  { icon: 'facial', name: 'Facials & add-ons', note: 'Anything with a station' },
];

const STEPS = [
  {
    n: '01',
    title: 'Member picks a service',
    body: 'They open the app at home, see what the wait actually looks like right now, and request a spot for the time they plan to arrive.',
  },
  {
    n: '02',
    title: 'The desk sees it land',
    body: 'The request shows up on the front desk board the instant it is made. One tap to accept, and the member gets a position and a time.',
  },
  {
    n: '03',
    title: 'The drive is tracked',
    body: 'With location sharing on, the app compares their live driving ETA against when the station actually frees up. The desk stops guessing.',
  },
  {
    n: '04',
    title: 'They walk in and go',
    body: 'Called up on arrival, no lobby, no clipboard. If someone is going to miss their window, staff know early enough to do something about it.',
  },
];

/* --------------------------------------------------------------------- page */

export default function HomePage() {
  return (
    <div className="relative min-h-dvh bg-ink">
      <Glow />
      <SiteHeader />

      <main className="relative">
        <Hero />
        <Services />
        <HowItWorks />
        <Features />
        <DeskSection />
        <DemoSection />
        <Pilot />
      </main>

      <SiteFooter
        note="Members, staff and sessions shown on this page are illustrative. The demo runs on a shared live database seeded with fictional accounts, so anything you do there is visible to anyone else with the link."
      />
    </div>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pt-20">
      <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] text-muted">
            <span className="rms-live size-1.5 rounded-full bg-accent" />
            Built for premium spa memberships
          </span>

          <h1 className="mt-5 text-[clamp(2.35rem,6.2vw,4rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
            Your members hold their spot
            <br className="hidden sm:block" /> before they leave the house.
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
            Red Light Therapy, the Wave Massage bed, tanning: the popular stations always draw a line, and
            today the only way into it is to drive over and wait. Reserve My Spot puts that same line on your
            members&rsquo; phones, and puts their live drive time in front of your staff.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent/90"
            >
              Try the live demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <AuthButton size="lg" />
          </div>

          <p className="mt-4 text-[13px] text-faint">
            The demo is open to everyone, no account needed. Sign in to keep a profile.
          </p>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-accent/8 blur-3xl" />

      {/* Member phone */}
      <div className="mx-auto w-full max-w-[19rem] rounded-[2rem] border border-line bg-shell p-3 shadow-2xl shadow-black/50">
        <div className="rounded-[1.5rem] border border-line-soft bg-ink p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">My Spot</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-wash px-2 py-0.5 text-[10px] font-medium text-accent">
              <span className="rms-live size-1 rounded-full bg-accent" />
              Live
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-wash text-accent">
              <ServiceIcon icon="wave" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">Wave Massage Bed</p>
              <p className="text-[11px] text-faint">20 min session · 3 beds</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-surface px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Your position</p>
            <p className="mt-0.5 text-[2rem] font-semibold leading-none tracking-tight">2nd</p>
            <p className="mt-1.5 text-[11px] text-muted">A bed frees up in about 14 minutes</p>
          </div>

          <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4 shrink-0 text-accent"
            >
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="text-[11px] text-muted">Sharing location · you&rsquo;re 9 minutes out</span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <span className="rounded-xl border border-line bg-surface px-3 py-2 text-center text-[11px] text-muted">
              Message desk
            </span>
            <span className="rounded-xl bg-accent px-3 py-2 text-center text-[11px] font-semibold text-ink">
              On my way
            </span>
          </div>
        </div>
      </div>

      {/* Desk card, overlapping the phone */}
      <div className="mx-auto mt-[-3rem] w-[min(23rem,100%)] rounded-2xl border border-line bg-shell p-4 shadow-2xl shadow-black/50 sm:ml-auto sm:mr-0 sm:translate-x-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">Front desk</span>
          <span className="text-[10px] text-faint">Red Light Therapy</span>
        </div>
        <ul className="mt-3 space-y-2">
          <DeskRow name="M. Alvarez" detail="In session · 6 min left" tone="accent" />
          <DeskRow name="J. Whitfield" detail="Next up · arriving 4:07" tone="neutral" />
          <DeskRow name="T. Okafor" detail="ETA 12 min · panel opens in 4" tone="alert" />
        </ul>
        <p className="mt-3 text-[10.5px] leading-relaxed text-faint">
          The third member is going to miss their window. The desk finds out now, not at the counter.
        </p>
      </div>
    </div>
  );
}

function DeskRow({
  name,
  detail,
  tone,
}: {
  name: string;
  detail: string;
  tone: 'accent' | 'neutral' | 'alert';
}) {
  const dot = { accent: 'bg-accent', neutral: 'bg-info', alert: 'bg-alert' }[tone];
  const text = { accent: 'text-accent', neutral: 'text-muted', alert: 'text-alert' }[tone];
  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{name}</span>
      <span className={`shrink-0 text-[11px] ${text}`}>{detail}</span>
    </li>
  );
}

/* ----------------------------------------------------------------- services */

function Services() {
  return (
    <section id="services" className="border-y border-line-soft bg-shell/40 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>The stations members line up for</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
          Anything with a limited number of stations can have a line worth managing.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          You define the service menu. Each one carries its own session length and station count, and the
          waitlist math follows from there.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <li
              key={s.name}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-accent/35"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-muted transition-colors group-hover:border-accent/25 group-hover:bg-accent-wash group-hover:text-accent">
                <ServiceIcon icon={s.icon} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-medium tracking-tight">{s.name}</span>
                <span className="block truncate text-[11.5px] text-faint">{s.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- how it works */

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20">
      <Eyebrow>How it works</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
        The same line you run today, minus the lobby.
      </h2>

      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-2xl border border-line bg-surface p-5">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-accent">{s.n}</span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ----------------------------------------------------------------- features */

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 pb-20">
      <Eyebrow>What members and staff get</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
        More than a name on a list.
      </h2>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 lg:col-span-2 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/8 blur-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-alert/35 bg-alert-wash px-2.5 py-1 text-[11px] font-medium text-alert">
            The part booking software can&rsquo;t do
          </span>
          <h3 className="mt-4 text-[clamp(1.25rem,2.4vw,1.6rem)] font-semibold leading-snug tracking-tight">
            Staff can tell the difference between a member who is on the way and one who isn&rsquo;t.
          </h3>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted">
            A phone call tells you someone <em>says</em> they will be there at four. Opt-in location sharing
            tells you their driving ETA right now, checked against the minute their station actually frees up.
            Once they cross the grace period you set, the desk has one decision to make: bump them back, or release the
            spot. No awkward wait, no idle station.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              'Live driving ETA, refreshed as they move',
              'Late flagged against the real station opening',
              'Grace period is yours to set',
              'Opt-in per member, off by default',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13px] text-muted">
                <Check />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <FeatureCard
          title="Member profiles"
          body="Members sign in, keep their favorite services one tap away, and carry their preferences and history between visits instead of restating them at the counter."
          icon={
            <>
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </>
          }
        />
        <FeatureCard
          title="Chat with the front desk"
          body="A direct thread between the member and whoever is working the desk. Running late, swapping a service, asking whether the sauna is free: answered without a phone call."
          icon={
            <>
              <path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />
              <path d="M8.5 9.5h7M8.5 13h4" />
            </>
          }
        />
        <FeatureCard
          title="Answers built in"
          body="Your FAQ lives inside the app and is edited from the admin console, so the desk stops fielding the same five questions and members stop guessing."
          icon={
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.2a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.4" />
              <path d="M12 17h.01" />
            </>
          }
        />
        <FeatureCard
          title="Honest wait times"
          body="Estimates come from your own session lengths and station counts, simulated forward through the current line, not a flat guess that ages badly by mid-afternoon."
          icon={
            <>
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </>
          }
        />
        <FeatureCard
          title="A room board that keeps up"
          body="Every station, who is in it, and who is next, updating live on every screen at once. Call up, start, complete, bump back, or release from the same board."
          icon={
            <>
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <path d="M3 9.5h18M9 9.5V20" />
            </>
          }
        />
        <FeatureCard
          title="You run the settings"
          body="Memberships and expiry dates, staff roles, the service menu, store hours, how far ahead members may request, and whether online requests are open at all."
          icon={
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2.5v3M12 18.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
            </>
          }
        />
      </div>
    </section>
  );
}

function FeatureCard({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6">
      <span className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-wash text-accent">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          {icon}
        </svg>
      </span>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

/* --------------------------------------------------------------------- desk */

const BOARD = [
  { icon: 'redlight', name: 'Red Light Therapy', stations: '2 panels', state: 'Both running', tone: 'accent' },
  { icon: 'wave', name: 'Wave Massage Bed', stations: '3 beds', state: '4 in line', tone: 'warn' },
  { icon: 'tanning', name: 'Tanning Beds', stations: '4 beds', state: '1 open now', tone: 'neutral' },
  { icon: 'sauna', name: 'Infrared Sauna', stations: '2 rooms', state: 'Open', tone: 'neutral' },
];

function DeskSection() {
  return (
    <section className="border-y border-line-soft bg-shell/40 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Three surfaces, one live database</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
            Members, the front desk, and the office each get their own view.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Everything is realtime. A member requests a spot and it appears at the desk immediately; the desk
            calls someone up and their phone knows before they reach the counter. No refresh button anywhere.
          </p>

          <dl className="mt-8 space-y-4">
            {[
              ['Member app', 'Live waits, request a spot, position and estimate, location sharing, chat, FAQ.'],
              [
                'Front desk portal',
                'Incoming requests, the room board, driving ETA against turn time, call up, start, complete, bump, release.',
              ],
              [
                'Admin console',
                'Memberships and dates, staff roles, services and capacity, hours, request window, FAQ.',
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-l-2 border-accent/40 pl-4">
                <dt className="text-[14px] font-semibold tracking-tight">{t}</dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between border-b border-line-soft pb-3">
            <span className="text-[12px] font-semibold tracking-tight">Room board</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-accent">
              <span className="rms-live size-1.5 rounded-full bg-accent" />
              Realtime
            </span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {BOARD.map((r) => (
              <li
                key={r.name}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-3.5 py-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted">
                  <ServiceIcon icon={r.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium tracking-tight">{r.name}</span>
                  <span className="block text-[11px] text-faint">{r.stations}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    r.tone === 'accent'
                      ? 'border-accent/30 bg-accent-wash text-accent'
                      : r.tone === 'warn'
                        ? 'border-warn/30 bg-warn-wash text-warn'
                        : 'border-line bg-surface text-muted'
                  }`}
                >
                  {r.state}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-faint">Illustrative board. The demo runs on live data.</p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- demo */

const LANES = [
  {
    title: 'Member app',
    body: 'What a member sees on their phone. Pick a service, watch the wait, share the drive.',
  },
  {
    title: 'Front desk portal',
    body: 'Incoming requests, the room board, and every member’s ETA. Accept, call up, bump, release.',
  },
  {
    title: 'Admin console',
    body: 'Memberships, staff roles, the service menu, hours, request window, and the FAQ.',
  },
];

function DemoSection() {
  return (
    <section id="demo" className="mx-auto max-w-6xl px-5 py-20">
      <div className="overflow-hidden rounded-3xl border border-accent/25 bg-accent-wash/40">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-ink/40 px-3 py-1 text-[12px] text-accent">
              <span className="rms-live size-1.5 rounded-full bg-accent" />
              Open to everyone
            </span>
            <h2 className="mt-4 text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
              Walk through the whole thing yourself.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              No sign-up, no sales call. The demo is the real application running against a live database with
              fictional members. Open the member view on your phone and the front desk on a laptop, and the two
              will talk to each other in real time.
            </p>
            <Link
              href="/demo"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent/90"
            >
              Open the demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <ul className="grid gap-3">
            {LANES.map((l) => (
              <li key={l.title}>
                <Link
                  href="/demo"
                  className="flex items-center gap-4 rounded-2xl border border-line bg-shell px-4 py-3.5 transition-colors hover:border-accent/40"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold tracking-tight">{l.title}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted">{l.body}</span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-4 shrink-0 text-faint"
                  >
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- pilot */

function Pilot() {
  return (
    <section id="pilot" className="mx-auto max-w-6xl px-5 pb-24">
      <div className="rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
        <Mark className="mx-auto size-11" />
        <h2 className="mt-5 text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
          Want this running at your spa?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          We take on a small number of locations at a time and configure it with you: your services, your
          station counts, your hours, your rules for who gets bumped. Tell us how your line works today.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-2xl bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent/90"
          >
            Start a conversation
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center rounded-2xl border border-line bg-surface-2 px-6 text-[15px] font-medium transition-colors hover:border-faint"
          >
            See pricing
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-12 items-center rounded-2xl border border-line bg-surface-2 px-6 text-[15px] font-medium transition-colors hover:border-faint"
          >
            See the demo first
          </Link>
        </div>
        <p className="mt-5 text-[13px] text-faint">
          $329 a month for a single location, less per location as you grow. Every number is published.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- pieces */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{children}</p>;
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-0.5 size-3.5 shrink-0 text-accent"
    >
      <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Glow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[36rem]"
      style={{
        background:
          'radial-gradient(60rem 26rem at 15% -8%, rgba(47,212,180,0.13), transparent 65%), radial-gradient(45rem 22rem at 95% 4%, rgba(106,165,255,0.07), transparent 60%)',
      }}
    />
  );
}
