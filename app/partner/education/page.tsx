"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download, GraduationCap, PlayCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { EDUCATION_CATEGORIES, EDUCATION_MODULES, UPCOMING_CPD_EVENT } from "@/data/education";
import type { EducationModule } from "@/lib/types";

export default function EducationCentrePage() {
  const { showToast } = useToast();
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<EducationModule | null>(null);

  const filtered = useMemo(
    () => (category === "All" ? EDUCATION_MODULES : EDUCATION_MODULES.filter((m) => m.category === category)),
    [category]
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Professional education centre</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
          Clinical resources designed to help referring professionals understand Eye Clinic London pathways,
          referral triggers and patient conversations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EDUCATION_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              category === c
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((module) => (
          <Card key={module.id} className="flex flex-col overflow-hidden">
            <button
              onClick={() => setActive(module)}
              className="relative flex aspect-video items-center justify-center bg-[var(--sidebar)] text-white"
            >
              <PlayCircle className="h-10 w-10 opacity-90" />
              <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-xs">{module.duration}</span>
            </button>
            <CardBody className="flex flex-1 flex-col gap-2">
              <Badge tone="accent">{module.category}</Badge>
              <h3 className="font-serif-display text-base font-semibold text-[var(--text)]">{module.title}</h3>
              <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{module.summary}</p>
              <Button variant="outline" size="sm" className="mt-auto w-fit" onClick={() => setActive(module)}>
                Watch module
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="bg-[var(--sidebar)] text-white">
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[var(--accent)]">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Upcoming CPD event</p>
              <p className="font-serif-display text-lg font-semibold">{UPCOMING_CPD_EVENT.title}</p>
              <p className="mt-1 text-sm text-white/70">
                {UPCOMING_CPD_EVENT.date} · {UPCOMING_CPD_EVENT.time} · {UPCOMING_CPD_EVENT.location}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => showToast({ variant: "success", title: "Interest registered", description: "We'll confirm your place at the CPD evening." })}
            >
              Register interest
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/25 text-white hover:bg-white/10"
              onClick={() => showToast({ variant: "info", title: "Attendee guide downloaded", description: "Demo PDF (simulation only)." })}
            >
              <Download className="h-4 w-4" />
              Attendee guide
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-white/10"
              onClick={() => showToast({ variant: "success", title: "Request sent", description: "Ryan will follow up about a practice-based session." })}
            >
              Request practice session
            </Button>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title ?? ""}
        description={active ? `${active.duration} · ${active.category}` : undefined}
      >
        {active && (
          <div className="flex flex-col gap-5">
            <div className="flex aspect-video items-center justify-center rounded-xl bg-[var(--sidebar)] text-white">
              <div className="text-center">
                <PlayCircle className="mx-auto h-10 w-10 opacity-80" />
                <p className="mt-2 text-xs text-white/60">Demo video placeholder</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{active.summary}</p>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Learning objectives</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-[var(--text-secondary)]">
                {active.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "success", title: "Knowledge check complete", description: "3/3 demo questions answered." })}
              >
                <GraduationCap className="h-4 w-4" />
                Take knowledge check
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast({ variant: "info", title: "Guide downloaded", description: "Demo PDF (simulation only)." })}
              >
                <Download className="h-4 w-4" />
                Download guide
              </Button>
              <LinkButton href="/partner/refer" size="sm">
                Refer a patient
              </LinkButton>
              <LinkButton href="/partner/contact" variant="ghost" size="sm">
                Book a conversation with Ryan
              </LinkButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
