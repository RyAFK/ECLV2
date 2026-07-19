-- Auto-create an eclv2.profiles row whenever a new auth.users row is created
-- (i.e. on Supabase email/password sign-up). Role and partner_id are read from
-- the signup metadata (supabase.auth.signUp({ options: { data: {...} } })) so the
-- client controls its own initial role at signup time; any *later* change to role
-- or partner_id is blocked for the client by eclv2.prevent_profile_privilege_escalation
-- (see 20260719000002_eclv2_rls.sql) and must be performed with the service role
-- (e.g. by clinic admin tooling), not by the user themselves.

create or replace function eclv2.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
declare
  requested_role eclv2.portal_role;
  requested_partner_id uuid;
begin
  begin
    requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'partner')::eclv2.portal_role;
  exception when invalid_text_representation then
    requested_role := 'partner';
  end;

  requested_partner_id := nullif(new.raw_user_meta_data ->> 'partner_id', '')::uuid;

  -- A partner-role profile must reference a real partner organisation; fall back
  -- to 'partner' role with no organisation only if the id given doesn't resolve,
  -- rather than silently promoting the user to clinic/executive.
  if requested_role = 'partner' and requested_partner_id is not null
     and not exists (select 1 from eclv2.partners where id = requested_partner_id) then
    requested_partner_id := null;
  end if;

  insert into eclv2.profiles (id, role, partner_id, full_name, email, greeting_name)
  values (
    new.id,
    requested_role,
    case when requested_role = 'partner' then requested_partner_id else null end,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger eclv2_on_auth_user_created
  after insert on auth.users
  for each row execute function eclv2.handle_new_user();

-- Keep eclv2.profiles.email in sync if a user changes their auth email.
create or replace function eclv2.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
begin
  update eclv2.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger eclv2_on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function eclv2.handle_user_email_change();
