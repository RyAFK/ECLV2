"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/Field";
import type { ClinicalCaseOption } from "@/lib/types";

export function CaseStudySection({
  scenario,
  options,
  onAnswered,
  onDiscuss,
  onAddNote,
}: {
  scenario: string;
  options: ClinicalCaseOption[];
  onAnswered: () => void;
  onDiscuss: () => void;
  onAddNote: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function select(index: number) {
    if (selected === null) onAnswered();
    setSelected(index);
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Patient Scenario</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">{scenario}</p>
        </div>

        <p className="text-sm font-medium text-[var(--text)]">What would you consider doing next?</p>
        <div className="flex flex-col gap-2">
          {options.map((option, i) => (
            <RadioCard key={option.label} label={option.label} selected={selected === i} onSelect={() => select(i)} />
          ))}
        </div>

        {selected !== null && (
          <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Educational feedback</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--text)]">{options[selected].feedback}</p>
          </div>
        )}

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4">
          <p className="text-sm font-medium text-[var(--text)]">Does this patient sound familiar?</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            You may already have a patient in your practice with a similar presentation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkButton href="/partner/refer" size="sm">
              Refer My Patient
            </LinkButton>
            <Button variant="outline" size="sm" onClick={onDiscuss}>
              Discuss My Patient With Ryan
            </Button>
            <Button variant="ghost" size="sm" onClick={onAddNote}>
              <NotebookPen className="h-3.5 w-3.5" />
              Save a note about this patient
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
