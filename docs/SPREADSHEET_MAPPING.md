# Spreadsheet → Supabase column mapping

**Status: proposed convention, not yet confirmed against the real spreadsheets.**
This implementation never obtained access to the Google Drive folder's contents
(no Google credentials were available), so the sheet-tab names, header names, and
value formats below are a reasonable convention inferred from the ECLV2 app's own
data model — not a mapping verified against the actual files. Before the sync is
relied on for real data, an operator with Drive access should open each
spreadsheet and confirm the tab names and header row match this document, or
update `SHEET_TABLE_MAP` / `COLUMN_ALIASES` in
`supabase/functions/sync-drive-sheets/index.ts` to match reality.

## How matching works

- **Sheet (tab) name** selects the target table, matched case/whitespace-insensitively
  against `SHEET_TABLE_MAP`. Any tab whose name isn't recognised is skipped
  entirely (not an error — lets a workbook carry extra notes/reference tabs).
- **Header row** (row 1 of each recognised tab) selects target columns via
  `COLUMN_ALIASES` — several header spellings are accepted per column (also
  case/whitespace-insensitive) so minor naming differences don't break the import.
- Any header not listed below is **ignored**, not an error — extra spreadsheet
  columns are safe to keep.
- A blank cell is **never** written — it's omitted from the upsert entirely, so it
  can't blank out an existing database value. To intentionally clear a field, that
  needs a direct database update, not a blank spreadsheet cell.

## `Partners` tab → `eclv2.partners`

| Accepted header(s) | Column | Required | Validation |
|---|---|---|---|
| External ID / Partner ID / ID | `external_id` | **Yes** | stable, unique upsert key |
| Practice Name / Name / Partner Name | `name` | **Yes** | — |
| Category / Partner Category | `category` | No | must be one of: Independent optometry, Optometry group, Private GP, Corporate healthcare, Ophthalmology |
| Professional / Contact Name | `professional` | No | — |
| Role / Job Title | `role` | No | — |
| Location | `location` | No | — |
| Referrals / Referral Count | `referrals_count` | No | numeric |
| Consultations / Consultation Count | `consultations_count` | No | numeric |
| Treatment Bookings / Treatment Booking Count | `treatment_bookings_count` | No | numeric |
| Conversion / Conversion % / Conversion Rate | `conversion` | No | numeric |
| Estimated Value / Est. Value / Est. Value (£) | `estimated_value` | No | numeric |
| Last Referral Date | `last_referral_date` | No | date, `YYYY-MM-DD` or `DD/MM/YYYY` |
| Last Contacted Date | `last_contacted_date` | No | date |
| Last Login Date | `last_login_date` | No | date |
| Relationship Status / Status | `relationship_status` | No | one of: Strategic, Active, Developing, New, Dormant, At risk |
| Owner / BDM Owner | `owner` | No | — |
| Engagement Score | `engagement_score` | No | numeric |
| Most Viewed Tab | `most_viewed_tab` | No | — |
| Resources Downloaded | `resources_downloaded` | No | numeric |
| Education Views | `education_views` | No | numeric |
| CPD Attendance | `cpd_attendance` | No | numeric |

## `Referrals` tab → `eclv2.referrals`

| Accepted header(s) | Column | Required | Validation |
|---|---|---|---|
| External ID / Referral ID / ID | `external_id` | **Yes** | stable, unique upsert key |
| Reference / Reference Number | `reference` | **Yes** | must be unique |
| Patient Label / Patient | `patient_label` | **Yes** | **must already be de-identified** (e.g. "Margaret H.") — rows that look like they contain a full name + DOB, or an NHS/ID-style number, are rejected rather than imported (see "Ambiguous/sensitive fields" below) |
| Pathway ID | `pathway_id` | **Yes** | should match a known pathway id (`cataract`, `laser-vision`, etc.) — unrecognised values are still imported but flagged |
| Pathway Name / Pathway | `pathway_name` | No | — |
| Reason / Referral Reason | `reason` | No | — |
| Referral Date | `referral_date` | No | date |
| Stage / Status | `stage` | No | one of the 13 `ReferralStage` values (`new`, `awaiting-contact`, ... `lost`) |
| Consultant | `consultant` | No | — |
| Appointment Date | `appointment_date` | No | date |
| Last Update / Last Updated | `last_update` | No | date |
| Partner External ID / Partner ID | resolved to `partner_id` | **Yes** | must match an already-synced partner's `external_id` — **sync the Partners tab first** |
| Professional Name / Referring Professional | `professional_name` | No | — |
| Practice Location | `practice_location` | No | — |
| Estimated Value / Est. Value | `estimated_value` | No | numeric |
| Owner | `owner` | No | — |
| Next Action | `next_action` | No | — |
| Conversion Probability | `conversion_probability` | No | High / Medium / Low |
| Highlight Context / Highlight | `highlight_context` | No | — |

## `Tasks` tab → `eclv2.tasks`

| Accepted header(s) | Column | Required | Validation |
|---|---|---|---|
| External ID / Task ID / ID | `external_id` | **Yes** | stable, unique upsert key |
| Title / Task Title | `title` | **Yes** | — |
| Reason | `reason` | No | — |
| Due Date | `due_date` | No | date |
| Priority | `priority` | No | High / Medium / Low |
| Partner External ID / Partner ID | resolved to `partner_id` | No | logged (not fatal) if it doesn't match a synced partner |
| Partner Name | `partner_name` | No | display fallback if the link above isn't resolvable |
| Completed | `completed` | No | TRUE/FALSE, Yes/No, 1/0 |

## `Updates` tab → `eclv2.updates`

| Accepted header(s) | Column | Required | Validation |
|---|---|---|---|
| External ID / Update ID / ID | `external_id` | **Yes** | stable, unique upsert key |
| Title | `title` | **Yes** | — |
| Description | `description` | No | — |
| Publish Date / Date | `publish_date` | No | date |
| Category | `category` | No | Clinic update / Education / CPD / Services / Partner resources / Case study |
| Audience | `audience` | No | `all` / `partner` / `clinic` (defaults to `all`) |

## Missing / ambiguous columns pending confirmation

These decisions were made without access to the real spreadsheets and should be
reviewed once they're available:

1. **Tab names.** `SHEET_TABLE_MAP` currently recognises "Partners"/"Referring
   Partners", "Referrals", "Tasks"/"BDM Tasks", "Updates"/"News and Updates". If
   the real workbook(s) use different tab names, add them to that map.
2. **`patient_label` de-identification.** The app's data model (and the RLS design
   protecting `eclv2.referrals`) assumes this column holds a short, already
   de-identified label, not real patient PII. The sync **actively rejects** rows
   where the cell looks like it might contain a full name + DOB or a long ID
   number, logging them to `sync_runs.errors` instead of importing — this needs a
   human to confirm the real spreadsheet's convention here before trusting it
   blind, since importing real, unredacted patient identifiers into this table
   would be a correctness and compliance problem this implementation could not
   silently guess its way around.
3. **Multiple workbooks vs. one workbook with four tabs.** The function handles
   either — it scans every spreadsheet file in the folder and every tab within
   each — but doesn't know which layout the real folder actually uses.
4. **Date format.** Both ISO (`YYYY-MM-DD`) and UK (`DD/MM/YYYY`) are accepted;
   native Google Sheets date cells are also handled. Any other format is
   rejected with an error rather than guessed.
5. **`pathway_id` vocabulary.** Referrals sync even when `pathway_id` doesn't
   match a known value (so a new pathway type doesn't block the whole row), but
   the UI's pathway-name lookups assume the `PathwayId` union in `lib/types.ts` —
   an unrecognised id will still display, just without pathway-specific styling.
