import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  description,
  context,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  description?: string;
  context?: string;
  icon?: LucideIcon;
  tone?: "default" | "accent";
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        {Icon && (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              tone === "accent" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--surface-soft)] text-[var(--text-secondary)]"
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-3 font-serif-display text-3xl font-semibold text-[var(--text)]">{value}</p>
      {description && <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>}
      {context && (
        <p className="mt-2 inline-flex items-center rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
          {context}
        </p>
      )}
    </Card>
  );
}
