'use client';

import { useState } from 'react';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

const LOCATION_OPTIONS = ['1', '2 to 3', '4 to 9', '10 or more'];

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  if (status.kind === 'sent') return <Sent onAgain={() => setStatus({ kind: 'idle' })} />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: 'sending' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus({
          kind: 'error',
          message: json.error || 'Something went wrong on our end. Please email sales@reservemy.spot.',
        });
        return;
      }
      form.reset();
      setStatus({ kind: 'sent' });
    } catch {
      setStatus({
        kind: 'error',
        message: 'We could not reach the server. Check your connection, or email sales@reservemy.spot.',
      });
    }
  }

  const sending = status.kind === 'sending';

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
      noValidate={false}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Business name" name="company" autoComplete="organization" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <fieldset className="mt-6">
        <legend className="text-[13px] font-medium text-muted">How many locations?</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {LOCATION_OPTIONS.map((opt, i) => (
            <label
              key={opt}
              className="cursor-pointer rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-[13px] text-muted transition-colors hover:border-faint has-[:checked]:border-accent/50 has-[:checked]:bg-accent-wash has-[:checked]:text-accent"
            >
              <input
                type="radio"
                name="locations"
                value={opt}
                defaultChecked={i === 0}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="message" className="text-[13px] font-medium text-muted">
          How does your line work today?{' '}
          <span className="text-faint">
            Which services do people end up waiting on, and what does the front desk run now?
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-ink px-4 py-3 text-[14px] leading-relaxed text-text focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
      </div>

      {/* Honeypot. Hidden from people and from screen readers, irresistible to bots. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === 'error' ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-alert/40 bg-alert/10 px-4 py-3 text-[13px] leading-relaxed text-alert"
        >
          {status.message}
        </p>
      ) : null}

      <div className="mt-7">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-accent px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Send message'}
          {sending ? null : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13px] font-medium text-muted">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-2xl border border-line bg-ink px-4 text-[14px] text-text focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
      />
    </div>
  );
}

function Sent({ onAgain }: { onAgain: () => void }) {
  return (
    <div className="rounded-3xl border border-accent/30 bg-accent-wash/40 p-8 sm:p-10">
      <span className="flex size-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent-wash text-accent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">That is with us.</h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        We read everything that comes in, and the answer arrives from a real address you can reply to. If
        something is urgent before then, sales@reservemy.spot reaches the same people.
      </p>
      <button
        onClick={onAgain}
        className="mt-6 inline-flex h-10 items-center rounded-xl border border-line bg-surface px-4 text-[13px] font-medium transition-colors hover:border-faint"
      >
        Send another
      </button>
    </div>
  );
}
