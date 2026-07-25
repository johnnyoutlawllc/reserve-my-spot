'use client';

import { createContext, useContext, useMemo } from 'react';
import { useLiveTable, useNow } from './db';
import type { Hours, Member, MemberLocation, Service, Settings, WaitlistEntry } from './types';
import { bookingWindow, projectAll, type BookingWindow, type ServiceQueue } from './wait';

type SpaData = {
  settings: Settings | null;
  hours: Hours[];
  services: Service[];
  activeServices: Service[];
  waitlist: WaitlistEntry[];
  members: Member[];
  locations: MemberLocation[];
  queues: ServiceQueue[];
  window: BookingWindow | null;
  now: number;
  loading: boolean;
  serviceById: (id: string) => Service | undefined;
  memberById: (id: string) => Member | undefined;
  locationFor: (memberId: string) => MemberLocation | undefined;
};

const SpaContext = createContext<SpaData | null>(null);

/**
 * One subscription set shared by every portal.
 *
 * The member app, the front desk board, and the admin console all read the same
 * five tables. Mounting the queries once per portal (instead of once per page)
 * keeps the realtime channel count sane and means a status change lands
 * everywhere at the same moment.
 */
export function SpaProvider({ children }: { children: React.ReactNode }) {
  const now = useNow(10_000);

  const s = useLiveTable<Settings>('rms_settings');
  const h = useLiveTable<Hours>('rms_hours', { order: { column: 'day_of_week' } });
  const sv = useLiveTable<Service>('rms_services', { order: { column: 'sort_order' } });
  const w = useLiveTable<WaitlistEntry>('rms_waitlist', { order: { column: 'requested_at' } });
  const m = useLiveTable<Member>('rms_members', { order: { column: 'full_name' } });
  const loc = useLiveTable<MemberLocation>('rms_member_locations');

  const settings = s.rows[0] ?? null;
  const activeServices = useMemo(() => sv.rows.filter((x) => x.is_active), [sv.rows]);

  const value = useMemo<SpaData>(() => {
    const serviceMap = new Map(sv.rows.map((x) => [x.id, x]));
    const memberMap = new Map(m.rows.map((x) => [x.id, x]));
    const locMap = new Map(loc.rows.map((x) => [x.member_id, x]));
    return {
      settings,
      hours: h.rows,
      services: sv.rows,
      activeServices,
      waitlist: w.rows,
      members: m.rows,
      locations: loc.rows,
      queues: projectAll(activeServices, w.rows, now),
      window: settings ? bookingWindow(settings, h.rows, new Date(now)) : null,
      now,
      loading: s.loading || sv.loading || w.loading,
      serviceById: (id) => serviceMap.get(id),
      memberById: (id) => memberMap.get(id),
      locationFor: (id) => locMap.get(id),
    };
  }, [settings, h.rows, sv.rows, activeServices, w.rows, m.rows, loc.rows, now, s.loading, sv.loading, w.loading]);

  return <SpaContext.Provider value={value}>{children}</SpaContext.Provider>;
}

export function useSpa() {
  const ctx = useContext(SpaContext);
  if (!ctx) throw new Error('useSpa must be used inside <SpaProvider>');
  return ctx;
}
