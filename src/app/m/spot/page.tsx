'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ServiceIcon } from '@/components/ServiceIcon';
import {
  Badge,
  Banner,
  Button,
  Card,
  Empty,
  Modal,
  SectionTitle,
  Spinner,
  StatusBadge,
  Toggle,
} from '@/components/ui';
import { cancelEntry, clearLocation, pushLocation, setLocationOptIn } from '@/lib/actions';
import { useLiveTable } from '@/lib/db';
import { drivingEta, haversine, interpolate, milesLabel } from '@/lib/geo';
import { useSession } from '@/lib/session';
import { useSpa } from '@/lib/spa';
import type { Notification, WaitlistEntry } from '@/lib/types';
import { LIVE_STATUSES } from '@/lib/types';
import { clockTime, findSlot, humanWait, sinceLabel } from '@/lib/wait';

export default function MySpotPage() {
  const { member } = useSession();
  const { waitlist, queues, serviceById, settings, now, loading } = useSpa();
  const [cancelling, setCancelling] = useState<WaitlistEntry | null>(null);
  const [busy, setBusy] = useState(false);

  const mine = useMemo(
    () =>
      waitlist
        .filter((e) => e.member_id === member?.id && LIVE_STATUSES.includes(e.status))
        .sort((a, b) => new Date(a.requested_at).getTime() - new Date(b.requested_at).getTime()),
    [waitlist, member?.id],
  );

  const history = useMemo(
    () =>
      waitlist
        .filter((e) => e.member_id === member?.id && !LIVE_STATUSES.includes(e.status))
        .sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime())
        .slice(0, 5),
    [waitlist, member?.id],
  );

  if (loading) return <Spinner label="Finding your spot" />;

  return (
    <div className="space-y-6">
      {mine.length === 0 ? (
        <Empty
          title="You’re not in line right now"
          body="Pick a service on the Book tab and the front desk will add you to the list."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7.5V12l3.5 2" strokeLinecap="round" />
            </svg>
          }
        />
      ) : (
        <ul className="space-y-3">
          {mine.map((entry) => {
            const service = serviceById(entry.service_id);
            const slot = findSlot(queues, entry.id);
            const ahead = slot ? slot.position - 1 : 0;
            const startMs =
              entry.status === 'in_service' && entry.started_at
                ? new Date(entry.started_at).getTime() + (service?.duration_minutes ?? 20) * 60_000
                : (slot?.startMs ?? (entry.estimated_start ? new Date(entry.estimated_start).getTime() : null));

            return (
              <li key={entry.id}>
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent-wash text-accent">
                      <ServiceIcon icon={service?.icon ?? 'sparkle'} />
                    </span>
                    <div className="min-w-0 grow">
                      <p className="truncate text-sm font-semibold tracking-tight">{service?.name ?? 'Service'}</p>
                      <p className="text-[11px] text-faint">Requested {sinceLabel(entry.requested_at, now)}</p>
                    </div>
                    <StatusBadge status={entry.status} />
                  </div>

                  <div className="px-4 py-4">
                    {entry.status === 'requested' ? (
                      <div className="flex items-center gap-3">
                        <span className="rms-live size-2.5 shrink-0 rounded-full bg-warn" />
                        <p className="text-[13px] leading-relaxed text-muted">
                          Sent to the front desk. They’ll add you to the {service?.name} line in a moment and
                          your estimate appears here.
                        </p>
                      </div>
                    ) : entry.status === 'notified' ? (
                      <div className="rounded-xl border border-accent/40 bg-accent-wash px-3.5 py-3">
                        <p className="text-sm font-semibold text-accent">You’re up — head to the front desk.</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-accent/80">
                          Your {service?.name} station is open and being held for you.
                        </p>
                      </div>
                    ) : entry.status === 'in_service' ? (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                          Session ends around
                        </p>
                        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-accent">
                          {startMs ? clockTime(startMs, settings?.timezone) : '—'}
                        </p>
                        <p className="mt-1 text-[12px] text-muted">Enjoy it. Nothing else to do.</p>
                      </div>
                    ) : (
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                            Estimated start
                          </p>
                          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                            {startMs ? clockTime(startMs, settings?.timezone) : '—'}
                          </p>
                          <p className="mt-1 text-[12px] text-muted">
                            {!slot ? '—' : slot.waitMinutes === 0 ? 'a station is free' : `${humanWait(slot.waitMinutes)} from now`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-faint">In line</p>
                          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                            #{slot?.position ?? '—'}
                          </p>
                          <p className="mt-1 text-[12px] text-muted">
                            {ahead === 0 ? 'you’re next' : `${ahead} ahead of you`}
                          </p>
                        </div>
                      </div>
                    )}

                    {entry.bumped_count > 0 ? (
                      <div className="mt-3">
                        <Banner tone="warn">
                          The desk moved you back {entry.bumped_count === 1 ? 'one place' : `${entry.bumped_count} places`} so
                          the room kept moving. Your spot is still held.
                        </Banner>
                      </div>
                    ) : null}

                    {entry.staff_note ? (
                      <p className="mt-3 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[12px] leading-relaxed text-muted">
                        <span className="font-semibold text-text">Front desk:</span> {entry.staff_note}
                      </p>
                    ) : null}

                    {entry.status !== 'in_service' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 -ml-1"
                        onClick={() => setCancelling(entry)}
                      >
                        Cancel this request
                      </Button>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <LocationCard hasActiveSpot={mine.length > 0} />

      <MemberActivity />

      {history.length > 0 ? (
        <section>
          <SectionTitle title="Recent visits" />
          <ul className="space-y-1.5">
            {history.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-surface px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{serviceById(e.service_id)?.name ?? 'Service'}</p>
                  <p className="text-[11px] text-faint">{sinceLabel(e.requested_at, now)}</p>
                </div>
                <StatusBadge status={e.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Modal
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        title="Cancel this request?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelling(null)} disabled={busy}>
              Keep it
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={async () => {
                if (!cancelling || !member) return;
                setBusy(true);
                try {
                  await cancelEntry(cancelling, member.full_name);
                  setCancelling(null);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? 'Cancelling…' : 'Yes, cancel'}
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-muted">
          You’ll lose your place in line and the front desk will be notified. You can request a new spot any
          time — there’s no penalty.
        </p>
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------- location */

/**
 * The location panel a member controls.
 *
 * Real GPS is the production path, but a laptop browser reports the office it is
 * sitting in and never moves — useless for showing a spa owner what the front desk
 * sees. So the demo simulator drives a synthetic approach along the same code path,
 * writing to the same row the front desk reads.
 */
function LocationCard({ hasActiveSpot }: { hasActiveSpot: boolean }) {
  const { member, refresh } = useSession();
  const { settings, locationFor, now } = useSpa();
  const [mode, setMode] = useState<'idle' | 'gps' | 'sim'>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [progress, setProgress] = useState(35);
  const watchRef = useRef<number | null>(null);
  const simTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (simTimer.current !== null) window.clearTimeout(simTimer.current);
    },
    [],
  );

  const location = member ? locationFor(member.id) : undefined;
  const memberId = member?.id;
  const spa = useMemo(
    () => (settings ? { lat: settings.spa_lat, lng: settings.spa_lng } : null),
    [settings],
  );

  /** Synthetic trip origin: ~9 miles northeast of the spa. */
  const origin = useMemo(
    () => (spa ? { lat: spa.lat + 0.115, lng: spa.lng + 0.1 } : null),
    [spa],
  );

  const send = useCallback(
    async (lat: number, lng: number, accuracy: number | null, simulated: boolean) => {
      if (!memberId || !spa) return;
      const distance = haversine({ lat, lng }, spa);
      await pushLocation({
        memberId,
        lat,
        lng,
        accuracy_m: accuracy,
        distance_meters: distance,
        eta_minutes: drivingEta(distance),
        is_simulated: simulated,
      });
    },
    [memberId, spa],
  );

  // Real GPS watch, only while the member has it turned on.
  useEffect(() => {
    if (mode !== 'gps' || !member?.location_opt_in) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsError(null);
        void send(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, false);
      },
      (err) => setGpsError(err.message || 'Location permission was denied.'),
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 20_000 },
    );
    watchRef.current = id;
    return () => {
      navigator.geolocation.clearWatch(id);
      watchRef.current = null;
    };
  }, [mode, member?.location_opt_in, send]);

  /**
   * Dragging the slider fires an input event per pixel, so the write trails the
   * gesture. The desk still sees a smooth approach and the last position wins.
   */
  function onSimulate(pct: number) {
    setProgress(pct);
    if (!origin || !spa) return;
    if (simTimer.current !== null) window.clearTimeout(simTimer.current);
    simTimer.current = window.setTimeout(() => {
      const point = interpolate(origin, spa, pct / 100);
      void send(point.lat, point.lng, 20, true);
    }, 250);
  }

  async function toggleOptIn(next: boolean) {
    if (!member) return;
    await setLocationOptIn(member.id, next);
    setMode('idle');
    if (!next) {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      setGpsError(null);
    }
    refresh();
  }

  const stale = location ? now - new Date(location.updated_at).getTime() > 5 * 60_000 : false;

  return (
    <section>
      <SectionTitle
        title="Location sharing"
        hint={hasActiveSpot ? 'Helps the desk hold your spot' : 'Turn on before you request a spot'}
      />
      <Card className="space-y-3 p-4">
        <Toggle
          checked={!!member?.location_opt_in}
          onChange={toggleOptIn}
          label="Share my location with the front desk"
          hint="Only while you have an active request. The desk sees your driving ETA, not your history."
        />

        {member?.location_opt_in ? (
          <>
            {location ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold tabular-nums">
                    {location.eta_minutes} min out
                    <span className="ml-2 text-xs font-normal text-muted">
                      {milesLabel(location.distance_meters ?? 0)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-faint">
                    Updated {sinceLabel(location.updated_at, now)}
                    {location.is_simulated ? ' · simulated' : ''}
                  </p>
                </div>
                <Badge tone={stale ? 'warn' : 'accent'}>
                  <span className={`size-1.5 rounded-full ${stale ? 'bg-warn' : 'bg-accent'}`} />
                  {stale ? 'stale' : 'live'}
                </Badge>
              </div>
            ) : (
              <p className="text-[12px] leading-relaxed text-faint">
                No position sent yet. Start a live update below.
              </p>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={mode === 'gps' ? 'primary' : 'outline'}
                onClick={() => {
                  if (mode === 'gps') {
                    setMode('idle');
                    return;
                  }
                  if (!('geolocation' in navigator)) {
                    setGpsError('This browser has no location support. Use the demo simulator instead.');
                    return;
                  }
                  setGpsError(null);
                  setMode('gps');
                }}
              >
                {mode === 'gps' ? 'Stop GPS' : 'Use real GPS'}
              </Button>
              <Button
                size="sm"
                variant={mode === 'sim' ? 'primary' : 'outline'}
                onClick={() => {
                  setMode(mode === 'sim' ? 'idle' : 'sim');
                  if (mode !== 'sim') onSimulate(progress);
                }}
              >
                {mode === 'sim' ? 'Stop demo' : 'Demo: simulate drive'}
              </Button>
              {location ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (member) await clearLocation(member.id);
                  }}
                >
                  Clear
                </Button>
              ) : null}
            </div>

            {gpsError ? <Banner tone="warn">{gpsError}</Banner> : null}

            {mode === 'sim' ? (
              <div className="rounded-xl border border-line bg-surface-2 px-3.5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                    Distance to spa
                  </span>
                  <span className="text-[11px] tabular-nums text-muted">{progress}% of the way</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => onSimulate(Number(e.target.value))}
                  aria-label="Simulated distance to the spa"
                  className="mt-2 w-full accent-[var(--color-accent)]"
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
                  Drag to move yourself toward the spa. The front desk board updates instantly — open it in
                  another window to watch.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-[12px] leading-relaxed text-faint">
            With sharing off, the desk can still hold your spot — they just have no way to know if you’re on
            the way, so a late arrival is more likely to be released.
          </p>
        )}
      </Card>
    </section>
  );
}

/* ------------------------------------------------------------------- activity */

function MemberActivity() {
  const { member } = useSession();
  const { now } = useSpa();
  const { rows } = useLiveTable<Notification>('rms_notifications', {
    order: { column: 'created_at', ascending: false },
  });

  const mine = rows.filter((n) => n.audience === 'member' && n.member_id === member?.id).slice(0, 6);
  if (mine.length === 0) return null;

  return (
    <section>
      <SectionTitle title="Updates from the desk" />
      <ul className="space-y-1.5">
        {mine.map((n) => (
          <li key={n.id} className="rounded-xl border border-line-soft bg-surface px-3.5 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13px] font-medium leading-snug">{n.title}</p>
              <span className="shrink-0 text-[10px] text-faint">{sinceLabel(n.created_at, now)}</span>
            </div>
            {n.body ? <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{n.body}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
