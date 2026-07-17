"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Textarea, Checkbox } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

interface PatientNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: string, markForDiscussion: boolean) => void;
}

export function PatientNoteModal({ open, onClose, onSave }: PatientNoteModalProps) {
  const { showToast } = useToast();
  const [note, setNote] = useState("");
  const [markForDiscussion, setMarkForDiscussion] = useState(false);

  function handleSave() {
    if (!note.trim()) return;
    onSave(note.trim(), markForDiscussion);
    showToast({
      variant: "success",
      title: "Added to Patients I Have in Mind",
      description: "You can revisit, discuss or convert this note from your Clinical Education dashboard.",
    });
    setNote("");
    setMarkForDiscussion(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Patients I Have in Mind" description="Save a broad, non-identifiable note about a patient you'd like to revisit.">
      <div className="flex flex-col gap-4">
        <Field label="Note" htmlFor="pn-note" hint="e.g. Patient in their late 60s struggling with glare and night driving. Discuss cataract assessment at next review.">
          <Textarea id="pn-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe the patient in general, non-identifiable terms" />
        </Field>
        <Checkbox label="Mark for discussion with Ryan" checked={markForDiscussion} onChange={(e) => setMarkForDiscussion(e.target.checked)} />
        <p className="text-xs text-[var(--text-secondary)]">
          Please do not include patient names, dates of birth, addresses or any other identifiable information.
        </p>
        <Button onClick={handleSave} disabled={!note.trim()} className="w-fit">
          Save note
        </Button>
      </div>
    </Modal>
  );
}
