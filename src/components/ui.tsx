'use client';

import { useEffect } from 'react';
import type { WaitStatus } from '@/lib/types';

/* ------------------------------------------------------------------ buttons */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'warn';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
};

const BUTTON_VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-ink hover:bg-accent/90 active:bg-accent/80 font-semibold',
  ghost: 'bg-transparent text-muted hover:bg-surface-2 hover:text-text',
  outline: 'border border-line bg-surface text-text hover:border-faint hover:bg-surface-2',
  danger: 'bg-alert text-ink hover:bg-alert/90 font-semibold',
  warn: 'border border-warn/40 bg-warn-wash text-warn hover:bg-warn/15',
};

const BUTTON_SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-[15px] rounded-2xl',
};

export function Button({
  variant = 'outline',
  size = 'md',
  block,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-40',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        block ? 'w-full' : '',
        className,
      ].join(' ')}
    />
  );
}

/* -------------------------------------------------------------------- layout */

export function Card({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`rounded-2xl border border-line bg-surface ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-faint">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Empty({ title, body, icon }: { title: string; body?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      {icon ? <div className="text-faint">{icon}</div> : null}
      <p className="text-sm font-medium text-muted">{title}</p>
      {body ? <p className="max-w-xs text-xs leading-relaxed text-faint">{body}</p> : null}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-xs text-faint">
      <span className="size-3 animate-spin rounded-full border-2 border-line border-t-accent" />
      {label ?? 'Loading'}
    </div>
  );
}

/* --------------------------------------------------------------------- badges */

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: 'neutral' | 'accent' | 'warn' | 'alert' | 'info';
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'border-line bg-surface-2 text-muted',
    accent: 'border-accent/30 bg-accent-wash text-accent',
    warn: 'border-warn/30 bg-warn-wash text-warn',
    alert: 'border-alert/35 bg-alert-wash text-alert',
    info: 'border-info/30 bg-info/10 text-info',
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export const STATUS_META: Record<WaitStatus, { label: string; tone: 'neutral' | 'accent' | 'warn' | 'alert' | 'info' }> =
  {
    requested: { label: 'Awaiting desk', tone: 'warn' },
    waiting: { label: 'In line', tone: 'info' },
    notified: { label: 'Called up', tone: 'accent' },
    in_service: { label: 'In session', tone: 'accent' },
    completed: { label: 'Completed', tone: 'neutral' },
    no_show: { label: 'No show', tone: 'alert' },
    cancelled: { label: 'Cancelled', tone: 'neutral' },
    forfeited: { label: 'Spot released', tone: 'alert' },
    declined: { label: 'Declined', tone: 'alert' },
  };

export function StatusBadge({ status }: { status: WaitStatus }) {
  const meta = STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

/* --------------------------------------------------------------------- inputs */

const FIELD_BASE =
  'w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm placeholder:text-faint ' +
  'focus:border-accent/60 focus:outline-none disabled:opacity-50';

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-faint">
      {children}
      {hint ? <span className="ml-2 font-normal normal-case tracking-normal text-faint/70">{hint}</span> : null}
    </span>
  );
}

export function TextInput({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={`${FIELD_BASE} ${className}`} />;
}

export function TextArea({
  className = '',
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={`${FIELD_BASE} resize-none ${className}`} />;
}

export function Select({
  className = '',
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={`${FIELD_BASE} appearance-none pr-8 ${className}`}>
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 rounded-xl border border-line bg-surface-2 px-3 py-3 ${
        disabled ? 'opacity-50' : 'cursor-pointer'
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs leading-relaxed text-faint">{hint}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-ink transition-transform ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

/* ---------------------------------------------------------------------- modal */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />
      <div className="rms-rise relative z-10 w-full max-w-lg rounded-t-3xl border border-line bg-shell p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:pb-5">
        <h3 className="mb-4 text-base font-semibold tracking-tight">{title}</h3>
        <div className="max-h-[65vh] overflow-y-auto">{children}</div>
        {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- banners */

export function Banner({
  tone = 'info',
  title,
  children,
  action,
}: {
  tone?: 'info' | 'warn' | 'alert' | 'accent';
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const tones = {
    info: 'border-info/25 bg-info/8 text-info',
    warn: 'border-warn/30 bg-warn-wash text-warn',
    alert: 'border-alert/35 bg-alert-wash text-alert',
    accent: 'border-accent/30 bg-accent-wash text-accent',
  } as const;
  return (
    <div className={`flex items-start justify-between gap-3 rounded-xl border px-3.5 py-3 ${tones[tone]}`}>
      <div className="min-w-0 text-xs leading-relaxed">
        {title ? <p className="mb-0.5 text-sm font-semibold">{title}</p> : null}
        {children}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-faint">{hint}</p> : null}
    </div>
  );
}
