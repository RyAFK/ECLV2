"use client";

import { useState } from "react";
import { ChevronRight, HelpCircle, PauseCircle, Stethoscope } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { ClinicalReferralScenario } from "@/lib/types";

type Answer = "refer" | "monitor" | "unclear";

const ANSWER_OPTIONS: { value: Answer; label: string; icon: typeof Stethoscope }[] = [
  { value: "refer", label: "Refer", icon: Stethoscope },
  { value: "monitor", label: "Monitor", icon: PauseCircle },
  { value: "unclear", label: "Not enough information", icon: HelpCircle },
];

export function WouldYouReferSection({
  scenarios,
  onScenarioAnswered,
}: {
  scenarios: ClinicalReferralScenario[];
  onScenarioAnswered: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(Answer | null)[]>(scenarios.map(() => null));

  const current = scenarios[step];
  const currentAnswer = answers[step];

  function selectAnswer(value: Answer) {
    if (answers[step] === null) onScenarioAnswered();
    setAnswers((prev) => prev.map((a, i) => (i === step ? value : a)));
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Would you consider referral?</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            A short practical decision exercise — there&apos;s no single right answer, just a chance to think it through.
          </p>
        </div>

        <StepProgress step={step + 1} totalSteps={scenarios.length} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Scenario {step + 1}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text)]">{current.scenario}</p>
        </div>

        <p className="text-sm font-medium text-[var(--text)]">Would you consider ophthalmology referral?</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ANSWER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => selectAnswer(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3.5 text-center text-sm font-medium transition",
                currentAnswer === opt.value
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]/40 text-[var(--text)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/60 hover:bg-[var(--surface-soft)]"
              )}
            >
              <opt.icon className="h-4.5 w-4.5 text-[var(--accent)]" />
              {opt.label}
            </button>
          ))}
        </div>

        {currentAnswer && (
          <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Educational feedback</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--text)]">{current.feedback[currentAnswer]}</p>
          </div>
        )}

        {currentAnswer && step < scenarios.length - 1 && (
          <Button size="sm" className="w-fit" onClick={() => setStep((s) => s + 1)}>
            Next scenario
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}

        {currentAnswer && step === scenarios.length - 1 && (
          <p className="text-sm font-medium text-[var(--success)]">You&apos;ve worked through all three scenarios.</p>
        )}
      </CardBody>
    </Card>
  );
}
