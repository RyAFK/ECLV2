"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Plus, Search, StickyNote } from "lucide-react";
import { useReferrals } from "@/lib/supabase/hooks";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { Input, Select, Checkbox } from "@/components/ui/Field";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { PathwayTimeline } from "@/components/referrals/PathwayTimeline";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { REFERRAL_STAGE_LABELS, type ReferralStage } from "@/lib/types";
import { PATHWAYS } from "@/data/services";

const STAGES = Object.keys(REFERRAL_STAGE_LABELS) as ReferralStage[];

export default function ClinicReferralsPage() {
  const { showToast } = useToast();
  const { referrals, updateStage } = useReferrals();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [pathway, setPathway] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      if (stage !== "all" && r.stage !== stage) return false;
      if (pathway !== "all" && r.pathwayId !== pathway) return false;
      if (search && !`${r.patientLabel} ${r.reference} ${r.partnerName}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [referrals, search, stage, pathway]);

  const open = referrals.find((r) => r.id === openId) ?? null;

  async function handleUpdateStage(id: string, newStage: ReferralStage) {
    await updateStage(id, newStage);
    showToast({ variant: "success", title: "Status updated", description: `Referral moved to ${REFERRAL_STAGE_LABELS[newStage]}.` });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function bulkAssign() {
    if (selected.length === 0) return;
    showToast({ variant: "success", title: "Owner assigned", description: `${selected.length} referral(s) assigned to Ryan.` });
    setSelected([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Referrals</h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Manage every referral across the ECL professional network.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => showToast({ variant: "info", title: "Demo export created", description: "Referral data exported (demo CSV simulation)." })}
        >
          <Download className="h-4 w-4" />
          Export demo data
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input className="pl-9" placeholder="Search patient, reference or partner" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={stage} onChange={(e) => setStage(e.target.value)} className="sm:w-56">
          <option value="all">All statuses</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {REFERRAL_STAGE_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select value={pathway} onChange={(e) => setPathway(e.target.value)} className="sm:w-56">
          <option value="all">All pathways</option>
          {PATHWAYS.filter((p) => p.id !== "not-sure").map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        {selected.length > 0 && (
          <Button size="sm" onClick={bulkAssign}>
            <Plus className="h-4 w-4" />
            Assign {selected.length} to Ryan
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No referrals match your filters" />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH className="w-8"></TH>
              <TH>Reference</TH>
              <TH>Patient</TH>
              <TH>Partner</TH>
              <TH>Pathway</TH>
              <TH>Stage</TH>
              <TH>Consultant</TH>
              <TH className="text-right">Est. value</TH>
              <TH>Owner</TH>
              <TH>Action</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR key={r.id}>
                <TD>
                  <Checkbox label="" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                </TD>
                <TD className="text-[var(--text-secondary)]">{r.reference}</TD>
                <TD className="font-medium">{r.patientLabel}</TD>
                <TD className="text-[var(--text-secondary)]">{r.partnerName}</TD>
                <TD>{r.pathwayName}</TD>
                <TD>
                  <ReferralStatusBadge stage={r.stage} />
                </TD>
                <TD className="text-[var(--text-secondary)]">{r.consultant ?? "—"}</TD>
                <TD className="text-right">{formatCurrency(r.estimatedValue)}</TD>
                <TD className="text-[var(--text-secondary)]">{r.owner}</TD>
                <TD>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Open referral"
                      onClick={() => setOpenId(r.id)}
                      className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Add note"
                      onClick={() => showToast({ variant: "success", title: "Note added", description: `Note added to ${r.reference}.` })}
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

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.patientLabel ?? ""} subtitle={open ? `${open.reference} · ${open.pathwayName}` : undefined}>
        {open && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <ReferralStatusBadge stage={open.stage} />
              <Badge tone="neutral">Owner: {open.owner}</Badge>
              <Badge tone="accent">{open.conversionProbability} conversion probability</Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--text)]">Update status</p>
              <Select className="mt-2" value={open.stage} onChange={(e) => handleUpdateStage(open.id, e.target.value as ReferralStage)}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {REFERRAL_STAGE_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Referral source</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{open.partnerName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Professional</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{open.professionalName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Referral reason</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{open.reason}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Consultant</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{open.consultant ?? "Unassigned"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Appointment date</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{open.appointmentDate ? formatDate(open.appointmentDate) : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Estimated value</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{formatCurrency(open.estimatedValue)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Next action</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{open.nextAction}</dd>
              </div>
            </dl>

            <div>
              <p className="text-sm font-medium text-[var(--text)]">Status timeline</p>
              <div className="mt-3">
                <PathwayTimeline steps={open.timeline} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "success", title: "Note added", description: "Demo note added to the communication log." })}
              >
                Add demo note
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "success", title: "Task created", description: `A follow-up task has been created for ${open.patientLabel}.` })}
              >
                Create task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "info", title: "Demo export created", description: `${open.reference} exported.` })}
              >
                Export demo data
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
