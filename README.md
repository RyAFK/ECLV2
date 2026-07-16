# ECL Connect

**Eye Clinic London Professional Referral Hub** — a front-end-only demonstration of a premium professional
referral, education and business-analytics portal for Eye Clinic London.

> Demonstration prototype. All patients, referrals, organisations, appointments, analytics and commercial figures
> shown are fictional. No backend, database or real authentication is used — all data is local TypeScript mock
> data, and non-sensitive demo state (tasks, favourites, notification status) is persisted to `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and choose one of the three demo experiences from the login
screen — no password required:

- **Referring Partner Demo** (`/partner`) — refer a patient, track referral journeys, explore services, use the
  non-diagnostic Referral Assistant, browse clinical education and CPD, request practice resources, and contact
  the dedicated Business Development Manager.
- **Clinic Team Demo** (`/clinic`) — manage referrals and partners, review analytics, the treatment pipeline,
  CRM-style tasks, partner engagement, an audit log and demo settings.
- **Executive Analytics Demo** (`/executive`) — a clean, presentation-style view of network-wide KPIs, growth
  trends and strategic opportunities.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Recharts · Lucide icons — no backend, no external
services.

## Project structure

```
app/            Routes for the public site, login, partner portal, clinic portal and executive dashboard
components/     Shared UI, layout, navigation, chart, dashboard, referral and table components
data/           Local TypeScript mock data (partners, referrals, services, analytics, education, etc.)
lib/            Types, formatters, constants and localStorage helpers
```

## Branding

The Eye Clinic London logo is not yet wired in — `components/branding/ECLLogoPlaceholder.tsx` is a clearly
labelled temporary mark built from CSS/SVG. Swap in the approved logo assets under `public/branding/` and update
that component when they're available; the rest of the app references it by component, not by file path.
