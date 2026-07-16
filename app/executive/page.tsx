"use client";

import {
  Bar,
  BarChart,
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
import { Activity, ClipboardList, TrendingUp, Users, Wallet } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { Card, CardBody } from "@/components/ui/Card";
import { tooltipContent } from "@/components/charts/ChartTooltip";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "@/components/charts/theme";
import {
  EXEC_KPIS,
  MONTHLY_REFERRAL_TREND,
  REFERRALS_BY_PATHWAY,
  REFERRAL_FUNNEL,
  TOP_PARTNERS_TABLE,
} from "@/data/analytics";
import { PARTNERS } from "@/data/partners";
import { ANALYTICS_DISCLAIMER } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/formatters";

export default function ExecutiveDashboardPage() {
  const k = EXEC_KPIS;
  const dormantCount = PARTNERS.filter((p) => p.relationshipStatus === "Dormant" || p.relationshipStatus === "At risk").length;
  const activeCount = PARTNERS.length - dormantCount;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Executive analytics</p>
        <h1 className="mt-2 font-serif-display text-3xl font-semibold text-[var(--text)]">Executive performance overview</h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--text-secondary)]">
          Referral growth, treatment conversion and professional network insights.
        </p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{ANALYTICS_DISCLAIMER}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Monthly referrals" value={String(k.monthlyReferrals)} icon={ClipboardList} tone="accent" />
        <KpiCard label="Consultations booked" value={String(k.consultationsBooked)} icon={Activity} />
        <KpiCard label="Treatment bookings" value={String(k.treatmentBookings)} icon={TrendingUp} />
        <KpiCard label="Estimated pipeline" value={formatCurrency(k.estimatedPipeline)} context="Fictional demo estimate only" icon={Wallet} tone="accent" />
        <KpiCard label="Referral-to-treatment-booking conversion" value={formatPercent(k.referralToTreatmentConversion)} icon={TrendingUp} />
        <KpiCard label="Active professional partners" value={String(k.activePartners)} icon={Users} />
        <KpiCard label="Portal engagement" value={formatPercent(k.portalEngagement)} icon={Users} tone="accent" />
        <KpiCard label="Upcoming procedures" value={String(k.upcomingProcedures)} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral, consultation and pipeline trend</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_REFERRAL_TREND}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Line type="monotone" dataKey="referrals" name="Referrals" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="consultations" name="Consultations" stroke={CHART_COLORS[2]} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="treatments" name="Treatment bookings" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Pipeline by pathway</p>
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
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Conversion funnel</p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {REFERRAL_FUNNEL.map((stage, i) => (
              <div key={stage.stage} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-center">
                <p className="font-serif-display text-2xl font-semibold text-[var(--text)]">{stage.value}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{stage.stage}</p>
                {i > 0 && (
                  <p className="mt-1 text-xs font-medium text-[var(--accent)]">
                    {Math.round((stage.value / REFERRAL_FUNNEL[i - 1].value) * 100)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Top five partners</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_PARTNERS_TABLE} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                  <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="partner" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={180} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Bar dataKey="referrals" name="Referrals" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Active versus dormant partners</p>
            <div className="mt-6 flex items-center justify-around">
              <div className="text-center">
                <p className="font-serif-display text-4xl font-semibold text-[var(--success)]">{activeCount}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Active</p>
              </div>
              <div className="text-center">
                <p className="font-serif-display text-4xl font-semibold text-[var(--warning)]">{dormantCount}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Dormant / at risk</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-[var(--text-secondary)]">
              Marylebone Independent Opticians alone represents {formatPercent(Math.round((PARTNERS[0].referrals / PARTNERS.reduce((a, p) => a + p.referrals, 0)) * 100))} of tracked referral volume — a
              concentration signal worth monitoring alongside broader network growth.
            </p>
          </CardBody>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 font-serif-display text-xl font-semibold text-[var(--text)]">Emerging opportunities</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InsightCard
            title="Opportunity 1"
            headline="Cataract referrals represent 31% of current referral demand."
          />
          <InsightCard
            title="Opportunity 2"
            tone="warning"
            headline="Nine professional partners have not referred in more than 90 days."
          />
          <InsightCard
            title="Opportunity 3"
            tone="information"
            headline="Dry-eye and ocular-surface education may support refractive and lens-based referral quality."
          />
          <InsightCard
            title="Opportunity 4"
            tone="success"
            headline="Private GP referrals have increased for three consecutive months."
          />
          <InsightCard
            title="Opportunity 5"
            headline="Highly engaged portal users represent a strong repeat-referral segment in the fictional dataset."
          />
        </div>
      </div>
    </div>
  );
}
