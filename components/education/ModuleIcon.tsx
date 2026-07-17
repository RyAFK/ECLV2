import { Aperture, ClipboardCheck, Eye, Focus, GitCompare, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Eye,
  Focus,
  GitCompare,
  Aperture,
  ClipboardCheck,
  TriangleAlert,
};

export function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Eye;
  return <Icon className={className} aria-hidden="true" />;
}

export function ModuleIconBadge({ name, className, tone = "accent" }: { name: string; className?: string; tone?: "accent" | "danger" }) {
  return (
    <span
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
        tone === "danger" ? "bg-[var(--danger-soft)] text-[var(--danger)]" : "bg-[var(--accent-soft)] text-[var(--accent)]",
        className
      )}
    >
      <ModuleIcon name={name} className="h-6 w-6" />
    </span>
  );
}
