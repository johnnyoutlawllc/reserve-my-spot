'use client';

import { useMemo, useState } from 'react';
import { ServiceIcon } from '@/components/ServiceIcon';
import {
  Badge,
  Banner,
  Button,
  Card,
  Empty,
  Label,
  Modal,
  SectionTitle,
  Spinner,
  Stat,
  StatusBadge,
  TextArea,
} from '@/components/ui';
import {
  acceptRequest,
  bumpBehindNext,
  callUp,
  completeService,
  declineRequest,
  markNoShow,
  releaseSpot,
  setStaffNote,
  startService,
} from '@/lib/actions';
import { milesLabel } from '@/lib/geo';
import { useSpa } from '@/lib/spa';
import type { Member, MemberLocation, Service, WaitlistEntry } from '@/lib/types';
import { clockTime, humanWait, sinceLabel, type QueueSlot } from '@/lib/wait';

type Risk = { level: 'ok' | 'tight' | 'late' | 'unknown'; gap: number; eta: number | null };

/**
 * Compares a member's driving ETA against when their station actually frees up.
 *
 * This is the judgement the rep used to make by squinting at the lobby. A positive
 * gap means the member will arrive after their turn comes around, which is the
 * moment the desk has to decide: hold, bump, or release.
 */
function assessRisk(
  entry: WaitlistEntry,
  slot: QueueSlot | null,
  location: MemberLocation | undefined,
  member: Member | undefined,
  graceMinutes: number,
): Risk {
  if (!location || !member?.location_opt_in) return { level: 'unknown', gap: 0, eta: null };
  const eta = location.eta_minutes ?? 0;
  const turnIn = entry.status === 'notified' ? 0 : (slot?.waitMinutes ?? 0);
  const gap = eta - turnIn;
  if (gap <= 0) return { level: 'ok', gap, eta };
  if (gap <= graceMinutes) return { level: 'tight', gap, eta };
  return { level: 'late', gap, eta };
}

export default function SupportBoardPage() {
  const { queues, waitlist, members, settings, memberById, locationFor, serviceById, now, loading } = useSpa();

  const requests = useMemo(
    () =>
      waitlist
        .filter((e) => e.status === 'requested')
        .sort((a, b) => new Date(a.requested_at).getTime() - new Date(b.requested_at).getTime()),
    [waitlist],
  );

  const waitingCount = queues.reduce((n, q) => n + q.slots.length, 0);
  const inSessionCount = queues.reduce((n, q) => n + q.inService.length, 0);
  const avgWait =
    waitingCount === 0
      ? 0
      : Math.round(
          queues.reduce((sum, q) => sum + q.slots.reduce((s, x) => s + x.waitMinutes, 0), 0) / waitingCount,
        );

  const enRoute = useMemo(() => {
    const live = waitlist.filter((e) => e.status === 'waiting' || e.status === 'notified');
    return live
      .map((entry) => {
        const q = queues.find((x) => x.service.id === entry.service_id);
        const slot = q?.slots.find((s) => s.entry.id === entry.id) ?? null;
        const member = memberById(entry.member_id);
        const location = locationFor(entry.member_id);
        return {
          entry,
          slot,
          member,
          location,
          service: serviceById(entry.service_id),
          risk: assessRisk(entry, slot, location, member, settings?.grace_period_minutes ?? 10),
        };
      })
      .sort((a, b) => rank(b.risk.level) - rank(a.risk.level) || (a.slot?.position ?? 0) - (b.slot?.position ?? 0));
  }, [waitlist, queues, memberById, locationFor, serviceById, settings?.grace_period_minutes]);

  const atRisk = enRoute.filter((r) => r.risk.level === 'late');

  if (loading) return <Spinner label="Loading the room" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Awaiting desk" value={requests.length} hint="new requests to accept" />
        <Stat
          label="In line"
          value={waitingCount}
          hint={waitingCount === 0 ? 'queue empty' : avgWait === 0 ? 'no wait right now' : `avg ${humanWait(avgWait)}`}
        />
        <Stat label="In session" value={inSessionCount} hint="stations occupied" />
        <Stat
          label="Running late"
          value={atRisk.length}
          hint={atRisk.length ? 'needs a decision' : 'everyone on pace'}
        />
      </div>

      {atRisk.length > 0 ? (
        <Banner tone="alert" title={`${atRisk.length} member${atRisk.length === 1 ? '' : 's'} will miss their turn`}>
          {atRisk
            .map((r) => `${r.member?.full_name ?? 'Member'} is ${r.risk.gap} min behind for ${r.service?.name}`)
            .join(' · ')}
        </Banner>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section>
            <SectionTitle
              title="Incoming requests"
              hint="Accept to put the member in line — they get the estimate immediately"
            />
            {requests.length === 0 ? (
              <Empty title="No pending requests" body="New requests appear here the moment a member taps Request my spot." />
            ) : (
              <ul className="space-y-2.5">
                {requests.map((entry) => (
                  <RequestCard key={entry.id} entry={entry} />
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle title="Room board" hint="Live queue per station group" />
            <div className="space-y-3">
              {queues.map((q) => (
                <ServiceBoard key={q.service.id} serviceId={q.service.id} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-3">
          <SectionTitle title="On the way" hint="Driving ETA vs. when their turn comes up" />
          {enRoute.length === 0 ? (
            <Empty title="Nobody in line" body="Once members are queued, their approach shows up here." />
          ) : (
            <ul className="space-y-2">
              {enRoute.map(({ entry, slot, member, location, service, risk }) => (
                <li key={entry.id}>
                  <Card
                    className={`p-3.5 ${
                      risk.level === 'late'
                        ? 'border-alert/40 bg-alert-wash/40'
                        : risk.level === 'tight'
                          ? 'border-warn/30'
                          : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold tracking-tight">
                          {member?.full_name ?? 'Member'}
                        </p>
                        <p className="truncate text-[11px] text-faint">
                          {service?.name} · {entry.status === 'notified' ? 'called up' : `#${slot?.position ?? '—'} in line`}
                        </p>
                      </div>
                      <RiskBadge risk={risk} />
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg border border-line-soft bg-surface-2 px-2 py-1.5">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-faint">Their turn</p>
                        <p className="mt-0.5 font-semibold tabular-nums">
                          {entry.status === 'notified'
                            ? 'now'
                            : slot
                              ? clockTime(slot.startMs, settings?.timezone)
                              : '—'}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line-soft bg-surface-2 px-2 py-1.5">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-faint">Arriving</p>
                        <p className="mt-0.5 font-semibold tabular-nums">
                          {risk.eta === null ? 'unknown' : `${risk.eta} min`}
                        </p>
                      </div>
                    </div>

                    {location ? (
                      <p className="mt-2 text-[11px] text-faint">
                        {milesLabel(location.distance_meters ?? 0)} · updated {sinceLabel(location.updated_at, now)}
                        {location.is_simulated ? ' · simulated' : ''}
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] text-faint">
                        {member?.location_opt_in ? 'No position sent yet.' : 'Location sharing is off.'}
                      </p>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          )}

          <Card className="p-3.5">
            <p className="text-[11px] leading-relaxed text-faint">
              {members.filter((m) => m.location_opt_in).length} of {members.length} members have location
              sharing on. Grace period is {settings?.grace_period_minutes ?? 10} minutes before someone counts as
              running late.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function rank(level: Risk['level']) {
  return level === 'late' ? 3 : level === 'tight' ? 2 : level === 'unknown' ? 1 : 0;
}

function RiskBadge({ risk }: { risk: Risk }) {
  if (risk.level === 'late') return <Badge tone="alert">{risk.gap} min late</Badge>;
  if (risk.level === 'tight') return <Badge tone="warn">tight</Badge>;
  if (risk.level === 'unknown') return <Badge>no location</Badge>;
  return <Badge tone="accent">on pace</Badge>;
}

/* --------------------------------------------------------- incoming requests */

function RequestCard({ entry }: { entry: WaitlistEntry }) {
  const { memberById, serviceById, queues, settings, now } = useSpa();
  const member = memberById(entry.member_id);
  const service = serviceById(entry.service_id);
  const queue = queues.find((q) => q.service.id === entry.service_id);
  const projectedWait = queue?.nextAvailableMinutes ?? 0;
  const [busy, setBusy] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState('');

  if (!service) return null;

  return (
    <li className="rms-rise">
      <Card className="border-warn/25 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
                <ServiceIcon icon={service.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">
                  {member?.full_name ?? 'Member'}
                  <span className="ml-2 font-normal text-muted">wants {service.name}</span>
                </p>
                <p className="text-[11px] text-faint">
                  Requested {sinceLabel(entry.requested_at, now)}
                  {entry.desired_time
                    ? ` · arriving ~${clockTime(new Date(entry.desired_time).getTime(), settings?.timezone)}`
                    : ' · as soon as possible'}
                  {member ? ` · ${member.tier}` : ''}
                </p>
              </div>
            </div>
            {entry.member_note ? (
              <p className="mt-2.5 rounded-lg border border-line bg-surface-2 px-3 py-2 text-[12px] leading-relaxed text-muted">
                “{entry.member_note}”
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-faint">
                Next opening
              </span>
              <span className="block text-sm font-semibold tabular-nums">{humanWait(projectedWait)}</span>
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await acceptRequest(entry, service, projectedWait);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Add to waitlist
            </Button>
            <Button variant="ghost" size="sm" disabled={busy} onClick={() => setDeclining(true)}>
              Decline
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={declining}
        onClose={() => setDeclining(false)}
        title={`Decline ${member?.full_name ?? 'this request'}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeclining(false)} disabled={busy}>
              Back
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await declineRequest(entry, service, reason);
                  setDeclining(false);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Decline request
            </Button>
          </>
        }
      >
        <label className="block">
          <Label hint="the member sees this">Reason</Label>
          <TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Bulb replacement on bed 2 — try again after 3pm."
          />
        </label>
      </Modal>
    </li>
  );
}

/* --------------------------------------------------------------- room board */

function ServiceBoard({ serviceId }: { serviceId: string }) {
  const { queues, settings, memberById, locationFor, waitlist, now } = useSpa();
  const queue = queues.find((q) => q.service.id === serviceId);
  if (!queue) return null;
  const { service, slots, inService } = queue;
  const siblings = waitlist.filter((e) => e.service_id === serviceId);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-soft px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
          <ServiceIcon icon={service.icon} className="size-4" />
        </span>
        <h3 className="text-sm font-semibold tracking-tight">{service.name}</h3>
        <Badge>
          {inService.length}/{service.capacity} stations busy
        </Badge>
        <Badge tone={slots.length ? 'info' : 'neutral'}>{slots.length} in line</Badge>
        <span className="ml-auto text-[11px] text-faint">
          next opening {humanWait(queue.nextAvailableMinutes)}
        </span>
      </div>

      {inService.length === 0 && slots.length === 0 ? (
        <p className="px-4 py-5 text-[12px] text-faint">Idle. No one in session or waiting.</p>
      ) : (
        <ul className="divide-y divide-line-soft">
          {inService.map((entry) => (
            <BoardRow
              key={entry.id}
              entry={entry}
              service={service}
              slot={null}
              siblings={siblings}
              member={memberById(entry.member_id)}
              location={locationFor(entry.member_id)}
              graceMinutes={settings?.grace_period_minutes ?? 10}
              timezone={settings?.timezone}
              now={now}
            />
          ))}
          {slots.map((slot) => (
            <BoardRow
              key={slot.entry.id}
              entry={slot.entry}
              service={service}
              slot={slot}
              siblings={siblings}
              member={memberById(slot.entry.member_id)}
              location={locationFor(slot.entry.member_id)}
              graceMinutes={settings?.grace_period_minutes ?? 10}
              timezone={settings?.timezone}
              now={now}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

function BoardRow({
  entry,
  service,
  slot,
  siblings,
  member,
  location,
  graceMinutes,
  timezone,
  now,
}: {
  entry: WaitlistEntry;
  service: Service;
  slot: QueueSlot | null;
  siblings: WaitlistEntry[];
  member: Member | undefined;
  location: MemberLocation | undefined;
  graceMinutes: number;
  timezone: string | undefined;
  now: number;
}) {
  const [busy, setBusy] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [noting, setNoting] = useState(false);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState(entry.staff_note ?? '');
  const risk = assessRisk(entry, slot, location, member, graceMinutes);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }

  const endsAt =
    entry.status === 'in_service' && entry.started_at
      ? new Date(entry.started_at).getTime() + service.duration_minutes * 60_000
      : null;

  return (
    <li
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 ${
        risk.level === 'late' ? 'bg-alert-wash/30' : ''
      }`}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-line text-[10px] font-semibold text-muted">
        {slot ? `#${slot.position}` : '▶'}
      </span>

      <div className="min-w-0 grow">
        <p className="truncate text-[13px] font-medium">
          {member?.full_name ?? 'Member'}
          {entry.bumped_count > 0 ? (
            <span className="ml-2 text-[10px] text-warn">bumped ×{entry.bumped_count}</span>
          ) : null}
        </p>
        <p className="truncate text-[11px] text-faint">
          {entry.status === 'in_service'
            ? `in session · ends ${endsAt ? clockTime(endsAt, timezone) : '—'}`
            : slot
              ? `turn at ${clockTime(slot.startMs, timezone)} · ${humanWait(slot.waitMinutes)}`
              : sinceLabel(entry.requested_at, now)}
          {location ? ` · ${risk.eta} min out` : ''}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <StatusBadge status={entry.status} />
        {risk.level === 'late' ? <RiskBadge risk={risk} /> : null}
      </div>

      <div className="flex w-full shrink-0 flex-wrap gap-1.5 sm:w-auto">
        {entry.status === 'waiting' ? (
          <>
            <Button size="sm" variant="primary" disabled={busy} onClick={() => run(() => callUp(entry, service))}>
              Call up
            </Button>
            <Button size="sm" disabled={busy} onClick={() => run(() => startService(entry))}>
              Start now
            </Button>
          </>
        ) : null}
        {entry.status === 'notified' ? (
          <>
            <Button size="sm" variant="primary" disabled={busy} onClick={() => run(() => startService(entry))}>
              Start session
            </Button>
            <Button size="sm" disabled={busy} onClick={() => run(() => markNoShow(entry, service))}>
              No show
            </Button>
          </>
        ) : null}
        {entry.status === 'in_service' ? (
          <Button size="sm" variant="primary" disabled={busy} onClick={() => run(() => completeService(entry))}>
            Complete
          </Button>
        ) : null}
        {entry.status === 'waiting' || entry.status === 'notified' ? (
          <>
            <Button
              size="sm"
              variant="warn"
              disabled={busy}
              onClick={() => run(() => bumpBehindNext(entry, siblings, service))}
            >
              Bump back
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setReleasing(true)}>
              Release
            </Button>
          </>
        ) : null}
        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setNoting(true)}>
          Note
        </Button>
      </div>

      <Modal
        open={releasing}
        onClose={() => setReleasing(false)}
        title={member ? `Release ${member.full_name}’s spot?` : 'Release this spot?'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReleasing(false)} disabled={busy}>
              Keep holding
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await releaseSpot(entry, service, reason);
                  setReleasing(false);
                })
              }
            >
              Release to next member
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {risk.level === 'late' ? (
            <Banner tone="alert">
              {member?.full_name} is about {risk.eta} minutes out and their turn is in{' '}
              {humanWait(slot?.waitMinutes ?? 0)} — roughly {risk.gap} minutes behind.
            </Banner>
          ) : null}
          <p className="text-[13px] leading-relaxed text-muted">
            Bump back keeps their visit and just moves them behind the next person. Release removes them from
            the line entirely and frees the station for whoever is next.
          </p>
          <label className="block">
            <Label hint="the member sees this">Reason</Label>
            <TextArea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Couldn't reach you and the room was full."
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={noting}
        onClose={() => setNoting(false)}
        title="Note for the member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNoting(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await setStaffNote(entry, note);
                  setNoting(false);
                })
              }
            >
              Save note
            </Button>
          </>
        }
      >
        <label className="block">
          <Label hint="shows on their My Spot screen">Note</Label>
          <TextArea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="We put you on bed 3 — it runs a little warmer."
          />
        </label>
      </Modal>
    </li>
  );
}
