"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/Field";
import { StepProgress } from "@/components/ui/ProgressBar";
import { ASSISTANT_DISCLAIMER } from "@/lib/constants";

const QUESTIONS = [
  {
    question: "What best describes the patient's primary concern?",
    options: [
      "Reduced or cloudy vision",
      "Glare, halos or night-vision difficulty",
      "Wants less dependence on glasses",
      "Persistent dryness, grittiness or irritation",
      "Possible corneal irregularity",
      "Raised eye pressure or glaucoma history",
      "Retinal symptoms (flashes, floaters, distortion)",
      "A child's eye concern",
      "Sudden or urgent symptom",
      "Second opinion on an existing diagnosis",
    ],
  },
  {
    question: "How would you describe the urgency?",
    options: ["Routine — no rush", "Soon — within a few weeks", "Urgent — needs prompt review"],
  },
  {
    question: "Is there any relevant supporting information?",
    options: ["Yes, imaging or test results available", "No supporting documents yet", "Unsure"],
  },
];

const OUTCOME_MAP: Record<string, { pathway: string; note: string }> = {
  "Reduced or cloudy vision": { pathway: "Cataract assessment", note: "Symptoms may be associated with cataract." },
  "Glare, halos or night-vision difficulty": { pathway: "Cataract assessment", note: "Glare and night-vision symptoms are common cataract triggers." },
  "Wants less dependence on glasses": { pathway: "Refractive lens exchange assessment", note: "May also suit laser vision correction — specialist assessment will confirm suitability." },
  "Persistent dryness, grittiness or irritation": { pathway: "Dry eye and ocular surface assessment", note: "A comprehensive ocular-surface assessment may help." },
  "Possible corneal irregularity": { pathway: "Corneal assessment", note: "Topography and specialist review can clarify the underlying cause." },
  "Raised eye pressure or glaucoma history": { pathway: "Glaucoma review", note: "Specialist monitoring or assessment may be appropriate." },
  "Retinal symptoms (flashes, floaters, distortion)": { pathway: "Retina review", note: "Retinal symptoms often benefit from prompt specialist review." },
  "A child's eye concern": { pathway: "Paediatric ophthalmology", note: "A specialist paediatric assessment may be appropriate." },
  "Sudden or urgent symptom": { pathway: "Urgent pathway required", note: "This demo does not provide clinical triage — please follow approved urgent-care protocols." },
  "Second opinion on an existing diagnosis": { pathway: "Second opinion", note: "A consultant-led review of the existing diagnosis and any imaging can be arranged." },
};

export default function ReferralAssistantPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const finished = step >= QUESTIONS.length;
  const outcome = finished ? OUTCOME_MAP[answers[0]] : null;

  function selectAnswer(value: string) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
    setStep((s) => s + 1);
  }

  function restart() {
    setStep(0);
    setAnswers([]);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)]">Not sure where a patient may fit?</h1>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Answer a few simple questions and explore which Eye Clinic London pathway may be relevant to discuss.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--information)]/30 bg-[var(--information-soft)] px-4 py-3 text-sm text-[var(--text)]">
        {ASSISTANT_DISCLAIMER}
      </div>

      <Card>
        <CardBody className="flex flex-col gap-5">
          {!finished ? (
            <>
              <StepProgress step={step + 1} totalSteps={QUESTIONS.length} />
              <p className="text-base font-medium text-[var(--text)]">{QUESTIONS[step].question}</p>
              <div className="grid grid-cols-1 gap-2">
                {QUESTIONS[step].options.map((opt) => (
                  <RadioCard key={opt} label={opt} selected={answers[step] === opt} onSelect={() => selectAnswer(opt)} />
                ))}
              </div>
            </>
          ) : (
            outcome && (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Suggested outcome</p>
                  <p className="mt-1.5 font-serif-display text-xl font-semibold text-[var(--text)]">{outcome.pathway}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{outcome.note}</p>
                  <p className="mt-3 text-xs text-[var(--text-secondary)]">
                    This is a non-diagnostic demonstration suggestion and does not replace clinical judgement.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <LinkButton href="/partner/refer">Refer this patient</LinkButton>
                  <LinkButton href="/partner/contact" variant="outline">
                    Discuss this case
                  </LinkButton>
                  <Link href="/partner/services" className="inline-flex items-center px-2 text-sm font-medium text-[var(--accent)] hover:underline">
                    View pathway information
                  </Link>
                </div>
                <Button variant="ghost" size="sm" className="w-fit" onClick={restart}>
                  Start again
                </Button>
              </div>
            )
          )}
        </CardBody>
      </Card>
    </div>
  );
}
