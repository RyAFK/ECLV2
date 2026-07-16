import type { UpdateItem } from "@/lib/types";

export const UPDATES: UpdateItem[] = [
  {
    id: "new-platform",
    title: "New ECL professional referral platform",
    description:
      "Making it easier for professional partners to refer patients and follow referral milestones from a single dashboard.",
    date: "2026-07-10",
    category: "Clinic update",
  },
  {
    id: "cataract-refractive-update",
    title: "Cataract and refractive pathway update",
    description:
      "A demonstration update explaining how professionals can access pathway information and referral support.",
    date: "2026-07-06",
    category: "Services",
  },
  {
    id: "new-education-module",
    title: "New clinical education module",
    description: "A new referral-focused module covering dry eye and ocular-surface assessment.",
    date: "2026-07-02",
    category: "Education",
  },
  {
    id: "cpd-evening",
    title: "Upcoming optometrist CPD evening",
    description: "A fictional professional education event for optometrists and dispensing opticians.",
    date: "2026-06-28",
    category: "CPD",
  },
  {
    id: "patient-materials",
    title: "Patient information materials available",
    description: "Partners can request printed or digital pathway leaflets for their practice.",
    date: "2026-06-20",
    category: "Partner resources",
  },
  {
    id: "case-study-cataract",
    title: "Case study: a smoother cataract pathway for shared patients",
    description:
      "A fictional case study illustrating how referral tracking supported a recent cataract pathway from referral to recovery.",
    date: "2026-06-14",
    category: "Case study",
  },
];

export const UPDATE_CATEGORIES = [
  "All",
  "Clinic update",
  "Education",
  "CPD",
  "Services",
  "Partner resources",
  "Case study",
];
