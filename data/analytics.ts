export const MONTHLY_REFERRAL_TREND = [
  { month: "Jan 2026", referrals: 24, consultations: 16, treatments: 9 },
  { month: "Feb 2026", referrals: 29, consultations: 19, treatments: 11 },
  { month: "Mar 2026", referrals: 31, consultations: 21, treatments: 12 },
  { month: "Apr 2026", referrals: 35, consultations: 23, treatments: 14 },
  { month: "May 2026", referrals: 40, consultations: 26, treatments: 16 },
  { month: "Jun 2026", referrals: 44, consultations: 29, treatments: 18 },
  { month: "Jul 2026", referrals: 48, consultations: 31, treatments: 19 },
];

export const REFERRALS_BY_PATHWAY = [
  { pathway: "Cataract", value: 15 },
  { pathway: "Refractive lens exchange", value: 9 },
  { pathway: "Laser vision correction", value: 8 },
  { pathway: "Dry eye", value: 6 },
  { pathway: "ICL", value: 4 },
  { pathway: "Cornea and keratoconus", value: 3 },
  { pathway: "Glaucoma", value: 1 },
  { pathway: "Retina", value: 1 },
  { pathway: "Paediatric", value: 1 },
];

export const REFERRAL_FUNNEL = [
  { stage: "Referrals", value: 48 },
  { stage: "Patients contacted", value: 38 },
  { stage: "Consultations booked", value: 31 },
  { stage: "Consultations completed", value: 24 },
  { stage: "Treatment bookings", value: 19 },
];

export const REFERRALS_BY_PROFESSIONAL_TYPE = [
  { type: "Independent optometrist", value: 19 },
  { type: "Multiple-practice optometrist", value: 8 },
  { type: "Dispensing optician", value: 6 },
  { type: "Private GP", value: 7 },
  { type: "Ophthalmologist", value: 3 },
  { type: "Corporate health", value: 4 },
  { type: "Other healthcare professional", value: 1 },
];

export const TOP_PARTNERS_TABLE = [
  { partner: "Marylebone Independent Opticians", type: "Independent optometry", referrals: 18, conversion: 78, treatmentBookings: 9, estimatedValue: 96000 },
  { partner: "Chelsea Vision Practice", type: "Independent optometry", referrals: 12, conversion: 67, treatmentBookings: 5, estimatedValue: 54000 },
  { partner: "Central London Private GP Group", type: "Private GP", referrals: 10, conversion: 70, treatmentBookings: 4, estimatedValue: 48500 },
  { partner: "Kensington Eye & Vision", type: "Optometry group", referrals: 8, conversion: 63, treatmentBookings: 3, estimatedValue: 32000 },
  { partner: "Harley Street Corporate Health", type: "Corporate healthcare", referrals: 7, conversion: 71, treatmentBookings: 3, estimatedValue: 28400 },
];

export const LOST_REFERRAL_REASONS = [
  { reason: "Patient declined", value: 5 },
  { reason: "Unable to contact", value: 4 },
  { reason: "Cost", value: 6 },
  { reason: "Alternative provider", value: 2 },
  { reason: "Timing", value: 3 },
  { reason: "Clinical suitability", value: 2 },
  { reason: "Insurance issue", value: 1 },
  { reason: "Consultation cancelled", value: 2 },
  { reason: "Duplicate referral", value: 1 },
  { reason: "Other", value: 1 },
];

export const AVERAGE_STAGE_TIME_DAYS = [
  { stage: "Referral to contact", days: 1.2 },
  { stage: "Contact to triage", days: 1.5 },
  { stage: "Triage to consultation booked", days: 2.1 },
  { stage: "Consultation booked to completed", days: 5.6 },
  { stage: "Completed to treatment booked", days: 3.4 },
  { stage: "Treatment booked to procedure", days: 9.8 },
];

export const GEOGRAPHIC_DISTRIBUTION = [
  { area: "Marylebone", value: 22 },
  { area: "Chelsea", value: 14 },
  { area: "Kensington", value: 11 },
  { area: "Fitzrovia", value: 10 },
  { area: "Notting Hill", value: 6 },
  { area: "Bloomsbury", value: 5 },
  { area: "Other London", value: 8 },
];

export const PORTAL_LOGINS_BY_WEEK = [
  { week: "Wk 1", logins: 41 },
  { week: "Wk 2", logins: 47 },
  { week: "Wk 3", logins: 52 },
  { week: "Wk 4", logins: 58 },
];

export const PAGE_VIEWS_BY_TAB = [
  { tab: "Home", views: 214 },
  { tab: "Refer a patient", views: 188 },
  { tab: "My referrals", views: 165 },
  { tab: "Services", views: 96 },
  { tab: "Education", views: 84 },
  { tab: "Resources", views: 52 },
  { tab: "Contact Ryan", views: 38 },
];

export const MOST_VIEWED_EDUCATION = [
  { title: "When should I refer for cataract surgery?", views: 61 },
  { title: "ICL versus laser vision correction", views: 47 },
  { title: "Dry-eye signs that may benefit from specialist assessment", views: 44 },
  { title: "Understanding premium lens conversations", views: 39 },
  { title: "Corneal red flags and when specialist review may help", views: 33 },
];

export const RESOURCE_DOWNLOADS = [
  { title: "Cataract referral guide", downloads: 34 },
  { title: "Dry-eye referral guide", downloads: 27 },
  { title: "RLE patient conversation guide", downloads: 21 },
  { title: "Corneal red-flags guide", downloads: 18 },
  { title: "Patient referral leaflet", downloads: 16 },
];

export const CONVERSION_BY_ENGAGEMENT = [
  { level: "Low engagement", conversion: 41 },
  { level: "Medium engagement", conversion: 58 },
  { level: "High engagement", conversion: 74 },
];

export const NEW_VS_RETURNING = [
  { period: "Apr", newUsers: 4, returning: 14 },
  { period: "May", newUsers: 3, returning: 17 },
  { period: "Jun", newUsers: 5, returning: 19 },
  { period: "Jul", newUsers: 2, returning: 21 },
];

export const CONSULTANT_WORKLOAD = [
  { consultant: "Mr Nicholas Faber", pathway: "Cataract", bookings: 8 },
  { consultant: "Miss Eleanor Vance", pathway: "Refractive / Laser", bookings: 7 },
  { consultant: "Mr David Okafor", pathway: "Glaucoma / Retina", bookings: 4 },
];

export const CONVERSION_BY_PATHWAY = [
  { pathway: "Cataract", conversion: 82 },
  { pathway: "Refractive lens exchange", conversion: 71 },
  { pathway: "Laser vision correction", conversion: 64 },
  { pathway: "Dry eye", conversion: 58 },
  { pathway: "ICL", conversion: 60 },
  { pathway: "Cornea and keratoconus", conversion: 55 },
];

export const EXEC_KPIS = {
  monthlyReferrals: 48,
  consultationsBooked: 31,
  treatmentBookings: 19,
  estimatedPipeline: 286400,
  referralToTreatmentConversion: 39.6,
  activePartners: 23,
  portalEngagement: 67,
  upcomingProcedures: 12,
};

export const CLINIC_OVERVIEW_KPIS = {
  referralsThisMonth: 48,
  referralsChangeVsPrevMonth: 20,
  patientsContacted: 38,
  patientsContactedPct: 79.2,
  consultationsBooked: 31,
  consultationsBookedPct: 64.6,
  consultationsCompleted: 24,
  consultationsCompletedPct: 77.4,
  treatmentBookings: 19,
  treatmentBookingsPct: 79.2,
  estimatedPipeline: 286400,
  activePartners: 23,
  portalEngagementPct: 67,
};
