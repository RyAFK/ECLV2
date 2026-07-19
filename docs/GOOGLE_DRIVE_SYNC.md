# Google Drive → Supabase sync

## Mechanism

The sync is a **Supabase Edge Function** (`supabase/functions/sync-drive-sheets`, Deno),
triggered on a schedule by **pg_cron + pg_net** (`supabase/migrations/20260719000006_eclv2_sync_cron.sql`).
It is not called by the browser, has `verify_jwt` disabled, and instead authenticates
callers via a shared secret header (`x-sync-secret`) that only the cron job and
operators know. This was chosen over Google Apps Script because it keeps the whole
pipeline inside Supabase (one place to audit, one set of secrets, native access to
`eclv2.*` tables and `sync_runs`) and over a plain scheduled webhook because pg_cron
+ pg_net requires no external scheduler.

```
pg_cron (every 30 min)
  -> eclv2.trigger_drive_sync()  [reads secret + URL from Supabase Vault]
    -> pg_net.http_post(...)  [fire-and-forget HTTPS call, response logged to net._http_response]
      -> Edge Function sync-drive-sheets
        -> checks x-sync-secret
        -> authenticates to Google as a service account (JWT bearer grant)
        -> lists spreadsheets in the configured Drive folder
        -> downloads/exports each as .xlsx, parses with SheetJS
        -> for each recognised sheet tab, maps header row -> eclv2 columns
        -> validates + upserts rows by external_id (service-role Supabase client)
        -> writes one eclv2.sync_runs row per invocation with aggregate counts/errors
```

## Secrets and where they live

| Secret | Where | Set by |
|---|---|---|
| `SYNC_TRIGGER_SECRET` | Edge Function secret (`supabase secrets set`) | Operator, out of band |
| `eclv2_sync_trigger_secret` | Supabase Vault (same value as above) | Already set by this implementation via `execute_sql`; **must match** the Edge Function secret |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Edge Function secret | Operator, out of band |
| `GOOGLE_DRIVE_FOLDER_ID` | Edge Function secret (optional — defaults to the folder given in the project brief) | Operator, out of band |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Injected automatically by Supabase into every Edge Function | Supabase platform — never set manually, **never** exposed to the browser |

The service-role key is only ever read inside the Edge Function's Deno runtime
(server-side, Supabase-managed). It is not present anywhere in the Next.js app,
`.env.local`, or any client bundle — only `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY` are used client-side, and the anon key's access is
governed entirely by the RLS policies in `supabase/migrations/`.

## One-time setup required to activate real syncing

This implementation could not complete these steps — they require credentials I
don't have access to:

1. **Create a Google Cloud service account** with the Drive API enabled, and
   generate a JSON key for it.
2. **Share the Drive folder**
   (`https://drive.google.com/drive/folders/1YtRERWNF2NUmeThWN2pSv93ugIcwSPSX`)
   with that service account's `client_email` (Viewer access is enough).
3. **Set the Edge Function secrets** (requires the Supabase CLI, logged in, or the
   dashboard — not available from this session):
   ```bash
   supabase secrets set --project-ref wszcqjxlkqtjqxyolcos \
     GOOGLE_SERVICE_ACCOUNT_JSON="$(cat service-account.json)" \
     SYNC_TRIGGER_SECRET="<value shared with you separately, out of band>"
   ```
   A random `SYNC_TRIGGER_SECRET` value has already been generated and stored in
   Supabase Vault (`eclv2_sync_trigger_secret`) — that's what
   `eclv2.trigger_drive_sync()` sends. The actual value was shared directly in
   chat, not committed here; retrieve it again any time with
   `select decrypted_secret from vault.decrypted_secrets where name = 'eclv2_sync_trigger_secret';`
   in the SQL editor. It must match the Edge Function secret exactly, or rotate
   both together (see below).
4. That's it — the next pg_cron tick (within 30 minutes) will run a real sync.
   To run immediately: `select eclv2.trigger_drive_sync();` in the SQL editor, or
   check progress with `select * from eclv2.sync_runs order by started_at desc;`.

## Verifying it's wired correctly (already done)

Without Google credentials, the plumbing was still verified end-to-end: calling
`eclv2.trigger_drive_sync()` reaches the deployed Edge Function over HTTPS
(confirmed via `select * from net._http_response`), which correctly rejects the
call because `SYNC_TRIGGER_SECRET` isn't set on the function yet — proving
cron → pg_net → Edge Function → auth-check all work. The only missing piece is
step 3 above.

## Rotating the shared secret

```sql
select vault.update_secret(
  (select id from vault.secrets where name = 'eclv2_sync_trigger_secret'),
  '<new random value>'
);
```
Then `supabase secrets set SYNC_TRIGGER_SECRET=<same new value>`.

## Idempotency and retries

- Every row is written with `INSERT ... ON CONFLICT (external_id) DO UPDATE`, so
  re-running the same spreadsheet state never creates duplicates.
- Blank spreadsheet cells are **omitted** from the upsert payload entirely
  (`cellToRecord` in `index.ts`), so they never overwrite a value already in the
  database — only cells that actually have content get written.
- A retry after a partial failure (e.g. the function times out midway) is safe:
  already-upserted rows are simply upserted again with the same values.
- Every invocation writes exactly one `eclv2.sync_runs` row recording
  `started_at`, `finished_at`, `status` (`success` / `partial` / `failed`),
  `inserted_count`, `updated_count`, `skipped_count`, and a structured `errors`
  JSON array (file, sheet, row, message) for anything that couldn't be imported.

## Changing the schedule

```sql
select cron.alter_job((select jobid from cron.job where jobname = 'eclv2-drive-sync'), schedule => '0 * * * *'); -- hourly
```

## Column mapping

See [`SPREADSHEET_MAPPING.md`](./SPREADSHEET_MAPPING.md).
