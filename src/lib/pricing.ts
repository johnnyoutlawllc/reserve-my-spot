/*
 * Every number on /pricing lives here.
 *
 * Reserve My Spot is a DataDay Studio product, and a prospect will read both
 * pricing pages in one sitting. Two rules follow from that:
 *
 *   1. The professional services ladder is reproduced verbatim from
 *      dataday.studio's `lib/plans.ts` (SERVICES). Same names, same prices,
 *      same hours. If it changes there, change it here.
 *   2. No DataDay monthly price is reused for a Reserve My Spot plan. $169 buys
 *      a custom app on your own domain with a dedicated database over there,
 *      and matching that number here would make this look like less for the
 *      same money. The one-time go-live fees are $250 and $500 to match DataDay
 *      exactly, and the branding add-on is +$80/mo, the same delta as DataDay's
 *      $89 to $169 step.
 *
 * Positioning: price against vertical spa software ($129 to $176), not generic
 * queue tools ($29 to $59). Never describe this as waitlist software on a
 * public page. That phrase drops the reader into a $31 comparison set.
 *
 * ON THE SHAPE OF THIS. There is one product and one feature set, and the only
 * thing that moves the price is how many locations you run. It was drafted as
 * three named feature bundles (Desk, Drive, Chain) and that was thrown out in
 * August 2026: the names told a buyer nothing, and holding the live driving ETA
 * back as the paywall meant the cheap tier shipped without the one thing that
 * makes this product worth buying. Nobody was supposed to buy that tier anyway.
 * Selling a deliberately worse version of your own pitch is not a pricing
 * strategy. Do not reintroduce feature tiers. If a number has to move, move the
 * per-location rate.
 *
 * ETA_ALLOWANCE is the one number here with a hard cost behind it. Every tracked
 * arrival is a run of routing API calls, so the allowance and the refresh
 * cadence in the app have to be set together: a 60-second refresh over a
 * fifteen-minute drive is roughly fifteen billable calls per arrival, and a busy
 * location can put real money through it. Widen the refresh interval before
 * widening this number.
 */

export type Plan = {
  id: 'single' | 'few' | 'many' | 'more';
  name: string;
  range: string;
  price: string;
  per: string;
  copy: string;
  /** Set on the tiers that are a discount off the single-location rate. */
  saving?: string;
};

/**
 * Priced per location, per month, and the rate drops as you add locations.
 * Ranges do not overlap: 1, 2 to 5, 6 to 20, more than 20.
 */
export const PLANS: Plan[] = [
  {
    id: 'single',
    name: 'Single location',
    range: 'One location',
    price: '$329',
    per: 'per month',
    copy: 'One spa, one front desk, the whole product. Most of the places we talk to start here and never need anything else.',
  },
  {
    id: 'few',
    name: 'Two to five locations',
    range: '2 to 5 locations',
    price: '$289',
    per: 'per location, per month',
    copy: 'Each location runs its own board with its own services and hours, and you get one view across all of them.',
    saving: '$40 a location off the single rate',
  },
  {
    id: 'many',
    name: 'Six to twenty locations',
    range: '6 to 20 locations',
    price: '$249',
    per: 'per location, per month',
    copy: 'Set up a service menu once and push it everywhere, or let each location keep its own. Regional rollups and per-location reporting come standard.',
    saving: '$80 a location off the single rate',
  },
  {
    id: 'more',
    name: 'More than twenty',
    range: 'Over 20 locations',
    price: 'Let us talk',
    per: 'we will quote it',
    copy: 'At this size the questions stop being about price and start being about your POS, your franchise agreements, and who owns the member list. Worth an actual conversation.',
  },
];

/** Everything below is in every plan. There is no cheaper version missing any of it. */
export const INCLUDED: { group: string; items: string[] }[] = [
  {
    group: 'The member app',
    items: [
      'Live waits for every service, before they leave home',
      'Request a spot, with position in line and an honest estimate',
      'Opt-in location sharing, off by default, on per member',
      'Chat with whoever is working the front desk',
      'Profiles, favorite services, and history between visits',
      'Your FAQ, right where the questions get asked',
    ],
  },
  {
    group: 'The front desk board',
    items: [
      'Incoming requests the instant a member makes one',
      'Live driving ETA, refreshed as they move',
      'Late flagged against the minute the station actually opens',
      'Grace period you set, then bump back or release in one tap',
      'Every station, who is in it, and who is next, updating live',
      'Call up, start, complete, bump back, release, all from one board',
    ],
  },
  {
    group: 'The admin console',
    items: [
      'Your service menu, session lengths, and station counts',
      'Store hours and how far ahead members may request',
      'Staff roles and who can do what',
      'Memberships and expiry dates',
      'Station utilization reporting',
      'A rollup across every location you run',
    ],
  },
];

/** Billed once, the day a location goes live. Same two numbers as DataDay. */
export const GO_LIVE = [
  {
    name: 'On our platform',
    price: '$250',
    detail: 'yourspa.reservemy.spot',
    copy: 'We build your service menu, station counts, hours and rules with you, load your membership list, and train the desk. One charge, the day you open it to members.',
  },
  {
    name: 'On your own domain',
    price: '$500',
    detail: 'book.yourspa.com',
    copy: 'Everything above, plus the move onto an address of your own: DNS, certificates, sign-in and email from your name. Your members never see ours.',
  },
];

export const ADD_ON = {
  name: 'Your own domain and branding',
  price: '+$80',
  per: 'per month',
  copy: 'Your logo, your name, your address on every screen a member touches. Pairs with the $500 go-live fee.',
};

/** Deliberately the lowest published number on the page. */
export const FOUNDING = {
  head: 'Founding location rate',
  body: 'We take on a small number of locations at a time. The first five lock $249 a month for twenty-four months. That is the rate a twenty-location chain pays, on one location, and it holds through both renewals.',
};

/** Tracked arrivals included, per location, per month. */
export const ETA_ALLOWANCE = '1,500 tracked arrivals a month, per location';

/**
 * Reproduced from dataday.studio. Do not reword, rename, or reprice these here.
 * A spa that wants a POS integration, a custom report, or a data migration is
 * not a special case, it is Monthly Upgrades.
 */
export const SERVICES = [
  {
    name: 'Quarterly Upgrades',
    price: '$500',
    per: 'per quarter',
    hours: '4 hours a quarter',
    copy: 'Four hours a quarter for upgrades and new features. We meet once a quarter, in person or over video, to talk through what is next.',
  },
  {
    name: 'Monthly Upgrades',
    price: '$500',
    per: 'per month',
    hours: '4 hours a month',
    copy: 'Four hours every month for upgrades and new features. We meet monthly to talk about what comes next.',
  },
  {
    name: 'Bi-Weekly Upgrades',
    price: '$1,500',
    per: 'per month',
    hours: '15 hours a month',
    copy: 'Fifteen hours a month and a meeting every two weeks, for an operation that is still growing.',
  },
  {
    name: 'Weekly Upgrades',
    price: '$4,000',
    per: 'per month',
    hours: '40 hours a month',
    copy: 'Forty hours a month and a weekly meeting, with a named engineer who knows your operation inside out.',
  },
];

/** DataDay's commitments, in DataDay's words. Same terms, same policy. */
export const TERMS = [
  {
    b: 'Twelve months from go-live',
    t: 'The term starts the day your location opens it to members, not the day you sign, and it renews each year. Thirty days notice before the renewal date stops the next one.',
  },
  {
    b: 'Bug fixes at no charge',
    t: 'If it stops doing what it was built to do, we fix it at no charge, and it never comes out of anyone’s hours. That holds on every plan, down to the cheapest.',
  },
  {
    b: 'Your data is yours',
    t: 'Members, sessions, and history leave with you whenever you want them, and we hold a copy for ninety days after you go.',
  },
  {
    b: 'Vendor costs at cost plus 20%',
    t: 'Live driving ETAs use a metered mapping service, so every plan includes 1,500 tracked arrivals a month per location. That is fifty a day, and a normal location does not come close. Past it, or for any other platform a job needs, we set it up in accounts that belong to you and pass the cost through with a flat, itemized 20 percent on top for managing it. You see the number before anything gets switched on, and we tell you when you are trending toward it rather than after.',
  },
];
