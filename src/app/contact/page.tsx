import { ContactForm } from './ContactForm';
import { Mark, SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata = {
  title: 'Contact',
  description:
    'Tell us how your line works today and we will show you what Reserve My Spot would look like at your spa. Or reach sales and support directly.',
};

const DIRECT = [
  {
    label: 'Sales',
    address: 'sales@reservemy.spot',
    blurb: 'Pricing and pilots, and what setup would look like at your place.',
  },
  {
    label: 'Support',
    address: 'support@reservemy.spot',
    blurb: 'For spas already running it. Your front desk and your admin both land here.',
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-dvh bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(47,212,180,0.10),transparent_70%)]"
      />
      <SiteHeader />

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-10 sm:pt-16">
        <div className="max-w-2xl">
          <h1 className="text-[clamp(2.1rem,5.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Tell us how your line works today.
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            The more you tell us about the services you run and how many stations each one has, the more
            specific we can be when we write back. Nobody is going to phone you unless you ask for a call,
            and there is nothing to sign here.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <ContactForm />

          <aside className="lg:pt-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
              Or write to us directly
            </h2>
            <div className="mt-4 space-y-3">
              {DIRECT.map((d) => (
                <a
                  key={d.address}
                  href={`mailto:${d.address}`}
                  className="block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-faint"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    {d.label}
                  </p>
                  <p className="mt-1.5 break-all text-[15px] font-medium tracking-tight underline decoration-line underline-offset-4">
                    {d.address}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{d.blurb}</p>
                </a>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-line-soft bg-surface/50 p-5">
              <div className="flex items-center gap-2.5">
                <Mark className="size-7" />
                <p className="text-[13.5px] font-medium tracking-tight">Want to look first?</p>
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                The demo is the real product on a live database. Open the member view and the front desk
                view together, then watch a request cross from one to the other.
              </p>
              <Link
                href="/demo"
                className="mt-4 inline-flex h-10 items-center rounded-xl border border-line bg-surface-2 px-4 text-[13px] font-medium transition-colors hover:border-faint"
              >
                Open the live demo
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
