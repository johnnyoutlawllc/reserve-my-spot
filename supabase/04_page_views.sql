-- Page view tracking. Applied 2026-07-26 (migration: s69_rms_page_views_tracking).
-- Moved to the `spot` schema with the rest of the rms_ tables on 2026-08-01
-- (migration: move_rms_tables_to_spot_schema). outlawdata.com reads it with the
-- service role, so its client sets the schema too.
create table if not exists spot.rms_page_views (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  page_path text not null,
  referrer text,
  referrer_host text,
  device_type text,
  browser text,
  os text,
  ip_address text,
  city text,
  country text,
  visited_at timestamptz not null default now()
);
create index if not exists rms_page_views_visited_at_idx on spot.rms_page_views (visited_at desc);
alter table spot.rms_page_views enable row level security;
create policy "tracking inserts" on spot.rms_page_views
  for insert to anon, authenticated with check (true);
-- No select policy on purpose: rows carry IPs. Reads happen from a separate
-- reporting tool with the service role, which bypasses RLS.
