import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { INCLUDED, MULTI, PLANS, UPGRADES } from '@/lib/pricing';

export const metadata = {
  title: 'Pricing',
  description:
    'Two plans. Without integration, $169 per location per month plus a $250 setup. With integration into your booking software, $250 per location per month plus a $500 setup. Both include the member app, the front desk board, and the admin console.',
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
        <Upgrades />
        <Cta />
      </main>

      <SiteFooter note="Prices are per location, in US dollars." />
    </div>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:pt-16">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 lg:items-end">
        <div>
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-4 text-[clamp(2.1rem,5.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Two plans. Pick whether we connect to your booking software.
          </h1>
        </div>
        <div className="space-y-4">
          <p className="text-[16px] leading-relaxed text-muted">
            Either way, members reserve their spot before they leave home. The difference is what happens
            next: your front desk books it, or your software books it on its own.
          </p>
          <p className="text-[14px] leading-relaxed text-faint">
            Both plans are the whole product, branded for you. Nothing is billed per message, so a busy
            Saturday leaves your bill where it was.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- plans */

function Plans() {
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="grid gap-4 lg:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={
              p.featured
                ? 'relative overflow-hidden rounded-3xl border border-accent/30 bg-accent-wash/40 p-7 sm:p-9'
                : 'relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-9'
            }
          >
            {p.featured ? (
              <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/8 blur-3xl" />
            ) : null}

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{p.name}</p>
            <h2 className="mt-3 text-[clamp(1.3rem,2.6vw,1.7rem)] font-semibold leading-snug tracking-tight">
              {p.head}
            </h2>

            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[clamp(2.2rem,4.6vw,3rem)] font-semibold leading-none tracking-tight">
                {p.monthly}
              </span>
              <span className="text-[13px] text-faint">{p.per}</span>
            </p>
            <p className="mt-3 text-[13.5px] text-muted">
              <span className="font-semibold text-fg">{p.setup}</span> {p.setupNote}
            </p>

            <p className="mt-5 border-t border-line-soft pt-5 text-[13.5px] leading-relaxed text-muted">
              {p.copy}
            </p>

            <Link
              href="/contact"
              className={
                p.featured
                  ? 'mt-7 inline-flex h-11 items-center justify-center rounded-2xl bg-accent px-5 text-[14px] font-semibold text-ink transition-colors hover:bg-accent/90'
                  : 'mt-7 inline-flex h-11 items-center justify-center rounded-2xl border border-line bg-surface-2 px-5 text-[14px] font-semibold transition-colors hover:border-faint'
              }
            >
              Get started
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-3xl border border-line-soft bg-surface/50 p-6 text-[13.5px] leading-relaxed text-muted">
        {MULTI}
      </p>
    </section>
  );
}

/* ----------------------------------------------------------------- included */

function Included() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionHead eyebrow="In both plans" title="The member app, the front desk board, and the admin console." />

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

/* ----------------------------------------------------------------- upgrades */

function Upgrades() {
  return (
    <section className="border-y border-line-soft bg-shell/40 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          eyebrow="Past setup"
          title="Want more changed than setup covers? Build time on a schedule."
        >
          Both run at the same $100-an-hour rate as setup, just spread across a standing meeting instead of a
          one-time push.
        </SectionHead>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {UPGRADES.map((u) => (
            <div key={u.name} className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{u.name}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-[clamp(1.6rem,3vw,2rem)] font-semibold leading-none tracking-tight">
                  {u.price}
                </span>
                <span className="text-[13px] text-faint">{u.per}</span>
              </p>
              <p className="mt-4 border-t border-line-soft pt-4 text-[13.5px] leading-relaxed text-muted">
                {u.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- cta */

function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="rounded-3xl bg-surface p-8 text-center sm:p-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-2xl bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent/90"
          >
            Start a conversation
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-12 items-center rounded-2xl bg-surface-2 px-6 text-[15px] font-medium transition-colors hover:bg-surface"
          >
            See the demo
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- pieces */

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-12 lg:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          {title}
        </h2>
      </div>
      {children ? <p className="text-[15px] leading-relaxed text-muted lg:pb-1">{children}</p> : null}
    </div>
  );
}

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
