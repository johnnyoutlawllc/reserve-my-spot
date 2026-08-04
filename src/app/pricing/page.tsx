import Link from 'next/link';
import { Mark, SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ADD_ON, CONNECT, FOUNDING, GO_LIVE, INCLUDED, PLANS, TERMS } from '@/lib/pricing';

export const metadata = {
  title: 'Pricing',
  description:
    'Reserve My Spot pricing, per location and per month. $189 for a single location, $159 each for two to five, $129 each for six to twenty, and a quote past that. Every plan is the whole product, and connecting it to the salon software you already run is $100 a location on top.',
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
        <Connect />
        <Founding />
        <Terms />
        <CrossLink />
        <Cta />
      </main>

      <SiteFooter note="Prices are per location, in US dollars. Pay annually and you pay for ten months." />
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
          There is one product, and the price moves with how many locations you run.
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-muted">
          Every plan is the whole thing. That means the app your members use, the board the front desk works
          from, the admin console your office runs it all through, and the drive tracking that makes any of
          it worth having. Once you are past a single location, the rate per location comes down.
        </p>
        <p className="mt-4 text-[14px] leading-relaxed text-faint">
          Pay annually and you pay for ten months instead of twelve. We do not run a free tier, because the
          demo already does what one would do, and nothing here is billed per message, so a busy Saturday
          leaves your bill exactly where it was. Two things sit outside the plan and cost extra, and both are
          further down this page: putting it on your own domain, and connecting it to the salon software you
          already run.
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
        We count locations. A spa with four hundred members pays what a spa with forty pays. Add a location
        mid-term and it joins at whatever rate your new count lands on, prorated from the day it opens.
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
        Every plan carries the part you came here for.
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
        Drive tracking is the reason this product exists, so it sits in the $189 plan exactly the way it sits
        in the twenty-location one. What the price reflects is how many front desks are running it.
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
          Setting your spa up is its own piece of work, and we bill it once.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          We sit down with you and work out the service menu, how long a session runs on each one, how many
          stations you have, when you open, and what happens to a member who misses their window. Then we
          load your membership list and train the desk. The charge lands the day you open it to members,
          which is the day your monthly bill starts too.
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

/* ------------------------------------------------------------------ connect */

function Connect() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>{CONNECT.eyebrow}</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
        {CONNECT.head}
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{CONNECT.copy}</p>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-accent-wash/40 p-7 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/8 blur-3xl" />
          <h3 className="text-[15px] font-semibold tracking-tight">{CONNECT.name}</h3>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-[2.4rem] font-semibold leading-none tracking-tight">{CONNECT.price}</span>
            <span className="text-[12.5px] text-faint">{CONNECT.per}</span>
          </p>
          <p className="mt-3 text-[12.5px] text-faint">
            This one stays the same whether you run one location or twenty.
          </p>
          <ul className="mt-6 space-y-2.5 border-t border-line-soft pt-6">
            {CONNECT.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13.5px] leading-snug text-muted">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-7 sm:p-8">
          <h3 className="text-[15px] font-semibold tracking-tight">{CONNECT.setup.name}</h3>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-[2.4rem] font-semibold leading-none tracking-tight">
              {CONNECT.setup.price}
            </span>
            <span className="text-[12.5px] text-faint">{CONNECT.setup.per}</span>
          </p>
          <p className="mt-5 border-t border-line-soft pt-5 text-[13.5px] leading-relaxed text-muted">
            {CONNECT.setup.copy}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <p className="rounded-3xl border border-line-soft bg-surface/50 p-6 text-[13.5px] leading-relaxed text-muted">
          {CONNECT.systems}
        </p>
        <p className="rounded-3xl border border-line-soft bg-surface/50 p-6 text-[13.5px] leading-relaxed text-faint">
          {CONNECT.caveat}
        </p>
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
          DataDay Studio built Reserve My Spot for one location&rsquo;s specific problem. If yours is
          different, that is the work the studio does. An $89 proof puts a working version of your idea on
          the internet inside a week.
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
          Send over what you run, how many stations each service has, and when your busiest hour hits. We
          will come back with the plan that fits and what the first month actually costs. Nobody has to get
          on a call for that.
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
