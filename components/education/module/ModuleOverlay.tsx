"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { ModuleIconBadge } from "@/components/education/ModuleIcon";
import { cn } from "@/lib/utils";

export function ModuleOverlay({
  moduleIcon,
  moduleTitle,
  stepLabel,
  step,
  totalSteps,
  onClose,
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
  showBack = true,
  children,
}: {
  moduleIcon: string;
  moduleTitle: string;
  stepLabel: string;
  step: number;
  totalSteps: number;
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]">
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <ModuleIconBadge name={moduleIcon} className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--text)]">{moduleTitle}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Step {step} of {totalSteps} · {stepLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close and return to Clinical Education"
            className="shrink-0 rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <StepProgress step={step} totalSteps={totalSteps} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">{children}</div>
      </div>

      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {showBack ? (
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={onContinue} disabled={continueDisabled} className={cn(continueDisabled && "opacity-50")}>
            {continueLabel}
            {continueLabel === "Continue" && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
