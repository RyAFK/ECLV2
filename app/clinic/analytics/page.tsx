"use client";

import { useState } from "react";
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
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardBody } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { tooltipContent } from "@/components/charts/ChartTooltip";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "@/components/charts/theme";
import { ANALYTICS_DISCLAIMER } from "@/lib/constants";
import {
  AVERAGE_STAGE_TIME_DAYS,
  CONSULTANT_WORKLOAD,
  CONVERSION_BY_ENGAGEMENT,
  CONVERSION_BY_PATHWAY,
  GEOGRAPHIC_DISTRIBUTION,
  LOST_REFERRAL_REASONS,
  MONTHLY_REFERRAL_TREND,
  MOST_VIEWED_EDUCATION,
  NEW_VS_RETURNING,
  PAGE_VIEWS_BY_TAB,
  PORTAL_LOGINS_BY_WEEK,
  REFERRALS_BY_PATHWAY,
  REFERRALS_BY_PROFESSIONAL_TYPE,
  RESOURCE_DOWNLOADS,
  TOP_PARTNERS_TABLE,
} from "@/data/analytics";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { formatCurrency, formatPercent } from "@/lib/formatters";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Referrals", value: "referrals" },
  { label: "Consultation conversion", value: "consultation" },
  { label: "Treatment conversion", value: "treatment" },
  { label: "Pipeline", value: "pipeline" },
  { label: "Services", value: "services" },
  { label: "Partners", value: "partners" },
  { label: "Engagement", value: "engagement" },
  { label: "Locations", value: "locations" },
];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardBody>
        <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{title}</p>
        <div className="mt-4 h-72">{children}</div>
      </CardBody>
    </Card>
  );
}

export default function ClinicAnalyticsPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Analytics</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{ANALYTICS_DISCLAIMER}</p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="overflow-x-auto" />

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Referral growth by month">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_REFERRAL_TREND}>
                <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Line type="monotone" dataKey="referrals" name="Referrals" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="consultations" name="Consultations" stroke={CHART_COLORS[2]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="treatments" name="Treatments" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Referrals by pathway">
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
          </ChartCard>
        </div>
      )}

      {tab === "referrals" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Referrals by professional type">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REFERRALS_BY_PROFESSIONAL_TYPE} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={170} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="value" name="Referrals" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Referrals by practice (top 5)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_PARTNERS_TABLE} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="partner" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={170} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="referrals" name="Referrals" fill={CHART_COLORS[1]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {tab === "consultation" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Average time between stages (days)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AVERAGE_STAGE_TIME_DAYS} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={190} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="days" name="Days" fill={CHART_COLORS[2]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Lost referral reasons">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LOST_REFERRAL_REASONS} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={150} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="value" name="Referrals" fill={CHART_COLORS[4]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {tab === "treatment" && (
        <ChartCard title="Consultation-to-treatment conversion by pathway">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CONVERSION_BY_PATHWAY} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="pathway" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={190} axisLine={false} tickLine={false} />
              <Tooltip content={tooltipContent((v) => `${v}%`)} />
              <Bar dataKey="conversion" name="Conversion" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {tab === "pipeline" && (
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Estimated pipeline by partner</p>
            <Table className="mt-4">
              <THead>
                <tr>
                  <TH>Partner</TH>
                  <TH className="text-right">Estimated pipeline value</TH>
                </tr>
              </THead>
              <TBody>
                {TOP_PARTNERS_TABLE.map((p) => (
                  <TR key={p.partner}>
                    <TD>{p.partner}</TD>
                    <TD className="text-right">{formatCurrency(p.estimatedValue)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      )}

      {tab === "services" && (
        <ChartCard title="Treatment demand by service">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REFERRALS_BY_PATHWAY} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="pathway" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={170} axisLine={false} tickLine={false} />
              <Tooltip content={tooltipContent()} />
              <Bar dataKey="value" name="Referrals" fill={CHART_COLORS[5]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {tab === "partners" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Top five partners by referral volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_PARTNERS_TABLE} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="partner" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={170} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="referrals" name="Referrals" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="New versus returning portal users">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NEW_VS_RETURNING}>
                <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                <XAxis dataKey="period" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="newUsers" name="New" stackId="a" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="returning" name="Returning" stackId="a" fill={CHART_COLORS[2]} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {tab === "engagement" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Portal logins by week">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PORTAL_LOGINS_BY_WEEK}>
                <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                <XAxis dataKey="week" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Line type="monotone" dataKey="logins" name="Logins" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Conversion by portal-engagement level">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONVERSION_BY_ENGAGEMENT}>
                <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                <XAxis dataKey="level" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent((v) => `${v}%`)} />
                <Bar dataKey="conversion" name="Conversion" fill={CHART_COLORS[3]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Most-viewed tabs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PAGE_VIEWS_BY_TAB} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="tab" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="views" name="Views" fill={CHART_COLORS[5]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Most-viewed education modules">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOST_VIEWED_EDUCATION} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="title" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={190} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="views" name="Views" fill={CHART_COLORS[6]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Resource downloads">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_DOWNLOADS} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="title" tick={{ fill: CHART_AXIS_COLOR, fontSize: 10 }} width={190} axisLine={false} tickLine={false} />
                <Tooltip content={tooltipContent()} />
                <Bar dataKey="downloads" name="Downloads" fill={CHART_COLORS[7]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {tab === "locations" && (
        <ChartCard title="Geographic distribution of referrals">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GEOGRAPHIC_DISTRIBUTION} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="area" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
              <Tooltip content={tooltipContent()} />
              <Bar dataKey="value" name="Referrals" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <p className="text-xs text-[var(--text-secondary)]">
        Consultant workload (demo): {CONSULTANT_WORKLOAD.map((c) => `${c.consultant} — ${c.bookings} bookings`).join(" · ")}
      </p>
      <p className="text-xs text-[var(--text-secondary)]">Professional types tracked: independent optometrist, multiple-practice optometrist, dispensing optician, private GP, ophthalmologist, corporate health, other healthcare professional. Conversion shown: {formatPercent(74)} for highly engaged portal users.</p>
    </div>
  );
}
