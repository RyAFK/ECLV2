-- Enable Supabase Realtime change notifications for the five operational tables
-- that ECLV2 screens subscribe to. profiles and sync_runs are intentionally
-- excluded (profiles rarely changes post-signup and doesn't need live UI updates;
-- sync_runs is polled by the clinic settings/audit view, not subscribed to).

alter publication supabase_realtime add table eclv2.partners;
alter publication supabase_realtime add table eclv2.referrals;
alter publication supabase_realtime add table eclv2.tasks;
alter publication supabase_realtime add table eclv2.updates;
alter publication supabase_realtime add table eclv2.notifications;

-- Grant schema usage + table privileges to the standard Supabase roles.
-- RLS (enabled in 20260719000002) still governs row visibility for anon/authenticated;
-- these GRANTs just allow the roles to attempt the statement at all.
grant usage on schema eclv2 to anon, authenticated, service_role;

grant select on eclv2.partners, eclv2.referrals, eclv2.updates to anon, authenticated;
grant select, update on eclv2.notifications to authenticated;
grant select, insert, update, delete on eclv2.tasks to authenticated;
grant select, update on eclv2.profiles to authenticated;
grant select on eclv2.sync_runs to authenticated;

grant all on all tables in schema eclv2 to service_role;
grant all on all sequences in schema eclv2 to service_role;
alter default privileges in schema eclv2 grant all on tables to service_role;

-- Note: granting SELECT to `anon` above is intentionally harmless — RLS policies
-- only grant `authenticated`, so anon still gets zero rows back (default deny).
-- We grant the anon role table-level SELECT purely so Postgres returns an empty
-- result set rather than a permission error for anon SELECTs, matching typical
-- Supabase client ergonomics; no anon policy exists on any eclv2 table.
