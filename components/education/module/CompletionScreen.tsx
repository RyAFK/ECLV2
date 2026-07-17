"use client";

import { Download, MessageCircle, PartyPopper, RotateCcw, Stethoscope } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function CompletionScreen({
  moduleTitle,
  guideTitle,
  onDiscuss,
}: {
  moduleTitle: string;
  guideTitle: string;
  onDiscuss: () => void;
}) {
  const { showToast } = useToast();

  return (
    <Card className="overflow-hidden border-[var(--accent)]/30 bg-gradient-to-br from-[var(--sidebar)] to-[#232019] text-white">
      <CardBody className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[var(--accent)]">
          <PartyPopper className="h-7 w-7" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Module Complete</p>
          <p className="mt-1.5 font-serif-display text-xl font-semibold sm:text-2xl">{moduleTitle}</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
            You now have a practical framework to help identify patients who may benefit from further ophthalmic assessment.
          </p>
        </div>

        <p className="mt-2 text-sm font-medium text-white/90">What would you like to do next?</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <LinkButton href="/partner/refer" variant="secondary">
            <Stethoscope className="h-4 w-4" />
            Refer a Patient
          </LinkButton>
          <Button variant="outline" className="border-white/25 text-white hover:bg-white/10" onClick={onDiscuss}>
            <MessageCircle className="h-4 w-4" />
            Discuss a Case With Ryan
          </Button>
          <Button
            variant="outline"
            className="border-white/25 text-white hover:bg-white/10"
            onClick={() =>
              showToast({ variant: "success", title: "Demo PDF downloaded", description: `${guideTitle}.pdf (simulation only)` })
            }
          >
            <Download className="h-4 w-4" />
            Download Referral Guide
          </Button>
          <LinkButton href="/partner/education" variant="ghost" className="text-white/80 hover:bg-white/10">
            <RotateCcw className="h-4 w-4" />
            Start Another Module
          </LinkButton>
        </div>
      </CardBody>
    </Card>
  );
}
