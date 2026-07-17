"use client";

import { CircleCheck } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";

export function KeyIndicatorsSection({
  indicators,
  onDiscuss,
  referHref,
  onReferClick,
}: {
  indicators: string[];
  onDiscuss: () => void;
  referHref: string;
  onReferClick: () => void;
}) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">What should I look out for?</h2>
        <ul className="flex flex-col gap-2.5">
          {indicators.map((indicator) => (
            <li key={indicator} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
              <CircleCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              {indicator}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4">
          <p className="text-sm font-medium text-[var(--text)]">Recognise any of these signs in one of your patients?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onDiscuss}>
              Discuss With Ryan
            </Button>
            <LinkButton href={referHref} size="sm" onClick={onReferClick}>
              Refer This Patient
            </LinkButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
