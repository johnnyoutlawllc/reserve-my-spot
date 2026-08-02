import { createClient } from '@supabase/supabase-js';

/** Postgres schema holding every rms_* table. Nothing of ours lives in public. */
export const SCHEMA = 'spot';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local.',
  );
}

export const supabase = createClient(url, key, {
  // Every rms_* table lives in the `spot` schema, not public. Setting it here
  // means `.from('rms_waitlist')` resolves to `spot.rms_waitlist` everywhere.
  // Realtime does not read this -- subscriptions name the schema themselves
  // (see SCHEMA in lib/db.ts).
  db: { schema: SCHEMA },
  // Sessions persist because the marketing site signs real people in with
  // Google (see lib/auth.tsx). detectSessionInUrl finishes the PKCE hand-off
  // when Google bounces the browser back with ?code=. The rms_* policies grant
  // `anon, authenticated` alike, so the demo behaves the same either way.
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  realtime: { params: { eventsPerSecond: 10 } },
});
