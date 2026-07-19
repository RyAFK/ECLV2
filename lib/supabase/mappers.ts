import type { NotificationItem, Partner, PathwayId, Referral, TaskItem, UpdateItem } from "@/lib/types";
import type { NotificationRow, PartnerRow, ReferralRow, TaskRow, UpdateRow } from "./database.types";

function daysAgo(dateString: string | null): number {
  if (!dateString) return 0;
  const then = new Date(dateString + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - then.getTime();
  return Math.max(0, Math.round(diffMs / 86_400_000));
}

export function partnerRowToPartner(row: PartnerRow): Partner {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    professional: row.professional,
    role: row.role,
    location: row.location,
    referrals: row.referrals_count,
    consultations: row.consultations_count,
    treatmentBookings: row.treatment_bookings_count,
    conversion: Number(row.conversion),
    estimatedValue: Number(row.estimated_value),
    lastReferralDaysAgo: daysAgo(row.last_referral_date),
    lastContactedDaysAgo: daysAgo(row.last_contacted_date),
    lastLoginDaysAgo: daysAgo(row.last_login_date),
    relationshipStatus: row.relationship_status,
    owner: row.owner,
    engagementScore: row.engagement_score,
    mostViewedTab: row.most_viewed_tab ?? undefined,
    resourcesDownloaded: row.resources_downloaded ?? undefined,
    educationViews: row.education_views ?? undefined,
    cpdAttendance: row.cpd_attendance ?? undefined,
  };
}

export function referralRowToReferral(row: ReferralRow, partnerName: string): Referral {
  return {
    id: row.id,
    reference: row.reference,
    patientLabel: row.patient_label,
    pathwayId: row.pathway_id as PathwayId,
    pathwayName: row.pathway_name,
    reason: row.reason,
    referralDate: row.referral_date,
    stage: row.stage,
    consultant: row.consultant ?? undefined,
    appointmentDate: row.appointment_date ?? undefined,
    lastUpdate: row.last_update,
    partnerId: row.partner_id,
    partnerName,
    professionalName: row.professional_name,
    practiceLocation: row.practice_location,
    estimatedValue: Number(row.estimated_value),
    owner: row.owner,
    nextAction: row.next_action,
    conversionProbability: row.conversion_probability,
    timeline: row.timeline ?? [],
    highlightContext: row.highlight_context ?? undefined,
  };
}

function dueLabel(dueDate: string | null): { due: string; dueSort: number } {
  if (!dueDate) return { due: "No due date", dueSort: 0 };
  const due = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diffDays === 0) return { due: "Today", dueSort: 0 };
  if (diffDays === 1) return { due: "Tomorrow", dueSort: 1 };
  if (diffDays === -1) return { due: "Yesterday", dueSort: -1 };
  const label = due.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return { due: label, dueSort: diffDays };
}

export function taskRowToTask(row: TaskRow): TaskItem {
  const { due, dueSort } = dueLabel(row.due_date);
  return {
    id: row.id,
    title: row.title,
    reason: row.reason,
    due,
    dueSort,
    priority: row.priority,
    partnerName: row.partner_name ?? undefined,
    completed: row.completed,
  };
}

export function updateRowToUpdate(row: UpdateRow): UpdateItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.publish_date,
    category: row.category,
  };
}

function relativeTime(dateString: string): string {
  const then = new Date(dateString).getTime();
  const diffMs = Date.now() - then;
  const diffMins = Math.round(diffMs / 60_000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export function notificationRowToNotification(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    message: row.message,
    time: relativeTime(row.created_at),
    read: row.is_read,
    category: row.category,
  };
}
