'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ServiceIcon } from '@/components/ServiceIcon';
import {
  Badge,
  Banner,
  Button,
  Card,
  Label,
  Modal,
  SectionTitle,
  Spinner,
  StatusBadge,
  TextArea,
  Select,
} from '@/components/ui';
import { requestSpot } from '@/lib/actions';
import { useSession } from '@/lib/session';
import { useSpa } from '@/lib/spa';
import type { Service } from '@/lib/types';
import { LIVE_STATUSES } from '@/lib/types';
import {
  clockTime,
  formatMinutes,
  humanSpan,
  humanWait,
  membershipState,
  parseTime,
  DAY_NAMES,
} from '@/lib/wait';

export default function BookPage() {
  const { member } = useSession();
  const { queues, waitlist, window: bookingWindow, settings, now, loading } = useSpa();
  const [picked, setPicked] = useState<Service | null>(null);
  const [arrival, setArrival] = useState('asap');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myLive = useMemo(
    () => waitlist.filter((e) => e.member_id === member?.id && LIVE_STATUSES.includes(e.status)),
    [waitlist, member?.id],
  );

  const membership = member ? membershipState(member) : { ok: false, reason: null };
  const atLimit = !!settings && myLive.length >= settings.max_active_per_member;
  const canRequest = !!bookingWindow?.open && membership.ok && !atLimit;

  const timezone = settings?.timezone;
  const arrivalOptions = useMemo(() => {
    if (!bookingWindow?.open) return [];
    const out: { value: string; label: string }[] = [{ value: 'asap', label: 'As soon as possible' }];
    const step = 15 * 60_000;
    const first = Math.ceil(bookingWindow.earliestArrivalMs / step) * step;
    for (let t = first; t <= bookingWindow.latestArrivalMs; t += step) {
      out.push({ value: String(t), label: clockTime(t, timezone) });
    }
    return out;
  }, [bookingWindow, timezone]);

  async function submit() {
    if (!member || !picked) return;
    setBusy(true);
    setError(null);
    try {
      await requestSpot({
        member,
        service: picked,
        desiredTime: arrival === 'asap' ? null : new Date(Number(arrival)),
        note,
      });
      setPicked(null);
      setNote('');
      setArrival('asap');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the request.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Spinner label="Checking today’s wait times" />;

  const today = bookingWindow?.today;

  return (
    <div className="space-y-5">
      {!membership.ok && membership.reason ? (
        <Banner tone="alert" title="Membership on hold">
          {membership.reason}
        </Banner>
      ) : null}

      {bookingWindow && !bookingWindow.open ? (
        <Banner tone="warn" title="Requests are closed">
          {bookingWindow.reason}
        </Banner>
      ) : null}

      {myLive.length > 0 ? (
        <Link href="/m/spot" className="block">
          <Card className="rms-rise border-accent/30 bg-accent-wash/40 p-4 transition-colors hover:border-accent/50">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  You have a spot
                </p>
                <p className="mt-1 truncate text-sm font-medium">
                  {myLive.map((e) => queues.find((q) => q.service.id === e.service_id)?.service.name ?? 'Service').join(', ')}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={myLive[0].status} />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 text-accent">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Card>
        </Link>
      ) : null}

      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">Today</p>
            <p className="mt-1 text-sm font-medium">
              {today && !today.is_closed
                ? `${DAY_NAMES[today.day_of_week]} · ${formatMinutes(parseTime(today.open_time))} – ${formatMinutes(parseTime(today.close_time))}`
                : 'Closed today'}
            </p>
            {settings ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
                Requests open up to {humanSpan(settings.max_advance_minutes)} before we do, and close{' '}
                {humanSpan(settings.cutoff_minutes_before_close)} before we shut.
              </p>
            ) : null}
          </div>
          <Badge tone={bookingWindow?.open ? 'accent' : 'neutral'}>
            <span className={bookingWindow?.open ? 'size-1.5 rounded-full bg-accent' : 'size-1.5 rounded-full bg-faint'} />
            {bookingWindow?.open ? 'Accepting' : 'Closed'}
          </Badge>
        </div>
      </Card>

      <section>
        <SectionTitle
          title="Choose a service"
          hint={atLimit ? 'One active spot at a time. Finish or cancel yours first.' : 'Live waits, updated automatically'}
        />
        <ul className="space-y-2.5">
          {queues.map((q) => {
            const inLine = q.slots.length;
            const busySlots = q.inService.length;
            const ready = q.nextAvailableMinutes === 0;
            return (
              <li key={q.service.id}>
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                        ready ? 'border-accent/30 bg-accent-wash text-accent' : 'border-line bg-surface-2 text-muted'
                      }`}
                    >
                      <ServiceIcon icon={q.service.icon} />
                    </div>
                    <div className="min-w-0 grow">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold tracking-tight">{q.service.name}</h3>
                        <span className="shrink-0 text-right">
                          <span
                            className={`block text-sm font-semibold tabular-nums ${ready ? 'text-accent' : 'text-text'}`}
                          >
                            {humanWait(q.nextAvailableMinutes)}
                          </span>
                          <span className="block text-[10px] text-faint">
                            {ready ? 'open now' : `~${clockTime(now + q.nextAvailableMinutes * 60_000, settings?.timezone)}`}
                          </span>
                        </span>
                      </div>
                      {q.service.description ? (
                        <p className="mt-1 text-[12px] leading-relaxed text-muted">{q.service.description}</p>
                      ) : null}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <Badge>{q.service.duration_minutes} min</Badge>
                        <Badge>
                          {q.service.capacity} {q.service.capacity === 1 ? 'station' : 'stations'}
                        </Badge>
                        {busySlots > 0 ? <Badge tone="accent">{busySlots} in session</Badge> : null}
                        {inLine > 0 ? <Badge tone="info">{inLine} in line</Badge> : null}
                      </div>
                      <Button
                        variant={ready ? 'primary' : 'outline'}
                        size="sm"
                        block
                        className="mt-3"
                        disabled={!canRequest}
                        onClick={() => {
                          setPicked(q.service);
                          setArrival('asap');
                        }}
                      >
                        Request my spot
                      </Button>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <Modal
        open={!!picked}
        onClose={() => setPicked(null)}
        title={picked ? `Request ${picked.name}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPicked(null)} disabled={busy}>
              Never mind
            </Button>
            <Button variant="primary" onClick={submit} disabled={busy}>
              {busy ? 'Sending…' : 'Send to front desk'}
            </Button>
          </>
        }
      >
        {picked ? (
          <div className="space-y-4">
            <p className="text-[13px] leading-relaxed text-muted">
              The front desk gets this immediately and adds you to the {picked.name} line. You’ll see your
              position and a live estimate on the My Spot tab.
            </p>

            <label className="block">
              <Label hint={settings ? `earliest ${settings.min_lead_minutes} min out` : undefined}>
                When will you arrive?
              </Label>
              <Select value={arrival} onChange={(e) => setArrival(e.target.value)}>
                {arrivalOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block">
              <Label hint="optional">Anything the desk should know?</Label>
              <TextArea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="First time on this one, or stacking with another service…"
              />
            </label>

            {member && !member.location_opt_in ? (
              <Banner tone="info" title="Turn on location sharing?">
                Sharing your location lets the desk see you’re on the way and hold your spot. You can enable it
                on the My Spot tab.
              </Banner>
            ) : null}

            {error ? <Banner tone="alert">{error}</Banner> : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
