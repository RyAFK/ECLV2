"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import { PathwayTimeline } from "@/components/referrals/PathwayTimeline";
import { ContactRyanCard } from "@/components/referrals/ContactRyanCard";
import { formatDate } from "@/lib/formatters";
import type { Referral } from "@/lib/types";
import { REFERRALS } from "@/data/referrals";
import { getSupabaseClient } from "@/lib/supabase/client";
import { referralRowToReferral } from "@/lib/supabase/mappers";

/**
 * Fetches a single referral by id directly (rather than filtering the full
 * useReferrals() list) so RLS is the only thing deciding visibility: a
 * partner requesting another partner's referral id gets zero rows back, not
 * a client-side filtered-out card, which is what actually protects this URL
 * against being used to enumerate other partners' referrals.
 */
export default function PartnerReferralDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [referral, setReferral] = useState<Referral | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        const found = REFERRALS.find((r) => r.id === id) ?? null;
        if (!cancelled) setReferral(found);
        return;
      }
      const { data, error } = await supabase.from("referrals").select("*, partners(name)").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setReferral(null);
        return;
      }
      setReferral(referralRowToReferral(data, data.partners?.name ?? ""));
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (referral === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (referral === null) notFound();

  const details = [
    { label: "Reference number", value: referral.reference },
    { label: "Referral date", value: formatDate(referral.referralDate) },
    { label: "Referring practice", value: referral.practiceLocation },
    { label: "Referring professional", value: referral.professionalName },
    { label: "Referral reason", value: referral.reason },
    { label: "Pathway", value: referral.pathwayName },
    { label: "Preferred clinic location", value: "Harley Street, London" },
    { label: "Assigned consultant", value: referral.consultant ?? "To be confirmed" },
    { label: "Consultation date", value: referral.appointmentDate ? formatDate(referral.appointmentDate) : "To be confirmed" },
    { label: "Current stage", value: referral.stage },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/partner/referrals" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]">
        <ArrowLeft className="h-4 w-4" />
        Back to my referrals
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">{referral.patientLabel}</h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            {referral.pathwayName} · {referral.reason}
          </p>
        </div>
        <ReferralStatusBadge stage={referral.stage} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Referral details</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{d.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-[var(--text)]">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Pathway journey</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Last update {formatDate(referral.lastUpdate)}
              </p>
              <div className="mt-6">
                <PathwayTimeline steps={referral.timeline} />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardBody>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Current pathway</h2>
              <ul className="mt-3 space-y-2.5 text-sm text-[var(--text-secondary)]">
                <li>{referral.pathwayName}</li>
                <li>Consultant-led assessment {referral.timeline[4]?.complete ? "completed" : "pending"}</li>
                <li>Premium option discussion documented</li>
                <li>{referral.appointmentDate ? `Appointment on ${formatDate(referral.appointmentDate)}` : "Appointment to be confirmed"}</li>
                <li>Postoperative follow-up planned where applicable</li>
                <li>Return-to-referrer update available after completion</li>
              </ul>
            </CardBody>
          </Card>

          <ContactRyanCard context={`Regarding ${referral.patientLabel} (${referral.reference})`} />
        </div>
      </div>
    </div>
  );
}
