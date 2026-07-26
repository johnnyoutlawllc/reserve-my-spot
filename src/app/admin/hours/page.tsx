'use client';

import { useState } from 'react';
import {
  Badge,
  Banner,
  Button,
  Card,
  Label,
  SectionTitle,
  Spinner,
  TextInput,
  Toggle,
} from '@/components/ui';
import { useSpa } from '@/lib/spa';
import { supabase } from '@/lib/supabase';
import type { Hours, Settings } from '@/lib/types';
import { DAY_NAMES, bookingWindow, formatMinutes, parseTime, spaClock } from '@/lib/wait';

/** Only the fields that actually differ from the saved row. */
function diffSettings(next: Settings, saved: Settings): Partial<Settings> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(next) as (keyof Settings)[]) {
    if (next[key] !== saved[key]) out[key] = next[key];
  }
  return out as Partial<Settings>;
}

export default function AdminHoursPage() {
  const { hours, settings, loading } = useSpa();

  if (loading || !settings) return <Spinner label="Loading hours" />;

  return (
    <div className="space-y-6">
      <StorePreview settings={settings} hours={hours} />
      <HoursGrid hours={hours} />
      <BookingWindowForm settings={settings} />
      <SpaDetailsForm settings={settings} />
    </div>
  );
}

function StorePreview({ settings, hours }: { settings: Settings; hours: Hours[] }) {
  const clock = spaClock(settings.timezone);
  const win = bookingWindow(settings, hours);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
            Right now at the spa
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            {DAY_NAMES[clock.dayOfWeek]} {clock.label}
            <span className="ml-2 text-xs font-normal text-faint">{settings.timezone}</span>
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            {win.open
              ? `Members can request spots now${
                  win.requestsCloseAt !== null ? ` until ${formatMinutes(win.requestsCloseAt)}` : ''
                }.`
              : win.reason}
          </p>
        </div>
        <Badge tone={win.open ? 'accent' : 'warn'}>
          <span className={`size-1.5 rounded-full ${win.open ? 'bg-accent' : 'bg-warn'}`} />
          {win.open ? 'accepting requests' : 'requests closed'}
        </Badge>
      </div>
    </Card>
  );
}

function HoursGrid({ hours }: { hours: Hours[] }) {
  const [error, setError] = useState<string | null>(null);

  async function patch(day: number, changes: Partial<Hours>) {
    setError(null);
    const { error: err } = await supabase.from('rms_hours').update(changes).eq('day_of_week', day);
    if (err) setError(err.message);
  }

  return (
    <section>
      <SectionTitle title="Store hours" hint="The Request button turns itself off outside these windows" />
      {error ? <Banner tone="alert">{error}</Banner> : null}
      <Card className="divide-y divide-line-soft">
        {hours.map((h) => (
          <div key={h.day_of_week} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            <p className="w-24 shrink-0 text-sm font-medium">{DAY_NAMES[h.day_of_week]}</p>

            {h.is_closed ? (
              <p className="grow text-[12px] text-faint">Closed all day</p>
            ) : (
              <div className="flex grow items-center gap-2">
                <label className="block">
                  <Label>Opens</Label>
                  <TextInput
                    type="time"
                    value={h.open_time.slice(0, 5)}
                    onChange={(e) => patch(h.day_of_week, { open_time: e.target.value })}
                    className="w-32"
                  />
                </label>
                <span className="mt-5 text-faint">–</span>
                <label className="block">
                  <Label>Closes</Label>
                  <TextInput
                    type="time"
                    value={h.close_time.slice(0, 5)}
                    onChange={(e) => patch(h.day_of_week, { close_time: e.target.value })}
                    className="w-32"
                  />
                </label>
                <span className="mt-5 text-[11px] text-faint">
                  {Math.round((parseTime(h.close_time) - parseTime(h.open_time)) / 60)} hrs open
                </span>
              </div>
            )}

            <div className="w-44 shrink-0">
              <Toggle
                checked={h.is_closed}
                onChange={(next) => patch(h.day_of_week, { is_closed: next })}
                label={h.is_closed ? 'Closed' : 'Open'}
              />
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}

/**
 * The online-request window.
 *
 * `min_lead` and `max_advance` bracket how far out a member may aim their arrival;
 * `cutoff` stops the desk from queueing people it cannot physically serve before
 * closing. All three are per-spa because a 3-minute cryo shop and a 30-minute
 * sauna shop want very different numbers.
 */
function BookingWindowForm({ settings }: { settings: Settings }) {
  // Editing state is a patch over the saved row, not a copy of it. That way a
  // realtime update from another admin doesn't need a sync effect, and it can't
  // silently clobber whatever this admin is halfway through typing.
  const [patch, setPatch] = useState<Partial<Settings>>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form: Settings = { ...settings, ...patch };
  const setForm = (next: Settings) => setPatch(diffSettings(next, settings));

  const dirty = Object.keys(patch).length > 0;

  const invalid =
    form.min_lead_minutes < 0 ||
    form.max_advance_minutes <= form.min_lead_minutes ||
    form.cutoff_minutes_before_close < 0 ||
    form.max_active_per_member < 1;

  async function save() {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase
      .from('rms_settings')
      .update({
        min_lead_minutes: form.min_lead_minutes,
        max_advance_minutes: form.max_advance_minutes,
        cutoff_minutes_before_close: form.cutoff_minutes_before_close,
        grace_period_minutes: form.grace_period_minutes,
        max_active_per_member: form.max_active_per_member,
        online_booking_enabled: form.online_booking_enabled,
      })
      .eq('id', 1);
    setBusy(false);
    if (err) setError(err.message);
    else {
      setPatch({});
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  }

  const num = (key: keyof Settings) => ({
    type: 'number' as const,
    value: String(form[key] ?? ''),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: Number(e.target.value) }),
  });

  return (
    <section>
      <SectionTitle title="Online request window" hint="How early and how late the app accepts requests" />
      <Card className="space-y-4 p-4">
        <Toggle
          checked={form.online_booking_enabled}
          onChange={(next) => setForm({ ...form, online_booking_enabled: next })}
          label="Accept requests through the app"
          hint="Turn off for a busy holiday or a system issue. Members see a walk-in message instead."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <Label hint="minutes">Minimum lead time</Label>
            <TextInput min={0} max={240} {...num('min_lead_minutes')} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Earliest arrival a member may pick. Gives the desk warning before someone shows up.
            </p>
          </label>

          <label className="block">
            <Label hint="minutes">Maximum advance</Label>
            <TextInput min={15} max={1440} {...num('max_advance_minutes')} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Furthest ahead a member may aim: {Math.round(form.max_advance_minutes / 60)} hr at this setting.
              Also how early the day&apos;s requests open.
            </p>
          </label>

          <label className="block">
            <Label hint="minutes before close">Request cutoff</Label>
            <TextInput min={0} max={240} {...num('cutoff_minutes_before_close')} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Stop taking requests this long before closing so the last sessions actually fit.
            </p>
          </label>

          <label className="block">
            <Label hint="minutes">Late grace period</Label>
            <TextInput min={0} max={60} {...num('grace_period_minutes')} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              How far behind a member&apos;s ETA can slip before the desk flags them as running late.
            </p>
          </label>

          <label className="block">
            <Label>Active spots per member</Label>
            <TextInput min={1} max={5} {...num('max_active_per_member')} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Keep at 1 for a fair queue. Raise it to let members stack back-to-back services.
            </p>
          </label>
        </div>

        {invalid ? (
          <Banner tone="warn">
            Maximum advance has to be greater than minimum lead time, and every value must be positive.
          </Banner>
        ) : null}
        {error ? <Banner tone="alert">{error}</Banner> : null}

        <div className="flex items-center gap-3">
          <Button variant="primary" disabled={!dirty || invalid || busy} onClick={save}>
            {busy ? 'Saving…' : 'Save window'}
          </Button>
          {saved ? <span className="text-[12px] text-accent">Saved. Live in the app.</span> : null}
        </div>
      </Card>
    </section>
  );
}

function SpaDetailsForm({ settings }: { settings: Settings }) {
  const [patch, setPatch] = useState<Partial<Settings>>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form: Settings = { ...settings, ...patch };
  const setForm = (next: Settings) => setPatch(diffSettings(next, settings));
  const dirty = Object.keys(patch).length > 0;

  async function save() {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase
      .from('rms_settings')
      .update({
        spa_name: form.spa_name,
        spa_address: form.spa_address,
        timezone: form.timezone,
        spa_lat: form.spa_lat,
        spa_lng: form.spa_lng,
      })
      .eq('id', 1);
    setBusy(false);
    if (err) setError(err.message);
    else {
      setPatch({});
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <section>
      <SectionTitle
        title="Location & branding"
        hint="Coordinates are what member ETAs are measured against"
      />
      <Card className="space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <Label>Spa name</Label>
            <TextInput value={form.spa_name} onChange={(e) => setForm({ ...form, spa_name: e.target.value })} />
          </label>
          <label className="block">
            <Label hint="IANA name">Timezone</Label>
            <TextInput
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              placeholder="America/Chicago"
            />
          </label>
        </div>

        <label className="block">
          <Label>Address</Label>
          <TextInput
            value={form.spa_address}
            onChange={(e) => setForm({ ...form, spa_address: e.target.value })}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <Label>Latitude</Label>
            <TextInput
              type="number"
              step="0.0001"
              value={String(form.spa_lat)}
              onChange={(e) => setForm({ ...form, spa_lat: Number(e.target.value) })}
            />
          </label>
          <label className="block">
            <Label>Longitude</Label>
            <TextInput
              type="number"
              step="0.0001"
              value={String(form.spa_lng)}
              onChange={(e) => setForm({ ...form, spa_lng: Number(e.target.value) })}
            />
          </label>
        </div>

        {error ? <Banner tone="alert">{error}</Banner> : null}

        <div className="flex items-center gap-3">
          <Button variant="primary" disabled={!dirty || busy} onClick={save}>
            {busy ? 'Saving…' : 'Save details'}
          </Button>
          {saved ? <span className="text-[12px] text-accent">Saved.</span> : null}
        </div>
      </Card>
    </section>
  );
}
