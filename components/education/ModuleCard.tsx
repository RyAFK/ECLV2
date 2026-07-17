"use client";

import { Bookmark, Clock, PlayCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ModuleIconBadge } from "@/components/education/ModuleIcon";
import { StatusPill } from "@/components/education/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { ClinicalModule, ModuleProgressRecord } from "@/lib/types";
import { computeModulePercent } from "@/lib/clinical-education-storage";

export function ModuleCard({
  module: mod,
  record,
  onToggleSave,
}: {
  module: ClinicalModule;
  record: ModuleProgressRecord;
  onToggleSave: () => void;
}) {
  const percent = computeModulePercent(record);
  const started = record.status !== "not-started";

  return (
    <Card className="flex flex-col gap-4 p-5 transition hover:border-[var(--accent)]/60 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <ModuleIconBadge name={mod.icon} />
        <button
          type="button"
          aria-label={record.savedForLater ? "Remove from saved" : "Save for later"}
          onClick={onToggleSave}
          className={cn(
            "shrink-0 rounded-full p-2 transition hover:bg-[var(--surface-soft)]",
            record.savedForLater ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
          )}
        >
          <Bookmark className={cn("h-4.5 w-4.5", record.savedForLater && "fill-current")} />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="font-serif-display text-base font-semibold leading-snug text-[var(--text)]">{mod.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{mod.summary}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={record.status} />
        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <Clock className="h-3.5 w-3.5" />
          {mod.duration}
        </span>
      </div>

      {started && (
        <div className="flex flex-col gap-1.5">
          <ProgressBar value={percent} tone={record.status === "completed" ? "success" : "accent"} />
          <p className="text-xs text-[var(--text-secondary)]">{percent}% complete</p>
        </div>
      )}

      <LinkButton href={`/partner/education/${mod.id}`} size="sm" className="mt-auto w-full" variant={record.status === "completed" ? "outline" : "primary"}>
        {record.status === "not-started" && (
          <>
            <PlayCircle className="h-4 w-4" />
            Start module
          </>
        )}
        {record.status === "in-progress" && (
          <>
            <PlayCircle className="h-4 w-4" />
            Continue module
          </>
        )}
        {record.status === "completed" && (
          <>
            <RotateCcw className="h-4 w-4" />
            Review module
          </>
        )}
      </LinkButton>
    </Card>
  );
}
