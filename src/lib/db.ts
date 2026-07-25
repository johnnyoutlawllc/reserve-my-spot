'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

type Order = { column: string; ascending?: boolean };

/** Channel names have to be unique per subscriber; a counter is enough. */
let channelSeq = 0;
const channelSuffix = () => `${(channelSeq += 1).toString(36)}`;

/**
 * Loads a table and keeps it live over Supabase Realtime.
 *
 * Every portal in this app is a shared view of the same room, so a change made
 * at the front desk has to land on the member's phone without a refresh. Rather
 * than patch individual payloads, a change event just re-runs the query -- these
 * tables are tiny and it keeps ordering and filters honest.
 */
export function useLiveTable<T>(table: string, opts: { order?: Order; deps?: unknown[] } = {}) {
  const { order, deps = [] } = opts;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const orderColumn = order?.column;
  const orderAscending = order?.ascending ?? true;

  // Every state write happens in the query's callback, never inline, so a render
  // is never triggered synchronously from the effect that starts the fetch.
  const load = useCallback(() => {
    let query = supabase.from(table).select('*');
    if (orderColumn) query = query.order(orderColumn, { ascending: orderAscending });
    return query.then(({ data, error: err }) => {
      if (!mounted.current) return;
      if (err) setError(err.message);
      else {
        setError(null);
        setRows((data ?? []) as T[]);
      }
      setLoading(false);
    });
  }, [table, orderColumn, orderAscending]);

  useEffect(() => {
    mounted.current = true;
    void load();
    const channel = supabase
      .channel(`live:${table}:${channelSuffix()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => void load())
      .subscribe();
    return () => {
      mounted.current = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, load, ...deps]);

  return { rows, loading, error, reload: load, setRows };
}

/** Re-renders on an interval so relative times and countdowns stay honest. */
export function useNow(intervalMs = 15_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export async function notifyStaff(input: {
  kind: string;
  title: string;
  body?: string;
  member_id?: string | null;
  waitlist_id?: string | null;
  thread_id?: string | null;
}) {
  await supabase.from('rms_notifications').insert({
    audience: 'staff',
    kind: input.kind,
    title: input.title,
    body: input.body ?? null,
    member_id: input.member_id ?? null,
    waitlist_id: input.waitlist_id ?? null,
    thread_id: input.thread_id ?? null,
  });
}

export async function notifyMember(input: {
  member_id: string;
  kind: string;
  title: string;
  body?: string;
  waitlist_id?: string | null;
}) {
  await supabase.from('rms_notifications').insert({
    audience: 'member',
    member_id: input.member_id,
    kind: input.kind,
    title: input.title,
    body: input.body ?? null,
    waitlist_id: input.waitlist_id ?? null,
  });
}
