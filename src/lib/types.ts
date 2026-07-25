export type StaffRole = 'support' | 'admin';

export type WaitStatus =
  | 'requested'
  | 'waiting'
  | 'notified'
  | 'in_service'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'forfeited'
  | 'declined';

export type Settings = {
  id: number;
  spa_name: string;
  spa_address: string;
  spa_lat: number;
  spa_lng: number;
  timezone: string;
  min_lead_minutes: number;
  max_advance_minutes: number;
  cutoff_minutes_before_close: number;
  grace_period_minutes: number;
  max_active_per_member: number;
  online_booking_enabled: boolean;
  updated_at: string;
};

export type Hours = {
  day_of_week: number;
  is_closed: boolean;
  open_time: string;
  close_time: string;
};

export type Staff = {
  id: string;
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
};

export type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  tier: 'trial' | 'premium' | 'elite';
  is_active: boolean;
  membership_start: string | null;
  membership_end: string | null;
  location_opt_in: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  capacity: number;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type WaitlistEntry = {
  id: string;
  member_id: string;
  service_id: string;
  status: WaitStatus;
  requested_at: string;
  desired_time: string | null;
  queued_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  estimated_start: string | null;
  estimated_wait_minutes: number | null;
  bumped_count: number;
  member_note: string | null;
  staff_note: string | null;
  created_by: 'member' | 'staff';
  updated_at: string;
};

export type MemberLocation = {
  member_id: string;
  lat: number;
  lng: number;
  accuracy_m: number | null;
  distance_meters: number | null;
  eta_minutes: number | null;
  is_simulated: boolean;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
};

export type ChatThread = {
  id: string;
  member_id: string;
  subject: string;
  status: 'open' | 'closed';
  last_message_at: string;
  unread_staff: number;
  unread_member: number;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  thread_id: string;
  sender_role: 'member' | 'staff' | 'system';
  sender_id: string | null;
  sender_name: string;
  body: string;
  created_at: string;
};

export type Notification = {
  id: string;
  audience: 'staff' | 'member';
  member_id: string | null;
  kind: string;
  title: string;
  body: string | null;
  waitlist_id: string | null;
  thread_id: string | null;
  is_read: boolean;
  created_at: string;
};

/** Statuses that still occupy a place in the room. */
export const LIVE_STATUSES: WaitStatus[] = ['requested', 'waiting', 'notified', 'in_service'];

/** Statuses that sit in a service queue awaiting a station. */
export const QUEUED_STATUSES: WaitStatus[] = ['waiting', 'notified'];
