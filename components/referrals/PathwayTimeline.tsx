import { Check } from "lucide-react";
import type { PathwayTimelineStep } from "@/lib/types";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function PathwayTimeline({ steps }: { steps: PathwayTimelineStep[] }) {
  return (
    <ol className="relative flex flex-col gap-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.stage} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px",
                  step.complete ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                )}
              />
            )}
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm",
                step.complete
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"
              )}
            >
              {step.complete ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className={cn("text-sm font-semibold", step.complete ? "text-[var(--text)]" : "text-[var(--text-secondary)]")}>
                  {step.stage}
                </p>
                {step.date && <p className="text-xs text-[var(--text-secondary)]">{formatDate(step.date)}</p>}
              </div>
              {step.note && <p className="mt-1 text-sm text-[var(--text-secondary)]">{step.note}</p>}
              {step.staffInitials && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Updated by {step.staffInitials}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
