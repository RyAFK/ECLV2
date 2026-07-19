-- Schedules the Google Drive -> Supabase sync (supabase/functions/sync-drive-sheets)
-- to run automatically every 30 minutes via pg_cron + pg_net, calling the deployed
-- Edge Function over HTTPS with a shared secret header.
--
-- No real secret value is committed here. This migration only creates a
-- placeholder Vault entry ('CHANGE_ME_VIA_DASHBOARD') if one doesn't already
-- exist; the actual secret must be set once, out of band (Supabase SQL editor
-- or `supabase secrets set`), to match the Edge Function's SYNC_TRIGGER_SECRET.
-- See docs/GOOGLE_DRIVE_SYNC.md for the exact rotation steps.

create extension if not exists pg_cron;
create extension if not exists pg_net;

grant usage on schema cron to postgres;

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'eclv2_sync_trigger_secret') then
    perform vault.create_secret(
      'CHANGE_ME_VIA_DASHBOARD',
      'eclv2_sync_trigger_secret',
      'Shared secret sent as x-sync-secret to the sync-drive-sheets Edge Function. Rotate via vault.update_secret() and supabase secrets set.'
    );
  end if;
end $$;

create or replace function eclv2.trigger_drive_sync()
returns void
language plpgsql
security definer
set search_path = eclv2, vault, pg_temp
as $$
declare
  v_secret text;
  v_project_url text;
begin
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'eclv2_sync_trigger_secret';
  select decrypted_secret into v_project_url from vault.decrypted_secrets where name = 'eclv2_project_url';

  if v_secret is null or v_secret = 'CHANGE_ME_VIA_DASHBOARD' then
    raise notice 'eclv2_sync_trigger_secret has not been rotated yet - skipping scheduled sync run. See docs/GOOGLE_DRIVE_SYNC.md.';
    return;
  end if;
  if v_project_url is null then
    raise notice 'eclv2_project_url secret is not set - skipping scheduled sync run. Set it to https://<project-ref>.supabase.co.';
    return;
  end if;

  perform net.http_post(
    url := v_project_url || '/functions/v1/sync-drive-sheets',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-sync-secret', v_secret, 'x-triggered-by', 'pg_cron'),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
end;
$$;

select cron.schedule('eclv2-drive-sync', '*/30 * * * *', $$select eclv2.trigger_drive_sync();$$);
