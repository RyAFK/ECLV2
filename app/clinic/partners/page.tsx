"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PARTNERS } from "@/data/partners";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { Tabs } from "@/components/ui/Tabs";
import { Input, Select } from "@/components/ui/Field";
import { RelationshipStatusBadge } from "@/components/referrals/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatPercent, daysAgoLabel } from "@/lib/formatters";

const CATEGORIES = ["All", "Independent optometry", "Optometry group", "Private GP", "Corporate healthcare", "Ophthalmology"];

export default function ClinicPartnersPage() {
  const [view, setView] = useState("all");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PARTNERS.filter((p) => {
      if (view === "dormant" && p.relationshipStatus !== "Dormant" && p.relationshipStatus !== "At risk") return false;
      if (view === "new" && p.relationshipStatus !== "New") return false;
      if (view === "strategic" && p.relationshipStatus !== "Strategic") return false;
      if (category !== "All" && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.referrals - a.referrals);
  }, [view, category, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Partners</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Manage professional referral partner relationships.</p>
      </div>

      <Tabs
        tabs={[
          { label: "All partners", value: "all", count: PARTNERS.length },
          { label: "Strategic", value: "strategic", count: PARTNERS.filter((p) => p.relationshipStatus === "Strategic").length },
          { label: "New", value: "new", count: PARTNERS.filter((p) => p.relationshipStatus === "New").length },
          { label: "Dormant / at risk", value: "dormant", count: PARTNERS.filter((p) => ["Dormant", "At risk"].includes(p.relationshipStatus)).length },
        ]}
        active={view}
        onChange={setView}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input className="pl-9" placeholder="Search partner name" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-64">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No partners match your filters" />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Partner</TH>
              <TH>Type</TH>
              <TH className="text-right">Referrals</TH>
              <TH className="text-right">Conversion</TH>
              <TH className="text-right">Est. value</TH>
              <TH>Last referral</TH>
              <TH>Last login</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.map((p) => (
              <TR key={p.id} onClick={undefined}>
                <TD>
                  <Link href={`/clinic/partners/${p.id}`} className="font-medium text-[var(--text)] hover:text-[var(--accent)]">
                    {p.name}
                  </Link>
                  <p className="text-xs text-[var(--text-secondary)]">{p.professional}</p>
                </TD>
                <TD className="text-[var(--text-secondary)]">{p.category}</TD>
                <TD className="text-right">{p.referrals}</TD>
                <TD className="text-right">{formatPercent(p.conversion)}</TD>
                <TD className="text-right">{formatCurrency(p.estimatedValue)}</TD>
                <TD className="text-[var(--text-secondary)]">{daysAgoLabel(p.lastReferralDaysAgo)}</TD>
                <TD className="text-[var(--text-secondary)]">{daysAgoLabel(p.lastLoginDaysAgo)}</TD>
                <TD>
                  <RelationshipStatusBadge status={p.relationshipStatus} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
