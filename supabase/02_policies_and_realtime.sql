-- Reserve My Spot: RLS, triggers, realtime
--
-- SECURITY NOTE, READ BEFORE PRODUCTION USE
-- This proof of concept has no end-user authentication (the landing page is a
-- demo identity picker), so the anon key needs read and write access to the
-- rms_* tables. RLS stays enabled so nothing ELSE in the Supabase project is
-- reachable, but within these tables the policy is wide open by design.
--
-- Shipping this to a paying spa means replacing the block below with Supabase
-- Auth plus policies keyed on auth.uid(): members restricted to their own
-- waitlist rows, locations, and chat threads; staff gated on a role claim.

do $$
declare t text;
begin
  foreach t in array array[
    'rms_settings','rms_hours','rms_staff','rms_members','rms_services','rms_waitlist',
    'rms_member_locations','rms_faqs','rms_chat_threads','rms_chat_messages','rms_notifications'
  ]
  loop
    execute format('alter table spot.%I enable row level security', t);
    execute format('drop policy if exists rms_demo_all on spot.%I', t);
    execute format(
      'create policy rms_demo_all on spot.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

create or replace function spot.rms_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists rms_waitlist_touch on spot.rms_waitlist;
create trigger rms_waitlist_touch before update on spot.rms_waitlist
  for each row execute function spot.rms_touch_updated_at();

drop trigger if exists rms_settings_touch on spot.rms_settings;
create trigger rms_settings_touch before update on spot.rms_settings
  for each row execute function spot.rms_touch_updated_at();

drop trigger if exists rms_faqs_touch on spot.rms_faqs;
create trigger rms_faqs_touch before update on spot.rms_faqs
  for each row execute function spot.rms_touch_updated_at();

-- A new message bumps its thread and marks the other side unread, so neither
-- portal has to maintain the counter itself.
create or replace function spot.rms_on_chat_message()
returns trigger language plpgsql as $$
begin
  update spot.rms_chat_threads
     set last_message_at = new.created_at,
         unread_staff  = case when new.sender_role = 'member' then unread_staff + 1 else 0 end,
         unread_member = case when new.sender_role = 'staff'  then unread_member + 1 else 0 end,
         status = 'open'
   where id = new.thread_id;
  return new;
end $$;

drop trigger if exists rms_chat_message_fanout on spot.rms_chat_messages;
create trigger rms_chat_message_fanout after insert on spot.rms_chat_messages
  for each row execute function spot.rms_on_chat_message();

alter table spot.rms_waitlist replica identity full;
alter table spot.rms_member_locations replica identity full;
alter table spot.rms_chat_threads replica identity full;

do $$
declare t text;
begin
  foreach t in array array[
    'rms_settings','rms_hours','rms_staff','rms_members','rms_services','rms_waitlist',
    'rms_member_locations','rms_faqs','rms_chat_threads','rms_chat_messages','rms_notifications'
  ]
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'spot' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table spot.%I', t);
    end if;
  end loop;
end $$;
