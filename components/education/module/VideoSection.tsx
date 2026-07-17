"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";

export function VideoSection({
  duration,
  watched,
  onWatch,
  onDiscuss,
  referHref,
  onReferClick,
}: {
  duration: string;
  watched: boolean;
  onWatch: () => void;
  onDiscuss: () => void;
  referHref: string;
  onReferClick: () => void;
}) {
  const [playing, setPlaying] = useState(watched);

  useEffect(() => {
    if (watched) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync once progress hydrates from localStorage after mount
      setPlaying(true);
    }
  }, [watched]);

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">5-minute clinical overview</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            A quick practical overview of the key clinical considerations, patient conversations and referral opportunities
            relating to this topic.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            onWatch();
          }}
          className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--sidebar)] text-white"
        >
          {playing ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <CheckCircle2 className="h-7 w-7 text-[var(--accent)]" />
              </span>
              <p className="text-sm text-white/80">Demo video playing (simulation only)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20">
                <PlayCircle className="h-8 w-8" />
              </span>
              <p className="text-sm text-white/70">Play clinical overview</p>
            </div>
          )}
          <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 text-xs">{duration}</span>
        </button>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4">
          <p className="text-sm font-medium text-[var(--text)]">Does this remind you of a patient you have recently seen?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkButton href={referHref} size="sm" onClick={onReferClick}>
              Yes — Refer a Patient
            </LinkButton>
            <Button variant="outline" size="sm" onClick={onDiscuss}>
              Yes — Discuss This Case
            </Button>
            <Button variant="ghost" size="sm">
              Continue Learning
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
