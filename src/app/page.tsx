import Link from 'next/link';
import { AuthButton, Mark, SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ServiceIcon } from '@/components/ServiceIcon';

export const metadata = {
  title: 'Reserve My Spot · Hold your spot at the spa before you leave home',
  description:
    'Spa members claim a spot for Red Light Therapy, the Wave bed or tanning from home. They share the drive over, and your front desk can see how far out each one really is. It runs next to the salon software you already have, and can read from it.',
};

/* ------------------------------------------------------------------ content */

const SERVICES = [
  { icon: 'redlight', name: 'Red Light Therapy', note: 'Panel time by the session' },
  { icon: 'wave', name: 'Wave Massage Bed', note: 'The one with the line' },
  { icon: 'tanning', name: 'Tanning Beds', note: 'Every level you offer' },
  { icon: 'sauna', name: 'Infrared Sauna', note: 'Rooms and pods' },
  { icon: 'cryo', name: 'Cryotherapy', note: 'Single-chamber turns' },
  { icon: 'compression', name: 'Compression', note: 'Boots and recovery chairs' },
  { icon: 'salt', name: 'Halotherapy', note: 'Salt room seats' },
  { icon: 'facial', name: 'Facials & add-ons', note: 'Anything with a station' },
];

const STEPS = [
  {
    n: '01',
    title: 'A member picks a service',
    body: 'At home, they open the app and look at what the wait is right now. Then they ask for a spot at the hour they plan to show up.',
  },
  {
    n: '02',
    title: 'It lands at the desk',
    body: 'The request appears on the front desk board the second it is made. A rep taps accept, and the member has a place in line and a time to be there.',
  },
  {
    n: '03',
    title: 'You watch the drive',
    body: 'If the member turns location sharing on, the app checks how long their drive will take against the minute their station frees up, and keeps checking as they move.',
  },
  {
    n: '04',
    title: 'They arrive and go straight in',
    body: 'A rep calls them up at the door and they walk to the station. When somebody is going to miss their window, the desk hears about it early enough to do something.',
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
        note="The members, staff and sessions on this page are made up for illustration. The demo runs on a shared live database seeded with fictional accounts, so anything you do there is visible to anyone else holding the link."
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
            Red Light Therapy and the Wave bed always have somebody waiting on them. Today a member gets into
            that line one way, by driving over and standing in it. Reserve My Spot moves the line onto their
            phone, and your staff can see how far out each person really is.
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
            The demo is open to anyone and needs no account. Sign in if you want to keep a profile.
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
          The third member is going to miss their window, and the desk knows about it while there is still
          time to move somebody up.
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
          You define the service menu. Every service gets a session length and a station count, and the
          estimates come out of those two numbers.
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
        What one request looks like, from the couch to the station.
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
        Everything your desk needs to hold a spot for the right person.
      </h2>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 lg:col-span-2 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/8 blur-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-alert/35 bg-alert-wash px-2.5 py-1 text-[11px] font-medium text-alert">
            Where this parts ways with booking software
          </span>
          <h3 className="mt-4 text-[clamp(1.25rem,2.4vw,1.6rem)] font-semibold leading-snug tracking-tight">
            Your staff can see who is out there driving over.
          </h3>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted">
            A member who phones ahead is telling you where they <em>intend</em> to be at four o&rsquo;clock.
            Turn on location sharing and you get the drive as it stands this minute, measured against when
            their station opens. Once they pass the grace period you set, a rep decides whether to bump them
            back or hand the spot to whoever is behind them.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              'Live driving ETA, refreshed as they move',
              'A member counts as late when the station opens without them',
              'You set the grace period',
              'Each member opts in, and it starts off',
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
          body="A member signs in once and the services they use most are waiting for them next time. History and preferences travel with the account, so nobody has to say all of it again at the counter."
          icon={
            <>
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </>
          }
        />
        <FeatureCard
          title="Chat with the front desk"
          body="One thread between a member and whoever happens to be working the desk. They can ask whether the sauna is free, or say they are running behind, without anybody picking up a phone."
          icon={
            <>
              <path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />
              <path d="M8.5 9.5h7M8.5 13h4" />
            </>
          }
        />
        <FeatureCard
          title="Answers built in"
          body="Your FAQ sits inside the app, and you edit it from the admin console. The desk ends up fielding the same five questions a lot less often."
          icon={
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.2a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.4" />
              <path d="M12 17h.01" />
            </>
          }
        />
        <FeatureCard
          title="It fits around your POS"
          body="Nobody is asking you to replace what the front desk already runs. This sits alongside it and reads from it, so equipment status and memberships come straight across and your staff stops keeping two sets of books. We only ever read. Nothing writes back, and your system of record stays the record."
          icon={
            <>
              <rect x="2.5" y="5" width="8.5" height="14" rx="2" />
              <rect x="15" y="5" width="6.5" height="14" rx="2" />
              <path d="M11.5 12h3" />
            </>
          }
        />
        <FeatureCard
          title="Honest wait times"
          body="An estimate runs your own session lengths and station counts forward through whoever is already in line. At four in the afternoon it still describes the room you actually have."
          icon={
            <>
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </>
          }
        />
        <FeatureCard
          title="A room board that keeps up"
          body="Every station on one board, showing who is in it and who comes next, live on every screen at once. Calling up, starting, completing, bumping back and releasing all happen right there."
          icon={
            <>
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <path d="M3 9.5h18M9 9.5V20" />
            </>
          }
        />
        <FeatureCard
          title="You run the settings"
          body="Memberships and when they expire, who on staff can do what, the service menu, your hours, and how far ahead a member is allowed to ask. You can also close online requests entirely."
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
          <Eyebrow>Three views, one live database</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
            Everybody who touches it gets a screen built around their job.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            All of it is realtime. A member asks for a spot and it lands at the desk in the same second, and
            when a rep calls that member up, the phone in their hand knows about it before they reach the
            counter. Nothing here has a refresh button.
          </p>

          <dl className="mt-8 space-y-4">
            {[
              ['Member app', 'Live waits, a request button, your place in line and a time, location sharing, chat, and the FAQ.'],
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
    body: 'What a member sees on their phone, from picking a service through to sharing the drive over.',
  },
  {
    title: 'Front desk portal',
    body: 'Incoming requests, the room board, and how far out everybody is. Accept, call up, bump or release from here.',
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
              There is nothing to sign up for. The demo is the real application, running on a live database
              seeded with fictional members. Put the member view on your phone and the front desk on a laptop,
              and the two will talk to each other while you watch.
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
          We take on a few locations at a time, and setting one up is something we do sitting with you. That
          covers the services you run, how many stations each one has, when you open, and what should happen
          to a member who misses their window. Start by telling us how the line works at your place today.
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
          A single location is $189 a month, and the rate per location comes down as you add more. Wiring it
          into the salon software you already run is $100 a location on top of that.
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
