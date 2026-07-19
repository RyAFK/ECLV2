# Setup and deployment

## Supabase project

- Project ref: `wszcqjxlkqtjqxyolcos` ("Referral App", eu-north-1). See the note in
  ["Which Supabase project"](#which-supabase-project-and-why) below — this is not
  the `gxtluazupzettaxkhrro` ref originally given.
- All ECLV2 objects live in a dedicated **`eclv2` Postgres schema** — `partners`,
  `profiles`, `referrals`, `tasks`, `updates`, `notifications`, `sync_runs` — kept
  completely separate from the project's pre-existing, unrelated `public` schema
  (see below).
- Migrations: `supabase/migrations/*.sql`, applied in order. Demo data:
  `supabase/seed.sql`.

### Which Supabase project, and why

The project ref given in the original brief (`gxtluazupzettaxkhrro`) was not
accessible to this session's Supabase connection. The only project reachable was
`wszcqjxlkqtjqxyolcos`, and it turned out to already contain a fully-built,
**unrelated** application's schema in `public` (a different referral-management
system with `profiles`, `practices`, `patients`, `audit_logs`, etc., and its own
`ecl_*` role enum). Per explicit user decision mid-build, ECLV2's tables were
created in an isolated `eclv2` schema in the same project rather than colliding
with, or requiring a new project for, that existing data. One shared-infrastructure
consequence was fixed with permission: `auth.users` is project-wide, and the other
app's own sign-up trigger had a pre-existing bug (hardcoded an invalid enum value)
that broke *all* sign-ups on the project; that one-line bug was fixed (see
`supabase/migrations/20260719000005_fix_shared_project_signup_trigger.sql`) — no
other object belonging to that application was touched.

## Environment variables

### Next.js app (`.env.local`, see `.env.example`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | For Supabase mode | `https://wszcqjxlkqtjqxyolcos.supabase.co`. Safe to expose to the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For Supabase mode | The anon/publishable key. Safe to expose — access is governed entirely by RLS. |

Both are optional: if unset (or the Supabase project has no data yet), the app
falls back to the local mock dataset in `data/*.ts` so it still runs standalone.

### Google Drive sync Edge Function (Supabase secrets, **not** this repo)

See [`GOOGLE_DRIVE_SYNC.md`](./GOOGLE_DRIVE_SYNC.md) for the full list and setup
steps. None of these are ever read by the Next.js app or shipped to the browser.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the two NEXT_PUBLIC_ values, or leave blank for mock-data mode
npm run dev
```

## Applying schema changes to Supabase

Migrations were applied directly via the Supabase MCP tooling during this build.
To apply them from a machine with the Supabase CLI instead:

```bash
supabase link --project-ref wszcqjxlkqtjqxyolcos
supabase db push          # applies supabase/migrations/*.sql
psql "$(supabase db url --project-ref wszcqjxlkqtjqxyolcos -- --schema eclv2)" -f supabase/seed.sql   # optional demo data
```

## Deploying the Edge Function

```bash
supabase functions deploy sync-drive-sheets --project-ref wszcqjxlkqtjqxyolcos --no-verify-jwt
```
(Already deployed as part of this implementation — this is only needed after
future code changes to `supabase/functions/sync-drive-sheets/index.ts`.)

## Production hosting (Vercel, Netlify, etc.)

This implementation did not have credentials for, or an existing connection to,
any hosting platform, so the production deployment step itself was not
performed. To deploy:

1. Push this branch / open a PR and merge to the default branch (or deploy the
   branch directly, depending on your platform).
2. In the hosting platform's project settings, add the two environment
   variables from the table above (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — the same values as `.env.local`, entered
   through the platform's secret/env UI, never committed to the repo.
3. Deploy. `npm run build` has been verified to succeed locally with these
   variables set (see the test results in the final report).
4. Once deployed, the Edge Function and pg_cron schedule work independently of
   the frontend deployment — no redeploy is needed for future spreadsheet
   changes to reach the app, only for changes to the Next.js code itself.

## Demo accounts

Three seeded accounts (see `supabase/seed.sql`) let you test each role without
Google Drive access:

| Role | Email | Password |
|---|---|---|
| Partner | `priya.shah@example-opticians.co.uk` | `Demo-Passw0rd!` |
| Clinic | `ryan@eyecliniclondon.com` | `Demo-Passw0rd!` |
| Executive | `executive@eyecliniclondon.com` | `Demo-Passw0rd!` |

Rotate or remove these before any non-demo use — the password is intentionally
simple and is shown in the login screen's own "Demo accounts" panel.
