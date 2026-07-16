import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { REFERRALS } from "@/data/referrals";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { PathwayTimeline } from "@/components/referrals/PathwayTimeline";
import { formatCurrency, formatDate } from "@/lib/formatters";

export function generateStaticParams() {
  return REFERRALS.map((r) => ({ id: r.id }));
}

export default async function ClinicReferralDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const referral = REFERRALS.find((r) => r.id === id);
  if (!referral) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/clinic/referrals" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]">
        <ArrowLeft className="h-4 w-4" />
        Back to referrals
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">{referral.patientLabel}</h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            {referral.reference} · {referral.pathwayName} · {referral.partnerName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ReferralStatusBadge stage={referral.stage} />
          <Badge tone="accent">{referral.conversionProbability} conversion probability</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral details</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <Detail label="Referral source" value={referral.partnerName} />
                <Detail label="Professional" value={referral.professionalName} />
                <Detail label="Referral reason" value={referral.reason} />
                <Detail label="Consultant" value={referral.consultant ?? "Unassigned"} />
                <Detail label="Appointment date" value={referral.appointmentDate ? formatDate(referral.appointmentDate) : "To be confirmed"} />
                <Detail label="Estimated value" value={formatCurrency(referral.estimatedValue)} />
                <Detail label="Owner" value={referral.owner} />
                <Detail label="Next action" value={referral.nextAction} />
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Status timeline</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Last update {formatDate(referral.lastUpdate)}</p>
              <div className="mt-6">
                <PathwayTimeline steps={referral.timeline} />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Communication log</h2>
              <ul className="mt-3 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
                <li>Referral received and logged by the clinic team.</li>
                <li>Patient contact attempted via preferred method.</li>
                <li>Consultation confirmation sent to referring practice.</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Audit trail</h2>
              <ul className="mt-3 flex flex-col gap-2 text-xs text-[var(--text-secondary)]">
                <li>Referral viewed by Ryan · {formatDate(referral.lastUpdate)}</li>
                <li>Status updated · {formatDate(referral.referralDate)}</li>
                <li>Portal visibility: Referring partner and clinic team</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[var(--text)]">{value}</dd>
    </div>
  );
}
