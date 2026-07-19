"use client";

import { use, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, CalendarClock, ClipboardList, Share2, Pencil } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePartners, useReferrals } from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Field";
import { RelationshipStatusBadge } from "@/components/referrals/StatusBadge";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { tooltipContent } from "@/components/charts/ChartTooltip";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "@/components/charts/theme";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatPercent, daysAgoLabel } from "@/lib/formatters";
import { MONTHLY_REFERRAL_TREND } from "@/data/analytics";

const RECENT_ACTIVITY = [
  "Referral received",
  "Practice meeting completed",
  "Cataract guide shared",
  "CPD invitation sent",
  "Refractive presentation delivered",
  "Follow-up call completed",
  "Patient leaflet request received",
];

interface LinkedProfile {
  display_name: string;
  professional_role: string;
  contact_number: string;
  email: string;
}

export default function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { partners, loading: partnersLoading } = usePartners();
  const { referrals } = useReferrals();
  const { showToast } = useToast();

  const partner = useMemo(() => partners.find((p) => p.id === id), [partners, id]);
  const partnerReferrals = useMemo(() => referrals.filter((r) => r.partnerId === id), [referrals, id]);

  const [linkedProfile, setLinkedProfile] = useState<LinkedProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ displayName: "", practiceName: "", professionalRole: "", contactNumber: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, professional_role, contact_number, email")
        .eq("partner_id", id)
        .eq("portal_role", "partner")
        .maybeSingle();
      if (!cancelled) setLinkedProfile(data as LinkedProfile | null);
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (partnersLoading && !partner) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!partner) notFound();

  const trendData = MONTHLY_REFERRAL_TREND.map((m, i) => ({ month: m.month, referrals: Math.max(0, Math.round(partner.referrals * (0.4 + i * 0.1))) }));

  function simulate(title: string, description: string) {
    showToast({ variant: "success", title, description });
  }

  function openEdit() {
    setForm({
      displayName: linkedProfile?.display_name ?? partner!.professional,
      practiceName: partner!.name,
      professionalRole: linkedProfile?.professional_role ?? partner!.role,
      contactNumber: linkedProfile?.contact_number ?? "",
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
    const { error } = await supabase.rpc("admin_update_partner_profile", {
      p_target_partner_id: id,
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
    setLinkedProfile({
      display_name: form.displayName,
      professional_role: form.professionalRole,
      contact_number: form.contactNumber,
      email: linkedProfile?.email ?? "",
    });
    setEditOpen(false);
    showToast({ variant: "success", title: "Partner profile updated" });
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/clinic/partners" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]">
        <ArrowLeft className="h-4 w-4" />
        Back to partners
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RelationshipStatusBadge status={partner.relationshipStatus} />
            <span className="text-xs text-[var(--text-secondary)]">{partner.category}</span>
          </div>
          <h1 className="mt-2 font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">{partner.name}</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {partner.professional} · {partner.role} · {partner.location}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Relationship owner: {partner.owner}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {linkedProfile && (
            <Button variant="outline" size="sm" onClick={openEdit}>
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => simulate("Task created", `A follow-up task has been created for ${partner.name}.`)}>
            <ClipboardList className="h-4 w-4" />
            Create task
          </Button>
          <Button variant="outline" size="sm" onClick={() => simulate("Call logged", `A call with ${partner.professional} has been logged.`)}>
            <Phone className="h-4 w-4" />
            Log call
          </Button>
          <Button variant="outline" size="sm" onClick={() => simulate("Demo email sent", `An email has been sent to ${partner.professional} (simulation).`)}>
            <Mail className="h-4 w-4" />
            Send demo email
          </Button>
          <Button variant="outline" size="sm" onClick={() => simulate("Meeting booked", `A meeting with ${partner.name} has been booked.`)}>
            <CalendarClock className="h-4 w-4" />
            Book meeting
          </Button>
          <Button variant="outline" size="sm" onClick={() => simulate("Resource shared", `A resource has been shared with ${partner.name}.`)}>
            <Share2 className="h-4 w-4" />
            Share resource
          </Button>
        </div>
      </div>

      {linkedProfile && (
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Linked partner account</p>
            <dl className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Full name</dt>
                <dd className="mt-1 text-sm font-medium text-[var(--text)]">{linkedProfile.display_name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Email (read-only)</dt>
                <dd className="mt-1 text-sm font-medium text-[var(--text)]">{linkedProfile.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Contact number</dt>
                <dd className="mt-1 text-sm font-medium text-[var(--text)]">{linkedProfile.contact_number || "—"}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Referrals" value={String(partner.referrals)} />
        <Stat label="Consultations" value={String(partner.consultations)} />
        <Stat label="Treatment bookings" value={String(partner.treatmentBookings)} />
        <Stat label="Conversion" value={formatPercent(partner.conversion)} />
        <Stat label="Estimated value" value={formatCurrency(partner.estimatedValue)} />
        <Stat label="Last referral" value={daysAgoLabel(partner.lastReferralDaysAgo)} />
        <Stat label="Last portal login" value={daysAgoLabel(partner.lastLoginDaysAgo)} />
        <Stat label="Engagement score" value={`${partner.engagementScore}/100`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral trend</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Line type="monotone" dataKey="referrals" name="Referrals" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Portal engagement</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <EngagementRow label="Most-viewed tab" value={partner.mostViewedTab ?? "—"} />
              <EngagementRow label="Education content views" value={String(partner.educationViews ?? 0)} />
              <EngagementRow label="Resources downloaded" value={String(partner.resourcesDownloaded ?? 0)} />
              <EngagementRow label="CPD attendance" value={String(partner.cpdAttendance ?? 0)} />
            </ul>
          </CardBody>
        </Card>
      </div>

      <InsightCard
        title="Growth opportunity"
        headline="Discuss a structured cataract and refractive information pathway for suitable patients and offer an in-practice education session."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Recent activity</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
              {RECENT_ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {a}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Relationship notes</p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {partner.relationshipStatus === "Dormant"
                ? "No referral activity recorded recently. A relationship check-in is recommended."
                : `${partner.professional} has been a consistently engaged referring professional. Continue nurturing this relationship with regular updates.`}
            </p>
          </CardBody>
        </Card>
      </div>

      <div>
        <p className="mb-3 font-serif-display text-lg font-semibold text-[var(--text)]">Referrals from this partner</p>
        {partnerReferrals.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No referrals recorded for this partner yet.</p>
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Reference</TH>
                <TH>Patient</TH>
                <TH>Pathway</TH>
                <TH>Stage</TH>
                <TH className="text-right">Est. value</TH>
              </tr>
            </THead>
            <TBody>
              {partnerReferrals.map((r) => (
                <TR key={r.id}>
                  <TD className="text-[var(--text-secondary)]">{r.reference}</TD>
                  <TD className="font-medium">{r.patientLabel}</TD>
                  <TD>{r.pathwayName}</TD>
                  <TD>
                    <ReferralStatusBadge stage={r.stage} />
                  </TD>
                  <TD className="text-right">{formatCurrency(r.estimatedValue)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit partner profile" description={partner.name}>
        <div className="flex flex-col gap-4">
          <Field label="Full name" htmlFor="admin-edit-name" required>
            <Input id="admin-edit-name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </Field>
          <Field label="Email address" htmlFor="admin-edit-email" hint="Read-only — email changes require a separate verified workflow">
            <Input id="admin-edit-email" value={linkedProfile?.email ?? ""} disabled readOnly />
          </Field>
          <Field label="Practice name" htmlFor="admin-edit-practice" required>
            <Input id="admin-edit-practice" value={form.practiceName} onChange={(e) => setForm({ ...form, practiceName: e.target.value })} />
          </Field>
          <Field label="Professional role" htmlFor="admin-edit-role" required>
            <Input id="admin-edit-role" value={form.professionalRole} onChange={(e) => setForm({ ...form, professionalRole: e.target.value })} />
          </Field>
          <Field label="Contact number" htmlFor="admin-edit-contact" required>
            <Input id="admin-edit-contact" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-serif-display text-xl font-semibold text-[var(--text)]">{value}</p>
    </Card>
  );
}

function EngagementRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="font-medium text-[var(--text)]">{value}</span>
    </li>
  );
}
