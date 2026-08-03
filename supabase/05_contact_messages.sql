-- Contact form intake for the marketing site (/contact -> /api/contact).
-- Applied to the Outlaw Apps project on 2026-08-03 as migration
-- `rms_contact_messages`. Safe to re-run.

create table if not exists spot.rms_contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  phone text,
  locations text,
  message text not null,
  source text not null default 'reservemy.spot/contact',
  user_agent text,
  emailed_at timestamptz
);

comment on table spot.rms_contact_messages is
  'Contact form submissions from the marketing site. Insert-only for the public: anon may write but never read, because rows carry prospect names, emails and phone numbers. Read them with the service role, or from the Supabase dashboard.';

create index if not exists rms_contact_messages_created_at_idx
  on spot.rms_contact_messages (created_at desc);

alter table spot.rms_contact_messages enable row level security;

-- Deliberately narrower than the rest of the rms_* tables, which grant anon
-- full read/write for the demo. This one holds real people's contact details,
-- so the public key may add a row and nothing else. There is no select policy
-- on purpose: the API route never reads a row back, and asking it to (an
-- .insert().select() round trip) is what makes a submission fail.
drop policy if exists "anon may submit the contact form" on spot.rms_contact_messages;
create policy "anon may submit the contact form"
  on spot.rms_contact_messages
  for insert
  to anon, authenticated
  with check (true);
