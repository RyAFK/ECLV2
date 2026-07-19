"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Download,
  MessageCircle,
  PlusCircle,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ReferralCard } from "@/components/referrals/ReferralCard";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useReferrals } from "@/lib/supabase/hooks";
import { useAuth } from "@/lib/supabase/auth-context";
import { PARTNER_DEMO_USER } from "@/data/demo-users";
import { UPDATES } from "@/data/updates";
import { UPCOMING_CPD_EVENT } from "@/data/education";
import { CLINICAL_MODULES } from "@/data/clinical-education";
import { RYAN_CONTACT } from "@/lib/constants";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";
import type { ReferralStage } from "@/lib/types";

const TREATMENT_STAGES: ReferralStage[] = ["treatment-booked", "procedure-completed", "aftercare", "completed"];
const AWAITING_CONTACT_STAGES: ReferralStage[] = ["new", "awaiting-contact"];
const TERMINAL_STAGES: ReferralStage[] = ["completed", "closed", "lost"];

const QUICK_LINKS = [
  { label: "Refer a patient", href: "/partner/refer", icon: PlusCircle },
  { label: "Discuss a case", href: "/partner/contact", icon: MessageCircle },
  { label: "Download referral guide", href: "/partner/resources", icon: Download },
  { label: "Book a practice visit", href: "/partner/contact", icon: CalendarDays },
  { label: "Explore treatment pathways", href: "/partner/services", icon: Stethoscope },
];

export default function PartnerDashboardPage() {
  const { profile } = useAuth();
  const { referrals, source, loading } = useReferrals();
  const latestUpdate = UPDATES[0];
  const featuredModule = CLINICAL_MODULES[0];

  const greetingName = profile?.display_name?.split(" ")[0] || PARTNER_DEMO_USER.greetingName;

  const stats = useMemo(() => {
    const total = referrals.length;
    const activeReferrals = referrals.filter((r) => !TERMINAL_STAGES.includes(r.stage));
    const consultationsBooked = referrals.filter((r) => Boolean(r.appointmentDate));
    const awaitingContact = referrals.filter((r) => AWAITING_CONTACT_STAGES.includes(r.stage));
    const completedPathways = referrals.filter((r) => r.stage === "completed");
    const treatmentBookings = referrals.filter((r) => TREATMENT_STAGES.includes(r.stage));
    const estimatedValue = referrals.filter((r) => r.stage !== "lost").reduce((sum, r) => sum + r.estimatedValue, 0);
    const conversion = total > 0 ? Math.round((treatmentBookings.length / total) * 100) : 0;

    return {
      activeReferrals,
      consultationsBooked,
      awaitingContact,
      completedPathways,
      treatmentBookings,
      estimatedValue,
      conversion,
    };
  }, [referrals]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
            Good morning, {greetingName}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Here is an overview of your Eye Clinic London referrals and latest professional updates.
          </p>
        </div>
        <LinkButton href="/partner/refer" size="lg" className="sm:hidden">
          <PlusCircle className="h-4 w-4" />
          Refer a patient
        </LinkButton>
      </div>

      {source === "error" ? (
        <EmptyState
          title="We couldn't load your referral data"
          description="There was a problem reaching Supabase. Please try again shortly, or contact Eye Clinic London if this continues."
        />
      ) : !loading && referrals.length === 0 ? (
        <EmptyState
          title="No referrals yet"
          description="Once you refer a patient, your active referrals and pathway progress will appear here."
          action={
            <LinkButton href="/partner/refer" size="sm">
              <PlusCircle className="h-4 w-4" />
              Refer a patient
            </LinkButton>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Active referrals"
              value={String(stats.activeReferrals.length)}
              description="Currently progressing through an Eye Clinic London pathway."
              icon={ClipboardList}
              tone="accent"
            />
            <KpiCard
              label="Consultations booked"
              value={String(stats.consultationsBooked.length)}
              description="Patients with a specialist assessment scheduled."
              icon={CalendarDays}
            />
            <KpiCard
              label="Awaiting contact"
              value={String(stats.awaitingContact.length)}
              description="Referral received and awaiting initial patient contact."
              icon={Sparkles}
            />
            <KpiCard
              label="Completed pathways"
              value={String(stats.completedPathways.length)}
              description="Referrals that have completed consultation, treatment or clinical review."
              icon={Stethoscope}
            />
            <KpiCard label="Treatment bookings" value={String(stats.treatmentBookings.length)} description="Referrals that reached treatment booking or beyond." />
            <KpiCard label="Conversion" value={formatPercent(stats.conversion)} description="Share of your referrals that reached treatment." />
            <KpiCard label="Estimated value" value={formatCurrency(stats.estimatedValue)} description="Estimated commercial value of your active and completed referrals." />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="flex flex-col gap-4 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-xl font-semibold text-[var(--text)]">Active referrals</h2>
                <Link href="/partner/referrals" className="text-sm font-medium text-[var(--accent)] hover:underline">
                  View all referrals
                </Link>
              </div>
              {stats.activeReferrals.length === 0 ? (
                <EmptyState title="No active referrals" description="Referrals currently in progress will appear here." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {stats.activeReferrals.slice(0, 4).map((referral) => (
                    <ReferralCard key={referral.id} referral={referral} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Latest ECL update</p>
                <p className="mt-2 font-serif-display text-base font-semibold text-[var(--text)]">{latestUpdate.title}</p>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{latestUpdate.description}</p>
                <Link href="/partner/updates" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline">
                  Read updates
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Featured education
                </div>
                <p className="mt-2 font-serif-display text-base font-semibold text-[var(--text)]">{featuredModule.title}</p>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{featuredModule.duration} clinical overview</p>
                <Link href="/partner/education" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline">
                  Explore Clinical Education
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Upcoming CPD event
                </div>
                <p className="mt-2 font-serif-display text-base font-semibold text-[var(--text)]">{UPCOMING_CPD_EVENT.title}</p>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{UPCOMING_CPD_EVENT.date} · {UPCOMING_CPD_EVENT.location}</p>
                <Link href="/partner/education" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline">
                  Register interest
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Referral Assistant</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Not sure where a patient may fit? Answer a few simple questions to explore a suggested pathway.</p>
                <LinkButton href="/partner/assistant" variant="outline" size="sm" className="mt-3">
                  <Sparkles className="h-4 w-4" />
                  Open assistant
                </LinkButton>
              </Card>

              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Your dedicated contact</p>
                <p className="mt-2 font-serif-display text-base font-semibold text-[var(--text)]">{RYAN_CONTACT.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{RYAN_CONTACT.role}</p>
                <LinkButton href="/partner/contact" variant="outline" size="sm" className="mt-3">
                  <MessageCircle className="h-4 w-4" />
                  Contact Ryan
                </LinkButton>
              </Card>
            </div>
          </div>
        </>
      )}

      <div>
        <h2 className="mb-4 font-serif-display text-xl font-semibold text-[var(--text)]">Quick links</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center transition hover:border-[var(--accent)] hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <link.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-[var(--text)]">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--text-secondary)]">Last updated {formatDate(new Date().toISOString())}.</p>
    </div>
  );
}
