# ECL Connect

**Eye Clinic London Professional Referral Hub** — a premium professional referral, education and
business-analytics portal for Eye Clinic London, backed by Supabase.

> All patients, referrals, organisations, appointments, analytics and commercial figures shown are fictional
> demonstration data. When `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, the app
> reads and writes through Supabase (Postgres + RLS + Realtime + email/password auth); when they aren't, it falls
> back to local TypeScript mock data so the app still runs standalone. See [`docs/SETUP.md`](docs/SETUP.md) for
> the full Supabase setup, [`docs/GOOGLE_DRIVE_SYNC.md`](docs/GOOGLE_DRIVE_SYNC.md) for the spreadsheet sync
> pipeline, and [`docs/SPREADSHEET_MAPPING.md`](docs/SPREADSHEET_MAPPING.md) for the column mapping.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key (optional — omit to run on mock data)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). With Supabase configured, sign in with a real (or the
seeded demo) account; without it, the login screen falls back to the original no-password demo picker for the
three experiences:

- **Referring Partner Demo** (`/partner`) — refer a patient, track referral journeys, explore services, use the
  non-diagnostic Referral Assistant, browse clinical education and CPD, request practice resources, and contact
  the dedicated Business Development Manager.
- **Clinic Team Demo** (`/clinic`) — manage referrals and partners, review analytics, the treatment pipeline,
  CRM-style tasks, partner engagement, an audit log and demo settings.
- **Executive Analytics Demo** (`/executive`) — a clean, presentation-style view of network-wide KPIs, growth
  trends and strategic opportunities.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Recharts · Lucide icons · Supabase (Postgres, Auth,
Realtime, Edge Functions).

## Project structure

```
app/            Routes for the public site, login, partner portal, clinic portal and executive dashboard
components/     Shared UI, layout, navigation, chart, dashboard, referral and table components
data/           Local TypeScript mock data, used as a fallback when Supabase is unavailable/empty
lib/            Types, formatters, constants, localStorage helpers, and lib/supabase/ (client, auth, data hooks)
supabase/       Migrations (supabase/migrations/), demo seed data (seed.sql), and the Google Drive sync Edge
                Function (functions/sync-drive-sheets/)
docs/           Setup instructions, the Drive sync mechanism, and the spreadsheet column mapping
```

## Branding

The Eye Clinic London logo is not yet wired in — `components/branding/ECLLogoPlaceholder.tsx` is a clearly
labelled temporary mark built from CSS/SVG. Swap in the approved logo assets under `public/branding/` and update
that component when they're available; the rest of the app references it by component, not by file path.
