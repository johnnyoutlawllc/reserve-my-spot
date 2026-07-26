import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const INTERNAL_HOSTS = new Set(['reservemy.spot', 'reserve-my-spot.vercel.app', 'localhost']);

function getDeviceType(ua: string) { return /tablet|ipad/i.test(ua) ? 'tablet' : /mobile|android|iphone|ipod/i.test(ua) ? 'mobile' : 'desktop'; }
function getBrowser(ua: string) { return /Edg\//i.test(ua) ? 'Edge' : /OPR\//i.test(ua) ? 'Opera' : /Chrome\//i.test(ua) ? 'Chrome' : /Firefox\//i.test(ua) ? 'Firefox' : /Safari\//i.test(ua) ? 'Safari' : 'Other'; }
function getOS(ua: string) { return /Windows/i.test(ua) ? 'Windows' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Mac OS X/i.test(ua) ? 'macOS' : /Android/i.test(ua) ? 'Android' : /Linux/i.test(ua) ? 'Linux' : 'Other'; }
function getReferrerHost(ref: string) {
  if (!ref) return '(direct)';
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '');
    return INTERNAL_HOSTS.has(h) ? '(internal)' : h;
  } catch { return '(unknown)'; }
}
async function getGeo(ip: string) {
  if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('::1')) return { city: null, country: null };
  try {
    const r = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(2000) });
    if (!r.ok) return { city: null, country: null };
    const d = await r.json() as { city?: string; country_name?: string };
    return { city: d.city ?? null, country: d.country_name ?? null };
  } catch { return { city: null, country: null }; }
}

export async function POST(req: NextRequest) {
  try {
    const { page_path = '/', referrer = '', session_id = 'unknown' } = await req.json();
    const ua = req.headers.get('user-agent') ?? '';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
    const geo = await getGeo(ip);
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
    const { error: insertErr } = await sb.from('rms_page_views').insert({
      session_id, page_path, referrer: referrer || null, referrer_host: getReferrerHost(referrer),
      device_type: getDeviceType(ua), browser: getBrowser(ua), os: getOS(ua),
      ip_address: ip !== 'unknown' ? ip : null, city: geo.city, country: geo.country,
    });
    if (insertErr) console.error('[track:insert]', insertErr.message);
    return NextResponse.json({ ok: !insertErr });
  } catch (err) {
    console.error('[track]', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
