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

/*
 * CONNECT: reading the salon software a spa already runs.
 *
 * WHAT IS AND IS NOT TRUE TODAY, because the copy has to stay inside it. As of
 * August 2026 nothing here is built. We have no API credentials, no adapter, no
 * partnership with any vendor, and no signed customer on it. What we have is
 * research: SunLync publishes an open Webservices API with a developer hub at
 * sandbox.sunlync.net, and Applied Digital lists eight salon packages that
 * integrate with T-Max timers (ActiveSalon, Envision, Helios, Meevo, SalonTouch
 * Studio, SunLync, Tan-Link, TanTrack), which is the addressable market.
 *
 * So the page sells a scoped engagement, not a shipped feature. The tone is
 * confident and unhedged, because a spa needs to believe we can handle their POS
 * and hedging reads as doubt. Confidence comes from being specific about the
 * mechanics, which is what actually makes a reader think we have done this
 * before. It must NOT come from claiming we have: no invented customer count, no
 * "we have integrated dozens of salons", no named partnership or certification,
 * no vendor logo. Those are checkable in one phone call and the deal dies on the
 * spot. If a prospect rings SunLync, everything we published should still be
 * true. Do not loosen this without an adapter actually running at a paying
 * location.
 *
 * WHY +$100/MO, FLAT. Value first: at a location doing a hundred desk
 * interactions a day, killing the double entry is on the order of 25 hours of
 * desk labor a month, so $100 captures well under a third of what it saves and
 * survives being questioned. It lands a single location at $289, which keeps the
 * page on the ladder it already uses. It is NOT discounted at higher location
 * counts, unlike the base rate: the base discount reflects setup and support that
 * genuinely amortizes across a chain, and integration support does not, because
 * every store has its own POS install, its own equipment list and its own
 * network. Five connected locations is $500/mo, which is one Monthly Upgrades
 * plan at DataDay, and that is deliberate. It is what funds the maintenance when
 * a vendor ships a breaking change.
 *
 * WHY THERE IS A ONE-TIME FEE AT ALL. Without it the first adapter for a vendor
 * is roughly forty hours of engineering recovered at $100/mo, which never pays
 * back inside a term.
 *
 * WHY IT IS $500 FLAT AND NOT TIERED. It was briefly $500 for a system we could
 * already reach and $1,500 for the first location on a new one. Johnny killed
 * that on August 3, 2026, and he was right: a spa that signs before we support
 * their POS is trusting us to work it out, and charging them triple for being
 * first bills a customer for our own lack of coverage. We eat the adapter build
 * and earn it back on every location after. It is also the better sales line,
 * because the same number regardless of what they run is itself the proof that
 * we are not afraid of their system, so the page says so out loud.
 *
 * This supersedes Rule 2 of the August 2026 pricing handoff, which routed
 * integration work to DataDay's Monthly Upgrades. Building an adapter is still
 * professional services. Keeping one alive is a subscription, and those are two
 * different things that both have to get paid for.
 *
 * ON NOT WRITING BACK. We read. We do not create sessions, take payment or touch
 * memberships in anyone's POS. That is a genuine engineering boundary and also
 * the whole sales answer to "you are not touching my system of record", so it is
 * on the page as a feature rather than buried as a limitation. Tanning session
 * intervals and exposure limits are enforced in their POS for legal reasons and
 * we are not going near them.
 */
export const CONNECT = {
  eyebrow: 'Connected setup',
  name: 'Connect it to the software you already run',
  price: '+$100',
  per: 'per location, per month',
  head: 'Stop typing the same member into two systems.',
  copy: 'Your front desk already runs something that knows the member, the membership and which beds are lit right now. Left alone, our board and that one drift apart by the middle of a Saturday and your staff ends up trusting neither. Connected, we read yours, and the board stops being a second set of books somebody has to keep.',
  items: [
    'Equipment status read from the system already tracking it, not guessed at',
    'A countdown off the real timer, cooldown and cleanup included, instead of an average',
    'Members, memberships and remaining sessions stay in step on their own',
    'Somebody who is not eligible today never gets offered a spot for today',
    'We read. We never write back, so your system of record stays the record',
  ],
  setup: {
    name: 'Connecting a location',
    price: '$500',
    per: 'one time, per location',
    copy: 'The same $500 whether we have met your system before or not. Working out one we have not seen is our job, and we are not going to bill you extra for being the first spa to bring it to us. It covers getting read access sorted with your vendor, mapping your equipment list onto the board, and testing the whole thing against your live data before a single member sees it.',
  },
  /* Researched, not shipped. Read the note above before touching this list. */
  systems:
    'The ones we come across most are SunLync, Tan-Link, SalonTouch Studio, Helios, Meevo, Envision and TanTrack, along with the T-Max timers sitting behind a good number of them. Tell us which one runs your desk and we will tell you exactly what comes across and what does not.',
  caveat:
    'How it goes. We deal with your software vendor so you do not have to, and you approve what we read before we read any of it. Some vendors move faster than others, and you will know where yours lands before you commit to anything.',
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
