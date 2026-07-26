'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth';

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#services', label: 'Services' },
  { href: '#faq', label: 'FAQ' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? 'border-line bg-ink/85 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-[15px] font-semibold tracking-tight">Reserve My Spot</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] text-muted transition-colors hover:text-text"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden h-9 items-center rounded-xl px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text sm:inline-flex"
          >
            Live demo
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

/** Sign in with Google, or (once signed in) the welcome chip and its menu. */
export function AuthButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { user, loading, displayName, avatarUrl, error, signInWithGoogle, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const h = size === 'lg' ? 'h-12 px-5 text-[15px] rounded-2xl' : 'h-9 px-3.5 text-[13px] rounded-xl';

  if (loading) {
    return <span className={`inline-flex ${h} animate-pulse items-center bg-surface-2`} aria-hidden />;
  }

  if (user) {
    return (
      <div className="relative" ref={wrap}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`inline-flex ${h} items-center gap-2 border border-accent/30 bg-accent-wash font-medium text-accent transition-colors hover:bg-accent/15`}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="size-5 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex size-5 items-center justify-center rounded-full bg-accent/20 text-[10px] font-semibold">
              {displayName?.[0]?.toUpperCase() ?? '?'}
            </span>
          )}
          <span className="max-w-[10rem] truncate">Welcome, {displayName}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3 opacity-70">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open ? (
          <div
            role="menu"
            className="rms-rise absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-shell shadow-2xl shadow-black/40"
          >
            <div className="border-b border-line-soft px-4 py-3">
              <p className="truncate text-sm font-medium">{user.user_metadata?.full_name ?? displayName}</p>
              <p className="truncate text-xs text-faint">{user.email}</p>
            </div>
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              Open the live demo
            </Link>
            <a
              href="#pilot"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              Bring this to my spa
            </a>
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="block w-full border-t border-line-soft px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await signInWithGoogle();
          setBusy(false);
        }}
        className={`inline-flex ${h} items-center gap-2.5 bg-white font-semibold text-[#1f1f1f] shadow-sm transition-colors hover:bg-white/90 disabled:opacity-50`}
      >
        <GoogleGlyph />
        {busy ? 'Opening Google…' : size === 'lg' ? 'Sign in with Google' : 'Sign in'}
      </button>
      {error ? (
        <p className="absolute right-0 top-full mt-1 w-56 text-right text-[11px] leading-snug text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function Mark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0f2c27" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="#2fd4b4" strokeOpacity="0.3" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="#2fd4b4" strokeWidth="1.7" />
      <path d="M16 11.5V16l3 1.8" fill="none" stroke="#2fd4b4" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
