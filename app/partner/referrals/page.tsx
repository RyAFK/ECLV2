"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Download, Eye, MessageCircle, Search, StickyNote } from "lucide-react";
import { useReferrals } from "@/lib/supabase/hooks";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { Tabs } from "@/components/ui/Tabs";
import { Input, Select } from "@/components/ui/Field";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { LinkButton } from "@/components/ui/Button";
import { formatDate } from "@/lib/formatters";
import type { ReferralStage } from "@/lib/types";
import { PATHWAYS } from "@/data/services";

const STATUS_TABS: { label: string; value: ReferralStage | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Awaiting contact", value: "awaiting-contact" },
  { label: "Triage", value: "triage" },
  { label: "Consultation booked", value: "consultation-booked" },
  { label: "Consultation completed", value: "consultation-completed" },
  { label: "Treatment recommended", value: "treatment-recommended" },
  { label: "Treatment booked", value: "treatment-booked" },
  { label: "Aftercare", value: "aftercare" },
  { label: "Completed", value: "completed" },
  { label: "Closed", value: "closed" },
];

export default function PartnerReferralsPage() {
  const { showToast } = useToast();
  const { referrals } = useReferrals();
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [pathway, setPathway] = useState("all");

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      if (status !== "all" && r.stage !== status) return false;
      if (pathway !== "all" && r.pathwayId !== pathway) return false;
      if (search && !`${r.patientLabel} ${r.reference}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [referrals, status, pathway, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">My referrals</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Track and manage every referral you have sent to Eye Clinic London.
        </p>
      </div>

      <Tabs tabs={STATUS_TABS} active={status} onChange={setStatus} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input
            className="pl-9"
            placeholder="Search patient or referral reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={pathway} onChange={(e) => setPathway(e.target.value)} className="sm:w-64">
          <option value="all">All services</option>
          {PATHWAYS.filter((p) => p.id !== "not-sure").map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No referrals match your filters" description="Try adjusting your search or status filter." />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Patient</TH>
              <TH>Reference</TH>
              <TH>Pathway</TH>
              <TH>Referral date</TH>
              <TH>Current stage</TH>
              <TH>Appointment</TH>
              <TH>Last update</TH>
              <TH>Action</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR key={r.id}>
                <TD className="font-medium">{r.patientLabel}</TD>
                <TD className="text-[var(--text-secondary)]">{r.reference}</TD>
                <TD>{r.pathwayName}</TD>
                <TD className="text-[var(--text-secondary)]">{formatDate(r.referralDate)}</TD>
                <TD>
                  <ReferralStatusBadge stage={r.stage} />
                </TD>
                <TD className="text-[var(--text-secondary)]">{r.appointmentDate ? formatDate(r.appointmentDate) : "—"}</TD>
                <TD className="text-[var(--text-secondary)]">{formatDate(r.lastUpdate)}</TD>
                <TD>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/partner/referrals/${r.id}`}
                      aria-label={`View ${r.patientLabel}`}
                      className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      aria-label="Download demo summary"
                      onClick={() =>
                        showToast({ variant: "info", title: "Demo summary downloaded", description: `${r.reference} summary (demo file).` })
                      }
                      className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Contact clinic"
                      onClick={() => showToast({ variant: "success", title: "Message sent to Eye Clinic London", description: `Regarding ${r.patientLabel}.` })}
                      className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Duplicate referral"
                      onClick={() => showToast({ variant: "info", title: "Referral duplicated", description: "A draft copy has been started." })}
                      className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Add note"
                      onClick={() => showToast({ variant: "success", title: "Note added", description: `Your note has been added to ${r.reference}.` })}
                      className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <StickyNote className="h-4 w-4" />
                    </button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <div>
        <LinkButton href="/partner/refer" variant="outline" size="sm">
          Refer another patient
        </LinkButton>
      </div>
    </div>
  );
}
