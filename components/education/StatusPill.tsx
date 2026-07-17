import { CheckCircle2, CircleDashed, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ModuleProgressStatus } from "@/lib/types";

const STATUS_CONFIG: Record<ModuleProgressStatus, { label: string; tone: "neutral" | "accent" | "success"; icon: typeof CheckCircle2 }> = {
  "not-started": { label: "Not started", tone: "neutral", icon: CircleDashed },
  "in-progress": { label: "In progress", tone: "accent", icon: PlayCircle },
  completed: { label: "Completed", tone: "success", icon: CheckCircle2 },
};

export function StatusPill({ status }: { status: ModuleProgressStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge tone={config.tone}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
