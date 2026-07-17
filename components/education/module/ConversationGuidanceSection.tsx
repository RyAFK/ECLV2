import { MessageSquareQuote } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

export function ConversationGuidanceSection({ examples }: { examples: string[] }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">
          How could I introduce this conversation to my patient?
        </h2>
        <div className="flex flex-col gap-3">
          {examples.map((example, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4">
              <MessageSquareQuote className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <p className="text-sm italic leading-relaxed text-[var(--text)]">&ldquo;{example}&rdquo;</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          These are example conversation starters only. Professional clinical judgement should always be used, and none of
          these examples constitute a diagnosis or a guaranteed treatment outcome.
        </p>
      </CardBody>
    </Card>
  );
}
