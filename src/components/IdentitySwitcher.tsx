'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import { useSession, type SessionKind } from '@/lib/session';
import type { Member, Staff } from '@/lib/types';

/*
 * Dropdown in the app top bars that swaps the demo identity in place. The demo
 * used to bounce people back to /demo to re-pick; this keeps the switch on the
 * surface they are already on. Member and staff live in separate session keys,
 * so `kind` decides which list this control drives.
 */
export function IdentitySwitcher({ kind, className = '' }: { kind: SessionKind; className?: string }) {
  const router = useRouter();
  const { member, staff, signIn } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { rows: members } = useLiveTable<Member>('rms_members', { order: { column: 'full_name' } });
  const { rows: staffRows } = useLiveTable<Staff>('rms_staff', { order: { column: 'full_name' } });

  const current = kind === 'member' ? member : staff;
  const options: (Member | Staff)[] = kind === 'member' ? members : staffRows;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pick(next: Member | Staff) {
    setOpen(false);
    if (next.id === current?.id) return;
    signIn({ kind, id: next.id });
    if (kind === 'member') router.push('/m');
    else router.push((next as Staff).role === 'admin' ? '/admin' : '/support');
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:border-faint hover:text-text"
      >
        <span className="max-w-[9rem] truncate font-medium text-text">
          {current?.full_name ?? 'Choose'}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="rms-rise absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-shell shadow-xl shadow-ink/40"
        >
          <p className="border-b border-line-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-faint">
            {kind === 'member' ? 'Switch member' : 'Switch staff'}
          </p>
          <ul className="max-h-[60vh] overflow-y-auto p-1.5">
            {options.map((o) => {
              const isMember = 'tier' in o;
              const isCurrent = o.id === current?.id;
              return (
                <li key={o.id}>
                  <button
                    role="menuitem"
                    onClick={() => pick(o)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      isCurrent ? 'bg-accent-wash' : 'hover:bg-surface-2'
                    }`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-line text-[10px] font-semibold text-muted">
                      {initials(o.full_name)}
                    </span>
                    <span className="min-w-0 grow">
                      <span className="block truncate text-[13px] font-medium">{o.full_name}</span>
                      <span className="block truncate text-[11px] text-faint">{o.email}</span>
                    </span>
                    {isMember ? (
                      <Badge tone={(o as Member).is_active ? 'accent' : 'alert'}>
                        {(o as Member).is_active ? (o as Member).tier : 'inactive'}
                      </Badge>
                    ) : (
                      <Badge tone="neutral">{(o as Staff).role}</Badge>
                    )}
                    {isCurrent ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="size-3.5 shrink-0 text-accent"
                        aria-hidden="true"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/demo"
            className="block border-t border-line-soft px-3 py-2.5 text-[12px] text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            All demo surfaces
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
