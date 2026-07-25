'use client';

import { useEffect, useRef, useState } from 'react';
import { useLiveTable, useNow } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/lib/types';
import { sinceLabel } from '@/lib/wait';

/**
 * The desk's alert surface.
 *
 * A rep isn't staring at the board every second, so a new request has to announce
 * itself: the badge counts unread staff notifications and a short chime plays for
 * anything that arrives while the tab is open. Audio is created lazily because
 * browsers reject an AudioContext built before the first user gesture.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const now = useNow(20_000);
  const { rows } = useLiveTable<Notification>('rms_notifications', {
    order: { column: 'created_at', ascending: false },
  });

  const staffNotes = rows.filter((n) => n.audience === 'staff').slice(0, 25);
  const unread = staffNotes.filter((n) => !n.is_read).length;

  const seen = useRef<Set<string> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const ids = new Set(staffNotes.map((n) => n.id));
    if (seen.current === null) {
      seen.current = ids; // first paint is history, not news
      return;
    }
    const fresh = staffNotes.filter((n) => !seen.current!.has(n.id) && !n.is_read);
    seen.current = ids;
    if (fresh.length === 0) return;
    chime(audioRef);
  }, [staffNotes]);

  async function markAllRead() {
    const ids = staffNotes.filter((n) => !n.is_read).map((n) => n.id);
    if (ids.length === 0) return;
    await supabase.from('rms_notifications').update({ is_read: true }).in('id', ids);
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) void markAllRead();
        }}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className={`relative flex size-9 items-center justify-center rounded-lg border transition-colors ${
          unread > 0
            ? 'border-accent/40 bg-accent-wash text-accent'
            : 'border-line text-muted hover:border-faint hover:text-text'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4.5">
          <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" strokeLinecap="round" />
          <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-ink">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button className="fixed inset-0 z-40" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="rms-rise absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-shell shadow-2xl shadow-black/60">
            <div className="border-b border-line-soft px-4 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Desk activity</p>
            </div>
            <ul className="max-h-96 divide-y divide-line-soft overflow-y-auto">
              {staffNotes.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-faint">Nothing yet today.</li>
              ) : (
                staffNotes.map((n) => (
                  <li key={n.id} className="px-4 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] font-medium leading-snug">{n.title}</p>
                      <span className="shrink-0 text-[10px] text-faint">{sinceLabel(n.created_at, now)}</span>
                    </div>
                    {n.body ? <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{n.body}</p> : null}
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}

function chime(ref: React.RefObject<AudioContext | null>) {
  try {
    ref.current ??= new AudioContext();
    const ctx = ref.current;
    if (ctx.state === 'suspended') return; // no gesture yet; stay silent rather than throw
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1170, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.34);
  } catch {
    /* audio is a nicety, never a failure path */
  }
}
