'use client';

import { notifyMember, notifyStaff } from './db';
import { supabase } from './supabase';
import type { Member, Service, WaitlistEntry } from './types';
import { humanWait } from './wait';

/** A member taps Request My Spot. Lands at the desk as `requested`, not queued yet. */
export async function requestSpot(input: {
  member: Member;
  service: Service;
  desiredTime: Date | null;
  note: string;
}) {
  const { data, error } = await supabase
    .from('rms_waitlist')
    .insert({
      member_id: input.member.id,
      service_id: input.service.id,
      status: 'requested',
      desired_time: input.desiredTime?.toISOString() ?? null,
      member_note: input.note.trim() || null,
      created_by: 'member',
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  const entry = data as WaitlistEntry;

  await notifyStaff({
    kind: 'request',
    title: `${input.member.full_name} requested ${input.service.name}`,
    body: input.desiredTime
      ? `Arriving around ${input.desiredTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
      : 'As soon as possible',
    member_id: input.member.id,
    waitlist_id: entry.id,
  });

  return entry;
}

export async function cancelEntry(entry: WaitlistEntry, memberName: string) {
  await update(entry.id, { status: 'cancelled', ended_at: new Date().toISOString() });
  await notifyStaff({
    kind: 'cancel',
    title: `${memberName} cancelled`,
    member_id: entry.member_id,
    waitlist_id: entry.id,
  });
}

/** The desk accepts the request and the member joins the service queue. */
export async function acceptRequest(entry: WaitlistEntry, service: Service, waitMinutes: number) {
  await update(entry.id, {
    status: 'waiting',
    queued_at: new Date().toISOString(),
    estimated_wait_minutes: waitMinutes,
    estimated_start: new Date(Date.now() + waitMinutes * 60_000).toISOString(),
  });
  await notifyMember({
    member_id: entry.member_id,
    kind: 'accepted',
    title: `You're on the list for ${service.name}`,
    body:
      waitMinutes <= 0
        ? 'A station is free — come on in whenever you get here.'
        : `Estimated start in ${humanWait(waitMinutes)}.`,
    waitlist_id: entry.id,
  });
}

export async function declineRequest(entry: WaitlistEntry, service: Service, reason: string) {
  await update(entry.id, {
    status: 'declined',
    staff_note: reason || null,
    ended_at: new Date().toISOString(),
  });
  await notifyMember({
    member_id: entry.member_id,
    kind: 'declined',
    title: `${service.name} request declined`,
    body: reason || 'Please see the front desk.',
    waitlist_id: entry.id,
  });
}

/** Station is open — tell the member to come in. */
export async function callUp(entry: WaitlistEntry, service: Service) {
  await update(entry.id, { status: 'notified', estimated_start: new Date().toISOString() });
  await notifyMember({
    member_id: entry.member_id,
    kind: 'called',
    title: `${service.name} is ready for you`,
    body: 'Head to the front desk when you arrive.',
    waitlist_id: entry.id,
  });
}

export async function startService(entry: WaitlistEntry) {
  await update(entry.id, { status: 'in_service', started_at: new Date().toISOString() });
}

export async function completeService(entry: WaitlistEntry) {
  await update(entry.id, { status: 'completed', ended_at: new Date().toISOString() });
}

export async function markNoShow(entry: WaitlistEntry, service: Service) {
  await update(entry.id, { status: 'no_show', ended_at: new Date().toISOString() });
  await notifyMember({
    member_id: entry.member_id,
    kind: 'no_show',
    title: `Marked as a no-show for ${service.name}`,
    body: 'Tap to request a new spot whenever you like.',
    waitlist_id: entry.id,
  });
}

/**
 * Pushes a late member behind the next person in line instead of dropping them.
 *
 * This is the humane version of "you lost your spot" — the room keeps moving for
 * whoever is already here, and the late member keeps their visit.
 */
export async function bumpBehindNext(entry: WaitlistEntry, siblings: WaitlistEntry[], service: Service) {
  const ordered = siblings
    .filter((e) => e.id !== entry.id && (e.status === 'waiting' || e.status === 'notified'))
    .sort((a, b) => key(a) - key(b));
  const next = ordered.find((e) => key(e) > key(entry));
  const target = next ? key(next) + 1_000 : Date.now();

  await update(entry.id, {
    status: 'waiting',
    queued_at: new Date(target).toISOString(),
    bumped_count: entry.bumped_count + 1,
  });
  await notifyMember({
    member_id: entry.member_id,
    kind: 'bumped',
    title: `Your ${service.name} spot moved back one`,
    body: 'We held your place — the app has your new estimate.',
    waitlist_id: entry.id,
  });
}

/** Give the spot to the next member waiting. */
export async function releaseSpot(entry: WaitlistEntry, service: Service, reason: string) {
  await update(entry.id, {
    status: 'forfeited',
    staff_note: reason || 'Spot released to the next member.',
    ended_at: new Date().toISOString(),
  });
  await notifyMember({
    member_id: entry.member_id,
    kind: 'forfeited',
    title: `Your ${service.name} spot was released`,
    body: reason || 'You can request a new spot any time.',
    waitlist_id: entry.id,
  });
}

export async function setStaffNote(entry: WaitlistEntry, note: string) {
  await update(entry.id, { staff_note: note.trim() || null });
}

async function update(id: string, patch: Record<string, unknown>) {
  const { error } = await supabase.from('rms_waitlist').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

function key(e: WaitlistEntry) {
  return new Date(e.queued_at ?? e.requested_at).getTime();
}

/* ------------------------------------------------------------------- location */

export async function pushLocation(input: {
  memberId: string;
  lat: number;
  lng: number;
  accuracy_m?: number | null;
  distance_meters: number;
  eta_minutes: number;
  is_simulated: boolean;
}) {
  await supabase.from('rms_member_locations').upsert(
    {
      member_id: input.memberId,
      lat: input.lat,
      lng: input.lng,
      accuracy_m: input.accuracy_m ?? null,
      distance_meters: input.distance_meters,
      eta_minutes: input.eta_minutes,
      is_simulated: input.is_simulated,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'member_id' },
  );
}

export async function clearLocation(memberId: string) {
  await supabase.from('rms_member_locations').delete().eq('member_id', memberId);
}

export async function setLocationOptIn(memberId: string, optIn: boolean) {
  await supabase.from('rms_members').update({ location_opt_in: optIn }).eq('id', memberId);
  if (!optIn) await clearLocation(memberId);
}

/* ----------------------------------------------------------------------- chat */

export async function sendMemberMessage(input: {
  member: Member;
  threadId: string | null;
  subject: string;
  body: string;
}) {
  let threadId = input.threadId;
  if (!threadId) {
    const { data, error } = await supabase
      .from('rms_chat_threads')
      .insert({ member_id: input.member.id, subject: input.subject.trim() || 'Question for the front desk' })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    threadId = (data as { id: string }).id;
  }

  const { error } = await supabase.from('rms_chat_messages').insert({
    thread_id: threadId,
    sender_role: 'member',
    sender_id: input.member.id,
    sender_name: input.member.full_name,
    body: input.body.trim(),
  });
  if (error) throw new Error(error.message);

  await notifyStaff({
    kind: 'message',
    title: `New message from ${input.member.full_name}`,
    body: input.body.trim().slice(0, 120),
    member_id: input.member.id,
    thread_id: threadId,
  });

  return threadId;
}

export async function sendStaffMessage(input: {
  threadId: string;
  staffId: string;
  staffName: string;
  body: string;
}) {
  const { error } = await supabase.from('rms_chat_messages').insert({
    thread_id: input.threadId,
    sender_role: 'staff',
    sender_id: input.staffId,
    sender_name: input.staffName,
    body: input.body.trim(),
  });
  if (error) throw new Error(error.message);
}

export async function markThreadRead(threadId: string, side: 'staff' | 'member') {
  const patch = side === 'staff' ? { unread_staff: 0 } : { unread_member: 0 };
  await supabase.from('rms_chat_threads').update(patch).eq('id', threadId);
}

export async function setThreadStatus(threadId: string, status: 'open' | 'closed') {
  await supabase.from('rms_chat_threads').update({ status }).eq('id', threadId);
}
