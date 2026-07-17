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
import { REFERRALS } from "@/data/referrals";
import { PARTNER_DEMO_USER } from "@/data/demo-users";
import { UPDATES } from "@/data/updates";
import { UPCOMING_CPD_EVENT } from "@/data/education";
import { CLINICAL_MODULES } from "@/data/clinical-education";
import { RYAN_CONTACT } from "@/lib/constants";
import { formatDate } from "@/lib/formatters";

const ACTIVE_REFERRALS = REFERRALS.filter((r) =>
  ["ref-margaret-h", "ref-jonathan-p", "ref-elizabeth-r"].includes(r.id)
);

const QUICK_LINKS = [
  { label: "Refer a patient", href: "/partner/refer", icon: PlusCircle },
  { label: "Discuss a case", href: "/partner/contact", icon: MessageCircle },
  { label: "Download referral guide", href: "/partner/resources", icon: Download },
  { label: "Book a practice visit", href: "/partner/contact", icon: CalendarDays },
  { label: "Explore treatment pathways", href: "/partner/services", icon: Stethoscope },
];

export default function PartnerDashboardPage() {
  const latestUpdate = UPDATES[0];
  const featuredModule = CLINICAL_MODULES[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
            Good morning, {PARTNER_DEMO_USER.greetingName}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active referrals" value="3" description="Currently progressing through an Eye Clinic London pathway." context="+1 this month" icon={ClipboardList} tone="accent" />
        <KpiCard label="Consultations booked" value="2" description="Patients with an upcoming specialist assessment." context="Next appointment in 3 days" icon={CalendarDays} />
        <KpiCard label="Awaiting contact" value="1" description="Referral received and awaiting initial patient contact." context="Last referral sent today" icon={Sparkles} />
        <KpiCard label="Completed pathways" value="14" description="Referrals that have completed consultation, treatment or clinical review." icon={Stethoscope} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[var(--text)]">Active referrals</h2>
            <Link href="/partner/referrals" className="text-sm font-medium text-[var(--accent)] hover:underline">
              View all referrals
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ACTIVE_REFERRALS.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} />
            ))}
          </div>
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
