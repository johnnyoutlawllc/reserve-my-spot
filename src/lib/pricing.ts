/*
 * Every number on /pricing lives here.
 *
 * Reserve My Spot is a DataDay Studio product, and a prospect will read both
 * pricing pages in one sitting. One rule follows from that: no DataDay monthly
 * price is reused for a Reserve My Spot plan. $169 buys a custom app on your own
 * domain with a dedicated database over there, and matching that number here
 * would make this look like less for the same money. The one-time go-live fees
 * are $250 and $500 to match DataDay exactly, and the branding add-on is
 * +$80/mo, the same delta as DataDay's $89 to $169 step.
 *
 * The DataDay professional services ladder (Quarterly / Monthly / Bi-Weekly /
 * Weekly Upgrades) used to be reproduced here as a SERVICES export, alongside a
 * section comparing this to having an app built from scratch. Both came off the
 * page in August 2026. They read as filler, and a spa shopping for a way to run
 * its line does not need a second price ladder or a hypothetical build quote in
 * the middle of one. Send anyone asking for build hours to dataday.studio.
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
 * ON THE COST OF A LOCATION, because it decides whether the entry rate works.
 * The marginal cost of one more location is close to a dollar a month. Supabase
 * Pro ($25/mo) and Vercel Pro ($20/mo) are shared across every project, a
 * location writes on the order of 1,500 rows a month, and the only thing that
 * scales per location is realtime connections: roughly 20 to 30 concurrent at
 * peak against Pro's 500, so about fifteen locations before an add-on is needed.
 *
 * The driving ETA costs nothing. It is computed in `lib/geo.ts` from a haversine
 * straight-line distance and a fixed speed table, not from a routing API, so
 * there is no metered mapping service behind it and no allowance to publish. A
 * previous version of this file claimed one. If a real routing provider is ever
 * wired in, that changes and this comment has to change with it.
 *
 * So the real cost of a location is support hours, not servers. At $189 and a
 * notional $100 an hour, a location breaks even somewhere near 1.8 hours of
 * support a month. That is the number to watch when deciding whether the entry
 * rate is too low, and it is why the admin console and the in-app FAQ are
 * commercial features and not just nice ones.
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
    price: '$189',
    per: 'per month',
    copy: 'A single spa with one front desk, running the whole product. Most of the places we talk to start here and stay here.',
  },
  {
    id: 'few',
    name: 'Two to five locations',
    range: '2 to 5 locations',
    price: '$159',
    per: 'per location, per month',
    copy: 'Each location runs its own board with its own services and hours, and you get one view across all of them.',
    saving: '$30 a location off the single rate',
  },
  {
    id: 'many',
    name: 'Six to twenty locations',
    range: '6 to 20 locations',
    price: '$129',
    per: 'per location, per month',
    copy: 'Build a service menu once and push it out to every location, or let each one keep its own. Regional rollups and per-location reporting are in here too.',
    saving: '$60 a location off the single rate',
  },
  {
    id: 'more',
    name: 'More than twenty',
    range: 'Over 20 locations',
    price: 'Let us talk',
    per: 'we will quote it',
    copy: 'Past twenty locations the questions are usually about your POS, your franchise agreements, and who owns the member list. That takes a real conversation.',
  },
];

/** Everything below is in every plan. There is no cheaper version missing any of it. */
export const INCLUDED: { group: string; items: string[] }[] = [
  {
    group: 'The member app',
    items: [
      'Live waits for every service, read from home',
      'A request that comes back with a place in line and an honest estimate',
      'Location sharing each member turns on for themselves',
      'Chat with whoever is working the front desk',
      'Profiles that carry favorites and history between visits',
      'Your FAQ, right where the questions get asked',
    ],
  },
  {
    group: 'The front desk board',
    items: [
      'Incoming requests the instant a member makes one',
      'Live driving ETA, refreshed as they move',
      'A member counts as late when the station opens without them',
      'A grace period you set, then bump back or release in one tap',
      'Every station live on the board, with who is in it and who follows',
      'Call up, start, complete, bump back and release, all from one board',
    ],
  },
  {
    group: 'The admin console',
    items: [
      'Your service menu, with session lengths and station counts',
      'Store hours and how far ahead a member may ask',
      'Staff roles and who is allowed to do what',
      'Memberships and expiry dates',
      'Reporting on how hard each station works',
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
    copy: 'Your spa runs at an address of ours. Setup, loading the membership list and training the desk are all inside this number, charged the day you open it to members.',
  },
  {
    name: 'On your own domain',
    price: '$500',
    detail: 'book.yourspa.com',
    copy: 'Everything in the first one, and then we move it onto an address you own. DNS, certificates, sign-in and email all come from your name.',
  },
];

export const ADD_ON = {
  name: 'Your own domain and branding',
  price: '+$80',
  per: 'per month',
  copy: 'Your logo and your name on every screen a member touches. Goes with the $500 go-live fee.',
};

/** Deliberately the lowest published number on the page. */
export const FOUNDING = {
  head: 'Founding location rate',
  body: 'We take on a few locations at a time. The first five lock $129 a month for twenty-four months, which is what a twenty-location chain pays, and it holds through both renewals.',
};

/** DataDay's commitments, in DataDay's words. Same terms, same policy. */
export const TERMS = [
  {
    b: 'Twelve months from go-live',
    t: 'The term starts the day your location opens it to members, and it renews each year after that. Thirty days notice ahead of a renewal date stops the next one.',
  },
  {
    b: 'Bug fixes at no charge',
    t: 'If it stops doing what it was built to do, we fix it and nobody’s hours get spent on it. That holds on every plan we sell.',
  },
  {
    b: 'Your data is yours',
    t: 'Members, sessions, and history leave with you whenever you want them, and we hold a copy for ninety days after you go.',
  },
  {
    b: 'Vendor costs at cost plus 20%',
    t: 'Everything the app does today runs inside what your plan already covers, drive tracking included. Once in a while a job needs something beyond that, like text messaging or a metered outside service. We talk it through first and look for a way around it. When there is none, the account gets opened in your name and we pass the cost through with a flat, itemized 20 percent on top for managing it. You see that number before anything gets switched on.',
  },
];
