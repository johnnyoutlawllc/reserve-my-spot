import Link from 'next/link';
import { Mark, SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ADD_ON, FOUNDING, GO_LIVE, INCLUDED, PLANS, SERVICES, TERMS } from '@/lib/pricing';

export const metadata = {
  title: 'Pricing',
  description:
    'Reserve My Spot pricing, per location and per month. $329 for a single location, $289 each for two to five, $249 each for six to twenty, and a conversation past that. Every plan is the whole product.',
};

export default function PricingPage() {
  return (
    <div className="relative min-h-dvh bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
        style={{
          background:
            'radial-gradient(58rem 24rem at 20% -6%, rgba(47,212,180,0.12), transparent 65%), radial-gradient(42rem 20rem at 92% 2%, rgba(106,165,255,0.06), transparent 60%)',
        }}
      />
      <SiteHeader />

      <main className="relative">
        <Hero />
        <Plans />
        <Included />
        <GoLive />
        <Founding />
        <Services />
        <VersusCustom />
        <Terms />
        <CrossLink />
        <Cta />
      </main>

      <SiteFooter note="Prices are per location and shown in US dollars. Annual billing is pay for ten months, get twelve." />
    </div>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:pt-16">
      <div className="max-w-2xl">
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="mt-4 text-[clamp(2.1rem,5.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          One product. The price depends on how many locations you run.
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-muted">
          There is no basic version and nothing held back for a higher tier. Every plan is the whole thing:
          the app your members use, the board your front desk works, the console your office runs it from,
          and the live drive tracking that makes any of it worth doing. The more locations you run, the less
          each one costs.
        </p>
        <p className="mt-4 text-[14px] leading-relaxed text-faint">
          Annual billing is pay for ten months and get twelve. There is no free tier and no per-message
          billing: the demo already does the job a free plan would, and notifications are in-app, so a busy
          Saturday never turns your flat bill into a variable one.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- plans */

function Plans() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-accent/30"
          >
            <h2 className="text-[15px] font-semibold tracking-tight">{p.name}</h2>
            <p className="mt-1 text-[12.5px] text-faint">{p.range}</p>

            <p className="mt-5 text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-none tracking-tight">
              {p.price}
            </p>
            <p className="mt-2 text-[12px] text-faint">{p.per}</p>

            {p.saving ? (
              <p className="mt-3 inline-flex w-fit rounded-lg border border-accent/25 bg-accent-wash px-2.5 py-1 text-[11.5px] font-medium text-accent">
                {p.saving}
              </p>
            ) : null}

            <p className="mt-5 flex-1 text-[13.5px] leading-relaxed text-muted">{p.copy}</p>

            <Link
              href="/contact"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-2xl border border-line bg-surface-2 px-5 text-[14px] font-semibold transition-colors hover:border-faint"
            >
              {p.id === 'more' ? 'Start the conversation' : 'Get started'}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-faint">
        Counting locations, not members, not stations, and not requests. Add a location mid-term and it
        joins at whatever rate your new count lands on, prorated from the day it opens.
      </p>
    </section>
  );
}

/* ----------------------------------------------------------------- included */

function Included() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>In every plan</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
        There is no version of this that leaves out the good part.
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
        Plenty of software puts the one feature you came for behind the top tier. The live drive tracking is
        the whole reason this exists, so it is in the single-location plan at $329 the same as it is in the
        twenty-location one. You are not buying features here, you are buying seats at the counter.
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {INCLUDED.map((g) => (
          <div key={g.group} className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="text-[14.5px] font-semibold tracking-tight">{g.group}</h3>
            <ul className="mt-5 space-y-2.5 border-t border-line-soft pt-5">
              {g.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-muted">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ go live */

function GoLive() {
  return (
    <section className="border-y border-line-soft bg-shell/40 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>One time, to go live</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Getting configured is its own piece of work, and it is billed once.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Your services, your session lengths, your station counts, your hours, your rules for who gets
          bumped. We do that with you, load your membership list, and train the desk. Charged the day your
          location opens it to members, and that is the same day your monthly bill starts.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {GO_LIVE.map((g) => (
            <div key={g.name} className="rounded-3xl border border-line bg-surface p-6">
              <h3 className="text-[15px] font-semibold tracking-tight">{g.name}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-[2.1rem] font-semibold leading-none tracking-tight">{g.price}</span>
                <span className="text-[12.5px] text-faint">one time</span>
              </p>
              <p className="mt-3 inline-block rounded-lg border border-line bg-surface-2 px-2.5 py-1 font-mono text-[12px] text-accent">
                {g.detail}
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{g.copy}</p>
            </div>
          ))}

          <div className="rounded-3xl border border-accent/25 bg-accent-wash/40 p-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Add-on</span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">{ADD_ON.name}</h3>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-[2.1rem] font-semibold leading-none tracking-tight">{ADD_ON.price}</span>
              <span className="text-[12.5px] text-faint">{ADD_ON.per}</span>
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{ADD_ON.copy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- founding */

function Founding() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-col gap-6 rounded-3xl border border-accent/30 bg-accent-wash/30 p-7 sm:flex-row sm:items-center sm:p-9">
        <Mark className="size-11 shrink-0" />
        <div className="flex-1">
          <h2 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-semibold leading-snug tracking-tight">
            {FOUNDING.head}
          </h2>
          <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">{FOUNDING.body}</p>
        </div>
        <Link
          href="/contact"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-accent px-5 text-[14px] font-semibold text-ink transition-colors hover:bg-accent/90"
        >
          Ask about it
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- services */

function Services() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16">
      <Eyebrow>When you want something built</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
        Changes and new features come from a build-time plan.
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
        Your monthly plan keeps the application running and covers bug fixes. An integration with the
        software you already pay for, a report nobody has built yet, a migration off whatever you are
        leaving behind: that is build time, and you buy it in whatever size you need. These are DataDay
        Studio&rsquo;s plans, unchanged, because this is not a special spa case.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.name} className="flex flex-col rounded-3xl border border-line bg-surface p-6">
            <h3 className="text-[14.5px] font-semibold tracking-tight">{s.name}</h3>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[1.9rem] font-semibold leading-none tracking-tight">{s.price}</span>
            </p>
            <p className="mt-1.5 text-[12px] text-faint">{s.per}</p>
            <p className="mt-4 inline-flex w-fit rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[11.5px] text-accent">
              {s.hours}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">{s.copy}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-faint">
        Cancel any time, period to period. Bug fixes are never taken out of these hours.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------ versus custom */

function VersusCustom() {
  return (
    <section className="border-y border-line-soft bg-shell/40 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <Eyebrow>The question everybody asks</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
            How this compares to having one built.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            DataDay Studio&rsquo;s platform plans cover running your app, and they do not include build
            time. A booking system built from scratch means a platform plan plus a professional services
            plan at $500 a month minimum, plus the months it takes to build it.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Reserve My Spot is that build, already done, running this week.
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-7">
          <ul className="space-y-4">
            {[
              ['Built from scratch', 'A platform plan, plus $500 a month or more in build time, plus the months.'],
              ['Reserve My Spot', 'One monthly number, one go-live fee, and members using it this week.'],
            ].map(([t, d], i) => (
              <li key={t} className={`border-l-2 pl-4 ${i === 1 ? 'border-accent' : 'border-line'}`}>
                <p className={`text-[14px] font-semibold tracking-tight ${i === 1 ? 'text-accent' : ''}`}>
                  {t}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line-soft pt-5 text-[13px] leading-relaxed text-faint">
            The three surfaces, the realtime board, the wait math and the drive tracking already exist and
            already work. You are paying to configure them around your spa, not to invent them.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- terms */

function Terms() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>What you are signing</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
        The terms, in plain words, before anybody sends a contract.
      </h2>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {TERMS.map((t) => (
          <div key={t.b} className="rounded-3xl border border-line bg-surface p-6">
            <dt className="text-[14.5px] font-semibold tracking-tight">{t.b}</dt>
            <dd className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{t.t}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* --------------------------------------------------------------- cross link */

function CrossLink() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16">
      <div className="rounded-3xl border border-line-soft bg-surface/50 p-7 sm:p-9">
        <h2 className="text-[clamp(1.2rem,2.3vw,1.5rem)] font-semibold leading-snug tracking-tight">
          Run something other than a spa?
        </h2>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-muted">
          Reserve My Spot was built by DataDay Studio for one location&rsquo;s specific problem. If yours is
          different, that is what the studio does. An $89 proof puts a working version of your idea on the
          internet in a week.
        </p>
        <a
          href="https://dataday.studio"
          className="mt-5 inline-flex h-11 items-center rounded-2xl border border-line bg-surface-2 px-5 text-[14px] font-medium transition-colors hover:border-faint"
        >
          dataday.studio
        </a>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- cta */

function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
        <h2 className="text-[clamp(1.6rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-tight">
          Tell us how your line works today.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          Your services, your station counts, your busiest hour. We will tell you which plan fits and what
          the first month actually costs, with no call required.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-2xl bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent/90"
          >
            Start a conversation
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-12 items-center rounded-2xl border border-line bg-surface-2 px-6 text-[15px] font-medium transition-colors hover:border-faint"
          >
            See the demo first
          </Link>
        </div>
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
      className="mt-[3px] size-3.5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
