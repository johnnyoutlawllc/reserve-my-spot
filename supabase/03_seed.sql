-- Reserve My Spot: demo seed
--
-- Safe to re-run: the reference tables use ON CONFLICT DO NOTHING, and the
-- activity section clears itself first so the demo always opens on the same
-- tableau (one member in session, two in line with one running late, one
-- request sitting at the desk, one unread question).

insert into public.rms_settings (id) values (1) on conflict (id) do nothing;

insert into public.rms_hours (day_of_week, is_closed, open_time, close_time) values
  (0, false, '10:00', '16:00'),
  (1, false, '08:00', '20:00'),
  (2, false, '08:00', '20:00'),
  (3, false, '08:00', '20:00'),
  (4, false, '08:00', '20:00'),
  (5, false, '08:00', '21:00'),
  (6, false, '09:00', '18:00')
on conflict (day_of_week) do nothing;

insert into public.rms_staff (full_name, email, role) values
  ('Elena Marsh',    'elena@serenitysprings.demo',  'admin'),
  ('Dana Whitfield', 'dana@serenitysprings.demo',   'admin'),
  ('Marcus Reyes',   'marcus@serenitysprings.demo', 'support'),
  ('Priya Nair',     'priya@serenitysprings.demo',  'support')
on conflict (email) do nothing;

insert into public.rms_services (name, description, duration_minutes, capacity, icon, sort_order) values
  ('Red Light Therapy',      'Full-body LED panel session for skin, recovery, and circulation.', 15, 2, 'redlight', 10),
  ('Wave Massage',           'Dry hydromassage bed. Pressure and zones set to your saved profile.', 20, 3, 'wave', 20),
  ('Tanning Bed',            'Level 3 stand-up bed with cooling and Bluetooth audio.', 12, 4, 'tanning', 30),
  ('Infrared Sauna',         'Private 2-person cabin, 130-150F, chromotherapy included.', 30, 2, 'sauna', 40),
  ('Cryotherapy',            'Whole-body chamber, -220F. Staff-attended.', 3, 1, 'cryo', 50),
  ('Compression Therapy',    'NormaTec leg and hip sleeves for lymphatic drainage.', 25, 2, 'compression', 60),
  ('Halotherapy Salt Room',  'Dry salt room for respiratory and skin relief.', 30, 6, 'salt', 70),
  ('Hydrafacial Express',    '15-minute cleanse, extract, and hydrate facial.', 15, 1, 'facial', 80)
on conflict do nothing;

insert into public.rms_members (full_name, email, phone, tier, is_active, membership_start, membership_end, location_opt_in) values
  ('Ava Sinclair',   'ava@demo.member',    '(615) 555-0142', 'elite',   true,  '2026-01-15', '2027-01-14', true),
  ('Ben Okafor',     'ben@demo.member',    '(615) 555-0198', 'premium', true,  '2026-03-01', '2027-02-28', true),
  ('Carla Mendes',   'carla@demo.member',  '(615) 555-0233', 'premium', true,  '2025-11-10', '2026-11-09', false),
  ('Derek Yoon',     'derek@demo.member',  '(615) 555-0271', 'trial',   true,  '2026-07-01', '2026-08-01', true),
  ('Elena Rossi',    'elena@demo.member',  '(615) 555-0310', 'elite',   true,  '2026-02-20', '2027-02-19', true),
  ('Frank Whitmore', 'frank@demo.member',  '(615) 555-0356', 'premium', false, '2024-06-01', '2026-05-31', false),
  ('Grace Halloway', 'grace@demo.member',  '(615) 555-0388', 'premium', true,  '2026-05-05', '2027-05-04', true),
  ('Hector Alvarez', 'hector@demo.member', '(615) 555-0421', 'premium', true,  '2026-06-12', '2027-06-11', false)
on conflict (email) do nothing;

insert into public.rms_faqs (question, answer, category, sort_order) values
  ('How does the waitlist actually work?',
   'Pick a service in the app and tap Request My Spot. The front desk gets your request instantly and adds you to that service''s queue. You''ll see your position and a live estimated start time that updates as people ahead of you finish.',
   'Waitlist', 10),
  ('Do I still have to show up early?',
   'No. That is the whole point. Request your spot from home, watch the estimate, and leave when the app says to. If you share your location, the front desk can see you are on the way and will hold your place.',
   'Waitlist', 20),
  ('Why does the app ask for my location?',
   'Location sharing is optional but strongly recommended. It lets the front desk see your driving ETA so they know to hold your spot instead of giving it away. We only use it while you have an active waitlist request, and you can turn it off any time.',
   'Location', 30),
  ('What happens if I am running late?',
   'The front desk sees your ETA. If you will miss your slot they can push you back one position instead of removing you, which keeps the room moving without costing you your visit. If they cannot reach you they may release the spot to the next member.',
   'Waitlist', 40),
  ('Can I book more than one service at a time?',
   'By default you can hold one active spot at a time so the queue stays fair. Ask the front desk if you want back-to-back services and they can stack them for you.',
   'Waitlist', 50),
  ('How far ahead can I request a spot?',
   'Requests open a set number of minutes before you plan to arrive and close a set number of minutes ahead of that. Your spa sets both windows, and the app tells you if you are outside them.',
   'Hours', 60),
  ('What if the spa is closed?',
   'The Request button is disabled outside store hours and inside the pre-close cutoff. The app shows today''s hours and the next time requests reopen.',
   'Hours', 70),
  ('Is Red Light Therapy safe to do every day?',
   'Most members use it 3 to 5 times a week. It is non-thermal and non-invasive, so there is no recovery time. Talk to the front desk about a schedule for your goals.',
   'Services', 80),
  ('Which services can more than one member use at once?',
   'It depends on how many stations your spa has. Tanning, wave massage, and the salt room usually run several members in parallel, so those queues move fastest. Cryotherapy is staff-attended and runs one at a time.',
   'Services', 90),
  ('How do I reach a real person?',
   'Tap Ask in the app. Your message goes straight to whoever is at the front desk and you will get a reply in the same thread. No phone tree, no hold music.',
   'General', 100),
  ('Does my membership expire?',
   'Your start and end dates live on your profile and the front desk manages them. If your membership has lapsed the app will tell you and the Request button turns off until it is renewed.',
   'Membership', 110),
  ('Is there a cancellation penalty?',
   'No. Cancel from the app any time before your spot is called and nothing is charged. Repeated no-shows after being called may be flagged by the front desk.',
   'Membership', 120)
on conflict do nothing;

/* ---------------------------------------------------------------- activity */

delete from public.rms_notifications;
delete from public.rms_chat_messages;
delete from public.rms_chat_threads;
delete from public.rms_member_locations;
delete from public.rms_waitlist;

with m as (select id, full_name from public.rms_members),
     s as (select id, name from public.rms_services)
insert into public.rms_waitlist
  (member_id, service_id, status, requested_at, queued_at, started_at, member_note, created_by)
select m.id, s.id, v.status, now() - v.ago, v.queued, v.started, v.note, 'member'
from (values
  ('Elena Rossi',   'Wave Massage',      'in_service', interval '9 minutes',  now() - interval '9 minutes',  now() - interval '6 minutes', null),
  ('Ben Okafor',    'Red Light Therapy', 'waiting',    interval '11 minutes', now() - interval '10 minutes', null::timestamptz, 'Back-to-back with the sauna if there is room'),
  ('Grace Halloway','Tanning Bed',       'waiting',    interval '6 minutes',  now() - interval '5 minutes',  null::timestamptz, null),
  ('Derek Yoon',    'Infrared Sauna',    'requested',  interval '1 minute',   null::timestamptz,             null::timestamptz, 'First visit, do I need to bring anything?')
) as v(member_name, service_name, status, ago, queued, started, note)
join m on m.full_name = v.member_name
join s on s.name = v.service_name;

-- Ben is close and on pace; Grace is far enough out to trip the late flag.
insert into public.rms_member_locations (member_id, lat, lng, accuracy_m, distance_meters, eta_minutes, is_simulated)
select id, 36.1690, -86.7720, 25, 1900, 7, true from public.rms_members where full_name = 'Ben Okafor';
insert into public.rms_member_locations (member_id, lat, lng, accuracy_m, distance_meters, eta_minutes, is_simulated)
select id, 36.2400, -86.6900, 30, 12800, 23, true from public.rms_members where full_name = 'Grace Halloway';

with t as (
  insert into public.rms_chat_threads (member_id, subject)
  select id, 'Cryo before or after red light?' from public.rms_members where full_name = 'Ava Sinclair'
  returning id, member_id
)
insert into public.rms_chat_messages (thread_id, sender_role, sender_id, sender_name, body)
select t.id, 'member', t.member_id, 'Ava Sinclair',
  'Quick question: is it better to do cryotherapy before or after red light therapy? Trying to build a routine.'
from t;

insert into public.rms_notifications (audience, member_id, kind, title, body, waitlist_id)
select 'staff', w.member_id, 'request',
       'Derek Yoon requested Infrared Sauna', 'First visit, do I need to bring anything?', w.id
from public.rms_waitlist w where w.status = 'requested';
