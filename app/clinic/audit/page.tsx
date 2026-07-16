"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { Input, Select } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { AUDIT_LOG } from "@/data/notifications";

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [recordType, setRecordType] = useState("all");

  const recordTypes = Array.from(new Set(AUDIT_LOG.map((a) => a.recordType)));

  const filtered = useMemo(() => {
    return AUDIT_LOG.filter((a) => {
      if (recordType !== "all" && a.recordType !== recordType) return false;
      if (search && !`${a.user} ${a.action} ${a.recordReference}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, recordType]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Audit</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Demonstration audit data only.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input className="pl-9" placeholder="Search user, action or record" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={recordType} onChange={(e) => setRecordType(e.target.value)} className="sm:w-56">
          <option value="all">All record types</option>
          {recordTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Timestamp</TH>
            <TH>User</TH>
            <TH>Role</TH>
            <TH>Action</TH>
            <TH>Record type</TH>
            <TH>Record reference</TH>
            <TH>Outcome</TH>
            <TH>Demo IP</TH>
          </tr>
        </THead>
        <TBody>
          {filtered.map((entry) => (
            <TR key={entry.id}>
              <TD className="text-[var(--text-secondary)]">{entry.timestamp}</TD>
              <TD className="font-medium">{entry.user}</TD>
              <TD className="text-[var(--text-secondary)]">{entry.role}</TD>
              <TD>{entry.action}</TD>
              <TD className="text-[var(--text-secondary)]">{entry.recordType}</TD>
              <TD className="text-[var(--text-secondary)]">{entry.recordReference}</TD>
              <TD>
                <Badge tone="success">{entry.outcome}</Badge>
              </TD>
              <TD className="text-[var(--text-secondary)]">{entry.ip}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
