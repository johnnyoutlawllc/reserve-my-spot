import Link from 'next/link';
import { Mark } from '@/components/SiteHeader';

/*
 * Shared by the marketing page and /contact. The section links are absolute
 * (/#how, not #how) so they still go somewhere from a page that has no such
 * section on it.
 */

const LINKS = [
  { href: '/#how', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/demo', label: 'Demo' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter({ note }: { note?: React.ReactNode }) {
  return (
    <footer className="relative border-t border-line-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark className="size-7" />
          <span className="text-[13.5px] font-medium tracking-tight">Reserve My Spot</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10 text-[12px] leading-relaxed text-faint">
        {note ? <p>{note}</p> : null}
        <p className={note ? 'mt-2' : ''}>
          <a
            href="https://dataday.studio"
            className="underline decoration-line underline-offset-2 transition-colors hover:text-accent"
          >
            a dataday.studio project
          </a>
          <span className="px-1.5">·</span>
          Designed in Rockwall, TX
        </p>
      </div>
    </footer>
  );
}
