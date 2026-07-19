-- Not an ECLV2 object. This project (wszcqjxlkqtjqxyolcos) is shared with an
-- unrelated, pre-existing application whose own auth.users trigger,
-- public.handle_new_auth_user(), hardcoded role = 'partner' when inserting into
-- public.profiles. Its own public.user_role enum never contained 'partner'
-- (only ecl_system_admin / ecl_clinical_user / ecl_referral_coordinator /
-- ecl_read_only_auditor / referring_user), so *every* new Supabase Auth sign-up
-- on this project - for either application - failed with a Postgres error,
-- because auth.users triggers for all schemas fire together and this one aborts
-- the whole transaction.
--
-- This migration is confined to fixing that one invalid literal (swapping it for
-- 'referring_user', the enum's own default and the closest existing equivalent to
-- an unprivileged new signup) so sign-ups work again. It does not touch any other
-- column, table, policy, or behaviour of that application. Applied with explicit
-- user approval after the bug was diagnosed and reported.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (
    id, role, status, first_name, last_name,
    professional_title, professional_role, goc_number,
    contact_number, email, requested_practice_name
  )
  values (
    new.id,
    'referring_user',
    'pending',
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'professional_title',
    new.raw_user_meta_data->>'professional_role',
    new.raw_user_meta_data->>'goc_number',
    new.raw_user_meta_data->>'contact_number',
    new.email,
    new.raw_user_meta_data->>'requested_practice_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;
