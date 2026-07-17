"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function ConversionPanel({
  moduleTitle,
  referHref,
  assistantHref,
  safetyNote,
  onReferClick,
  onDiscussClick,
}: {
  moduleTitle: string;
  referHref: string;
  assistantHref: string;
  safetyNote?: string;
  onReferClick: () => void;
  onDiscussClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 shadow-sm dark:border-teal-800 dark:bg-teal-950/40">
      <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
        <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">Module complete</span>
      </div>

      <h2 className="mt-2 font-serif-display text-xl font-semibold text-[var(--text)]">Have a patient in mind?</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">
        You&apos;ve just completed <strong>{moduleTitle}</strong>. If a patient comes to mind, you can explore the broad
        situation with the ECL Referral Assistant or start a referral now — subject to full clinical assessment.
      </p>

      {safetyNote && (
        <p className="mt-3 rounded-lg border border-teal-300 bg-white/60 px-3 py-2 text-xs leading-relaxed text-teal-900 dark:border-teal-700 dark:bg-black/20 dark:text-teal-100">
          {safetyNote}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2.5">
        <LinkButton href={referHref} onClick={onReferClick}>
          Refer this patient
        </LinkButton>
        <LinkButton href={assistantHref} variant="outline" onClick={onDiscussClick}>
          Discuss this case
          <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>

      <p className="mt-3 text-xs text-teal-800 dark:text-teal-200">
        Not sure where they fit? Start with the Referral Assistant — no diagnosis is provided and you remain in control of
        the referral decision.
      </p>
    </div>
  );
}
