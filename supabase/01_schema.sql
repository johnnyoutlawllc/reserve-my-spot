-- Reserve My Spot: schema
--
-- All tables are prefixed rms_ and live in `public`. They are in `public` rather
-- than a dedicated Postgres schema because PostgREST only serves schemas listed
-- under Exposed schemas in the project's API settings; the prefix gives the same
-- namespacing without needing that project-wide setting changed.

create extension if not exists "pgcrypto";

-- Single-row config for the spa.
create table if not exists public.rms_settings (
  id int primary key default 1 check (id = 1),
  spa_name text not null default 'Serenity Springs Spa',
  spa_address text not null default '480 Marigold Lane, Suite 200',
  spa_lat double precision not null default 36.1553,
  spa_lng double precision not null default -86.7845,
  timezone text not null default 'America/Chicago',
  -- Earliest arrival a member may aim for.
  min_lead_minutes int not null default 15,
  -- Furthest ahead a member may aim, and how early the day's requests open.
  max_advance_minutes int not null default 720,
  -- Stop accepting requests this long before closing.
  cutoff_minutes_before_close int not null default 30,
  -- How far behind a member's ETA can slip before the desk flags them late.
  grace_period_minutes int not null default 10,
  max_active_per_member int not null default 1,
  online_booking_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.rms_hours (
  day_of_week int primary key check (day_of_week between 0 and 6), -- 0 = Sunday
  is_closed boolean not null default false,
  open_time time not null default '09:00',
  close_time time not null default '19:00'
);

create table if not exists public.rms_staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role text not null default 'support' check (role in ('support','admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.rms_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  tier text not null default 'premium' check (tier in ('trial','premium','elite')),
  is_active boolean not null default true,
  membership_start date,
  membership_end date,
  location_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

-- duration_minutes x capacity is what every wait estimate is built from.
create table if not exists public.rms_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes int not null default 20,
  capacity int not null default 1,
  icon text not null default 'sparkle',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- One row per request. `requested` means it is sitting at the desk unaccepted;
-- `waiting` onward means it holds a place in the service's queue.
create table if not exists public.rms_waitlist (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.rms_members(id) on delete cascade,
  service_id uuid not null references public.rms_services(id) on delete restrict,
  status text not null default 'requested'
    check (status in ('requested','waiting','notified','in_service','completed','no_show','cancelled','forfeited','declined')),
  requested_at timestamptz not null default now(),
  desired_time timestamptz,
  queued_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  estimated_start timestamptz,
  estimated_wait_minutes int,
  bumped_count int not null default 0,
  member_note text,
  staff_note text,
  created_by text not null default 'member' check (created_by in ('member','staff')),
  updated_at timestamptz not null default now()
);

-- Latest known position only; no history is kept.
create table if not exists public.rms_member_locations (
  member_id uuid primary key references public.rms_members(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  accuracy_m double precision,
  distance_meters double precision,
  eta_minutes int,
  is_simulated boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.rms_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  sort_order int not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.rms_chat_threads (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.rms_members(id) on delete cascade,
  subject text not null default 'Question for the front desk',
  status text not null default 'open' check (status in ('open','closed')),
  last_message_at timestamptz not null default now(),
  unread_staff int not null default 0,
  unread_member int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.rms_chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.rms_chat_threads(id) on delete cascade,
  sender_role text not null check (sender_role in ('member','staff','system')),
  sender_id uuid,
  sender_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rms_notifications (
  id uuid primary key default gen_random_uuid(),
  audience text not null default 'staff' check (audience in ('staff','member')),
  member_id uuid references public.rms_members(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  waitlist_id uuid references public.rms_waitlist(id) on delete cascade,
  thread_id uuid references public.rms_chat_threads(id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists rms_waitlist_status_idx on public.rms_waitlist (status, requested_at);
create index if not exists rms_waitlist_service_idx on public.rms_waitlist (service_id, status);
create index if not exists rms_waitlist_member_idx on public.rms_waitlist (member_id, status);
create index if not exists rms_chat_messages_thread_idx on public.rms_chat_messages (thread_id, created_at);
create index if not exists rms_chat_threads_member_idx on public.rms_chat_threads (member_id, last_message_at desc);
create index if not exists rms_notifications_unread_idx on public.rms_notifications (audience, is_read, created_at desc);
create index if not exists rms_faqs_pub_idx on public.rms_faqs (is_published, category, sort_order);
