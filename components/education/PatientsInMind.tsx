"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, NotebookPen, Trash2, UserRoundPlus } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { PatientNoteModal } from "@/components/education/PatientNoteModal";
import { usePatientNotes } from "@/lib/clinical-education-storage";
import { cn } from "@/lib/utils";

export function PatientsInMind() {
  const { notes, addNote, toggleDiscussion, markConverted, deleteNote } = usePatientNotes();
  const { showToast } = useToast();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  function handleConvert(id: string) {
    markConverted(id);
    showToast({ variant: "success", title: "Redirecting to referral form", description: "Demo simulation — patient details are not pre-filled." });
    router.push("/partner/refer");
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Patients I Have in Mind</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Save a broad, non-identifiable note while you learn — then discuss it with Ryan or turn it into a referral when you&apos;re ready.
            </p>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserRoundPlus className="h-4 w-4" />
            Add a note
          </Button>
        </div>

        {notes.length === 0 ? (
          <EmptyState
            icon={NotebookPen}
            title="No patients noted yet"
            description="As you work through Clinical Education modules, save a quick note about a patient who comes to mind."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.moduleTitle && <Badge tone="accent">{n.moduleTitle}</Badge>}
                    {n.markedForDiscussion && <Badge tone="information">For discussion</Badge>}
                    {n.convertedToReferral && <Badge tone="success">Referral started</Badge>}
                  </div>
                  <button
                    type="button"
                    aria-label="Delete note"
                    onClick={() => deleteNote(n.id)}
                    className="rounded-full p-1.5 text-[var(--text-secondary)] transition hover:bg-[var(--surface)] hover:text-[var(--danger)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-[var(--text)]">{n.note}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(n.markedForDiscussion && "border-[var(--accent)] text-[var(--accent)]")}
                    onClick={() => toggleDiscussion(n.id)}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {n.markedForDiscussion ? "Marked for discussion" : "Mark for discussion"}
                  </Button>
                  {!n.convertedToReferral && (
                    <Button size="sm" onClick={() => handleConvert(n.id)}>
                      Convert to referral
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <PatientNoteModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(note, markForDiscussion) => addNote(note, undefined, undefined, markForDiscussion)}
      />
    </Card>
  );
}
