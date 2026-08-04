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
  'Running more than 5 locations? Bulk pricing available. Let us talk.';

/** Our commitments, in plain words. Same terms, same policy. */
export const TERMS = [
  {
    b: 'Twelve months from go-live',
    t: 'The term starts the day your location opens to members, and renews each year after that. Thirty days notice ahead of a renewal stops the next one.',
  },
  {
    b: 'Bug fixes at no charge',
    t: 'If it stops doing what it was built to do, we fix it and nobody’s hours get spent on it.',
  },
  {
    b: 'Your data is yours',
    t: 'Members, sessions, and history leave with you whenever you want them, and we hold a copy for ninety days after you go.',
  },
];
