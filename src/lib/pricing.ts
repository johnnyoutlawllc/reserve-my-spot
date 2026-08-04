/*
 * Every number on /pricing lives here.
 *
 * TWO PLANS. The only thing that separates them is whether we connect to the
 * booking software your front desk already runs.
 *
 *   No integration:  $169/mo per location + $250 one-time setup.
 *                    Members reserve a spot. Your front desk books it on your
 *                    system. Setup covers branding and fine tuning.
 *
 *   Integration:     $250/mo per location + $500 one-time setup.
 *                    Members reserve, and the booking is handled automatically
 *                    in your software. Your support reps stop re-typing requests
 *                    and watching an incoming queue.
 *
 * Both plans are the whole product: the member app with location tracking, the
 * front desk board, and the admin console. There is no cheaper version missing
 * any of it.
 *
 * Positioning: price against vertical spa software, not generic queue tools.
 * Never call this waitlist software on a public page.
 *
 * WHAT IS AND IS NOT TRUE ABOUT THE INTEGRATION TODAY, because the copy has to
 * stay inside it. Nothing is built: no API credentials, no adapter, no vendor
 * partnership, no signed customer. The page sells a scoped engagement, confident
 * and specific about the mechanics, but it must never claim a history we do not
 * have: no customer counts, no partnerships, no certifications, no vendor logos.
 * If a prospect rings their software vendor to check, everything on the page
 * should still be true. Do not loosen this until an adapter is running at a
 * paying location.
 *
 * WE ONLY READ. On the integration plan we read the software they already run.
 * We never write back, so their system of record stays untouched. That is a real
 * engineering boundary and the whole answer to "you are not touching my system."
 */

/** The two plans. The only difference is the integration. */
export const PLANS = [
  {
    name: 'No integration',
    head: 'Members reserve. Your desk books it.',
    monthly: '$169',
    per: 'per location, per month',
    setup: '$250',
    setupNote: 'one-time setup',
    copy: 'Members reserve a service from home or the app. Your front desk sees each request and books it on the system you already use. The setup fee covers your branding and fine tuning your services, hours, and stations.',
    featured: false,
  },
  {
    name: 'Integration',
    head: 'Members reserve. The booking manages itself.',
    monthly: '$250',
    per: 'per location, per month',
    setup: '$500',
    setupNote: 'one-time setup',
    copy: 'Members reserve online or in the app, and the booking is handled automatically in your software. Your support reps no longer data enter requests or watch an incoming queue. The setup fee covers connecting to your system and testing against your live data before any member sees it.',
    featured: true,
  },
];

/** In both plans. There is no cheaper version with pieces missing. */
export const INCLUDED: { group: string; items: string[] }[] = [
  {
    group: 'Member app with location tracking',
    items: [
      'Members reserve ahead from home or their phone',
      'Sharing location is required to reserve, so you always know where they are',
      'Sharing begins 20 minutes before the appointment and ends once they arrive or cancel',
      'A place in line and a time estimate come back with every request',
      'Chat with whoever is working the front desk',
    ],
  },
  {
    group: 'Front desk board',
    items: [
      'Reservations land on the board the moment a member makes one',
      'Live driving ETA, refreshed as they move',
      'Every station on one board, with who is in it and who is next',
      'Call up, start, complete, no show, bump back, and release, all from the board',
      'Two-way chat with members, with saved quick replies for the common questions',
    ],
  },
  {
    group: 'Admin console',
    items: [
      'Your service menu, session lengths, and station counts',
      'Store hours and how far ahead members can reserve',
      'Staff roles and memberships',
      'Reporting across every location you run',
    ],
  },
];

/** Bulk pricing kicks in at five or more locations. Kept short on purpose. */
export const MULTI =
  "Running more than 5 locations? Bulk pricing available. Let's talk.";

/**
 * Ongoing build time past setup, mirrored from dataday.studio's own two
 * cheapest rungs (Quarterly Upgrades, Monthly Upgrades): same $500 price,
 * same 4-hour allotment, same $100/hr baseline, reworded for a spa audience.
 */
export const UPGRADES = [
  {
    name: 'Quarterly Upgrades',
    price: '$500',
    per: 'per quarter',
    copy: "Four hours a quarter for changes to your setup: a new service, a station count that no longer matches your floor, copy that isn't landing. We meet once a quarter to talk through what's next.",
  },
  {
    name: 'Monthly Upgrades',
    price: '$500',
    per: 'per month',
    copy: 'Four hours every month for the same kind of work, on a faster clock. A standing monthly check-in keeps that time pointed at what matters most.',
  },
];
