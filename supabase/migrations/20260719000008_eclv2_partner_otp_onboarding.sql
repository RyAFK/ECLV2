-- Referring-partner OTP auth + profile onboarding.
--
-- Renames eclv2.profiles/notifications columns to the exact names required by
-- the partner auth spec (user_id, portal_role, display_name, contact_number,
-- recipient_user_id), adds partner-onboarding fields, and replaces the old
-- "role/partner_id must be set together" constraint with an onboarding_complete
-- flag, since OTP sign-up now creates a bare profile *before* the partner has
-- chosen a practice name (previously every signup path supplied partner_id
-- immediately, which is no longer true for passwordless partner sign-up).
--
-- Column renames are safe: Postgres tracks FKs, indexes and RLS policy
-- expressions by attnum, not name, so they follow the rename automatically.
-- Only PL/pgSQL function *bodies* (plain text SQL) need to be rewritten by hand
-- below - they are not dependency-tracked the way policies/indexes are, and
-- the existing trigger functions must be redefined *immediately* after the
-- rename, before any other statement in this migration updates eclv2.profiles
-- (otherwise the still-old trigger body fires against the already-renamed
-- columns and errors, as happened on the first attempt at this migration).

-- ---------------------------------------------------------------------------
-- 1. Renames
-- ---------------------------------------------------------------------------

alter table eclv2.profiles rename column id to user_id;
alter table eclv2.profiles rename column role to portal_role;
alter table eclv2.profiles rename column full_name to display_name;
alter table eclv2.profiles rename column phone to contact_number;
alter table eclv2.notifications rename column recipient_id to recipient_user_id;

-- ---------------------------------------------------------------------------
-- 2. Helper functions / triggers - rewritten for the renamed columns, done
--    before any UPDATE touches eclv2.profiles in the rest of this migration.
-- ---------------------------------------------------------------------------

create or replace function eclv2.current_role()
returns eclv2.portal_role
language sql
stable
security definer
set search_path = eclv2, pg_temp
as $$
  select portal_role from eclv2.profiles where user_id = auth.uid();
$$;

create or replace function eclv2.current_partner_id()
returns uuid
language sql
stable
security definer
set search_path = eclv2, pg_temp
as $$
  select partner_id from eclv2.profiles where user_id = auth.uid();
$$;

-- eclv2.is_staff() is unchanged (it only calls current_role()).

-- Client-side updates may never change portal_role/partner_id (privilege
-- escalation guard), EXCEPT when performed by our own trusted onboarding
-- function, which flags the current transaction via a GUC that no ordinary
-- PostgREST request can set (PostgREST only ever issues parameterized
-- queries/RPC calls, never raw SET statements from client input).
create or replace function eclv2.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
begin
  if coalesce(current_setting('eclv2.privileged_update', true), 'false') = 'true' then
    return new;
  end if;
  if auth.role() = 'authenticated' and (new.portal_role is distinct from old.portal_role or new.partner_id is distinct from old.partner_id) then
    raise exception 'Changing role or partner_id is not permitted from the client';
  end if;
  return new;
end;
$$;

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

  if requested_role = 'partner' and requested_partner_id is not null
     and not exists (select 1 from eclv2.partners where id = requested_partner_id) then
    requested_partner_id := null;
  end if;

  insert into eclv2.profiles (user_id, portal_role, partner_id, display_name, email, greeting_name)
  values (
    new.id,
    requested_role,
    case when requested_role = 'partner' then requested_partner_id else null end,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function eclv2.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
begin
  update eclv2.profiles set email = new.email where user_id = new.id;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. New columns / constraints / backfill (safe now that triggers are fixed)
-- ---------------------------------------------------------------------------

update eclv2.profiles set contact_number = '' where contact_number is null;
alter table eclv2.profiles alter column contact_number set not null;
alter table eclv2.profiles alter column contact_number set default '';

alter table eclv2.profiles add column practice_name text not null default '';
alter table eclv2.profiles add column professional_role text not null default '';
alter table eclv2.profiles add column onboarding_complete boolean not null default false;

alter table eclv2.profiles drop constraint profiles_partner_role_requires_partner_id;

-- Every partner profile gets its own dedicated partners row at onboarding time
-- (see eclv2.complete_partner_onboarding below), so partner_id is 1:1 per
-- profile. NULLs (clinic/executive profiles) are unaffected - Postgres unique
-- constraints don't compare NULLs as equal.
alter table eclv2.profiles add constraint profiles_partner_id_unique unique (partner_id);

-- Backfill the three seeded demo accounts so they remain fully usable without
-- going through onboarding (they already represent "complete" accounts).
update eclv2.profiles p
set onboarding_complete = true,
    practice_name = coalesce((select pt.name from eclv2.partners pt where pt.id = p.partner_id), ''),
    professional_role = coalesce((select pt.role from eclv2.partners pt where pt.id = p.partner_id), '')
where p.user_id in (
  'a0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000002',
  'a0000000-0000-4000-8000-000000000003'
);

-- ---------------------------------------------------------------------------
-- 4. Secure onboarding / profile-update RPCs
-- ---------------------------------------------------------------------------

create or replace function eclv2.complete_partner_onboarding(
  p_display_name text,
  p_practice_name text,
  p_professional_role text,
  p_contact_number text
)
returns eclv2.profiles
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_partner_id uuid;
  v_profile eclv2.profiles;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  if trim(coalesce(p_display_name, '')) = '' then
    raise exception 'Full name is required';
  end if;
  if trim(coalesce(p_practice_name, '')) = '' then
    raise exception 'Practice name is required';
  end if;
  if trim(coalesce(p_professional_role, '')) = '' then
    raise exception 'Professional role is required';
  end if;
  if trim(coalesce(p_contact_number, '')) = '' then
    raise exception 'Contact number is required';
  end if;

  select partner_id into v_partner_id from eclv2.profiles where user_id = v_uid;

  if v_partner_id is null then
    insert into eclv2.partners (name, professional, role)
    values (trim(p_practice_name), trim(p_display_name), trim(p_professional_role))
    returning id into v_partner_id;
  else
    update eclv2.partners
    set name = trim(p_practice_name), professional = trim(p_display_name), role = trim(p_professional_role), updated_at = now()
    where id = v_partner_id;
  end if;

  perform set_config('eclv2.privileged_update', 'true', true);

  update eclv2.profiles
  set display_name = trim(p_display_name),
      practice_name = trim(p_practice_name),
      professional_role = trim(p_professional_role),
      contact_number = trim(p_contact_number),
      portal_role = 'partner',
      partner_id = v_partner_id,
      onboarding_complete = true,
      updated_at = now()
  where user_id = v_uid
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function eclv2.complete_partner_onboarding(text, text, text, text) from public;
grant execute on function eclv2.complete_partner_onboarding(text, text, text, text) to authenticated;

create or replace function eclv2.update_my_partner_profile(
  p_display_name text,
  p_practice_name text,
  p_professional_role text,
  p_contact_number text
)
returns eclv2.profiles
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_partner_id uuid;
  v_profile eclv2.profiles;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select partner_id into v_partner_id from eclv2.profiles where user_id = v_uid and portal_role = 'partner';
  if v_partner_id is null then
    raise exception 'Only referring partner accounts can use this function';
  end if;

  if trim(coalesce(p_display_name, '')) = '' then
    raise exception 'Full name is required';
  end if;
  if trim(coalesce(p_practice_name, '')) = '' then
    raise exception 'Practice name is required';
  end if;
  if trim(coalesce(p_professional_role, '')) = '' then
    raise exception 'Professional role is required';
  end if;
  if trim(coalesce(p_contact_number, '')) = '' then
    raise exception 'Contact number is required';
  end if;

  update eclv2.partners
  set name = trim(p_practice_name), professional = trim(p_display_name), role = trim(p_professional_role), updated_at = now()
  where id = v_partner_id;

  update eclv2.profiles
  set display_name = trim(p_display_name),
      practice_name = trim(p_practice_name),
      professional_role = trim(p_professional_role),
      contact_number = trim(p_contact_number),
      updated_at = now()
  where user_id = v_uid
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function eclv2.update_my_partner_profile(text, text, text, text) from public;
grant execute on function eclv2.update_my_partner_profile(text, text, text, text) to authenticated;

create or replace function eclv2.admin_update_partner_profile(
  p_target_partner_id uuid,
  p_display_name text,
  p_practice_name text,
  p_professional_role text,
  p_contact_number text
)
returns eclv2.profiles
language plpgsql
security definer
set search_path = eclv2, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_target_user_id uuid;
  v_profile eclv2.profiles;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;
  if not eclv2.is_staff() then
    raise exception 'Only clinic or executive accounts can update partner profiles';
  end if;

  if trim(coalesce(p_display_name, '')) = '' then
    raise exception 'Full name is required';
  end if;
  if trim(coalesce(p_practice_name, '')) = '' then
    raise exception 'Practice name is required';
  end if;
  if trim(coalesce(p_professional_role, '')) = '' then
    raise exception 'Professional role is required';
  end if;
  if trim(coalesce(p_contact_number, '')) = '' then
    raise exception 'Contact number is required';
  end if;

  select user_id into v_target_user_id
  from eclv2.profiles
  where partner_id = p_target_partner_id and portal_role = 'partner'
  limit 1;

  if v_target_user_id is null then
    raise exception 'No referring partner profile is linked to this partner organisation';
  end if;

  update eclv2.partners
  set name = trim(p_practice_name), professional = trim(p_display_name), role = trim(p_professional_role), updated_at = now()
  where id = p_target_partner_id;

  update eclv2.profiles
  set display_name = trim(p_display_name),
      practice_name = trim(p_practice_name),
      professional_role = trim(p_professional_role),
      contact_number = trim(p_contact_number),
      updated_at = now()
  where user_id = v_target_user_id
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function eclv2.admin_update_partner_profile(uuid, text, text, text, text) from public;
grant execute on function eclv2.admin_update_partner_profile(uuid, text, text, text, text) to authenticated;
