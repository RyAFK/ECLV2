-- Fixes a security-advisor warning (function_search_path_mutable): the
-- eclv2.set_updated_at trigger function was missing a pinned search_path.

create or replace function eclv2.set_updated_at()
returns trigger
language plpgsql
set search_path = eclv2, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
