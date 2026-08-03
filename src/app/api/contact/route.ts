import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/*
 * Contact form intake.
 *
 * Two independent things happen, in this order, and the second is allowed to
 * fail: the message is written to spot.rms_contact_messages, then it is emailed
 * to sales. The database write is what makes the form trustworthy. There is no
 * mail provider configured on this project yet (no RESEND_API_KEY anywhere in
 * Vercel), so without the row a submission would simply evaporate. Once a key
 * is set the same submission both lands in the table and hits the inbox.
 */

const NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || 'sales@dataday.studio';
/** Resend refuses to send from a domain it has not verified. Override until reservemy.spot is. */
const MAIL_FROM = process.env.MAIL_FROM_CONTACT || 'Reserve My Spot <noreply@reservemy.spot>';

const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  phone: 40,
  locations: 40,
  message: 4000,
} as const;

type Field = keyof typeof LIMITS;

function clean(value: unknown, field: Field): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, LIMITS[field]);
}

/** Deliberately loose. Bouncing a real address is worse than accepting a fake one. */
function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  // Hidden field no human ever sees, so anything in it came from a bot. Answer
  // 200 so the bot has nothing to learn from the response.
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true, emailed: false });
  }

  const name = clean(body.name, 'name');
  const email = clean(body.email, 'email');
  const message = clean(body.message, 'message');
  const company = clean(body.company, 'company');
  const phone = clean(body.phone, 'phone');
  const locations = clean(body.locations, 'locations');

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: 'Name, email and a message are all required.' },
      { status: 400 },
    );
  }
  if (!looksLikeEmail(email)) {
    return NextResponse.json({ ok: false, error: 'That email address looks off.' }, { status: 400 });
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: 'spot' }, auth: { persistSession: false } },
  );

  // Mail first so the row can record whether it went out, in one write. The
  // table is insert-only for the anon key, so the route cannot read a row back
  // to stamp it afterwards, and asking for one is what makes the insert fail.
  const emailed = await sendToSales({ name, email, company, phone, locations, message });

  const { error: insertErr } = await sb.from('rms_contact_messages').insert({
    name,
    email,
    company: company || null,
    phone: phone || null,
    locations: locations || null,
    message,
    user_agent: req.headers.get('user-agent'),
    emailed_at: emailed ? new Date().toISOString() : null,
  });

  if (insertErr) console.error('[contact:insert]', insertErr.message);

  // Nothing captured and nothing sent is the only real failure. Either one on
  // its own still means someone will read this.
  if (insertErr && !emailed) {
    return NextResponse.json(
      { ok: false, error: 'We could not get that through. Please email us directly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, emailed });
}

async function sendToSales(m: {
  name: string;
  email: string;
  company: string;
  phone: string;
  locations: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY is not set, message saved but not emailed');
    return false;
  }

  const lines = [
    `Name: ${m.name}`,
    `Email: ${m.email}`,
    m.company ? `Business: ${m.company}` : null,
    m.phone ? `Phone: ${m.phone}` : null,
    m.locations ? `Locations: ${m.locations}` : null,
    '',
    m.message,
    '',
    'Sent from the contact form on reservemy.spot',
  ].filter((l) => l !== null);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: NOTIFY_TO,
        reply_to: m.email,
        subject: `Reserve My Spot enquiry: ${m.company || m.name}`,
        text: lines.join('\n'),
      }),
    });
    if (!res.ok) {
      // Log what Resend said. The usual answer is an unverified sender domain.
      const why = await res.text().catch(() => '');
      console.error(`[contact] Resend refused the message (${res.status}) ${why}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[contact] send failed', err);
    return false;
  }
}
