import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Reserve My Spot',
    short_name: 'My Spot',
    description:
      'Claim your spot at the spa before you leave the house. Live waitlist, wait times, and front-desk chat.',
    start_url: '/m',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070908',
    theme_color: '#070908',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
