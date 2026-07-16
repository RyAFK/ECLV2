import type { LucideIcon } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function InsightCard({
  title,
  headline,
  recommendation,
  icon: Icon = Lightbulb,
  tone = "accent",
  action,
}: {
  title: string;
  headline: string;
  recommendation?: string;
  icon?: LucideIcon;
  tone?: "accent" | "warning" | "success" | "information" | "danger";
  action?: React.ReactNode;
}) {
  const toneClasses = {
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    information: "bg-[var(--information-soft)] text-[var(--information)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }[tone];

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", toneClasses)}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{title}</p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--text)]">{headline}</p>
          {recommendation && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text)]">Recommendation: </span>
              {recommendation}
            </p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </Card>
  );
}
