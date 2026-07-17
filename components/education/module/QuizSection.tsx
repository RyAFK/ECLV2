"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { ClinicalQuizQuestion } from "@/lib/types";

export function QuizSection({
  moduleTitle,
  questions,
  completed,
  score,
  onAnswer,
  onRetake,
  onDiscuss,
}: {
  moduleTitle: string;
  questions: ClinicalQuizQuestion[];
  completed: boolean;
  score: number;
  onAnswer: (correct: boolean) => void;
  onRetake: () => void;
  onDiscuss: () => void;
}) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [localScore, setLocalScore] = useState(0);
  const [finished, setFinished] = useState(completed);

  const question = questions[step];

  // Catches up the UI if progress hydrates from localStorage after this
  // component's first render (the module was already completed previously).
  useEffect(() => {
    if (completed && !finished && selected === null && step === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync once progress hydrates from localStorage after mount
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  function selectOption(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === question.correctIndex;
    if (correct) setLocalScore((s) => s + 1);
    onAnswer(correct);
  }

  function next() {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function retake() {
    onRetake();
    setStep(0);
    setSelected(null);
    setLocalScore(0);
    setFinished(false);
  }

  const displayScore = finished && !completed ? localScore : score;

  if (finished) {
    return (
      <Card className="border-[var(--success)]/30">
        <CardBody className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <div>
            <p className="font-serif-display text-xl font-semibold text-[var(--text)]">Module Complete</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">You scored {displayScore}/3</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">You have completed this Clinical Education module.</p>
          </div>

          <div className="mt-2 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-5">
            <p className="text-sm font-medium text-[var(--text)]">The most important question: do you have a patient in mind?</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <LinkButton href="/partner/refer" size="sm">
                Yes — Refer a Patient
              </LinkButton>
              <Button variant="outline" size="sm" onClick={onDiscuss}>
                Yes — Discuss With Ryan
              </Button>
              <LinkButton href="/partner/education" variant="ghost" size="sm">
                Not Right Now — Return to Education
              </LinkButton>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={retake}>
            Retake knowledge check
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Knowledge check</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Three quick questions on {moduleTitle.toLowerCase()}.</p>
        </div>

        <StepProgress step={step + 1} totalSteps={questions.length} />

        <p className="text-sm font-medium text-[var(--text)]">{question.question}</p>
        <div className="flex flex-col gap-2">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = selected === i;
            const showState = selected !== null;
            return (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(i)}
                disabled={selected !== null}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left text-sm transition",
                  !showState && "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/60 hover:bg-[var(--surface-soft)]",
                  showState && isCorrect && "border-[var(--success)] bg-[var(--success-soft)] text-[var(--text)]",
                  showState && isSelected && !isCorrect && "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--text)]",
                  showState && !isSelected && !isCorrect && "border-[var(--border)] text-[var(--text-secondary)] opacity-70"
                )}
              >
                {option}
                {showState && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[var(--success)]" />}
                {showState && isSelected && !isCorrect && <XCircle className="h-4.5 w-4.5 shrink-0 text-[var(--danger)]" />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4">
            <p className="text-sm leading-relaxed text-[var(--text)]">{question.explanation}</p>
            <Button size="sm" className="mt-3" onClick={next}>
              {step < questions.length - 1 ? "Next question" : "See results"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
