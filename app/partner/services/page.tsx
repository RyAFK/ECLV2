"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/Field";
import { StepProgress } from "@/components/ui/ProgressBar";
import { PATHWAYS } from "@/data/services";
import { NavIcon } from "@/components/navigation/NavIcon";

const CONCERN_OPTIONS = [
  "Cloudy or reduced vision",
  "Glare or night-driving difficulty",
  "Reduced dependence on glasses",
  "High prescription",
  "Dry, sore or gritty eyes",
  "Corneal irregularity",
  "Raised eye pressure",
  "Retinal finding",
  "Child eye concern",
  "Sudden or urgent symptom",
  "Existing diagnosis requiring a second opinion",
  "Unsure",
];

const SUPPORT_OPTIONS = [
  "Routine specialist assessment",
  "Refractive suitability assessment",
  "Surgical opinion",
  "Dry-eye assessment",
  "Second opinion",
  "Urgent review",
  "Advice before referring",
  "Unsure",
];

const DOCUMENT_OPTIONS = ["OCT", "Visual field", "Topography", "Biometry", "Prescription", "Referral letter", "No documents", "Unsure"];

function suggestPathway(concern: string, support: string): { id: string; name: string } {
  if (concern === "Sudden or urgent symptom" || support === "Urgent review") return { id: "emergency", name: "Emergency eye assessment" };
  if (concern === "Existing diagnosis requiring a second opinion" || support === "Second opinion") return { id: "second-opinion", name: "Second opinion" };
  if (concern === "Cloudy or reduced vision" || concern === "Glare or night-driving difficulty") return { id: "cataract", name: "Cataract assessment" };
  if (concern === "Reduced dependence on glasses" && support === "Surgical opinion") return { id: "laser-vision", name: "Laser vision correction" };
  if (concern === "Reduced dependence on glasses") return { id: "rle", name: "Refractive lens exchange" };
  if (concern === "High prescription") return { id: "icl", name: "Implantable contact lens" };
  if (concern === "Dry, sore or gritty eyes") return { id: "dry-eye", name: "Dry eye and ocular surface" };
  if (concern === "Corneal irregularity") return { id: "cornea-keratoconus", name: "Cornea and keratoconus" };
  if (concern === "Raised eye pressure") return { id: "glaucoma", name: "Glaucoma assessment" };
  if (concern === "Retinal finding") return { id: "retina", name: "Retina assessment" };
  if (concern === "Child eye concern") return { id: "paediatric", name: "Paediatric ophthalmology" };
  return { id: "cataract", name: "Cataract assessment" };
}

export default function ServicesPage() {
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderStep, setFinderStep] = useState(1);
  const [concern, setConcern] = useState("");
  const [support, setSupport] = useState("");
  const [docs, setDocs] = useState("");

  const result = concern && support ? suggestPathway(concern, support) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Specialist eye-care pathways for your patients
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-secondary)]">
          Explore consultant-led assessment, advanced diagnostics and personalised treatment pathways available
          through Eye Clinic London.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PATHWAYS.filter((p) => p.id !== "not-sure").map((pathway) => (
          <Card key={pathway.id} className="flex flex-col gap-4 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <NavIcon name="Stethoscope" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-serif-display text-lg font-semibold text-[var(--text)]">{pathway.name}</h3>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{pathway.description}</p>
            </div>
            {pathway.elements.length > 0 && (
              <ul className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
                {pathway.elements.slice(0, 4).map((el) => (
                  <li key={el} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                    {el}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto flex gap-2 pt-2">
              <LinkButton href="/partner/refer" size="sm">
                Refer a patient
              </LinkButton>
              <LinkButton href="/partner/education" variant="outline" size="sm">
                Explore pathway
              </LinkButton>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-[var(--surface-soft)]">
        <CardBody className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <HelpCircle className="h-5 w-5" />
            </span>
            <h2 className="font-serif-display text-xl font-semibold text-[var(--text)]">
              Not sure which pathway may be relevant?
            </h2>
          </div>

          {!finderOpen ? (
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Use our interactive, non-diagnostic service finder to explore a suggested pathway in under a minute.
              </p>
              <Button className="mt-4" onClick={() => setFinderOpen(true)}>
                Start service finder
              </Button>
            </div>
          ) : !result ? (
            <div className="flex flex-col gap-4">
              <StepProgress step={finderStep} totalSteps={3} />
              {finderStep === 1 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[var(--text)]">What is the patient&rsquo;s main concern?</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {CONCERN_OPTIONS.map((c) => (
                      <RadioCard key={c} label={c} selected={concern === c} onSelect={() => { setConcern(c); setFinderStep(2); }} />
                    ))}
                  </div>
                </div>
              )}
              {finderStep === 2 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[var(--text)]">What type of support is being requested?</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SUPPORT_OPTIONS.map((s) => (
                      <RadioCard key={s} label={s} selected={support === s} onSelect={() => { setSupport(s); setFinderStep(3); }} />
                    ))}
                  </div>
                </div>
              )}
              {finderStep === 3 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[var(--text)]">Is supporting information available?</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {DOCUMENT_OPTIONS.map((d) => (
                      <RadioCard key={d} label={d} selected={docs === d} onSelect={() => setDocs(d)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Suggested pathway</p>
                <p className="mt-1.5 font-serif-display text-xl font-semibold text-[var(--text)]">{result.name}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  This is a non-diagnostic demonstration suggestion. Final pathway selection and any treatment
                  recommendation must be based on appropriate clinical assessment.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <LinkButton href="/partner/refer">
                  Start referral
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton href="/partner/contact" variant="outline">
                  Discuss with Ryan
                </LinkButton>
                <Link href="/partner/education" className="inline-flex items-center px-2 text-sm font-medium text-[var(--accent)] hover:underline">
                  View pathway information
                </Link>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                onClick={() => {
                  setFinderOpen(false);
                  setFinderStep(1);
                  setConcern("");
                  setSupport("");
                  setDocs("");
                }}
              >
                Start again
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
