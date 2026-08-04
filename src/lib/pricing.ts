/*
 * Every number on /pricing lives here.
 *
 * ON THE SHAPE OF THIS, because it was rebuilt in August 2026. There is one
 * product, one feature set, and one published price: $189 per location, per
 * month, everything in. It used to be a four step location ladder ($189 / $159 /
 * $129 / quote) and that came off the page. The market we actually sell to is
 * single location, our own copy says most places "start here and stay here," and
 * the ladder printed three extra numbers for a segment that is a real
 * conversation anyway. A chain's questions are about its POS, its franchise
 * agreements and who owns the member list, none of which fit in a price cell, so
 * multiple locations now route to a conversation instead of a pre-quoted rate.
 * If the single number has to move, move it. Do not reprint a ladder.
 *
 * ON NOT REINTRODUCING FEATURE TIERS. This was drafted once as three named
 * bundles (Desk, Drive, Chain) and thrown out, because holding the live driving
 * ETA back as the paywall shipped a cheap tier without the one thing that makes
 * the product worth buying. The rule that came out of that still holds: the
 * published product is complete. The member app, the front desk board, the
 * driving ETA and the admin console are all in the $189. Connect (below) is an
 * optional layer that reads salon software a spa already runs. It is not a
 * withheld core feature, it is a genuinely separate capability with its own
 * marginal cost, which is why it is priced on its own and not by gating the base.
 *
 * Reserve My Spot is a DataDay Studio product and a prospect reads both pricing
 * pages in one sitting, so no DataDay monthly price is reused here. The one-time
 * go-live fees are $250 and $500 to match DataDay exactly. Own-domain used to
 * carry a +$80/mo branding add-on on top of the $500; that add-on is gone. It
 * was a third pricing axis nobody expected, a monthly charge bolted onto a
 * one-time fee, and it was the most surprising line on the page. Own domain is
 * now simply the $500 launch, branded, at the same $189/mo. That leaves the
 * monthly at $189 against DataDay's $169 own-domain rate, which is deliberate:
 * this is a full product, not a generic site, and it should not read as cheaper.
 *
 * Positioning: price against vertical spa software ($129 to $176), not generic
 * queue tools ($29 to $59). Never describe this as waitlist software on a
 * public page. That phrase drops the reader into a $31 comparison set.
 *
 * ON THE COST OF A LOCATION, because it decides whether $189 works. The marginal
 * cost of one more location is close to a dollar a month. Supabase Pro ($25/mo)
 * and Vercel Pro ($20/mo) are shared across every project, a location writes on
 * the order of 1,500 rows a month, and the only thing that scales per location
 * is realtime connections: roughly 20 to 30 concurrent at peak against Pro's 500,
 * so about fifteen locations before an add-on is needed.
 *
 * The driving ETA costs nothing. It is computed in `lib/geo.ts` from a haversine
 * straight-line distance and a fixed speed table, not from a routing API, so
 * there is no metered mapping service behind it and no allowance to publish. If a
 * real routing provider is ever wired in, that changes and this comment with it.
 *
 * So the real cost of a location is support hours, not servers. At $189 and a
 * notional $100 an hour, a location breaks even somewhere near 1.8 hours of
 * support a month. That is the number to watch when deciding whether the entry
 * rate is too low, and it is why the admin console and the in-app FAQ are
 * commercial features and not just nice ones.
 */

/** The one published price. Everything a spa runs is in it. */
export const PRICE = {
  monthly: '$189',
  per: 'per location, per month',
  annual: '$1,890',
  annualNote: 'Pay for the year and you pay for ten months, so two are on us.',
  chains:
    'Running more than one location? The rate comes down, and past a couple of stores the questions are about your POS, your franchise agreements and who owns the member list. That takes a real conversation, so tell us your count and we will quote it.',
};

/** Everything below is in the price. There is no cheaper version missing any of it. */
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
    name: 'On your own domain, branded',
    price: '$500',
    detail: 'book.yourspa.com',
    copy: 'Everything in the first one, and then we move it onto an address you own with your logo and name on every screen a member touches. DNS, certificates, sign-in and email all come from you. No extra monthly for it, just the higher one-time.',
  },
];

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
 * WHY +$100/MO, and why it is the same at every location count. Value first: at a
 * location doing a hundred desk interactions a day, killing the double entry is
 * on the order of 25 hours of desk labor a month, so $100 captures well under a
 * third of what it saves and survives being questioned. It lands a connected
 * location at $289 all in. It does not come down with location count the way the
 * base rate does for a chain: base support amortizes across stores, integration
 * support does not, because every store has its own POS install, its own
 * equipment list and its own network. Connecting five stores is $500/mo, one
 * Monthly Upgrades plan at DataDay, and that is deliberate. It is what funds the
 * maintenance when a vendor ships a breaking change.
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
 * ON NOT WRITING BACK. We read. We do not create sessions, take payment or touch
 * memberships in anyone's POS. That is a genuine engineering boundary and also
 * the whole sales answer to "you are not touching my system of record", so it is
 * on the page as a feature rather than buried as a limitation. Tanning session
 * intervals and exposure limits are enforced in their POS for legal reasons and
 * we are not going near them.
 */
export const CONNECT = {
  eyebrow: 'Optional: connect it to your software',
  name: 'Connect it to the software you already run',
  price: '+$100',
  per: 'per location, per month',
  allIn: 'That is $289 a month all in for a connected location.',
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

/*
 * FOUNDING. This used to print "$129 a month for twenty-four months" right next
 * to the $189 sticker, which made the sticker look negotiable and left a reader
 * reconciling two first-location prices on one page. An early rate is a
 * conversation and a limited cohort, not a permanent second ladder in print, so
 * the banner invites it without naming a competing number. The real rate gets
 * agreed in the conversation.
 */
export const FOUNDING = {
  head: 'Founding locations',
  body: 'We are taking on a small first group of spas at a held rate that locks for the length of the term. It is a limited cohort and it is close to signed. If you want in, say so and we will talk numbers.',
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
