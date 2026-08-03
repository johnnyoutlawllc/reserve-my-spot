'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from '@/lib/session';

/*
 * Both surfaces at once. The member app and the front desk portal are full pages
 * with their own shells, sticky headers and fixed bottom nav, so each pane is an
 * iframe: fixed positioning then resolves against the pane instead of the window
 * and both apps lay out exactly as they do on their own. Same origin, so the two
 * frames read the same localStorage identities and the same Realtime channel,
 * which is the whole point of the view: do something on one side, watch it land
 * on the other.
 */

const MIN = 20;
const MAX = 80;

type Pane = 'member' | 'desk';

export default function SplitDemoPage() {
  const { member, staff } = useSession();

  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState<Record<Pane, boolean>>({ member: true, desk: true });

  // Side by side on desktop, stacked on mobile. Read from the same breakpoint the
  // rest of the app uses for its wide layouts.
  const [horizontal, setHorizontal] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setHorizontal(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const both = visible.member && visible.desk;

  function toggle(pane: Pane) {
    setVisible((v) => {
      const next = { ...v, [pane]: !v[pane] };
      // Never hide both; flipping the last one off shows the other instead.
      if (!next.member && !next.desk) return { member: pane !== 'member', desk: pane !== 'desk' };
      return next;
    });
  }

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDragging(true);

      const move = (ev: PointerEvent) => {
        const raw = horizontal
          ? (ev.clientX - rect.left) / rect.width
          : (ev.clientY - rect.top) / rect.height;
        setSplit(Math.min(MAX, Math.max(MIN, raw * 100)));
      };
      const stop = () => {
        setDragging(false);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', stop);
        window.removeEventListener('pointercancel', stop);
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', stop);
      window.addEventListener('pointercancel', stop);
    },
    [horizontal],
  );

  function nudge(e: React.KeyboardEvent) {
    const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const fwd = horizontal ? 'ArrowRight' : 'ArrowDown';
    if (e.key !== back && e.key !== fwd) return;
    e.preventDefault();
    setSplit((s) => Math.min(MAX, Math.max(MIN, s + (e.key === fwd ? 2 : -2))));
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink">
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line-soft bg-shell px-3 py-2">
        <Link
          href="/demo"
          className="flex items-center gap-1 text-[12px] text-faint transition-colors hover:text-text"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Demo
        </Link>

        <span className="hidden text-[13px] font-semibold tracking-tight sm:inline">Side by side</span>

        <div className="ml-auto flex items-center gap-1.5">
          <PaneToggle
            on={visible.member}
            last={visible.member && !both}
            onClick={() => toggle('member')}
            label="Member"
            sub={member?.full_name.split(' ')[0]}
          />
          <PaneToggle
            on={visible.desk}
            last={visible.desk && !both}
            onClick={() => toggle('desk')}
            label="Front desk"
            sub={staff?.full_name.split(' ')[0]}
          />
        </div>
      </header>

      <div
        ref={containerRef}
        className={`flex min-h-0 grow ${horizontal ? 'flex-row' : 'flex-col'}`}
      >
        {visible.member ? (
          <Pane
            title="Member app"
            src="/m"
            grow={!both}
            basis={`${split}%`}
            frozen={dragging}
          />
        ) : null}

        {both ? (
          <div
            role="separator"
            aria-orientation={horizontal ? 'vertical' : 'horizontal'}
            aria-label="Resize the two views"
            aria-valuenow={Math.round(split)}
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            tabIndex={0}
            onPointerDown={startDrag}
            onKeyDown={nudge}
            className={`group relative shrink-0 touch-none bg-line-soft transition-colors hover:bg-accent/40 focus-visible:bg-accent focus-visible:outline-none ${
              dragging ? 'bg-accent' : ''
            } ${horizontal ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize'}`}
          >
            {/* A wider invisible target than the 6px the eye sees. */}
            <span
              aria-hidden="true"
              className={`absolute ${
                horizontal ? '-inset-x-2 inset-y-0' : '-inset-y-2 inset-x-0'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-faint/60 group-hover:bg-accent ${
                horizontal ? 'h-8 w-0.5' : 'h-0.5 w-8'
              }`}
            />
          </div>
        ) : null}

        {visible.desk ? (
          <Pane title="Front desk portal" src="/support" grow basis="auto" frozen={dragging} />
        ) : null}
      </div>
    </div>
  );
}

function Pane({
  title,
  src,
  grow,
  basis,
  frozen,
}: {
  title: string;
  src: string;
  grow: boolean;
  basis: string;
  frozen: boolean;
}) {
  return (
    <div
      className="min-h-0 min-w-0 overflow-hidden"
      style={{ flex: grow ? '1 1 0%' : `0 0 ${basis}` }}
    >
      <iframe
        src={src}
        title={title}
        className={`size-full border-0 ${frozen ? 'pointer-events-none' : ''}`}
      />
    </div>
  );
}

function PaneToggle({
  on,
  last,
  onClick,
  label,
  sub,
}: {
  on: boolean;
  /** The only pane left on screen, so hiding it would leave nothing. */
  last: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={last}
      aria-pressed={on}
      title={last ? `${label} is the only view left` : on ? `Hide ${label}` : `Show ${label}`}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        on
          ? 'border-accent/40 bg-accent-wash text-accent'
          : 'border-line text-faint hover:border-faint hover:text-text'
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5">
        {on ? (
          <>
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="2.75" />
          </>
        ) : (
          <>
            <path
              d="M4 4l16 16M9.9 6.1A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 4M6.6 8.2A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1 0 1.9-.2 2.7-.5"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
      {label}
      {on && sub ? <span className="hidden opacity-60 sm:inline">{sub}</span> : null}
    </button>
  );
}
