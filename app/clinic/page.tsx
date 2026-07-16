"use client";

import {
  Activity,
  CalendarCheck,
  ClipboardList,
  PhoneCall,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { tooltipContent } from "@/components/charts/ChartTooltip";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "@/components/charts/theme";
import { CLINIC_OVERVIEW_KPIS, MONTHLY_REFERRAL_TREND, REFERRALS_BY_PATHWAY, REFERRAL_FUNNEL, TOP_PARTNERS_TABLE } from "@/data/analytics";
import { LATEST_ACTIVITY } from "@/data/notifications";
import { CLINIC_DEMO_USER } from "@/data/demo-users";
import { formatCurrency, formatPercent } from "@/lib/formatters";

export default function ClinicOverviewPage() {
  const k = CLINIC_OVERVIEW_KPIS;
  const maxFunnel = REFERRAL_FUNNEL[0].value;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Good morning, {CLINIC_DEMO_USER.greetingName}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Here is what is happening across the Eye Clinic London referral network today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Referrals this month" value={String(k.referralsThisMonth)} context={`+${k.referralsChangeVsPrevMonth}% versus previous month`} icon={ClipboardList} tone="accent" />
        <KpiCard label="Patients contacted" value={String(k.patientsContacted)} context={`${formatPercent(k.patientsContactedPct)} of referrals`} icon={PhoneCall} />
        <KpiCard label="Consultations booked" value={String(k.consultationsBooked)} context={`${formatPercent(k.consultationsBookedPct)} of referrals`} icon={CalendarCheck} />
        <KpiCard label="Consultations completed" value={String(k.consultationsCompleted)} context={`${formatPercent(k.consultationsCompletedPct)} of booked consultations`} icon={Stethoscope} />
        <KpiCard label="Treatment bookings" value={String(k.treatmentBookings)} context={`${formatPercent(k.treatmentBookingsPct)} of completed consultations`} icon={Activity} tone="accent" />
        <KpiCard label="Estimated treatment pipeline" value={formatCurrency(k.estimatedPipeline)} context="Fictional demo estimate only" icon={Wallet} />
        <KpiCard label="Active professional partners" value={String(k.activePartners)} context="Referred within the last 90 days" icon={Users} />
        <KpiCard label="Partner portal engagement" value={formatPercent(k.portalEngagementPct)} context="Logged in within the last 30 days" icon={TrendingUp} tone="accent" />
      </div>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral funnel</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Conversion across the current month, fictional demo data.</p>
          <div className="mt-5 flex flex-col gap-3">
            {REFERRAL_FUNNEL.map((stage, i) => {
              const pct = Math.round((stage.value / maxFunnel) * 100);
              const conversion = i === 0 ? 100 : Math.round((stage.value / REFERRAL_FUNNEL[i - 1].value) * 100);
              return (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="w-44 shrink-0 text-sm font-medium text-[var(--text)]">{stage.stage}</div>
                  <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[var(--surface-soft)]">
                    <div
                      className="flex h-full items-center rounded-lg bg-[var(--accent)] px-3 text-xs font-medium text-white transition-all"
                      style={{ width: `${pct}%` }}
                    >
                      {stage.value}
                    </div>
                  </div>
                  <div className="w-20 shrink-0 text-right text-xs text-[var(--text-secondary)]">
                    {i === 0 ? "—" : `${conversion}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referrals by pathway</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={REFERRALS_BY_PATHWAY} dataKey="value" nameKey="pathway" innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {REFERRALS_BY_PATHWAY.map((entry, i) => (
                      <Cell key={entry.pathway} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={tooltipContent()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[var(--text-secondary)]">
              {REFERRALS_BY_PATHWAY.map((entry, i) => (
                <div key={entry.pathway} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {entry.pathway} ({entry.value})
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral trend</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_REFERRAL_TREND}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Line type="monotone" dataKey="referrals" name="Referrals" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="treatments" name="Treatments" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <InsightCard
              title="Referral momentum increasing"
              headline="Referrals are up 100% compared with January."
              tone="success"
            />
          </CardBody>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-xl font-semibold text-[var(--text)]">Top referral sources</h2>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>Partner</TH>
              <TH>Type</TH>
              <TH className="text-right">Referrals</TH>
              <TH className="text-right">Consultation conversion</TH>
              <TH className="text-right">Treatment bookings</TH>
              <TH className="text-right">Estimated value</TH>
            </tr>
          </THead>
          <TBody>
            {TOP_PARTNERS_TABLE.map((p) => (
              <TR key={p.partner}>
                <TD className="font-medium">{p.partner}</TD>
                <TD className="text-[var(--text-secondary)]">{p.type}</TD>
                <TD className="text-right">{p.referrals}</TD>
                <TD className="text-right">{formatPercent(p.conversion)}</TD>
                <TD className="text-right">{p.treatmentBookings}</TD>
                <TD className="text-right">{formatCurrency(p.estimatedValue)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">All financial values are fictional demo estimates.</p>
      </div>

      <div>
        <h2 className="mb-4 font-serif-display text-xl font-semibold text-[var(--text)]">Business development insights</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InsightCard
            title="High-performing opportunity"
            headline="Marylebone Independent Opticians has generated 18 referrals this year and shows a 78% referral-to-consultation conversion rate."
            recommendation="Explore a formal cataract and refractive pathway meeting and review which patient materials would support further referrals."
          />
          <InsightCard
            title="Dormant partner alert"
            tone="warning"
            headline="Regent Street Optometry has not referred in 94 days. Nine referrals in the previous six months."
            recommendation="Schedule a relationship follow-up and check whether the practice needs updated referral guides or patient leaflets."
          />
          <InsightCard
            title="Growing service demand"
            tone="success"
            headline="Cataract referrals increased by 36% over the last 90 days."
            recommendation="Review consultation availability and focus outreach on suitable cataract education."
          />
          <InsightCard
            title="Cross-service opportunity"
            tone="information"
            headline="Six recent cataract or refractive referrals also recorded significant dry-eye symptoms."
            recommendation="Create an ocular-surface optimisation education pathway for referring professionals."
          />
        </div>
      </div>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Latest activity</p>
          <ul className="mt-4 flex flex-col gap-3">
            {LATEST_ACTIVITY.map((activity, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {activity}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
