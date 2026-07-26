# Reserve My Spot

A proof of concept for selling to local spas: premium members claim a spot from
home instead of driving over and sitting in the lobby on a first-come, first-served
basis.

The pitch in one sentence: **the front desk sees a request the instant it lands,
along with the member's live driving ETA, so a spot gets held for someone who is
genuinely on the way and released when they aren't.**

## Three surfaces, one live database

| Route | Who | What it does |
| --- | --- | --- |
| `/` | anyone | Demo identity picker. No passwords. |
| `/m` | member | Mobile-first app: service menu with live waits, request a spot, My Spot with position + estimate, location sharing, front-desk chat, FAQ. |
| `/support` | support rep | Incoming requests, live room board per station group, driving ETA vs. turn time, call up / start / complete / bump / release, member chat. |
| `/admin` | admin | Memberships and dates, staff roles, service menu, store hours, online request window, FAQ management. |

Member and staff sign-ins are stored under **separate** localStorage keys, so one
browser can be a member in one tab and the front desk in another. That is the
demo: put two windows side by side and watch them talk over Supabase Realtime.

## The two ideas worth understanding

**Wait estimates come from simulating stations.** Each service has a
`duration_minutes` and a `capacity` (beds, rooms, chairs). `projectService()` in
[`src/lib/wait.ts`](src/lib/wait.ts) works out when each station frees up, then
hands the queue to whichever opens first. A service with 3 hydromassage beds
drains its line three times faster than the single cryo chamber, and the member
sees that difference without anyone typing an estimate.

**Late detection is a comparison, not a guess.** `assessRisk()` in
[`src/app/support/page.tsx`](src/app/support/page.tsx) compares a member's driving
ETA against the minute their station actually opens. Arriving before your turn is
`on pace`; within the admin's grace period is `tight`; past it is `late`, and the
rep gets a choice: **Bump back** (keeps their visit, moves them behind the next
person) or **Release** (frees the station for whoever is next). That decision used
to be a rep squinting at the lobby.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + publishable key
npm run dev
```

Apply the SQL in [`supabase/`](supabase/) in order (`01_schema`,
`02_policies_and_realtime`, `03_seed`) against a Supabase project. `03_seed.sql` is
safe to re-run, and it resets the demo activity to a fixed opening tableau.

### Demo location sharing

A laptop browser reports the room it is sitting in and never moves, which proves
nothing to a spa owner. My Spot has a **Demo: simulate drive** slider that moves
you toward the spa along the same code path real GPS uses, writing to the same row
the front desk reads. Drag it with the support portal open in another window.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · TypeScript ·
Supabase Postgres + Realtime · deployed on Vercel.

Tables are prefixed `rms_` inside a shared Supabase project.
They sit in `public` rather than a dedicated Postgres schema because PostgREST only
serves schemas listed under the project's *Exposed schemas* setting. The prefix
gives the same namespacing without a project-wide change.

## Before this is sold to anyone

This is a demo build, and two things are deliberately unfinished:

1. **There is no authentication.** The identity picker writes an id to
   localStorage; the anon key has full read/write on the `rms_*` tables. Anyone
   with the URL can act as any member or rep. Production needs Supabase Auth and
   RLS policies keyed on `auth.uid()`. See the note at the top of
   [`supabase/02_policies_and_realtime.sql`](supabase/02_policies_and_realtime.sql).
2. **Notifications are in-app only.** The desk bell and the member's Updates list
   read a `rms_notifications` table. A real member needs a push notification when
   they're called up, which means a service worker plus a push provider (or SMS).

Driving ETAs are also straight-line distance with an assumed speed, not routed:
good enough to demo the idea, worth swapping for a real routing API if a spa cares
about accuracy in traffic.
