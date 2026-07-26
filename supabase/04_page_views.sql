-- Page view tracking. Applied 2026-07-26 (migration: s69_rms_page_views_tracking).
-- Lives in public with the rms_ prefix for the same reason as the other rms_
-- tables: PostgREST only serves schemas listed under Exposed schemas.
create table if not exists public.rms_page_views (
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
create index if not exists rms_page_views_visited_at_idx on public.rms_page_views (visited_at desc);
alter table public.rms_page_views enable row level security;
create policy "tracking inserts" on public.rms_page_views
  for insert to anon, authenticated with check (true);
-- No select policy on purpose: rows carry IPs. Reads happen from a separate
-- reporting tool with the service role, which bypasses RLS.
