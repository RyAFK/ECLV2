"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

const AGE_RANGES = ["Under 40", "40–54", "55–64", "65–74", "75 and over"];

interface DiscussCaseModalProps {
  open: boolean;
  onClose: () => void;
  moduleTitle?: string;
  onBookRyan: () => void;
}

export function DiscussCaseModal({ open, onClose, moduleTitle, onBookRyan }: DiscussCaseModalProps) {
  const { showToast } = useToast();
  const [treatmentArea, setTreatmentArea] = useState(moduleTitle ?? "");
  const [ageRange, setAgeRange] = useState(AGE_RANGES[2]);
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setTreatmentArea(moduleTitle ?? "");
    setAgeRange(AGE_RANGES[2]);
    setSymptoms("");
    setNotes("");
  }

  function handleSend() {
    showToast({
      variant: "success",
      title: "Case enquiry sent to Ryan",
      description: "This is a demo simulation — Ryan will follow up about this scenario shortly.",
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      title="Discuss this case"
      description="Describe a broad, non-identifiable clinical scenario for Ryan to review with you."
    >
      <div className="flex flex-col gap-4">
        <Field label="Treatment area or concern" htmlFor="dc-area">
          <Input id="dc-area" value={treatmentArea} onChange={(e) => setTreatmentArea(e.target.value)} placeholder="e.g. Cataract, RLE, dry eye" />
        </Field>
        <Field label="Broad patient age range" htmlFor="dc-age">
          <Select id="dc-age" value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
            {AGE_RANGES.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </Select>
        </Field>
        <Field label="Main symptoms or presenting concerns" htmlFor="dc-symptoms">
          <Textarea id="dc-symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe the presenting concern in general terms — no identifiable patient details." />
        </Field>
        <Field label="Optional additional notes" htmlFor="dc-notes">
          <Textarea id="dc-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <p className="text-xs text-[var(--text-secondary)]">
          Please do not enter real patient-identifiable information in this demonstration environment.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSend}>Send case enquiry</Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onBookRyan();
            }}
          >
            Book a conversation with Ryan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
