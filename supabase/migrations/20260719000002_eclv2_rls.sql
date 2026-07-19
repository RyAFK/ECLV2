-- ECLV2 row-level security
--
-- Principles enforced:
--  * Anonymous (anon) role has no policies anywhere in this schema -> default deny.
--  * Authenticated users only ever see rows permitted by their eclv2.profiles.role
--    and (for partner users) eclv2.profiles.partner_id.
--  * Client-side (anon/authenticated, i.e. the publishable/anon key) writes are
--    restricted to narrow, specific columns/rows needed by the UI. Bulk/structural
--    writes (partners, updates, sync_runs, referral creation) are service_role only,
--    performed by the sync Edge Function or trusted server-side code.

alter table eclv2.partners enable row level security;
alter table eclv2.profiles enable row level security;
alter table eclv2.referrals enable row level security;
alter table eclv2.tasks enable row level security;
alter table eclv2.updates enable row level security;
alter table eclv2.notifications enable row level security;
alter table eclv2.sync_runs enable row level security;

-- ---------------------------------------------------------------------------
-- Helper functions (security definer, so they can read eclv2.profiles without
-- being blocked by - or recursing into - the RLS policies defined below).
-- ---------------------------------------------------------------------------

create or replace function eclv2.current_role()
returns eclv2.portal_role
language sql
stable
security definer
set search_path = eclv2, pg_temp
as $$
  select role from eclv2.profiles where id = auth.uid();
$$;

create or replace function eclv2.current_partner_id()
returns uuid
language sql
stable
security definer
set search_path = eclv2, pg_temp
as $$
  select partner_id from eclv2.profiles where id = auth.uid();
$$;

create or replace function eclv2.is_staff()
returns boolean
language sql
stable
security definer
set search_path = eclv2, pg_temp
as $$
  select eclv2.current_role() in ('clinic', 'executive');
$$;

grant execute on function eclv2.current_role() to authenticated;
grant execute on function eclv2.current_partner_id() to authenticated;
grant execute on function eclv2.is_staff() to authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy profiles_select_own on eclv2.profiles
  for select to authenticated
  using (id = auth.uid() or eclv2.is_staff());

create policy profiles_update_own on eclv2.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Prevent a user from escalating their own role/partner_id via the update policy
-- above (defence in depth alongside the CHECK constraint and application logic).
create or replace function eclv2.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
begin
  if auth.role() = 'authenticated' and (new.role is distinct from old.role or new.partner_id is distinct from old.partner_id) then
    raise exception 'Changing role or partner_id is not permitted from the client';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_privilege_escalation
  before update on eclv2.profiles
  for each row execute function eclv2.prevent_profile_privilege_escalation();

-- No client-side insert/delete policy: profile rows are created exclusively by the
-- eclv2.handle_new_user trigger (security definer, see auth migration) on signup.

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------

create policy partners_select_staff on eclv2.partners
  for select to authenticated
  using (eclv2.is_staff());

create policy partners_select_own_org on eclv2.partners
  for select to authenticated
  using (eclv2.current_role() = 'partner' and id = eclv2.current_partner_id());

-- No client insert/update/delete policies: partner records are structural/commercial
-- data maintained by the Google Drive sync pipeline (service_role) only.

-- ---------------------------------------------------------------------------
-- referrals
-- ---------------------------------------------------------------------------

create policy referrals_select_staff on eclv2.referrals
  for select to authenticated
  using (eclv2.is_staff());

create policy referrals_select_own_org on eclv2.referrals
  for select to authenticated
  using (eclv2.current_role() = 'partner' and partner_id = eclv2.current_partner_id());

-- Clinic/executive staff may update the working fields of a referral (stage,
-- consultant, appointment, ownership, next action) but not fabricate patient
-- identity, reference numbers or the audit timeline directly from the client.
create policy referrals_update_staff on eclv2.referrals
  for update to authenticated
  using (eclv2.is_staff())
  with check (eclv2.is_staff());

-- No client insert/delete policy: referrals are created via the sync pipeline or a
-- dedicated server-side "refer a patient" endpoint (future scope), never a bare
-- client insert.

-- ---------------------------------------------------------------------------
-- tasks (internal BDM/clinic tool - never visible to partner accounts)
-- ---------------------------------------------------------------------------

create policy tasks_all_staff on eclv2.tasks
  for select to authenticated
  using (eclv2.is_staff());

create policy tasks_insert_staff on eclv2.tasks
  for insert to authenticated
  with check (eclv2.is_staff());

create policy tasks_update_staff on eclv2.tasks
  for update to authenticated
  using (eclv2.is_staff())
  with check (eclv2.is_staff());

create policy tasks_delete_staff on eclv2.tasks
  for delete to authenticated
  using (eclv2.is_staff());

-- ---------------------------------------------------------------------------
-- updates (news / announcements)
-- ---------------------------------------------------------------------------

create policy updates_select_staff on eclv2.updates
  for select to authenticated
  using (eclv2.is_staff());

create policy updates_select_partner on eclv2.updates
  for select to authenticated
  using (eclv2.current_role() = 'partner' and audience in ('all', 'partner'));

-- No client write policies: updates are published by clinic staff via a trusted
-- server-side/admin path (or the sync pipeline), not directly by any browser client.

-- ---------------------------------------------------------------------------
-- notifications (strictly per-recipient)
-- ---------------------------------------------------------------------------

create policy notifications_select_own on eclv2.notifications
  for select to authenticated
  using (recipient_id = auth.uid());

create policy notifications_update_own on eclv2.notifications
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- No client insert/delete policy: notifications are created by trusted server-side
-- logic / triggers (service_role), never inserted directly by a browser client.

-- ---------------------------------------------------------------------------
-- sync_runs (operational visibility for staff; written only by the Edge Function)
-- ---------------------------------------------------------------------------

create policy sync_runs_select_staff on eclv2.sync_runs
  for select to authenticated
  using (eclv2.is_staff());

-- No insert/update/delete policy for anon/authenticated at all: only the
-- service_role key (used exclusively inside the Edge Function, never the browser)
-- can write sync_runs, since service_role bypasses RLS entirely.
