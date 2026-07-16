"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, MousePointerClick, RefreshCcw, Users } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/tables/Table";
import { tooltipContent } from "@/components/charts/ChartTooltip";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "@/components/charts/theme";
import {
  CONVERSION_BY_ENGAGEMENT,
  MOST_VIEWED_EDUCATION,
  NEW_VS_RETURNING,
  PAGE_VIEWS_BY_TAB,
  PORTAL_LOGINS_BY_WEEK,
  RESOURCE_DOWNLOADS,
} from "@/data/analytics";
import { PARTNERS } from "@/data/partners";
import { daysAgoLabel } from "@/lib/formatters";

export default function EngagementPage() {
  const sortedPartners = [...PARTNERS].sort((a, b) => b.engagementScore - a.engagementScore);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Partner engagement</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Professional-partner portal usage and engagement, fictional demo data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Active portal users" value="23" icon={Users} tone="accent" />
        <KpiCard label="Logins this month" value="198" icon={RefreshCcw} />
        <KpiCard label="Repeat users" value="19" icon={Users} />
        <KpiCard label="Referral-form completions" value="41" icon={MousePointerClick} />
        <KpiCard label="Resource downloads" value="116" icon={Download} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Logins by week</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PORTAL_LOGINS_BY_WEEK}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Line type="monotone" dataKey="logins" name="Logins" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Page views by tab</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAGE_VIEWS_BY_TAB} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
                  <XAxis type="number" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="tab" tick={{ fill: CHART_AXIS_COLOR, fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Bar dataKey="views" name="Views" fill={CHART_COLORS[1]} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Conversion by portal-engagement level</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONVERSION_BY_ENGAGEMENT}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="level" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent((v) => `${v}%`)} />
                  <Bar dataKey="conversion" name="Conversion" fill={CHART_COLORS[3]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">New versus returning users</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={NEW_VS_RETURNING}>
                  <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
                  <XAxis dataKey="period" tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={tooltipContent()} />
                  <Bar dataKey="newUsers" name="New" stackId="a" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="returning" name="Returning" stackId="a" fill={CHART_COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Most-viewed education content</p>
            <ul className="mt-3 flex flex-col gap-2">
              {MOST_VIEWED_EDUCATION.map((m) => (
                <li key={m.title} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text)]">{m.title}</span>
                  <span className="text-[var(--text-secondary)]">{m.views} views</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-serif-display text-lg font-semibold text-[var(--text)]">Most-used quick actions</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <li className="flex justify-between"><span className="text-[var(--text)]">Refer a patient</span><span>212 uses</span></li>
              <li className="flex justify-between"><span className="text-[var(--text)]">Discuss a case</span><span>64 uses</span></li>
              <li className="flex justify-between"><span className="text-[var(--text)]">Download referral guide</span><span>58 uses</span></li>
              <li className="flex justify-between"><span className="text-[var(--text)]">Book a practice visit</span><span>22 uses</span></li>
            </ul>
          </CardBody>
        </Card>
      </div>

      <div>
        <p className="mb-3 font-serif-display text-lg font-semibold text-[var(--text)]">Partner engagement</p>
        <Table>
          <THead>
            <tr>
              <TH>Partner</TH>
              <TH>Last login</TH>
              <TH>Most-viewed tab</TH>
              <TH className="text-right">Resources downloaded</TH>
              <TH className="text-right">Referrals submitted</TH>
              <TH className="text-right">Engagement score</TH>
              <TH>Suggested action</TH>
            </tr>
          </THead>
          <TBody>
            {sortedPartners.map((p) => (
              <TR key={p.id}>
                <TD className="font-medium">{p.name}</TD>
                <TD className="text-[var(--text-secondary)]">{daysAgoLabel(p.lastLoginDaysAgo)}</TD>
                <TD className="text-[var(--text-secondary)]">{p.mostViewedTab}</TD>
                <TD className="text-right">{p.resourcesDownloaded}</TD>
                <TD className="text-right">{p.referrals}</TD>
                <TD className="text-right">{p.engagementScore}/100</TD>
                <TD className="text-[var(--text-secondary)]">
                  {p.engagementScore < 40 ? "Send re-engagement invitation" : p.engagementScore < 70 ? "Share new education content" : "Continue nurturing relationship"}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>

      <Card className="bg-[var(--surface-soft)]">
        <CardBody>
          <p className="text-sm text-[var(--text)]">
            <span className="font-medium">Demo insight: </span>
            Partners who viewed at least two education modules submitted more referrals in this fictional demo
            dataset. Resource downloads: {RESOURCE_DOWNLOADS.length} guides tracked.
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            This is a demo insight for illustrative purposes, not a real business conclusion.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
