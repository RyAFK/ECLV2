import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ReferralStatusBadge } from "@/components/referrals/StatusBadge";
import type { Referral } from "@/lib/types";
import { formatDate } from "@/lib/formatters";

export function ReferralCard({ referral }: { referral: Referral }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif-display text-lg font-semibold text-[var(--text)]">{referral.patientLabel}</p>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{referral.pathwayName}</p>
        </div>
        <ReferralStatusBadge stage={referral.stage} />
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        <span className="font-medium text-[var(--text)]">Reason: </span>
        {referral.reason}
      </p>
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-[var(--surface-soft)] p-3.5 text-xs text-[var(--text-secondary)]">
        <div>
          <p className="uppercase tracking-wide">Referring professional</p>
          <p className="mt-0.5 text-sm font-medium text-[var(--text)]">{referral.professionalName}</p>
        </div>
        <div>
          <p className="uppercase tracking-wide">Practice</p>
          <p className="mt-0.5 text-sm font-medium text-[var(--text)]">{referral.practiceLocation}</p>
        </div>
      </div>
      {referral.highlightContext && (
        <p className="rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-soft)]/30 px-3 py-2 text-sm text-[var(--text)]">
          {referral.highlightContext}
        </p>
      )}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-[var(--text-secondary)]">Referred {formatDate(referral.referralDate)}</p>
        <Link
          href={`/partner/referrals/${referral.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          View journey
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}
