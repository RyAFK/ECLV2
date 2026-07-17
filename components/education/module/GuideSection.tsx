"use client";

import { Bookmark, CheckCircle2, Download, FileText } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { GUIDE_COVERAGE } from "@/data/clinical-education";
import { cn } from "@/lib/utils";

export function GuideSection({
  guide,
  savedForLater,
  onToggleSave,
  onDownload,
}: {
  guide: { title: string; description: string };
  savedForLater: boolean;
  onToggleSave: () => void;
  onDownload: () => void;
}) {
  const { showToast } = useToast();

  return (
    <Card className="border-[var(--accent)]/30 bg-[var(--accent-soft)]/20">
      <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)] shadow-sm">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-serif-display text-base font-semibold text-[var(--text)]">{guide.title}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{guide.description}</p>
            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {GUIDE_COVERAGE.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Button
            size="sm"
            onClick={() => {
              onDownload();
              showToast({ variant: "success", title: "Demo PDF downloaded", description: `${guide.title}.pdf (simulation only)` });
            }}
          >
            <Download className="h-4 w-4" />
            Download Referral Guide
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(savedForLater && "border-[var(--accent)] text-[var(--accent)]")}
            onClick={() => {
              onToggleSave();
              showToast({
                variant: "success",
                title: savedForLater ? "Removed from saved" : "Saved to your Clinical Education library.",
              });
            }}
          >
            <Bookmark className={cn("h-4 w-4", savedForLater && "fill-current")} />
            {savedForLater ? "Saved for Later" : "Save for Later"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
