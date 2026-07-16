import { Badge } from "@/components/ui/Badge";
import { REFERRAL_STAGE_LABELS, type ReferralStage, type RelationshipStatus } from "@/lib/types";

const STAGE_TONE: Record<ReferralStage, "neutral" | "success" | "warning" | "danger" | "information" | "accent"> = {
  new: "information",
  "awaiting-contact": "warning",
  contacted: "information",
  triage: "warning",
  "consultation-booked": "accent",
  "consultation-completed": "accent",
  "treatment-recommended": "accent",
  "treatment-booked": "success",
  "procedure-completed": "success",
  aftercare: "success",
  completed: "neutral",
  closed: "neutral",
  lost: "danger",
};

export function ReferralStatusBadge({ stage }: { stage: ReferralStage }) {
  return <Badge tone={STAGE_TONE[stage]}>{REFERRAL_STAGE_LABELS[stage]}</Badge>;
}

const RELATIONSHIP_TONE: Record<RelationshipStatus, "neutral" | "success" | "warning" | "danger" | "information" | "accent"> = {
  Strategic: "accent",
  Active: "success",
  Developing: "information",
  New: "information",
  Dormant: "warning",
  "At risk": "danger",
};

export function RelationshipStatusBadge({ status }: { status: RelationshipStatus }) {
  return <Badge tone={RELATIONSHIP_TONE[status]}>{status}</Badge>;
}

const PRIORITY_TONE: Record<"High" | "Medium" | "Low", "neutral" | "success" | "warning" | "danger" | "information" | "accent"> = {
  High: "danger",
  Medium: "warning",
  Low: "neutral",
};

export function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{priority} priority</Badge>;
}
