import type { Hours, Service, Settings, WaitlistEntry } from './types';
import { QUEUED_STATUSES } from './types';

export type QueueSlot = {
  entry: WaitlistEntry;
  /** 1-based place in this service's queue. */
  position: number;
  /** Projected station start time, ms epoch. */
  startMs: number;
  /** Minutes from `now` until the projected start. */
  waitMinutes: number;
};

export type ServiceQueue = {
  service: Service;
  /** Entries currently on a station. */
  inService: WaitlistEntry[];
  /** Queued entries with their projected starts, in queue order. */
  slots: QueueSlot[];
  /** What a member joining right now would wait, in minutes. */
  nextAvailableMinutes: number;
};

const MIN = 60_000;

function orderKey(e: WaitlistEntry) {
  return new Date(e.queued_at ?? e.requested_at).getTime();
}

/**
 * Projects a service's queue by simulating its stations.
 *
 * Each station is busy until its current session ends, then takes the next
 * member in line. A service with 3 wave-massage beds drains its queue three
 * times faster than a single cryo chamber, which is the whole reason the
 * estimate is worth showing to a member.
 */
export function projectService(
  service: Service,
  entries: WaitlistEntry[],
  now = Date.now(),
): ServiceQueue {
  const mine = entries.filter((e) => e.service_id === service.id);
  const inService = mine
    .filter((e) => e.status === 'in_service')
    .sort((a, b) => orderKey(a) - orderKey(b));
  const queued = mine
    .filter((e) => QUEUED_STATUSES.includes(e.status))
    .sort((a, b) => orderKey(a) - orderKey(b));

  const durationMs = Math.max(1, service.duration_minutes) * MIN;
  const capacity = Math.max(1, service.capacity);

  // When each station frees up. Occupied stations first, then any idle ones.
  const freeAt: number[] = inService.slice(0, capacity).map((e) => {
    const started = e.started_at ? new Date(e.started_at).getTime() : now;
    return Math.max(now, started + durationMs);
  });
  while (freeAt.length < capacity) freeAt.push(now);

  const slots: QueueSlot[] = queued.map((entry, i) => {
    freeAt.sort((a, b) => a - b);
    const startMs = freeAt[0];
    freeAt[0] = startMs + durationMs;
    return {
      entry,
      position: i + 1,
      startMs,
      waitMinutes: Math.max(0, Math.round((startMs - now) / MIN)),
    };
  });

  freeAt.sort((a, b) => a - b);
  return {
    service,
    inService,
    slots,
    nextAvailableMinutes: Math.max(0, Math.round((freeAt[0] - now) / MIN)),
  };
}

export function projectAll(
  services: Service[],
  entries: WaitlistEntry[],
  now = Date.now(),
): ServiceQueue[] {
  return services.map((s) => projectService(s, entries, now));
}

export function findSlot(queues: ServiceQueue[], waitlistId: string): QueueSlot | null {
  for (const q of queues) {
    const hit = q.slots.find((s) => s.entry.id === waitlistId);
    if (hit) return hit;
  }
  return null;
}

/* ---------------------------------------------------------------- store hours */

export type SpaClock = {
  /** 0 = Sunday, matching rms_hours.day_of_week. */
  dayOfWeek: number;
  /** Minutes since midnight at the spa. */
  minutesOfDay: number;
  label: string;
};

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Reads the wall clock in the spa's timezone, not the member's. */
export function spaClock(timezone: string, at = new Date()): SpaClock {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(at);
  } catch {
    parts = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(at);
  }
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = parseInt(get('hour'), 10) % 24;
  const minute = parseInt(get('minute'), 10);
  const dayOfWeek = DAY_INDEX[get('weekday')] ?? at.getDay();
  return {
    dayOfWeek,
    minutesOfDay: hour * 60 + minute,
    label: formatMinutes(hour * 60 + minute),
  };
}

export function parseTime(value: string): number {
  const [h, m] = value.split(':');
  return parseInt(h, 10) * 60 + parseInt(m ?? '0', 10);
}

export function formatMinutes(total: number): string {
  const wrapped = ((total % 1440) + 1440) % 1440;
  const h24 = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type BookingWindow = {
  open: boolean;
  /** Why requests are closed, phrased for a member. */
  reason: string | null;
  today: Hours | null;
  /** Inclusive request window in minutes-of-day, when the spa is open today. */
  requestsOpenAt: number | null;
  requestsCloseAt: number | null;
  /** Bounds for a member-chosen arrival time, ms epoch. */
  earliestArrivalMs: number;
  latestArrivalMs: number;
};

/**
 * Decides whether the app should accept a request right now.
 *
 * Three admin-controlled gates: the master online toggle, today's store hours
 * widened by `max_advance_minutes` on the front, and `cutoff_minutes_before_close`
 * on the back so the desk isn't queueing people it can't serve.
 */
export function bookingWindow(
  settings: Settings,
  hours: Hours[],
  at = new Date(),
): BookingWindow {
  const clock = spaClock(settings.timezone, at);
  const today = hours.find((h) => h.day_of_week === clock.dayOfWeek) ?? null;
  const nowMs = at.getTime();
  const base = {
    today,
    earliestArrivalMs: nowMs + settings.min_lead_minutes * MIN,
    latestArrivalMs: nowMs + settings.max_advance_minutes * MIN,
  };

  if (!settings.online_booking_enabled) {
    return {
      ...base,
      open: false,
      reason: 'Online requests are paused. Please see the front desk.',
      requestsOpenAt: null,
      requestsCloseAt: null,
    };
  }
  if (!today || today.is_closed) {
    return {
      ...base,
      open: false,
      reason: `${settings.spa_name} is closed ${DAY_NAMES[clock.dayOfWeek]}.`,
      requestsOpenAt: null,
      requestsCloseAt: null,
    };
  }

  const openAt = parseTime(today.open_time);
  const closeAt = parseTime(today.close_time);
  // Clamped to midnight: a long advance window means "as soon as the day starts",
  // not a time that wraps back into yesterday.
  const requestsOpenAt = Math.max(0, openAt - settings.max_advance_minutes);
  const requestsCloseAt = closeAt - settings.cutoff_minutes_before_close;

  if (clock.minutesOfDay < requestsOpenAt) {
    return {
      ...base,
      open: false,
      reason: `Requests for today open at ${formatMinutes(requestsOpenAt)}. Doors open at ${formatMinutes(openAt)}.`,
      requestsOpenAt,
      requestsCloseAt,
    };
  }
  if (clock.minutesOfDay >= requestsCloseAt) {
    return {
      ...base,
      open: false,
      reason: `Requests closed for today at ${formatMinutes(requestsCloseAt)} (${settings.cutoff_minutes_before_close} min before we close).`,
      requestsOpenAt,
      requestsCloseAt,
    };
  }

  // Never propose an arrival past the last servable minute.
  const closeMs = nowMs + (closeAt - clock.minutesOfDay) * MIN;
  return {
    ...base,
    open: true,
    reason: null,
    requestsOpenAt,
    requestsCloseAt,
    latestArrivalMs: Math.min(base.latestArrivalMs, closeMs),
  };
}

export function membershipState(member: {
  is_active: boolean;
  membership_start: string | null;
  membership_end: string | null;
}): { ok: boolean; reason: string | null } {
  if (!member.is_active) {
    return { ok: false, reason: 'Your membership is marked inactive. The front desk can reactivate it.' };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (member.membership_start && member.membership_start > today) {
    return { ok: false, reason: `Your membership starts ${member.membership_start}.` };
  }
  if (member.membership_end && member.membership_end < today) {
    return { ok: false, reason: `Your membership ended ${member.membership_end}. Renew at the front desk.` };
  }
  return { ok: true, reason: null };
}

/** "45 min" / "4 hr" / "1 hr 30 min", for durations described in prose. */
export function humanSpan(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function humanWait(minutes: number): string {
  if (minutes <= 0) return 'Ready now';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function clockTime(ms: number, timezone?: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(ms));
  }
}

export function sinceLabel(iso: string, now = Date.now()): string {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / MIN));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
