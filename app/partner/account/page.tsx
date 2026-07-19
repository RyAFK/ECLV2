"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Checkbox, Field, Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useLocalStorageState } from "@/lib/demo-storage";
import { RESOURCES } from "@/data/resources";
import { formatCurrency, formatDate, formatPercent, initials } from "@/lib/formatters";
import { useAuth } from "@/lib/supabase/auth-context";
import { useReferrals, usePartners } from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { ReferralStage } from "@/lib/types";

const TREATMENT_STAGES: ReferralStage[] = ["treatment-booked", "procedure-completed", "aftercare", "completed"];
const TERMINAL_STAGES: ReferralStage[] = ["completed", "closed", "lost"];

export default function PartnerAccountPage() {
  const { showToast } = useToast();
  const { profile, isConfigured, refreshProfile } = useAuth();
  const { referrals } = useReferrals();
  const { partners } = usePartners();
  const [favourites] = useLocalStorageState<string[]>("resource-favourites", []);
  const [prefs, setPrefs] = useLocalStorageState("notification-prefs", {
    emailUpdates: true,
    inAppNotifications: true,
    cpdInvites: true,
    dormantAlerts: false,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ displayName: "", practiceName: "", professionalRole: "", contactNumber: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const linkedPartner = useMemo(() => partners.find((p) => p.id === profile?.partner_id), [partners, profile]);

  const stats = useMemo(() => {
    const total = referrals.length;
    const active = referrals.filter((r) => !TERMINAL_STAGES.includes(r.stage)).length;
    const completed = referrals.filter((r) => r.stage === "completed").length;
    const treatmentBookings = referrals.filter((r) => TREATMENT_STAGES.includes(r.stage)).length;
    const conversion = total > 0 ? Math.round((treatmentBookings / total) * 100) : 0;
    const pathwayCounts = new Map<string, number>();
    referrals.forEach((r) => pathwayCounts.set(r.pathwayName, (pathwayCounts.get(r.pathwayName) ?? 0) + 1));
    let topPathway = "—";
    let topCount = 0;
    pathwayCounts.forEach((count, name) => {
      if (count > topCount) {
        topCount = count;
        topPathway = name;
      }
    });
    return { total, active, completed, conversion, treatmentBookings, topPathway };
  }, [referrals]);

  function togglePref(key: keyof typeof prefs) {
    setPrefs({ ...prefs, [key]: !prefs[key] });
    showToast({ variant: "success", title: "Preference updated", description: "Your demo notification setting has been saved." });
  }

  function openEdit() {
    if (!profile) return;
    setForm({
      displayName: profile.display_name,
      practiceName: profile.practice_name,
      professionalRole: profile.professional_role,
      contactNumber: profile.contact_number,
    });
    setFormError(null);
    setEditOpen(true);
  }

  async function handleSave() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setFormError("Supabase is not configured.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const { error } = await supabase.rpc("update_my_partner_profile", {
      p_display_name: form.displayName,
      p_practice_name: form.practiceName,
      p_professional_role: form.professionalRole,
      p_contact_number: form.contactNumber,
    });
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    await refreshProfile();
    setEditOpen(false);
    showToast({ variant: "success", title: "Profile updated" });
  }

  const displayName = profile?.display_name ?? "Referring Partner";
  const professionalRole = profile?.professional_role || "Referring partner";
  const practiceName = profile?.practice_name || linkedPartner?.name || "—";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Account</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Your referring-partner account details.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-semibold text-white">
                {initials(displayName)}
              </span>
              <div>
                <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{displayName}</p>
                <p className="text-sm text-[var(--text-secondary)]">{professionalRole}</p>
              </div>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="Practice" value={practiceName} />
              <Row label="Email" value={profile?.email ?? "—"} />
              <Row label="Contact" value={profile?.contact_number || "—"} />
              <Row label="Member since" value={profile ? formatDate(profile.member_since) : "—"} />
              <Row label="Relationship manager" value="Ryan" />
            </dl>
            {profile && isConfigured && (
              <Button variant="outline" size="sm" onClick={openEdit} className="mt-1 w-fit">
                Edit profile
              </Button>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral summary</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Total referrals" value={String(stats.total)} />
              <Stat label="Active" value={String(stats.active)} />
              <Stat label="Completed" value={String(stats.completed)} />
              <Stat label="Conversion" value={formatPercent(stats.conversion)} />
              <Stat label="Treatment bookings" value={String(stats.treatmentBookings)} />
              <Stat label="Most-referred pathway" value={stats.topPathway} />
            </div>
            <p className="mt-4 text-xs text-[var(--text-secondary)]">
              Figures reflect referrals linked to your practice only.
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Saved resources</p>
            {favourites.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">No favourites saved yet. Visit Practice resources to save materials.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {RESOURCES.filter((r) => favourites.includes(r.id)).map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                    <span className="text-[var(--text)]">{r.title}</span>
                    <Badge tone="neutral">{r.type}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Demo notification settings</p>
            <div className="mt-3 flex flex-col gap-3">
              <Checkbox label="Email-style demo notifications" checked={prefs.emailUpdates} onChange={() => togglePref("emailUpdates")} />
              <Checkbox label="In-app notifications" checked={prefs.inAppNotifications} onChange={() => togglePref("inAppNotifications")} />
              <Checkbox label="CPD and education invitations" checked={prefs.cpdInvites} onChange={() => togglePref("cpdInvites")} />
              <Checkbox label="Practice engagement summaries" checked={prefs.dormantAlerts} onChange={() => togglePref("dormantAlerts")} />
            </div>
          </CardBody>
        </Card>
      </div>

      {linkedPartner && (
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Portal activity</p>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Education views" value={String(linkedPartner.educationViews ?? 0)} />
              <Stat label="Resources downloaded" value={String(linkedPartner.resourcesDownloaded ?? 0)} />
              <Stat label="CPD attendance" value={String(linkedPartner.cpdAttendance ?? 0)} />
              <Stat label="Estimated value" value={formatCurrency(linkedPartner.estimatedValue)} />
            </div>
          </CardBody>
        </Card>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <div className="flex flex-col gap-4">
          <Field label="Full name" htmlFor="edit-display-name" required>
            <Input id="edit-display-name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </Field>
          <Field label="Email address" htmlFor="edit-email" hint="Read-only">
            <Input id="edit-email" value={profile?.email ?? ""} disabled readOnly />
          </Field>
          <Field label="Practice name" htmlFor="edit-practice" required>
            <Input id="edit-practice" value={form.practiceName} onChange={(e) => setForm({ ...form, practiceName: e.target.value })} />
          </Field>
          <Field label="Professional role" htmlFor="edit-role" required>
            <Input id="edit-role" value={form.professionalRole} onChange={(e) => setForm({ ...form, professionalRole: e.target.value })} />
          </Field>
          <Field label="Contact number" htmlFor="edit-contact" required>
            <Input id="edit-contact" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          </Field>
          {formError && <p className="text-sm text-[var(--danger)]">{formError}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--text-secondary)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--text)]">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-serif-display text-xl font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}
