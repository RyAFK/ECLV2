"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, PhoneCall, Sparkles, Stethoscope, TrendingUp } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ModuleCard } from "@/components/education/ModuleCard";
import { ModuleIconBadge } from "@/components/education/ModuleIcon";
import { DiscussCaseModal } from "@/components/education/DiscussCaseModal";
import { BookRyanModal } from "@/components/education/BookRyanModal";
import { PatientsInMind } from "@/components/education/PatientsInMind";
import { CLINICAL_MODULES } from "@/data/clinical-education";
import { computeModulePercent, useClinicalEducationProgress } from "@/lib/clinical-education-storage";

export default function ClinicalEducationPage() {
  const { getRecord, toggleSavedForLater, completedCount } = useClinicalEducationProgress();
  const [discussOpen, setDiscussOpen] = useState(false);
  const [ryanOpen, setRyanOpen] = useState(false);

  const totalModules = CLINICAL_MODULES.length;
  const completionPct = Math.round((completedCount / totalModules) * 100);

  const recommendation = useMemo(() => {
    const inProgress = CLINICAL_MODULES.map((m) => ({ module: m, record: getRecord(m.id) })).find(
      ({ record }) => record.status === "in-progress"
    );
    if (inProgress) {
      return {
        kind: "continue" as const,
        module: inProgress.module,
        percent: computeModulePercent(inProgress.record),
      };
    }
    const popular = CLINICAL_MODULES.map((m) => ({ module: m, record: getRecord(m.id) })).find(
      ({ record }) => record.status !== "completed"
    );
    return { kind: "popular" as const, module: popular?.module ?? CLINICAL_MODULES[0] };
  }, [getRecord]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Clinical Education</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
          Practical, bite-sized clinical education to help you identify suitable patients, understand treatment pathways and make
          confident referrals.
        </p>
      </div>

      <Card className="overflow-hidden border-[var(--accent)]/30 bg-gradient-to-br from-[var(--sidebar)] to-[#232019] text-white">
        <CardBody className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--accent)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif-display text-xl font-semibold sm:text-2xl">Have a patient in mind?</p>
              <p className="mt-1.5 max-w-xl text-sm text-white/70">
                Not sure which treatment pathway may be relevant? Explore our interactive referral assistant or discuss the case
                directly with Ryan.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/partner/assistant" variant="secondary">
              <Sparkles className="h-4 w-4" />
              Explore a Patient Scenario
            </LinkButton>
            <Button variant="outline" className="border-white/25 text-white hover:bg-white/10" onClick={() => setDiscussOpen(true)}>
              <MessageCircle className="h-4 w-4" />
              Discuss a Case
            </Button>
            <LinkButton href="/partner/refer" variant="outline" className="border-white/25 text-white hover:bg-white/10">
              <Stethoscope className="h-4 w-4" />
              Refer a Patient
            </LinkButton>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Your Learning Progress</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {totalModules} modules available · {completedCount} completed · {completionPct}% complete
              </p>
            </div>
            <span className="rounded-full bg-[var(--accent-soft)] px-3.5 py-1.5 text-sm font-semibold text-[var(--accent)]">
              {completionPct}%
            </span>
          </div>
          <ProgressBar value={completionPct} tone="accent" />
          <p className="text-sm text-[var(--text-secondary)]">
            Complete each short module to strengthen your confidence in identifying suitable patients for referral.
          </p>
        </CardBody>
      </Card>

      <div>
        <h2 className="mb-3 flex items-center gap-2 font-serif-display text-lg font-semibold text-[var(--text)]">
          <TrendingUp className="h-4.5 w-4.5 text-[var(--accent)]" />
          Recommended For You
        </h2>
        <Card className="border-[var(--accent)]/40 bg-[var(--accent-soft)]/25">
          <CardBody className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ModuleIconBadge name={recommendation.module.icon} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                  {recommendation.kind === "continue" ? "Continue learning" : "Popular with referring optometrists"}
                </p>
                <p className="mt-0.5 font-serif-display text-base font-semibold text-[var(--text)]">{recommendation.module.title}</p>
                {recommendation.kind === "continue" && (
                  <p className="mt-0.5 text-sm text-[var(--text-secondary)]">You are {recommendation.percent}% through this module.</p>
                )}
              </div>
            </div>
            <LinkButton href={`/partner/education/${recommendation.module.id}`} size="sm">
              {recommendation.kind === "continue" ? "Continue module" : "Start module"}
              <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </CardBody>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 font-serif-display text-xl font-semibold text-[var(--text)]">Clinical Education modules</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {CLINICAL_MODULES.map((mod) => (
            <ModuleCard key={mod.id} module={mod} record={getRecord(mod.id)} onToggleSave={() => toggleSavedForLater(mod.id)} />
          ))}
        </div>
      </div>

      <PatientsInMind />

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Still unsure whether a patient is suitable for referral? Ryan is happy to talk it through.
          </p>
          <Button variant="outline" size="sm" onClick={() => setRyanOpen(true)}>
            <PhoneCall className="h-4 w-4" />
            Book a Conversation With Ryan
          </Button>
        </div>
      </Card>

      <p className="text-xs text-[var(--text-secondary)]">
        Looking for the wider professional education library and CPD events?{" "}
        <Link href="/partner/education/library" className="font-medium text-[var(--accent)] hover:underline">
          View the education library
        </Link>
        .
      </p>

      <DiscussCaseModal open={discussOpen} onClose={() => setDiscussOpen(false)} onBookRyan={() => setRyanOpen(true)} />
      <BookRyanModal open={ryanOpen} onClose={() => setRyanOpen(false)} />
    </div>
  );
}
