-- ECLV2 demo/seed data.
-- Mirrors the original front-end mock data (data/partners.ts, data/referrals.ts,
-- data/tasks.ts, data/updates.ts) so the app looks identical immediately after
-- cutover, while now living in eclv2.* tables. Also creates three demo auth
-- accounts (one per role) so clinic/partner/executive access can be tested end to
-- end. Safe to re-run: every insert is keyed by external_id/email and upserts.
--
-- Demo login passwords are intentionally simple and MUST be rotated before any
-- real use; they exist purely so this environment can be smoke-tested.

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------

insert into eclv2.partners
  (external_id, name, category, professional, role, location, referrals_count, consultations_count,
   treatment_bookings_count, conversion, estimated_value, last_referral_date, last_contacted_date,
   last_login_date, relationship_status, owner, engagement_score, most_viewed_tab, resources_downloaded,
   education_views, cpd_attendance)
values
  ('marylebone-independent-opticians', 'Marylebone Independent Opticians', 'Independent optometry', 'Priya Shah', 'Optometrist and Practice Owner', 'Marylebone, London', 18, 14, 9, 78, 96000, '2026-07-14', '2026-07-10', '2026-07-17', 'Strategic', 'Ryan', 92, 'Refer a patient', 4, 12, 3),
  ('chelsea-vision-practice', 'Chelsea Vision Practice', 'Independent optometry', 'Daniel Morgan', 'Optometrist', 'Chelsea, London', 12, 8, 5, 67, 54000, '2026-07-08', '2026-06-29', '2026-07-13', 'Active', 'Ryan', 74, 'Education', 3, 7, 1),
  ('central-london-private-gp-group', 'Central London Private GP Group', 'Private GP', 'Dr Amelia Carter', 'Private GP', 'Fitzrovia, London', 10, 7, 4, 70, 48500, '2026-07-11', '2026-07-04', '2026-07-15', 'Active', 'Ryan', 81, 'Services', 2, 5, 2),
  ('kensington-eye-vision', 'Kensington Eye & Vision', 'Optometry group', 'Sophie Williams', 'Dispensing Optician and Practice Manager', 'Kensington, London', 8, 5, 3, 63, 32000, '2026-07-05', '2026-06-27', '2026-07-10', 'Developing', 'Ryan', 58, 'Referral Assistant', 1, 3, 0),
  ('harley-street-corporate-health', 'Harley Street Corporate Health', 'Corporate healthcare', 'Laura Bennett', 'Corporate Health Manager', 'Marylebone, London', 7, 5, 3, 71, 28400, '2026-07-01', '2026-06-24', '2026-07-07', 'Active', 'Ryan', 66, 'Services', 2, 4, 1),
  ('regent-street-optometry', 'Regent Street Optometry', 'Independent optometry', 'James Ferris', 'Optometrist and Practice Owner', 'Regent Street, London', 9, 6, 3, 67, 48000, '2026-04-16', '2026-05-19', '2026-04-22', 'Dormant', 'Ryan', 22, 'Home', 1, 2, 0),
  ('notting-hill-optometry', 'Notting Hill Optometry', 'Independent optometry', 'Omar Rahman', 'Optometrist', 'Notting Hill, London', 2, 1, 0, 50, 6000, '2026-07-13', '2026-07-15', '2026-07-16', 'New', 'Ryan', 64, 'Education', 3, 6, 0),
  ('bloomsbury-eyecare', 'Bloomsbury Eyecare', 'Independent optometry', 'Rachel Ainsworth', 'Optometrist', 'Bloomsbury, London', 5, 2, 1, 40, 11000, '2026-05-08', '2026-06-04', '2026-05-28', 'At risk', 'Ryan', 31, 'Services', 0, 1, 0)
on conflict (external_id) do update set
  name = excluded.name, category = excluded.category, professional = excluded.professional, role = excluded.role,
  location = excluded.location, referrals_count = excluded.referrals_count, consultations_count = excluded.consultations_count,
  treatment_bookings_count = excluded.treatment_bookings_count, conversion = excluded.conversion,
  estimated_value = excluded.estimated_value, last_referral_date = excluded.last_referral_date,
  last_contacted_date = excluded.last_contacted_date, last_login_date = excluded.last_login_date,
  relationship_status = excluded.relationship_status, owner = excluded.owner, engagement_score = excluded.engagement_score,
  most_viewed_tab = excluded.most_viewed_tab, resources_downloaded = excluded.resources_downloaded,
  education_views = excluded.education_views, cpd_attendance = excluded.cpd_attendance, updated_at = now();

-- ---------------------------------------------------------------------------
-- referrals
-- ---------------------------------------------------------------------------

insert into eclv2.referrals
  (external_id, reference, patient_label, pathway_id, pathway_name, reason, referral_date, stage, consultant,
   appointment_date, last_update, partner_id, professional_name, practice_location, estimated_value, owner,
   next_action, conversion_probability, highlight_context, timeline)
values
  ('ref-margaret-h', 'ECL-2026-0611', 'Margaret H.', 'cataract', 'Cataract assessment', 'Progressive glare and reduced night vision', '2026-07-08', 'treatment-booked', 'Mr Nicholas Faber', '2026-07-22', '2026-07-14', (select id from eclv2.partners where external_id = 'marylebone-independent-opticians'), 'Priya Shah, Optometrist', 'Marylebone, London', 5200, 'Ryan', 'Confirm pre-operative assessment appointment', 'High', 'Cataract surgery planned for 22 July 2026.', '[]'),
  ('ref-jonathan-p', 'ECL-2026-0648', 'Jonathan P.', 'laser-vision', 'Laser vision correction assessment', 'Seeking reduced dependence on glasses', '2026-07-11', 'consultation-booked', 'Miss Eleanor Vance', '2026-07-18', '2026-07-13', (select id from eclv2.partners where external_id = 'marylebone-independent-opticians'), 'Priya Shah, Optometrist', 'Marylebone, London', 3600, 'Ryan', 'Confirm attendance ahead of refractive assessment', 'Medium', 'Refractive assessment scheduled for 18 July 2026.', '[]'),
  ('ref-elizabeth-r', 'ECL-2026-0663', 'Elizabeth R.', 'dry-eye', 'Dry eye and ocular surface assessment', 'Persistent irritation and contact-lens intolerance', '2026-07-16', 'awaiting-contact', null, null, '2026-07-16', (select id from eclv2.partners where external_id = 'marylebone-independent-opticians'), 'Priya Shah, Optometrist', 'Marylebone, London', 1400, 'Ryan', 'Contact patient to confirm details and preferred appointment', 'Medium', 'Referral received today.', '[]'),
  ('ref-peter-w', 'ECL-2026-0521', 'Peter W.', 'cataract', 'Cataract assessment', 'Cloudy vision affecting driving', '2026-06-18', 'completed', 'Mr Nicholas Faber', '2026-06-29', '2026-07-10', (select id from eclv2.partners where external_id = 'chelsea-vision-practice'), 'Daniel Morgan, Optometrist', 'Chelsea, London', 5400, 'Ryan', 'Pathway complete — return-to-referrer letter sent', 'High', null, '[]'),
  ('ref-anne-c', 'ECL-2026-0577', 'Anne C.', 'rle', 'Refractive lens exchange', 'High hyperopia, seeking reduced glasses dependence', '2026-06-30', 'treatment-recommended', 'Miss Eleanor Vance', '2026-07-09', '2026-07-09', (select id from eclv2.partners where external_id = 'central-london-private-gp-group'), 'Dr Amelia Carter, Private GP', 'Fitzrovia, London', 6200, 'Ryan', 'Follow up on treatment decision', 'Medium', null, '[]'),
  ('ref-michael-t', 'ECL-2026-0492', 'Michael T.', 'cornea-keratoconus', 'Cornea and keratoconus', 'Increasing astigmatism and reduced best-corrected vision', '2026-06-12', 'consultation-completed', 'Mr Nicholas Faber', '2026-06-25', '2026-06-25', (select id from eclv2.partners where external_id = 'kensington-eye-vision'), 'Sophie Williams, Dispensing Optician', 'Kensington, London', 3200, 'Ryan', 'Record treatment recommendation', 'Medium', null, '[]'),
  ('ref-jennifer-s', 'ECL-2026-0705', 'Jennifer S.', 'icl', 'Implantable contact lens', 'High myopia unsuitable for laser correction', '2026-07-13', 'triage', null, null, '2026-07-14', (select id from eclv2.partners where external_id = 'harley-street-corporate-health'), 'Laura Bennett, Corporate Health Manager', 'Marylebone, London', 4800, 'Ryan', 'Complete clinical triage and book consultation', 'Medium', null, '[]'),
  ('ref-robert-d', 'ECL-2026-0398', 'Robert D.', 'glaucoma', 'Glaucoma assessment', 'Raised intraocular pressure identified at routine test', '2026-05-28', 'aftercare', 'Mr David Okafor', '2026-06-10', '2026-07-02', (select id from eclv2.partners where external_id = 'chelsea-vision-practice'), 'Daniel Morgan, Optometrist', 'Chelsea, London', 2100, 'Ryan', 'Schedule six-month monitoring review', 'High', null, '[]'),
  ('ref-sarah-l', 'ECL-2026-0721', 'Sarah L.', 'retina', 'Retina assessment', 'New floaters and occasional flashes', '2026-07-14', 'consultation-booked', 'Mr David Okafor', '2026-07-19', '2026-07-15', (select id from eclv2.partners where external_id = 'kensington-eye-vision'), 'Sophie Williams, Dispensing Optician', 'Kensington, London', 1800, 'Ryan', 'Confirm attendance for retinal imaging', 'Medium', null, '[]'),
  ('ref-david-k', 'ECL-2026-0733', 'David K.', 'paediatric', 'Paediatric ophthalmology', 'Reduced vision identified at school screening', '2026-07-15', 'new', null, null, '2026-07-15', (select id from eclv2.partners where external_id = 'notting-hill-optometry'), 'Omar Rahman, Optometrist', 'Notting Hill, London', 900, 'Ryan', 'Log referral and contact parent or guardian', 'Medium', null, '[]'),
  ('ref-margaret-p', 'ECL-2026-0455', 'Margaret P.', 'second-opinion', 'Second opinion', 'Second opinion requested on existing cataract recommendation', '2026-06-05', 'closed', null, null, '2026-06-22', (select id from eclv2.partners where external_id = 'bloomsbury-eyecare'), 'Rachel Ainsworth, Optometrist', 'Bloomsbury, London', 0, 'Ryan', 'Closed — patient proceeded with existing provider', 'Low', null, '[]'),
  ('ref-oliver-b', 'ECL-2026-0559', 'Oliver B.', 'laser-vision', 'Laser vision correction', 'Stable myopia, keen to stop wearing contact lenses', '2026-06-24', 'lost', null, null, '2026-07-01', (select id from eclv2.partners where external_id = 'harley-street-corporate-health'), 'Laura Bennett, Corporate Health Manager', 'Marylebone, London', 0, 'Ryan', 'Lost — cost cited as reason', 'Low', null, '[]'),
  ('ref-helen-f', 'ECL-2026-0680', 'Helen F.', 'dry-eye', 'Dry eye and ocular surface', 'Screen-related dryness and fluctuating vision', '2026-07-06', 'treatment-booked', 'Miss Eleanor Vance', '2026-07-17', '2026-07-12', (select id from eclv2.partners where external_id = 'central-london-private-gp-group'), 'Dr Amelia Carter, Private GP', 'Fitzrovia, London', 1600, 'Ryan', 'Confirm IPL treatment slot', 'High', null, '[]')
on conflict (external_id) do update set
  stage = excluded.stage, consultant = excluded.consultant, appointment_date = excluded.appointment_date,
  last_update = excluded.last_update, next_action = excluded.next_action, estimated_value = excluded.estimated_value,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------------

insert into eclv2.tasks (external_id, title, reason, due_date, priority, partner_id, partner_name, completed)
values
  ('task-regent-street', 'Call Regent Street Optometry', 'No referral activity in 94 days.', '2026-07-19', 'High', (select id from eclv2.partners where external_id = 'regent-street-optometry'), 'Regent Street Optometry', false),
  ('task-marylebone-followup', 'Follow up Marylebone Independent Opticians', 'Discuss structured cataract pathway and patient resources.', '2026-07-20', 'Medium', (select id from eclv2.partners where external_id = 'marylebone-independent-opticians'), 'Marylebone Independent Opticians', false),
  ('task-chelsea-dry-eye', 'Send dry-eye referral materials', 'Requested during last practice visit.', '2026-07-18', 'Medium', (select id from eclv2.partners where external_id = 'chelsea-vision-practice'), 'Chelsea Vision Practice', false),
  ('task-notting-hill-onboarding', 'Review new partner onboarding', 'Confirm onboarding materials have been received.', '2026-07-20', 'Low', (select id from eclv2.partners where external_id = 'notting-hill-optometry'), 'Notting Hill Optometry', false),
  ('task-bloomsbury-atrisk', 'Schedule at-risk relationship review', 'Referral volume down 60% over the last quarter.', '2026-07-21', 'High', (select id from eclv2.partners where external_id = 'bloomsbury-eyecare'), 'Bloomsbury Eyecare', false),
  ('task-harley-street-cpd', 'Send CPD invitation', 'Corporate health team keen on refractive update.', '2026-07-24', 'Low', (select id from eclv2.partners where external_id = 'harley-street-corporate-health'), 'Harley Street Corporate Health', false),
  ('task-kensington-portal', 'Introduce portal engagement features', 'Low portal login activity in the last 30 days.', '2026-07-12', 'Medium', (select id from eclv2.partners where external_id = 'kensington-eye-vision'), 'Kensington Eye & Vision', true),
  ('task-central-london-review', 'Referral performance review call', 'Quarterly relationship check-in requested.', '2026-07-08', 'Medium', (select id from eclv2.partners where external_id = 'central-london-private-gp-group'), 'Central London Private GP Group', true)
on conflict (external_id) do update set
  completed = excluded.completed, due_date = excluded.due_date, priority = excluded.priority, updated_at = now();

-- ---------------------------------------------------------------------------
-- updates
-- ---------------------------------------------------------------------------

insert into eclv2.updates (external_id, title, description, publish_date, category, audience)
values
  ('new-platform', 'New ECL professional referral platform', 'Making it easier for professional partners to refer patients and follow referral milestones from a single dashboard.', '2026-07-10', 'Clinic update', 'all'),
  ('cataract-refractive-update', 'Cataract and refractive pathway update', 'A demonstration update explaining how professionals can access pathway information and referral support.', '2026-07-06', 'Services', 'all'),
  ('new-education-module', 'New clinical education module', 'A new referral-focused module covering dry eye and ocular-surface assessment.', '2026-07-02', 'Education', 'all'),
  ('cpd-evening', 'Upcoming optometrist CPD evening', 'A fictional professional education event for optometrists and dispensing opticians.', '2026-06-28', 'CPD', 'partner'),
  ('patient-materials', 'Patient information materials available', 'Partners can request printed or digital pathway leaflets for their practice.', '2026-06-20', 'Partner resources', 'partner'),
  ('case-study-cataract', 'Case study: a smoother cataract pathway for shared patients', 'A fictional case study illustrating how referral tracking supported a recent cataract pathway from referral to recovery.', '2026-06-14', 'Case study', 'all')
on conflict (external_id) do update set
  title = excluded.title, description = excluded.description, updated_at = now();

-- ---------------------------------------------------------------------------
-- Demo auth accounts (one per role) + eclv2.profiles are created via the
-- eclv2.handle_new_user trigger reading raw_user_meta_data below.
-- Passwords: Demo-Passw0rd! (rotate before any non-demo use).
-- ---------------------------------------------------------------------------

do $$
declare
  v_partner_id uuid;
  v_partner_user_id uuid := 'a0000000-0000-4000-8000-000000000001';
  v_clinic_user_id uuid := 'a0000000-0000-4000-8000-000000000002';
  v_exec_user_id uuid := 'a0000000-0000-4000-8000-000000000003';
  v_password text := crypt('Demo-Passw0rd!', gen_salt('bf'));
begin
  select id into v_partner_id from eclv2.partners where external_id = 'marylebone-independent-opticians';

  -- partner demo user: priya.shah@example-opticians.co.uk
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
    recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_partner_user_id, 'authenticated', 'authenticated',
    'priya.shah@example-opticians.co.uk', v_password, now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('role', 'partner', 'partner_id', v_partner_id::text, 'full_name', 'Priya Shah'),
    now(), now(), '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  values (
    gen_random_uuid(), v_partner_user_id::text, v_partner_user_id,
    jsonb_build_object('sub', v_partner_user_id::text, 'email', 'priya.shah@example-opticians.co.uk'),
    'email', now(), now(), now()
  )
  on conflict do nothing;

  -- clinic demo user: ryan@eyecliniclondon.com
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
    recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_clinic_user_id, 'authenticated', 'authenticated',
    'ryan@eyecliniclondon.com', v_password, now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('role', 'clinic', 'full_name', 'Ryan'),
    now(), now(), '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  values (
    gen_random_uuid(), v_clinic_user_id::text, v_clinic_user_id,
    jsonb_build_object('sub', v_clinic_user_id::text, 'email', 'ryan@eyecliniclondon.com'),
    'email', now(), now(), now()
  )
  on conflict do nothing;

  -- executive demo user: executive@eyecliniclondon.com
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
    recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_exec_user_id, 'authenticated', 'authenticated',
    'executive@eyecliniclondon.com', v_password, now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('role', 'executive', 'full_name', 'Alexandra Whitfield'),
    now(), now(), '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  values (
    gen_random_uuid(), v_exec_user_id::text, v_exec_user_id,
    jsonb_build_object('sub', v_exec_user_id::text, 'email', 'executive@eyecliniclondon.com'),
    'email', now(), now(), now()
  )
  on conflict do nothing;
end $$;

-- ---------------------------------------------------------------------------
-- notifications (assigned to the seeded demo users as recipients)
-- ---------------------------------------------------------------------------

insert into eclv2.notifications (recipient_id, message, category, is_read, created_at)
select p.id, n.message, n.category, n.is_read, n.created_at
from (values
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'New cataract referral received from Marylebone Independent Opticians.', 'Referral', false, now() - interval '10 minutes'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'Consultation booked for patient M.H.', 'Referral', false, now() - interval '1 hour'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'Treatment booking confirmed.', 'Referral', false, now() - interval '3 hours'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'Referral update available for J.P.', 'Referral', false, now() - interval '1 day'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'Dormant partner alert: Regent Street Optometry.', 'Partner', true, now() - interval '1 day'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'Partner milestone: 50 referrals this quarter.', 'Partner', true, now() - interval '2 days'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'New CPD registration interest.', 'Education', true, now() - interval '3 days'),
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'Practice requested patient leaflets.', 'Resource', true, now() - interval '4 days'),
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'Referral form saved as demo draft.', 'Referral', true, now() - interval '5 days'),
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'Education module completed.', 'Education', true, now() - interval '6 days')
) as n(recipient_ext_id, message, category, is_read, created_at)
join eclv2.profiles p on p.id = n.recipient_ext_id
on conflict do nothing;
