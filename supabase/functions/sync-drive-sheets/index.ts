// ECLV2 Google Drive Excel -> Supabase sync
//
// Mechanism: a Supabase Edge Function (Deno), triggered on a schedule by
// pg_cron + pg_net (see supabase/migrations/20260719000006_eclv2_sync_cron.sql).
// It is NOT a browser-callable endpoint for end users - it requires a shared
// secret (SYNC_TRIGGER_SECRET) that only the cron job and operators know, and it
// uses the Supabase service-role key that Supabase injects automatically into
// every Edge Function's environment (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).
// That key is never sent to, or reachable from, browser code - see
// docs/GOOGLE_DRIVE_SYNC.md for the full write-up.
//
// Flow: authenticate to Google as a service account -> list spreadsheet files in
// the configured Drive folder -> download/export each as .xlsx -> parse with
// SheetJS -> for each recognised sheet name, map header row -> eclv2 columns ->
// validate each row -> upsert by external_id -> record one eclv2.sync_runs row
// per invocation with aggregate inserted/updated/skipped/error counts.

import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";
import { SignJWT, importPKCS8 } from "npm:jose@5";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GOOGLE_DRIVE_FOLDER_ID = Deno.env.get("GOOGLE_DRIVE_FOLDER_ID") ?? "1YtRERWNF2NUmeThWN2pSv93ugIcwSPSX";
const SYNC_TRIGGER_SECRET = Deno.env.get("SYNC_TRIGGER_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GOOGLE_MIME_SHEET = "application/vnd.google-apps.spreadsheet";
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** Sheet-tab name (case/space-insensitive) -> eclv2 table. Matched against each tab in every workbook found. */
const SHEET_TABLE_MAP: Record<string, "partners" | "referrals" | "tasks" | "updates"> = {
  partners: "partners",
  "referring partners": "partners",
  referrals: "referrals",
  tasks: "tasks",
  "bdm tasks": "tasks",
  updates: "updates",
  "news and updates": "updates",
};

/** Column header aliases accepted per target column, matched case/space-insensitively against the header row. */
const COLUMN_ALIASES: Record<string, Record<string, string[]>> = {
  partners: {
    external_id: ["external id", "partner id", "id"],
    name: ["practice name", "name", "partner name"],
    category: ["category", "partner category"],
    professional: ["professional", "contact name"],
    role: ["role", "job title"],
    location: ["location"],
    referrals_count: ["referrals", "referral count"],
    consultations_count: ["consultations", "consultation count"],
    treatment_bookings_count: ["treatment bookings", "treatment booking count"],
    conversion: ["conversion", "conversion %", "conversion rate"],
    estimated_value: ["estimated value", "est. value", "est. value (£)"],
    last_referral_date: ["last referral date"],
    last_contacted_date: ["last contacted date"],
    last_login_date: ["last login date"],
    relationship_status: ["relationship status", "status"],
    owner: ["owner", "bdm owner"],
    engagement_score: ["engagement score"],
    most_viewed_tab: ["most viewed tab"],
    resources_downloaded: ["resources downloaded"],
    education_views: ["education views"],
    cpd_attendance: ["cpd attendance"],
  },
  referrals: {
    external_id: ["external id", "referral id", "id"],
    reference: ["reference", "reference number"],
    patient_label: ["patient label", "patient"],
    pathway_id: ["pathway id"],
    pathway_name: ["pathway name", "pathway"],
    reason: ["reason", "referral reason"],
    referral_date: ["referral date"],
    stage: ["stage", "status"],
    consultant: ["consultant"],
    appointment_date: ["appointment date"],
    last_update: ["last update", "last updated"],
    partner_external_id: ["partner external id", "partner id"],
    professional_name: ["professional name", "referring professional"],
    practice_location: ["practice location"],
    estimated_value: ["estimated value", "est. value"],
    owner: ["owner"],
    next_action: ["next action"],
    conversion_probability: ["conversion probability"],
    highlight_context: ["highlight context", "highlight"],
  },
  tasks: {
    external_id: ["external id", "task id", "id"],
    title: ["title", "task title"],
    reason: ["reason"],
    due_date: ["due date"],
    priority: ["priority"],
    partner_external_id: ["partner external id", "partner id"],
    partner_name: ["partner name"],
    completed: ["completed"],
  },
  updates: {
    external_id: ["external id", "update id", "id"],
    title: ["title"],
    description: ["description"],
    publish_date: ["publish date", "date"],
    category: ["category"],
    audience: ["audience"],
  },
};

const REFERRAL_STAGES = new Set([
  "new", "awaiting-contact", "contacted", "triage", "consultation-booked", "consultation-completed",
  "treatment-recommended", "treatment-booked", "procedure-completed", "aftercare", "completed", "closed", "lost",
]);
const PARTNER_CATEGORIES = new Set(["Independent optometry", "Optometry group", "Private GP", "Corporate healthcare", "Ophthalmology"]);
const RELATIONSHIP_STATUSES = new Set(["Strategic", "Active", "Developing", "New", "Dormant", "At risk"]);
const PRIORITIES = new Set(["High", "Medium", "Low"]);
const CONVERSION_PROBABILITIES = new Set(["High", "Medium", "Low"]);
const UPDATE_CATEGORIES = new Set(["Clinic update", "Education", "CPD", "Services", "Partner resources", "Case study"]);
const UPDATE_AUDIENCES = new Set(["all", "partner", "clinic"]);

interface SyncError {
  file: string;
  sheet: string;
  row: number;
  message: string;
}

interface Counters {
  inserted: number;
  updated: number;
  skipped: number;
  errors: SyncError[];
}

// ---------------------------------------------------------------------------
// Google auth
// ---------------------------------------------------------------------------

async function getGoogleAccessToken(): Promise<string> {
  const raw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON secret is not set");
  const creds = JSON.parse(raw) as { client_email: string; private_key: string };

  const privateKey = await importPKCS8(creds.private_key, "RS256");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/drive.readonly",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(creds.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

async function listDriveFiles(accessToken: string): Promise<DriveFile[]> {
  const q = encodeURIComponent(
    `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false and (mimeType = '${GOOGLE_MIME_SHEET}' or mimeType = '${XLSX_MIME}')`
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType)&pageSize=100`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Drive files.list failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { files: DriveFile[] };
  return json.files ?? [];
}

async function downloadWorkbook(accessToken: string, file: DriveFile): Promise<XLSX.WorkBook> {
  const url =
    file.mimeType === GOOGLE_MIME_SHEET
      ? `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=${encodeURIComponent(XLSX_MIME)}`
      : `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Drive download failed for ${file.name}: ${res.status} ${await res.text()}`);
  const buffer = await res.arrayBuffer();
  return XLSX.read(buffer, { type: "array", cellDates: true });
}

// ---------------------------------------------------------------------------
// Row parsing helpers
// ---------------------------------------------------------------------------

function normaliseHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Builds header-name -> column-key lookup for one sheet's header row, using COLUMN_ALIASES. */
function buildHeaderMap(headerRow: unknown[], table: string): Map<number, string> {
  const aliases = COLUMN_ALIASES[table];
  const map = new Map<number, string>();
  headerRow.forEach((cell, index) => {
    if (typeof cell !== "string") return;
    const normalised = normaliseHeader(cell);
    for (const [column, names] of Object.entries(aliases)) {
      if (names.includes(normalised)) {
        map.set(index, column);
        break;
      }
    }
  });
  return map;
}

function cellToRecord(row: unknown[], headerMap: Map<number, string>): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  headerMap.forEach((column, index) => {
    const value = row[index];
    if (value === undefined || value === null || value === "") return; // blank cell -> omit, never overwrite with blank
    record[column] = value;
  });
  return record;
}

function parseDateCell(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") {
    const trimmed = value.trim();
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (iso) return trimmed;
    const uk = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (uk) {
      const [, d, m, y] = uk;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return null; // unparseable
  }
  return null;
}

function parseBoolCell(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  const s = String(value).trim().toLowerCase();
  if (["true", "yes", "y", "1"].includes(s)) return true;
  if (["false", "no", "n", "0"].includes(s)) return false;
  return undefined;
}

function parseNumberCell(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Heuristic guard against accidental real patient PII landing in patient_label (must stay a de-identified label). */
function looksLikePatientPII(label: string): boolean {
  if (label.length > 60) return true;
  if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(label)) return true; // looks like a DOB
  if (/\b\d{6,}\b/.test(label)) return true; // looks like an NHS/ID number
  return false;
}

// ---------------------------------------------------------------------------
// Per-table processors
// ---------------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

async function processPartnersSheet(
  supabase: SupabaseClient,
  rows: unknown[][],
  fileName: string,
  sheetName: string,
  counters: Counters
) {
  if (rows.length === 0) return;
  const headerMap = buildHeaderMap(rows[0], "partners");
  for (let i = 1; i < rows.length; i++) {
    const rowNumber = i + 1;
    const raw = cellToRecord(rows[i], headerMap);
    if (Object.keys(raw).length === 0) continue; // fully blank row

    if (!raw.external_id || !raw.name) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: "Missing required external_id or name" });
      continue;
    }
    if (raw.category && !PARTNER_CATEGORIES.has(String(raw.category))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised category "${raw.category}"` });
      continue;
    }
    if (raw.relationship_status && !RELATIONSHIP_STATUSES.has(String(raw.relationship_status))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised relationship_status "${raw.relationship_status}"` });
      continue;
    }

    const payload: Record<string, unknown> = { external_id: String(raw.external_id), name: String(raw.name) };
    if (raw.category) payload.category = raw.category;
    if (raw.professional) payload.professional = raw.professional;
    if (raw.role) payload.role = raw.role;
    if (raw.location) payload.location = raw.location;
    if (raw.referrals_count !== undefined) payload.referrals_count = parseNumberCell(raw.referrals_count);
    if (raw.consultations_count !== undefined) payload.consultations_count = parseNumberCell(raw.consultations_count);
    if (raw.treatment_bookings_count !== undefined) payload.treatment_bookings_count = parseNumberCell(raw.treatment_bookings_count);
    if (raw.conversion !== undefined) payload.conversion = parseNumberCell(raw.conversion);
    if (raw.estimated_value !== undefined) payload.estimated_value = parseNumberCell(raw.estimated_value);
    if (raw.relationship_status) payload.relationship_status = raw.relationship_status;
    if (raw.owner) payload.owner = raw.owner;
    if (raw.engagement_score !== undefined) payload.engagement_score = parseNumberCell(raw.engagement_score);
    if (raw.most_viewed_tab) payload.most_viewed_tab = raw.most_viewed_tab;
    if (raw.resources_downloaded !== undefined) payload.resources_downloaded = parseNumberCell(raw.resources_downloaded);
    if (raw.education_views !== undefined) payload.education_views = parseNumberCell(raw.education_views);
    if (raw.cpd_attendance !== undefined) payload.cpd_attendance = parseNumberCell(raw.cpd_attendance);

    for (const dateCol of ["last_referral_date", "last_contacted_date", "last_login_date"] as const) {
      if (raw[dateCol] !== undefined) {
        const parsed = parseDateCell(raw[dateCol]);
        if (parsed === null) {
          counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unparseable date in ${dateCol}: "${raw[dateCol]}"` });
        } else {
          payload[dateCol] = parsed;
        }
      }
    }

    const { data: existing } = await supabase.from("partners").select("id").eq("external_id", payload.external_id).maybeSingle();
    const { error } = await supabase.from("partners").upsert(payload, { onConflict: "external_id" });
    if (error) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: error.message });
    } else if (existing) {
      counters.updated++;
    } else {
      counters.inserted++;
    }
  }
}

async function processReferralsSheet(
  supabase: SupabaseClient,
  rows: unknown[][],
  fileName: string,
  sheetName: string,
  counters: Counters
) {
  if (rows.length === 0) return;
  const headerMap = buildHeaderMap(rows[0], "referrals");
  for (let i = 1; i < rows.length; i++) {
    const rowNumber = i + 1;
    const raw = cellToRecord(rows[i], headerMap);
    if (Object.keys(raw).length === 0) continue;

    if (!raw.external_id || !raw.reference || !raw.patient_label || !raw.pathway_id || !raw.partner_external_id) {
      counters.skipped++;
      counters.errors.push({
        file: fileName, sheet: sheetName, row: rowNumber,
        message: "Missing required field (external_id, reference, patient_label, pathway_id, or partner_external_id)",
      });
      continue;
    }
    if (looksLikePatientPII(String(raw.patient_label))) {
      counters.skipped++;
      counters.errors.push({
        file: fileName, sheet: sheetName, row: rowNumber,
        message: "patient_label looks like it may contain real patient PII (full name/DOB/ID number) - row skipped for manual review, not imported",
      });
      continue;
    }
    if (raw.stage && !REFERRAL_STAGES.has(String(raw.stage))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised stage "${raw.stage}"` });
      continue;
    }
    if (raw.conversion_probability && !CONVERSION_PROBABILITIES.has(String(raw.conversion_probability))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised conversion_probability "${raw.conversion_probability}"` });
      continue;
    }

    const { data: partner } = await supabase.from("partners").select("id").eq("external_id", String(raw.partner_external_id)).maybeSingle();
    if (!partner) {
      counters.skipped++;
      counters.errors.push({
        file: fileName, sheet: sheetName, row: rowNumber,
        message: `partner_external_id "${raw.partner_external_id}" does not match any synced partner - sync partners before referrals`,
      });
      continue;
    }

    const payload: Record<string, unknown> = {
      external_id: String(raw.external_id),
      reference: String(raw.reference),
      patient_label: String(raw.patient_label),
      pathway_id: String(raw.pathway_id),
      partner_id: partner.id,
    };
    if (raw.pathway_name) payload.pathway_name = raw.pathway_name;
    if (raw.reason) payload.reason = raw.reason;
    if (raw.stage) payload.stage = raw.stage;
    if (raw.consultant) payload.consultant = raw.consultant;
    if (raw.professional_name) payload.professional_name = raw.professional_name;
    if (raw.practice_location) payload.practice_location = raw.practice_location;
    if (raw.estimated_value !== undefined) payload.estimated_value = parseNumberCell(raw.estimated_value);
    if (raw.owner) payload.owner = raw.owner;
    if (raw.next_action) payload.next_action = raw.next_action;
    if (raw.conversion_probability) payload.conversion_probability = raw.conversion_probability;
    if (raw.highlight_context) payload.highlight_context = raw.highlight_context;

    let dateError = false;
    for (const dateCol of ["referral_date", "appointment_date", "last_update"] as const) {
      if (raw[dateCol] !== undefined) {
        const parsed = parseDateCell(raw[dateCol]);
        if (parsed === null) {
          counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unparseable date in ${dateCol}: "${raw[dateCol]}"` });
          if (dateCol === "referral_date") dateError = true;
        } else {
          payload[dateCol] = parsed;
        }
      }
    }
    if (dateError) {
      counters.skipped++;
      continue;
    }

    const { data: existing } = await supabase.from("referrals").select("id").eq("external_id", payload.external_id).maybeSingle();
    const { error } = await supabase.from("referrals").upsert(payload, { onConflict: "external_id" });
    if (error) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: error.message });
    } else if (existing) {
      counters.updated++;
    } else {
      counters.inserted++;
    }
  }
}

async function processTasksSheet(
  supabase: SupabaseClient,
  rows: unknown[][],
  fileName: string,
  sheetName: string,
  counters: Counters
) {
  if (rows.length === 0) return;
  const headerMap = buildHeaderMap(rows[0], "tasks");
  for (let i = 1; i < rows.length; i++) {
    const rowNumber = i + 1;
    const raw = cellToRecord(rows[i], headerMap);
    if (Object.keys(raw).length === 0) continue;

    if (!raw.external_id || !raw.title) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: "Missing required external_id or title" });
      continue;
    }
    if (raw.priority && !PRIORITIES.has(String(raw.priority))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised priority "${raw.priority}"` });
      continue;
    }

    const payload: Record<string, unknown> = { external_id: String(raw.external_id), title: String(raw.title) };
    if (raw.reason) payload.reason = raw.reason;
    if (raw.priority) payload.priority = raw.priority;
    if (raw.partner_name) payload.partner_name = raw.partner_name;
    const completed = parseBoolCell(raw.completed);
    if (completed !== undefined) payload.completed = completed;

    if (raw.partner_external_id) {
      const { data: partner } = await supabase.from("partners").select("id").eq("external_id", String(raw.partner_external_id)).maybeSingle();
      if (partner) payload.partner_id = partner.id;
      else counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `partner_external_id "${raw.partner_external_id}" not found (task imported without partner link)` });
    }

    if (raw.due_date !== undefined) {
      const parsed = parseDateCell(raw.due_date);
      if (parsed === null) counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unparseable date in due_date: "${raw.due_date}"` });
      else payload.due_date = parsed;
    }

    const { data: existing } = await supabase.from("tasks").select("id").eq("external_id", payload.external_id).maybeSingle();
    const { error } = await supabase.from("tasks").upsert(payload, { onConflict: "external_id" });
    if (error) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: error.message });
    } else if (existing) {
      counters.updated++;
    } else {
      counters.inserted++;
    }
  }
}

async function processUpdatesSheet(
  supabase: SupabaseClient,
  rows: unknown[][],
  fileName: string,
  sheetName: string,
  counters: Counters
) {
  if (rows.length === 0) return;
  const headerMap = buildHeaderMap(rows[0], "updates");
  for (let i = 1; i < rows.length; i++) {
    const rowNumber = i + 1;
    const raw = cellToRecord(rows[i], headerMap);
    if (Object.keys(raw).length === 0) continue;

    if (!raw.external_id || !raw.title) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: "Missing required external_id or title" });
      continue;
    }
    if (raw.category && !UPDATE_CATEGORIES.has(String(raw.category))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised category "${raw.category}"` });
      continue;
    }
    if (raw.audience && !UPDATE_AUDIENCES.has(String(raw.audience))) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unrecognised audience "${raw.audience}"` });
      continue;
    }

    const payload: Record<string, unknown> = { external_id: String(raw.external_id), title: String(raw.title) };
    if (raw.description) payload.description = raw.description;
    if (raw.category) payload.category = raw.category;
    if (raw.audience) payload.audience = raw.audience;
    if (raw.publish_date !== undefined) {
      const parsed = parseDateCell(raw.publish_date);
      if (parsed === null) counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: `Unparseable date in publish_date: "${raw.publish_date}"` });
      else payload.publish_date = parsed;
    }

    const { data: existing } = await supabase.from("updates").select("id").eq("external_id", payload.external_id).maybeSingle();
    const { error } = await supabase.from("updates").upsert(payload, { onConflict: "external_id" });
    if (error) {
      counters.skipped++;
      counters.errors.push({ file: fileName, sheet: sheetName, row: rowNumber, message: error.message });
    } else if (existing) {
      counters.updated++;
    } else {
      counters.inserted++;
    }
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (!SYNC_TRIGGER_SECRET) {
    return new Response(JSON.stringify({ error: "SYNC_TRIGGER_SECRET is not configured on the function" }), { status: 500 });
  }
  const providedSecret = req.headers.get("x-sync-secret");
  if (providedSecret !== SYNC_TRIGGER_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { db: { schema: "eclv2" } });

  const { data: run, error: runError } = await supabase
    .from("sync_runs")
    .insert({ source: "google_drive_excel", status: "running", triggered_by: req.headers.get("x-triggered-by") ?? "schedule" })
    .select()
    .single();
  if (runError || !run) {
    return new Response(JSON.stringify({ error: `Failed to create sync_runs row: ${runError?.message}` }), { status: 500 });
  }

  const counters: Counters = { inserted: 0, updated: 0, skipped: 0, errors: [] };
  const processedFileNames: string[] = [];

  try {
    const accessToken = await getGoogleAccessToken();
    const files = await listDriveFiles(accessToken);

    for (const file of files) {
      processedFileNames.push(file.name);
      let workbook: XLSX.WorkBook;
      try {
        workbook = await downloadWorkbook(accessToken, file);
      } catch (e) {
        counters.errors.push({ file: file.name, sheet: "", row: 0, message: `Download/parse failed: ${(e as Error).message}` });
        continue;
      }

      for (const sheetName of workbook.SheetNames) {
        const table = SHEET_TABLE_MAP[normaliseHeader(sheetName)];
        if (!table) continue; // unrecognised tab name - skip silently, it's not one of ours
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, dateNF: "yyyy-mm-dd" });

        if (table === "partners") await processPartnersSheet(supabase, rows, file.name, sheetName, counters);
        else if (table === "referrals") await processReferralsSheet(supabase, rows, file.name, sheetName, counters);
        else if (table === "tasks") await processTasksSheet(supabase, rows, file.name, sheetName, counters);
        else if (table === "updates") await processUpdatesSheet(supabase, rows, file.name, sheetName, counters);
      }
    }

    const status = counters.errors.length === 0 ? "success" : counters.inserted + counters.updated > 0 ? "partial" : "failed";
    await supabase
      .from("sync_runs")
      .update({
        finished_at: new Date().toISOString(),
        status,
        inserted_count: counters.inserted,
        updated_count: counters.updated,
        skipped_count: counters.skipped,
        error_count: counters.errors.length,
        errors: counters.errors,
        file_name: processedFileNames.join(", ") || null,
      })
      .eq("id", run.id);

    return new Response(JSON.stringify({ run_id: run.id, status, ...counters }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = (e as Error).message;
    await supabase
      .from("sync_runs")
      .update({
        finished_at: new Date().toISOString(),
        status: "failed",
        inserted_count: counters.inserted,
        updated_count: counters.updated,
        skipped_count: counters.skipped,
        error_count: counters.errors.length + 1,
        errors: [...counters.errors, { file: "", sheet: "", row: 0, message }],
        file_name: processedFileNames.join(", ") || null,
      })
      .eq("id", run.id);

    return new Response(JSON.stringify({ run_id: run.id, status: "failed", error: message }), { status: 500 });
  }
});
