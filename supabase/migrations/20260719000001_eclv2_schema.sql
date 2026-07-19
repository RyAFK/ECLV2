-- ECLV2 schema
-- Deliberately isolated in a dedicated `eclv2` Postgres schema (rather than `public`)
-- because the target Supabase project already contains an unrelated pre-existing
-- application schema in `public` (profiles, practices, referrals, notifications, ...).
-- Using a separate schema lets ECLV2 use the exact table names required by spec
-- (partners, profiles, referrals, tasks, updates, notifications, sync_runs) with
-- zero risk of colliding with, or overwriting, that unrelated data.

create schema if not exists eclv2;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type eclv2.portal_role as enum ('partner', 'clinic', 'executive');

create type eclv2.referral_stage as enum (
  'new',
  'awaiting-contact',
  'contacted',
  'triage',
  'consultation-booked',
  'consultation-completed',
  'treatment-recommended',
  'treatment-booked',
  'procedure-completed',
  'aftercare',
  'completed',
  'closed',
  'lost'
);

create type eclv2.conversion_probability as enum ('High', 'Medium', 'Low');

create type eclv2.partner_category as enum (
  'Independent optometry',
  'Optometry group',
  'Private GP',
  'Corporate healthcare',
  'Ophthalmology'
);

create type eclv2.relationship_status as enum (
  'Strategic',
  'Active',
  'Developing',
  'New',
  'Dormant',
  'At risk'
);

create type eclv2.task_priority as enum ('High', 'Medium', 'Low');

create type eclv2.update_category as enum (
  'Clinic update',
  'Education',
  'CPD',
  'Services',
  'Partner resources',
  'Case study'
);

create type eclv2.update_audience as enum ('all', 'partner', 'clinic');

create type eclv2.sync_status as enum ('running', 'success', 'partial', 'failed');

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------

create table eclv2.partners (
  id uuid primary key default gen_random_uuid(),
  external_id text unique, -- stable id from the source spreadsheet, used for upserts
  name text not null,
  category eclv2.partner_category not null default 'Independent optometry',
  professional text not null default '',
  role text not null default '',
  location text not null default '',
  referrals_count integer not null default 0,
  consultations_count integer not null default 0,
  treatment_bookings_count integer not null default 0,
  conversion numeric(5, 2) not null default 0,
  estimated_value numeric(12, 2) not null default 0,
  last_referral_date date,
  last_contacted_date date,
  last_login_date date,
  relationship_status eclv2.relationship_status not null default 'New',
  owner text not null default '',
  engagement_score integer not null default 0,
  most_viewed_tab text,
  resources_downloaded integer,
  education_views integer,
  cpd_attendance integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table eclv2.partners is 'Referring partner organisations (practices). Synced from Google Drive spreadsheets via external_id.';

create index partners_relationship_status_idx on eclv2.partners (relationship_status);
create index partners_category_idx on eclv2.partners (category);

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table eclv2.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role eclv2.portal_role not null default 'partner',
  partner_id uuid references eclv2.partners (id) on delete set null,
  full_name text not null default '',
  email text not null default '',
  phone text,
  location text,
  member_since date not null default current_date,
  greeting_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_partner_role_requires_partner_id
    check (role <> 'partner' or partner_id is not null)
);

comment on table eclv2.profiles is 'One row per authenticated user, holding portal role and (for partner users) their partner organisation.';

create index profiles_partner_id_idx on eclv2.profiles (partner_id);
create index profiles_role_idx on eclv2.profiles (role);

-- ---------------------------------------------------------------------------
-- referrals
-- ---------------------------------------------------------------------------

create table eclv2.referrals (
  id uuid primary key default gen_random_uuid(),
  external_id text unique, -- stable id from the source spreadsheet, used for upserts
  reference text not null unique,
  patient_label text not null, -- de-identified label only (e.g. "Margaret H."), never full patient PII
  pathway_id text not null,
  pathway_name text not null,
  reason text not null default '',
  referral_date date not null default current_date,
  stage eclv2.referral_stage not null default 'new',
  consultant text,
  appointment_date date,
  last_update date not null default current_date,
  partner_id uuid not null references eclv2.partners (id) on delete restrict,
  professional_name text not null default '',
  practice_location text not null default '',
  estimated_value numeric(12, 2) not null default 0,
  owner text not null default '',
  next_action text not null default '',
  conversion_probability eclv2.conversion_probability not null default 'Medium',
  timeline jsonb not null default '[]'::jsonb,
  highlight_context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table eclv2.referrals is 'Referral records. patient_label must stay a de-identified label, never raw patient PII.';

create index referrals_partner_id_idx on eclv2.referrals (partner_id);
create index referrals_stage_idx on eclv2.referrals (stage);

-- ---------------------------------------------------------------------------
-- tasks (internal clinic/BDM CRM tasks - no patient data)
-- ---------------------------------------------------------------------------

create table eclv2.tasks (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  title text not null,
  reason text not null default '',
  due_date date,
  priority eclv2.task_priority not null default 'Medium',
  partner_id uuid references eclv2.partners (id) on delete set null,
  partner_name text,
  assigned_to uuid references eclv2.profiles (id) on delete set null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table eclv2.tasks is 'Clinic/BDM follow-up and relationship-management tasks.';

create index tasks_completed_idx on eclv2.tasks (completed);
create index tasks_partner_id_idx on eclv2.tasks (partner_id);

-- ---------------------------------------------------------------------------
-- updates (news / announcements feed)
-- ---------------------------------------------------------------------------

create table eclv2.updates (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  title text not null,
  description text not null default '',
  publish_date date not null default current_date,
  category eclv2.update_category not null default 'Clinic update',
  audience eclv2.update_audience not null default 'all',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table eclv2.updates is 'News / announcements feed shown to partners and clinic staff.';

create index updates_publish_date_idx on eclv2.updates (publish_date desc);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------

create table eclv2.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references eclv2.profiles (id) on delete cascade,
  message text not null,
  category text not null default 'General',
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table eclv2.notifications is 'Per-user notifications. Visible only to their intended recipient (recipient_id).';

create index notifications_recipient_id_idx on eclv2.notifications (recipient_id);
create index notifications_recipient_unread_idx on eclv2.notifications (recipient_id) where not is_read;

-- ---------------------------------------------------------------------------
-- sync_runs (audit trail for the Google Drive -> Supabase sync pipeline)
-- ---------------------------------------------------------------------------

create table eclv2.sync_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'google_drive_excel',
  file_id text,
  file_name text,
  sheet_name text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status eclv2.sync_status not null default 'running',
  inserted_count integer not null default 0,
  updated_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  triggered_by text not null default 'schedule',
  created_at timestamptz not null default now()
);

comment on table eclv2.sync_runs is 'Audit log of every Google Drive Excel -> Supabase sync run. Written exclusively by the sync Edge Function (service role).';

create index sync_runs_started_at_idx on eclv2.sync_runs (started_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger
-- ---------------------------------------------------------------------------

create or replace function eclv2.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger partners_set_updated_at before update on eclv2.partners
  for each row execute function eclv2.set_updated_at();
create trigger profiles_set_updated_at before update on eclv2.profiles
  for each row execute function eclv2.set_updated_at();
create trigger referrals_set_updated_at before update on eclv2.referrals
  for each row execute function eclv2.set_updated_at();
create trigger tasks_set_updated_at before update on eclv2.tasks
  for each row execute function eclv2.set_updated_at();
create trigger updates_set_updated_at before update on eclv2.updates
  for each row execute function eclv2.set_updated_at();
