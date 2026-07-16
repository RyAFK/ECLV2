import type { EducationModule } from "@/lib/types";

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: "when-refer-cataract",
    title: "When should I refer for cataract surgery?",
    duration: "5:12",
    category: "Cataract",
    summary:
      "A practical overview of the symptoms and functional triggers that suggest a cataract assessment may be appropriate.",
    objectives: [
      "Recognise common cataract symptoms and functional impact",
      "Understand what happens during an ECL cataract assessment",
      "Know when to refer versus continue monitoring",
    ],
  },
  {
    id: "rle-conversation",
    title: "Identifying a suitable refractive lens exchange conversation",
    duration: "4:48",
    category: "Lens-based correction",
    summary: "How to spot patients who may benefit from a refractive lens exchange conversation.",
    objectives: [
      "Identify presbyopic patients who may be suitable for RLE",
      "Understand lifestyle and refractive-goal questions to ask",
      "Know how to introduce the RLE pathway to a patient",
    ],
  },
  {
    id: "icl-vs-laser",
    title: "ICL versus laser vision correction",
    duration: "6:04",
    category: "Refractive",
    summary: "Comparing implantable contact lens and laser vision correction suitability considerations.",
    objectives: [
      "Understand the key differences between ICL and laser pathways",
      "Know which prescription ranges commonly suit each option",
      "Recognise when specialist assessment is needed to decide",
    ],
  },
  {
    id: "premium-lens-conversations",
    title: "Understanding premium lens conversations",
    duration: "5:35",
    category: "Cataract and RLE",
    summary: "Supporting patients through premium lens options during cataract and RLE conversations.",
    objectives: [
      "Understand the range of lens options available",
      "Learn how to set realistic patient expectations",
      "Know what ECL covers in the lens-option discussion",
    ],
  },
  {
    id: "managing-expectations",
    title: "Managing patient expectations before referral",
    duration: "4:20",
    category: "Patient communication",
    summary: "Simple communication techniques to prepare patients for a specialist referral.",
    objectives: [
      "Frame the referral conversation clearly for patients",
      "Explain what to expect from the ECL referral journey",
      "Reduce patient anxiety ahead of specialist assessment",
    ],
  },
  {
    id: "dry-eye-signs",
    title: "Dry-eye signs that may benefit from specialist assessment",
    duration: "5:46",
    category: "Dry eye",
    summary: "Recognising ocular-surface signs that may warrant a specialist dry-eye referral.",
    objectives: [
      "Identify key dry-eye and ocular-surface red flags",
      "Understand when contact-lens intolerance suggests referral",
      "Know what a specialist dry-eye assessment involves",
    ],
  },
  {
    id: "corneal-red-flags",
    title: "Corneal red flags and when specialist review may help",
    duration: "6:18",
    category: "Cornea",
    summary: "A guide to identifying corneal irregularities and when to refer for specialist review.",
    objectives: [
      "Recognise signs suggestive of keratoconus",
      "Understand the role of topography in referral decisions",
      "Know when urgent corneal review is appropriate",
    ],
  },
  {
    id: "after-ecl-referral",
    title: "What happens after an ECL referral?",
    duration: "3:22",
    category: "Referral pathway",
    summary: "A walkthrough of the referral journey from submission through to completed pathway.",
    objectives: [
      "Understand each stage of the ECL referral pathway",
      "Know what communication to expect as a referring professional",
      "Understand how to track referral progress in ECL Connect",
    ],
  },
];

export const EDUCATION_CATEGORIES = [
  "All",
  "Cataract",
  "Lens-based correction",
  "Laser vision correction",
  "ICL",
  "Dry eye",
  "Cornea",
  "Glaucoma",
  "Retina",
  "Paediatric eye care",
  "Red flags",
  "Patient communication",
  "Case studies",
];

export const UPCOMING_CPD_EVENT = {
  title: "Optometrist and Dispensing Optician CPD Evening",
  date: "6 August 2026",
  time: "6:30pm – 8:30pm",
  location: "Eye Clinic London, Harley Street",
  description:
    "A fictional professional education evening covering cataract, refractive and dry-eye referral pathways, with CPD points available.",
};
