export type PortalRole = "partner" | "clinic" | "executive";

export type PathwayId =
  | "cataract"
  | "rle"
  | "laser-vision"
  | "icl"
  | "dry-eye"
  | "cornea-keratoconus"
  | "glaucoma"
  | "retina"
  | "paediatric"
  | "emergency"
  | "second-opinion"
  | "not-sure";

export interface Pathway {
  id: PathwayId;
  name: string;
  shortDescription: string;
  description: string;
  elements: string[];
  icon: string;
}

export type ReferralStage =
  | "new"
  | "awaiting-contact"
  | "contacted"
  | "triage"
  | "consultation-booked"
  | "consultation-completed"
  | "treatment-recommended"
  | "treatment-booked"
  | "procedure-completed"
  | "aftercare"
  | "completed"
  | "closed"
  | "lost";

export const REFERRAL_STAGE_LABELS: Record<ReferralStage, string> = {
  new: "New",
  "awaiting-contact": "Awaiting contact",
  contacted: "Contacted",
  triage: "Triage required",
  "consultation-booked": "Consultation booked",
  "consultation-completed": "Consultation completed",
  "treatment-recommended": "Treatment recommended",
  "treatment-booked": "Treatment booked",
  "procedure-completed": "Procedure completed",
  aftercare: "Aftercare",
  completed: "Completed",
  closed: "Closed",
  lost: "Lost",
};

export interface PathwayTimelineStep {
  stage: string;
  date?: string;
  note?: string;
  staffInitials?: string;
  complete: boolean;
}

export interface Referral {
  id: string;
  reference: string;
  patientLabel: string;
  pathwayId: PathwayId;
  pathwayName: string;
  reason: string;
  referralDate: string;
  stage: ReferralStage;
  consultant?: string;
  appointmentDate?: string;
  lastUpdate: string;
  partnerId: string;
  partnerName: string;
  professionalName: string;
  practiceLocation: string;
  estimatedValue: number;
  owner: string;
  nextAction: string;
  conversionProbability: "High" | "Medium" | "Low";
  timeline: PathwayTimelineStep[];
  highlightContext?: string;
}

export type PartnerCategory =
  | "Independent optometry"
  | "Optometry group"
  | "Private GP"
  | "Corporate healthcare"
  | "Ophthalmology";

export type RelationshipStatus =
  | "Strategic"
  | "Active"
  | "Developing"
  | "New"
  | "Dormant"
  | "At risk";

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  professional: string;
  role: string;
  location: string;
  referrals: number;
  consultations: number;
  treatmentBookings: number;
  conversion: number;
  estimatedValue: number;
  lastReferralDaysAgo: number;
  lastContactedDaysAgo: number;
  lastLoginDaysAgo: number;
  relationshipStatus: RelationshipStatus;
  owner: string;
  engagementScore: number;
  mostViewedTab?: string;
  resourcesDownloaded?: number;
  educationViews?: number;
  cpdAttendance?: number;
}

export interface DemoUser {
  id: string;
  name: string;
  role: string;
  organisation: string;
  location: string;
  email: string;
  phone: string;
  memberSince: string;
  greetingName: string;
}

export interface EducationModule {
  id: string;
  title: string;
  duration: string;
  category: string;
  summary: string;
  objectives: string[];
}

export interface UpdateItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "Clinic update" | "Education" | "CPD" | "Services" | "Partner resources" | "Case study";
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: string;
  fileName: string;
}

export interface TaskItem {
  id: string;
  title: string;
  reason: string;
  due: string;
  dueSort: number;
  priority: "High" | "Medium" | "Low";
  partnerName?: string;
  completed: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  read: boolean;
  category: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  recordType: string;
  recordReference: string;
  outcome: string;
  ip: string;
}

export type ModuleProgressStatus = "not-started" | "in-progress" | "completed";

export interface ModuleProgressRecord {
  status: ModuleProgressStatus;
  videoWatched: boolean;
  caseStudyAnswered: boolean;
  referralScenariosAnswered: number;
  quizAnswered: number;
  quizScore: number;
  quizCompleted: boolean;
  savedForLater: boolean;
  updatedAt: string;
}

export type ClinicalEducationProgress = Record<string, ModuleProgressRecord>;

export interface PatientInMindNote {
  id: string;
  note: string;
  moduleId?: string;
  moduleTitle?: string;
  markedForDiscussion: boolean;
  convertedToReferral: boolean;
  createdAt: string;
}

export interface ClinicalCaseOption {
  label: string;
  feedback: string;
}

export interface ClinicalReferralScenario {
  scenario: string;
  feedback: {
    refer: string;
    monitor: string;
    unclear: string;
  };
}

export interface ClinicalQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ClinicalModule {
  id: string;
  title: string;
  summary: string;
  duration: string;
  icon: string;
  openingQuestion: string;
  openingFollowUp: string;
  keyIndicators: string[];
  conversationExamples: string[];
  caseStudy: {
    scenario: string;
    options: ClinicalCaseOption[];
  };
  referralScenarios: ClinicalReferralScenario[];
  quiz: ClinicalQuizQuestion[];
  guide: {
    title: string;
    description: string;
  };
}
