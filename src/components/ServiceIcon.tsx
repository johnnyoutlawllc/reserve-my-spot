'use client';

/** Line icons for the service catalog. Keys match rms_services.icon. */
const PATHS: Record<string, React.ReactNode> = {
  redlight: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
    </>
  ),
  wave: (
    <>
      <path d="M2 9c2.2 0 2.2 2.2 4.4 2.2S8.6 9 10.8 9s2.2 2.2 4.4 2.2S17.4 9 19.6 9 22 11.2 22 11.2" />
      <path d="M2 15c2.2 0 2.2 2.2 4.4 2.2S8.6 15 10.8 15s2.2 2.2 4.4 2.2S17.4 15 19.6 15 22 17.2 22 17.2" />
    </>
  ),
  tanning: (
    <>
      <rect x="3" y="4" width="18" height="4" rx="2" />
      <rect x="3" y="16" width="18" height="4" rx="2" />
      <path d="M7 11v2M12 11v2M17 11v2" />
    </>
  ),
  sauna: (
    <>
      <path d="M4 20V9.5L12 4l8 5.5V20" />
      <path d="M4 20h16" />
      <path d="M9.5 16c0-1.4 1.5-1.9 1.5-3.2 0-.9-.6-1.5-.6-1.5M14 16c0-1.4 1.5-1.9 1.5-3.2 0-.9-.6-1.5-.6-1.5" />
    </>
  ),
  cryo: (
    <>
      <path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10" />
      <path d="M12 6.5 9.8 8.7M12 6.5l2.2 2.2M12 17.5l-2.2-2.2M12 17.5l2.2-2.2" />
    </>
  ),
  compression: (
    <>
      <path d="M9 3h6l-.7 7.5a4 4 0 0 1-.6 1.8l-1.2 2a1.8 1.8 0 0 1-3 0l-1.2-2a4 4 0 0 1-.6-1.8Z" />
      <path d="M11 17.5v3.5M13.5 17.5v3.5M8.4 7h7.2" />
    </>
  ),
  salt: (
    <>
      <circle cx="7" cy="8" r="1.3" />
      <circle cx="12.5" cy="5.5" r="1.3" />
      <circle cx="17.5" cy="9" r="1.3" />
      <circle cx="9.5" cy="13.5" r="1.3" />
      <circle cx="15" cy="15" r="1.3" />
      <circle cx="6" cy="18" r="1.3" />
      <circle cx="19" cy="18.5" r="1.3" />
    </>
  ),
  facial: (
    <>
      <path d="M12 3c4 0 6.5 2.8 6.5 7 0 5-3.2 11-6.5 11S5.5 15 5.5 10C5.5 5.8 8 3 12 3Z" />
      <path d="M9.3 10h.01M14.7 10h.01M10 14.5c1.2.9 2.8.9 4 0" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="M18 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
    </>
  ),
};

export const ICON_KEYS = Object.keys(PATHS);

export function ServiceIcon({
  icon,
  className = 'size-5',
}: {
  icon: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[icon] ?? PATHS.sparkle}
    </svg>
  );
}
