import type { Pathway } from "@/lib/types";

export const PATHWAYS: Pathway[] = [
  {
    id: "cataract",
    name: "Cataract surgery",
    shortDescription:
      "For patients experiencing symptoms or functional difficulties that may be associated with cataract.",
    description:
      "A consultant-led pathway for assessment and personalised discussion of cataract treatment and lens options.",
    elements: [
      "Diagnostic assessment",
      "Consultant review",
      "Lens-option discussion",
      "Treatment planning",
      "Postoperative review",
      "Communication with the referring professional where appropriate",
    ],
    icon: "Eye",
  },
  {
    id: "rle",
    name: "Refractive lens exchange",
    shortDescription:
      "For suitable patients exploring a lens-based option to reduce dependence on glasses.",
    description:
      "A lens-based vision-correction pathway for suitable patients seeking reduced dependence on glasses.",
    elements: [
      "Suitability assessment",
      "Lifestyle and refractive-goal discussion",
      "Lens-option planning",
      "Consultant-led treatment plan",
      "Postoperative review",
    ],
    icon: "ScanEye",
  },
  {
    id: "laser-vision",
    name: "Laser vision correction",
    shortDescription:
      "For suitable patients interested in laser-based vision correction following specialist assessment.",
    description:
      "A specialist-led pathway covering LASIK, LASEK and PRK suitability, planning and aftercare.",
    elements: [
      "LASIK",
      "LASEK",
      "PRK",
      "Suitability assessment",
      "Corneal imaging",
      "Tear-film evaluation",
      "Consultant-led planning",
    ],
    icon: "Zap",
  },
  {
    id: "icl",
    name: "Implantable contact lens",
    shortDescription: "For suitable patients exploring an implantable lens option.",
    description:
      "A specialist lens-based option assessed according to prescription, eye anatomy, ocular health and patient goals.",
    elements: [
      "Prescription and anatomy assessment",
      "Anterior chamber evaluation",
      "Suitability discussion",
      "Consultant-led treatment plan",
      "Postoperative review",
    ],
    icon: "CircleDot",
  },
  {
    id: "dry-eye",
    name: "Dry eye and ocular surface",
    shortDescription:
      "For persistent dry-eye symptoms, meibomian gland dysfunction, contact-lens intolerance or complex ocular-surface concerns.",
    description:
      "A comprehensive assessment and personalised management pathway for dry eye and ocular-surface disease.",
    elements: [
      "Comprehensive assessment",
      "Tear-film evaluation",
      "Meibomian gland assessment",
      "Personalised management",
      "IPL where clinically appropriate",
      "Ongoing ocular-surface care",
    ],
    icon: "Droplets",
  },
  {
    id: "cornea-keratoconus",
    name: "Cornea and keratoconus",
    shortDescription:
      "For suspected or established corneal disease, irregular corneal shape or specialist corneal assessment.",
    description:
      "Specialist corneal diagnostics and management, including keratoconus assessment and second opinion.",
    elements: [
      "Corneal diagnostics",
      "Topography",
      "Keratoconus assessment",
      "Specialist second opinion",
      "Corneal disease management",
      "Surgical and non-surgical pathway discussion where appropriate",
    ],
    icon: "Radar",
  },
  {
    id: "glaucoma",
    name: "Glaucoma assessment",
    shortDescription: "For patients requiring specialist assessment, monitoring or a second opinion.",
    description: "Specialist glaucoma assessment, diagnostics, monitoring and treatment discussion.",
    elements: ["Specialist assessment", "Diagnostics", "Monitoring", "Treatment discussion"],
    icon: "Gauge",
  },
  {
    id: "retina",
    name: "Retina assessment",
    shortDescription: "For retinal symptoms, findings or specialist review.",
    description: "Retinal assessment, imaging and consultant review for a range of retinal presentations.",
    elements: ["Retinal assessment", "Imaging", "Consultant review"],
    icon: "CircleDashed",
  },
  {
    id: "paediatric",
    name: "Paediatric ophthalmology",
    shortDescription:
      "For children requiring specialist assessment of a corneal, cataract, ocular-surface or other appropriate eye concern.",
    description: "Specialist eye-care pathways for children, presented in a reassuring but professional manner.",
    elements: ["Specialist paediatric assessment", "Family-centred communication", "Coordinated follow-up"],
    icon: "Baby",
  },
  {
    id: "emergency",
    name: "Emergency eye assessment",
    shortDescription: "For urgent symptoms requiring prompt clinical review.",
    description:
      "Urgent symptoms require appropriate clinical assessment. This demo does not provide clinical triage.",
    elements: ["Prompt clinical review", "Urgent-care signposting"],
    icon: "TriangleAlert",
  },
  {
    id: "second-opinion",
    name: "Second opinion",
    shortDescription:
      "For patients seeking a specialist review of an existing diagnosis, recommendation or treatment plan.",
    description: "Consultant-led review of existing diagnoses, scans and recommendations.",
    elements: ["Review of existing diagnosis", "Review of scans and imaging", "Independent consultant opinion"],
    icon: "MessagesSquare",
  },
  {
    id: "not-sure",
    name: "Not sure",
    shortDescription: "Use the ECL Referral Assistant or let the clinic team guide the most appropriate pathway.",
    description: "Use the ECL Referral Assistant or let the clinic team guide the most appropriate pathway.",
    elements: [],
    icon: "HelpCircle",
  },
];

export function getPathway(id: string): Pathway | undefined {
  return PATHWAYS.find((p) => p.id === id);
}
