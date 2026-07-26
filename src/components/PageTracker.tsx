'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateSessionId(): string {
  const KEY = 'rms_sid';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem(KEY, sid); }
  return sid;
}

export function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_path: pathname, referrer: document.referrer ?? '', session_id: getOrCreateSessionId() }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
