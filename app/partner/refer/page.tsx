"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { Field, Input, Select, Textarea, Checkbox, RadioCard } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { REFERRAL_FORM_DISCLAIMER } from "@/lib/constants";
import { PATHWAYS } from "@/data/services";
import { PATHWAY_SPECIFIC_QUESTIONS, SHARED_CLINICAL_QUESTIONS } from "@/data/pathway-questions";
import type { PathwayId } from "@/lib/types";
import { NavIcon } from "@/components/navigation/NavIcon";

const STEPS = ["Patient", "Referral reason", "Clinical information", "Documents and preferences", "Review", "Submitted"];

const DOCUMENT_TYPES = [
  "Referral letter",
  "OCT",
  "Visual fields",
  "Corneal topography",
  "Biometry",
  "Prescription",
  "Previous correspondence",
  "Other clinical document",
];

interface UploadedDoc {
  name: string;
  type: string;
  progress: number;
}

interface FormState {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  preferredContact: string;
  preferredTime: string;
  consent: boolean;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  pathwayId: PathwayId | "";
  reason: string;
  symptoms: string;
  laterality: string;
  urgency: string;
  preferredConsultant: string;
  additionalNotes: string;
  relevantFactors: string[];
  location: string;
  preferredDay: string;
  preferredTimeSlot: string;
  documentContactMethod: string;
  insuranceStatus: string;
  priorityAppointment: boolean;
  preReferralDiscussion: boolean;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  phone: "",
  address: "",
  postcode: "",
  preferredContact: "Email",
  preferredTime: "Morning",
  consent: false,
  guardianName: "",
  guardianRelationship: "",
  guardianPhone: "",
  pathwayId: "",
  reason: "",
  symptoms: "",
  laterality: "Both",
  urgency: "Routine",
  preferredConsultant: "",
  additionalNotes: "",
  relevantFactors: [],
  location: "No preference",
  preferredDay: "",
  preferredTimeSlot: "No preference",
  documentContactMethod: "Email",
  insuranceStatus: "Unsure",
  priorityAppointment: false,
  preReferralDiscussion: false,
};

function generateReference() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ECL-2026-${num}`;
}

export default function ReferPatientPage() {
  return (
    <Suspense fallback={null}>
      <ReferPatientForm />
    </Suspense>
  );
}

function ReferPatientForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const pathwayParam = searchParams.get("pathway");
  const preselectedPathway = PATHWAYS.some((p) => p.id === pathwayParam) ? (pathwayParam as PathwayId) : "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({ ...INITIAL_STATE, pathwayId: preselectedPathway });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [reference, setReference] = useState("");

  const selectedPathway = PATHWAYS.find((p) => p.id === form.pathwayId);
  const isPaediatric = form.pathwayId === "paediatric";
  const isEmergency = form.pathwayId === "emergency";

  const pathwayQuestions = useMemo(() => {
    if (!form.pathwayId) return [];
    return [...SHARED_CLINICAL_QUESTIONS, ...PATHWAY_SPECIFIC_QUESTIONS[form.pathwayId]];
  }, [form.pathwayId]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFactor(factor: string) {
    setForm((prev) => ({
      ...prev,
      relevantFactors: prev.relevantFactors.includes(factor)
        ? prev.relevantFactors.filter((f) => f !== factor)
        : [...prev.relevantFactors, factor],
    }));
  }

  function validateStep(current: number): boolean {
    const newErrors: Record<string, string> = {};
    if (current === 1) {
      if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
      if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
      if (!form.dob) newErrors.dob = "Date of birth is required.";
      if (!form.email.trim() && !form.phone.trim()) newErrors.email = "Provide an email or contact number.";
      if (!form.consent) newErrors.consent = "Consent confirmation is required to proceed.";
      if (isPaediatric && !form.guardianName.trim()) newErrors.guardianName = "Parent or guardian name is required.";
    }
    if (current === 2) {
      if (!form.pathwayId) newErrors.pathwayId = "Select a pathway to continue.";
    }
    if (current === 3) {
      if (!form.reason.trim()) newErrors.reason = "Primary reason for referral is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileSelect(type: string, fileName: string) {
    setDocs((prev) => [...prev, { name: fileName, type, progress: 0 }]);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setDocs((prev) =>
        prev.map((d) => (d.name === fileName && d.type === type ? { ...d, progress: Math.min(progress, 100) } : d))
      );
      if (progress >= 100) clearInterval(interval);
    }, 250);
  }

  function saveDraft() {
    showToast({
      variant: "info",
      title: "Referral saved as demo draft",
      description: "You can find this in your recently submitted referrals (demo state only).",
    });
  }

  function submitReferral() {
    const ref = generateReference();
    setReference(ref);
    setStep(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Refer a patient</h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Complete the guided referral form to send a patient to Eye Clinic London.
        </p>
      </div>

      {step < 6 && preselectedPathway && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/30 px-4 py-3 text-sm text-[var(--text)]">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <p>
            We&apos;ve pre-selected <strong>{PATHWAYS.find((p) => p.id === preselectedPathway)?.name}</strong> based on where
            you came from — you can change this in step 2 if it isn&apos;t right.
          </p>
        </div>
      )}

      {step < 6 && (
        <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-4 py-3 text-sm text-[var(--text)]">
          {REFERRAL_FORM_DISCLAIMER}
        </div>
      )}

      {step < 6 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>
              Step {step} of 5: {STEPS[step - 1]}
            </span>
          </div>
          <StepProgress step={step} totalSteps={5} />
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardBody className="flex flex-col gap-5">
            <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Patient details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
                <Input id="firstName" value={form.firstName} invalid={!!errors.firstName} onChange={(e) => update("firstName", e.target.value)} />
              </Field>
              <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
                <Input id="lastName" value={form.lastName} invalid={!!errors.lastName} onChange={(e) => update("lastName", e.target.value)} />
              </Field>
              <Field label="Date of birth" htmlFor="dob" required error={errors.dob}>
                <Input id="dob" type="date" value={form.dob} invalid={!!errors.dob} onChange={(e) => update("dob", e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email} hint="Provide an email or contact number.">
                <Input id="email" type="email" value={form.email} invalid={!!errors.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Contact number" htmlFor="phone">
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </Field>
              <Field label="Postcode" htmlFor="postcode">
                <Input id="postcode" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} />
              </Field>
              <Field label="Address" htmlFor="address" className="sm:col-span-2">
                <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </Field>
              <Field label="Preferred contact method" htmlFor="preferredContact">
                <Select id="preferredContact" value={form.preferredContact} onChange={(e) => update("preferredContact", e.target.value)}>
                  <option>Email</option>
                  <option>Phone</option>
                  <option>SMS</option>
                </Select>
              </Field>
              <Field label="Preferred contact time" htmlFor="preferredTime">
                <Select id="preferredTime" value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </Select>
              </Field>
            </div>

            {isPaediatric && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <p className="text-sm font-medium text-[var(--text)]">Parent or guardian details</p>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Guardian name" htmlFor="guardianName" required error={errors.guardianName}>
                    <Input id="guardianName" value={form.guardianName} invalid={!!errors.guardianName} onChange={(e) => update("guardianName", e.target.value)} />
                  </Field>
                  <Field label="Relationship to patient" htmlFor="guardianRelationship">
                    <Input id="guardianRelationship" value={form.guardianRelationship} onChange={(e) => update("guardianRelationship", e.target.value)} />
                  </Field>
                  <Field label="Guardian contact number" htmlFor="guardianPhone">
                    <Input id="guardianPhone" value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} />
                  </Field>
                </div>
              </div>
            )}

            <Checkbox
              label="I confirm the patient (or their parent/guardian) has consented to this referral being made to Eye Clinic London."
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
            />
            {errors.consent && <p className="text-xs text-[var(--danger)]">{errors.consent}</p>}
          </CardBody>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardBody className="flex flex-col gap-4">
            <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">
              Which Eye Clinic London pathway may be relevant?
            </h2>
            {errors.pathwayId && <p className="text-xs text-[var(--danger)]">{errors.pathwayId}</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PATHWAYS.map((pathway) => (
                <RadioCard
                  key={pathway.id}
                  label={pathway.name}
                  description={pathway.shortDescription}
                  selected={form.pathwayId === pathway.id}
                  onSelect={() => update("pathwayId", pathway.id)}
                  icon={<NavIcon name="Sparkles" className="h-4 w-4" />}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardBody className="flex flex-col gap-5">
            <div>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Clinical information</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Pathway selected: <span className="font-medium text-[var(--text)]">{selectedPathway?.name}</span>
              </p>
            </div>

            {isEmergency && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-4 text-sm text-[var(--text)]">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]" />
                <p>
                  This demo does not provide clinical triage. In a live system, emergency referrals must follow
                  approved urgent-care protocols.
                </p>
              </div>
            )}

            <Field label="Primary reason for referral" htmlFor="reason" required error={errors.reason}>
              <Textarea id="reason" value={form.reason} invalid={!!errors.reason} onChange={(e) => update("reason", e.target.value)} placeholder="Describe the primary reason for this referral" />
            </Field>
            <Field label="Symptoms" htmlFor="symptoms">
              <Textarea id="symptoms" value={form.symptoms} onChange={(e) => update("symptoms", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Laterality" htmlFor="laterality">
                <Select id="laterality" value={form.laterality} onChange={(e) => update("laterality", e.target.value)}>
                  <option>Right</option>
                  <option>Left</option>
                  <option>Both</option>
                </Select>
              </Field>
              <Field label="Urgency" htmlFor="urgency">
                <Select id="urgency" value={form.urgency} onChange={(e) => update("urgency", e.target.value)}>
                  <option>Routine</option>
                  <option>Soon</option>
                  <option>Urgent</option>
                </Select>
              </Field>
              <Field label="Preferred consultant" htmlFor="preferredConsultant">
                <Input id="preferredConsultant" value={form.preferredConsultant} onChange={(e) => update("preferredConsultant", e.target.value)} placeholder="If applicable" />
              </Field>
            </div>

            {pathwayQuestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Relevant clinical factors</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Select any factors relevant to this pathway.</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {pathwayQuestions.map((q) => (
                    <Checkbox
                      key={q}
                      label={q}
                      checked={form.relevantFactors.includes(q)}
                      onChange={() => toggleFactor(q)}
                    />
                  ))}
                </div>
              </div>
            )}

            <Field label="Additional clinical notes" htmlFor="additionalNotes">
              <Textarea id="additionalNotes" value={form.additionalNotes} onChange={(e) => update("additionalNotes", e.target.value)} />
            </Field>
          </CardBody>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardBody className="flex flex-col gap-6">
            <div>
              <h2 className="font-serif-display text-lg font-semibold text-[var(--text)]">Documents and preferences</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Demo upload only — files are not stored or transmitted anywhere.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DOCUMENT_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-dashed border-[var(--border)] p-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
                >
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-[var(--text-secondary)]" />
                    {type}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(type, file.name);
                      e.target.value = "";
                    }}
                  />
                  <span className="text-xs font-medium text-[var(--accent)]">Attach</span>
                </label>
              ))}
            </div>

            {docs.length > 0 && (
              <div className="flex flex-col gap-2">
                {docs.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
                    <FileText className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text)]">{doc.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{doc.type} · Demo upload only</p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]">
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                    </div>
                    {doc.progress >= 100 ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
                    ) : (
                      <span className="text-xs text-[var(--text-secondary)]">{doc.progress}%</span>
                    )}
                    <button
                      aria-label="Remove file"
                      onClick={() => setDocs((prev) => prev.filter((_, idx) => idx !== i))}
                      className="shrink-0 rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Clinic location preference" htmlFor="location">
                <Select id="location" value={form.location} onChange={(e) => update("location", e.target.value)}>
                  <option>No preference</option>
                  <option>London clinic</option>
                  <option>East Grinstead location</option>
                </Select>
              </Field>
              <Field label="Preferred day" htmlFor="preferredDay">
                <Input id="preferredDay" value={form.preferredDay} onChange={(e) => update("preferredDay", e.target.value)} placeholder="e.g. Weekday mornings" />
              </Field>
              <Field label="Preferred appointment time" htmlFor="preferredTimeSlot">
                <Select id="preferredTimeSlot" value={form.preferredTimeSlot} onChange={(e) => update("preferredTimeSlot", e.target.value)}>
                  <option>No preference</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </Select>
              </Field>
              <Field label="Preferred contact method" htmlFor="documentContactMethod">
                <Select id="documentContactMethod" value={form.documentContactMethod} onChange={(e) => update("documentContactMethod", e.target.value)}>
                  <option>Email</option>
                  <option>Phone</option>
                  <option>SMS</option>
                </Select>
              </Field>
              <Field label="Insurance status" htmlFor="insuranceStatus">
                <Select id="insuranceStatus" value={form.insuranceStatus} onChange={(e) => update("insuranceStatus", e.target.value)}>
                  <option>Insured</option>
                  <option>Self-funding</option>
                  <option>Unsure</option>
                </Select>
              </Field>
            </div>
            <div className="flex flex-col gap-2">
              <Checkbox
                label="Request priority appointment"
                checked={form.priorityAppointment}
                onChange={(e) => update("priorityAppointment", e.target.checked)}
              />
              <Checkbox
                label="Request pre-referral discussion with the clinic team"
                checked={form.preReferralDiscussion}
                onChange={(e) => update("preReferralDiscussion", e.target.checked)}
              />
            </div>
          </CardBody>
        </Card>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-4">
          <ReviewSection title="Patient details">
            <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`} />
            <ReviewRow label="Date of birth" value={form.dob} />
            <ReviewRow label="Email" value={form.email || "—"} />
            <ReviewRow label="Contact number" value={form.phone || "—"} />
            <ReviewRow label="Preferred contact" value={`${form.preferredContact}, ${form.preferredTime}`} />
          </ReviewSection>
          <ReviewSection title="Selected pathway">
            <ReviewRow label="Pathway" value={selectedPathway?.name ?? "—"} />
          </ReviewSection>
          <ReviewSection title="Clinical information">
            <ReviewRow label="Reason" value={form.reason} />
            <ReviewRow label="Laterality" value={form.laterality} />
            <ReviewRow label="Urgency" value={form.urgency} />
            <ReviewRow label="Relevant factors" value={form.relevantFactors.length ? form.relevantFactors.join(", ") : "None selected"} />
          </ReviewSection>
          <ReviewSection title="Documents">
            <ReviewRow label="Attached" value={docs.length ? docs.map((d) => d.name).join(", ") : "No documents attached"} />
          </ReviewSection>
          <ReviewSection title="Appointment preference">
            <ReviewRow label="Location" value={form.location} />
            <ReviewRow label="Preferred day" value={form.preferredDay || "No preference"} />
            <ReviewRow label="Insurance status" value={form.insuranceStatus} />
          </ReviewSection>
          <ReviewSection title="Consent declaration">
            <ReviewRow label="Consent confirmed" value={form.consent ? "Yes" : "No"} />
          </ReviewSection>
        </div>
      )}

      {step === 6 && (
        <Card className="border-[var(--success)]/30">
          <CardBody className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h2 className="font-serif-display text-2xl font-semibold text-[var(--text)]">Referral successfully received</h2>
            <p className="max-w-md text-sm text-[var(--text-secondary)]">
              Thank you. The Eye Clinic London team will review the referral and contact the patient or nominated
              representative regarding the next appropriate step.
            </p>
            <p className="rounded-full bg-[var(--surface-soft)] px-4 py-1.5 text-sm font-medium text-[var(--text)]">
              Reference: {reference}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button onClick={() => router.push("/partner/referrals")}>View referral</Button>
              <Button variant="outline" onClick={() => router.push("/partner")}>
                Return to dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(INITIAL_STATE);
                  setDocs([]);
                  setErrors({});
                  setStep(1);
                }}
              >
                Refer another patient
              </Button>
              <Button variant="ghost" onClick={() => router.push("/partner/contact")}>
                Contact Ryan
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step < 6 && (
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={goBack} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            {step === 5 && (
              <Button variant="outline" onClick={saveDraft}>
                Save demo draft
              </Button>
            )}
            {step < 5 ? (
              <Button onClick={goNext}>
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submitReferral}>Submit referral</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{title}</p>
        <div className="mt-3 flex flex-col gap-2">{children}</div>
      </CardBody>
    </Card>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text)] sm:text-right">{value || "—"}</span>
    </div>
  );
}
