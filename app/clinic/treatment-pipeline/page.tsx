"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, ClipboardCheck, Hourglass, TrendingUp, Users } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { tooltipContent } from "@/components/charts/ChartTooltip";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "@/components/charts/theme";
import { CONSULTANT_WORKLOAD, CONVERSION_BY_PATHWAY, MONTHLY_REFERRAL_TREND, REFERRALS_BY_PATHWAY } from "@/data/analytics";
import { REFERRALS } from "@/data/referrals";
import { formatDate, formatPercent } from "@/lib/formatters";

const PIPELINE_RECORDS = [
  { initials: "M.H.", pathway: "Cataract", stage: "Treatment booked", context: "Procedure in 4 days" },
  { initials: "J.P.", pathway: "Laser vision correction", stage: "Assessment complete", context: "Decision discussion pending" },
  { initials: "E.R.", pathway: "Dry eye", stage: "Treatment plan active", context: "Follow-up in 2 weeks" },
];

const UPCOMING_CONSULTATIONS = REFERRALS.filter((r) => r.stage === "consultation-booked");
const UPCOMING_PROCEDURES = REFERRALS.filter((r) => r.stage === "treatment-booked");
const DELAYED_STAGE_ALERTS = REFERRALS.filter((r) => ["triage", "awaiting-contact"].includes(r.stage));

export default function TreatmentPipelinePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Treatment pipeline overview</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Fictional demo view of treatment demand and scheduling.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Treatment bookings this month" value="19" icon={ClipboardCheck} tone="accent" />
        <KpiCard label="Consultation-to-treatment conversion" value="79%" icon={TrendingUp} />
        <KpiCard label="Upcoming procedures" value="12" icon={CalendarClock} />
        <KpiCard label="Average referral-to-consultation time" value="8.4 days" icon={Hourglass} />
        <KpiCard label="New referrals" value="48" icon={Users} />
      </div>

      <div>
        <p className="mb-3 font-serif-display text-lg font-semibold text-[var(--text)]">Current pathway records</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PIPELINE_RECORDS.map((rec) => (
            <Card key={rec.initials} className="p-5">
              <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{rec.initials}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{rec.pathway}</p>
              <Badge tone="accent" className="mt-3">{rec.stage}</Badge>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{rec.context}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Monthly treatment bookings</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_REFERRAL_TREND}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Bar dataKey="treatments" name="Treatment bookings" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Pathway mix</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REFERRALS_BY_PATHWAY} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                  <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="pathway" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Bar dataKey="value" name="Referrals" fill={CHART_COLORS[2]} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Upcoming consultations</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {UPCOMING_CONSULTATIONS.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text)]">{r.patientLabel} · {r.pathwayName}</span>
                  <span className="text-[var(--text-secondary)]">{r.appointmentDate ? formatDate(r.appointmentDate) : "TBC"}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Upcoming procedures</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {UPCOMING_PROCEDURES.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text)]">{r.patientLabel} · {r.pathwayName}</span>
                  <span className="text-[var(--text-secondary)]">{r.appointmentDate ? formatDate(r.appointmentDate) : "TBC"}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Consultant workload</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {CONSULTANT_WORKLOAD.map((c) => (
                <li key={c.consultant} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text)]">{c.consultant} · {c.pathway}</span>
                  <Badge tone="neutral">{c.bookings} bookings</Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Conversion by pathway</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {CONVERSION_BY_PATHWAY.map((c) => (
                <li key={c.pathway} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text)]">{c.pathway}</span>
                  <span className="font-medium text-[var(--text)]">{formatPercent(c.conversion)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="border-[var(--warning)]/30">
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral-stage delay alerts</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Referrals awaiting contact or triage beyond the expected window.</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {DELAYED_STAGE_ALERTS.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text)]">{r.patientLabel} · {r.pathwayName}</span>
                <Badge tone="warning">{r.stage === "triage" ? "Triage required" : "Awaiting contact"}</Badge>
              </li>
            ))}
            {DELAYED_STAGE_ALERTS.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No delayed referrals at present.</p>}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
