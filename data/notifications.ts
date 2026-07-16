import type { AuditEntry, NotificationItem } from "@/lib/types";

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", message: "New cataract referral received from Marylebone Independent Opticians.", time: "10 minutes ago", read: false, category: "Referral" },
  { id: "n2", message: "Consultation booked for patient M.H.", time: "1 hour ago", read: false, category: "Referral" },
  { id: "n3", message: "Treatment booking confirmed.", time: "3 hours ago", read: false, category: "Referral" },
  { id: "n4", message: "Referral update available for J.P.", time: "Yesterday", read: false, category: "Referral" },
  { id: "n5", message: "Dormant partner alert: Regent Street Optometry.", time: "Yesterday", read: true, category: "Partner" },
  { id: "n6", message: "Partner milestone: 50 referrals this quarter.", time: "2 days ago", read: true, category: "Partner" },
  { id: "n7", message: "New CPD registration interest.", time: "3 days ago", read: true, category: "Education" },
  { id: "n8", message: "Practice requested patient leaflets.", time: "4 days ago", read: true, category: "Resource" },
  { id: "n9", message: "Referral form saved as demo draft.", time: "5 days ago", read: true, category: "Referral" },
  { id: "n10", message: "Education module completed.", time: "6 days ago", read: true, category: "Education" },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", timestamp: "2026-07-16 09:12", user: "Ryan", role: "Business Development Manager", action: "Referral viewed", recordType: "Referral", recordReference: "ECL-2026-0663", outcome: "Success", ip: "10.20.14.2" },
  { id: "a2", timestamp: "2026-07-16 08:47", user: "Priya Shah", role: "Referring Professional", action: "Referral submitted", recordType: "Referral", recordReference: "ECL-2026-0663", outcome: "Success", ip: "10.10.44.9" },
  { id: "a3", timestamp: "2026-07-15 17:20", user: "Kate Marsh", role: "Clinic Team", action: "Status updated", recordType: "Referral", recordReference: "ECL-2026-0680", outcome: "Success", ip: "10.20.14.5" },
  { id: "a4", timestamp: "2026-07-15 15:03", user: "Ryan", role: "Business Development Manager", action: "Partner note added", recordType: "Partner", recordReference: "Regent Street Optometry", outcome: "Success", ip: "10.20.14.2" },
  { id: "a5", timestamp: "2026-07-15 11:41", user: "Daniel Morgan", role: "Referring Professional", action: "Resource downloaded", recordType: "Resource", recordReference: "Cataract referral guide", outcome: "Success", ip: "10.10.51.3" },
  { id: "a6", timestamp: "2026-07-14 16:55", user: "Ryan", role: "Business Development Manager", action: "Task completed", recordType: "Task", recordReference: "task-kensington-portal", outcome: "Success", ip: "10.20.14.2" },
  { id: "a7", timestamp: "2026-07-14 10:12", user: "Sophie Williams", role: "Referring Professional", action: "Contact form submitted", recordType: "Contact request", recordReference: "CR-1042", outcome: "Success", ip: "10.10.62.7" },
  { id: "a8", timestamp: "2026-07-13 14:38", user: "Kate Marsh", role: "Clinic Team", action: "Demo export created", recordType: "Analytics", recordReference: "Top referral sources", outcome: "Success", ip: "10.20.14.5" },
  { id: "a9", timestamp: "2026-07-12 09:05", user: "Priya Shah", role: "Referring Professional", action: "Notification dismissed", recordType: "Notification", recordReference: "n7", outcome: "Success", ip: "10.10.44.9" },
  { id: "a10", timestamp: "2026-07-11 13:27", user: "Ryan", role: "Business Development Manager", action: "Referral viewed", recordType: "Referral", recordReference: "ECL-2026-0648", outcome: "Success", ip: "10.20.14.2" },
];

export const LATEST_ACTIVITY = [
  "New cataract referral received",
  "Laser consultation booked",
  "Partner profile moved to Strategic",
  "Dry-eye education guide downloaded",
  "Dormant partner task created",
  "Referral reached treatment-booked stage",
  "CPD registration interest submitted",
];
