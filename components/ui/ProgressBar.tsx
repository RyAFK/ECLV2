import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  className,
  tone = "accent",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "accent" | "success" | "warning" | "danger" | "information";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneVar = {
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    information: "var(--information)",
  }[tone];
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: toneVar }}
      />
    </div>
  );
}

export function StepProgress({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i < step ? "bg-[var(--accent)]" : "bg-[var(--surface-soft)]"
          )}
        />
      ))}
    </div>
  );
}
