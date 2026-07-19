// Hand-written types for the `eclv2` Postgres schema (supabase/migrations/).
// Supabase's type generator only emits the `public` schema by default, and this
// project's `public` schema belongs to an unrelated application, so these are
// maintained by hand to match the migrations exactly.

export type PortalRole = "partner" | "clinic" | "executive";

export type DbReferralStage =
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

export type DbConversionProbability = "High" | "Medium" | "Low";

export type DbPartnerCategory =
  | "Independent optometry"
  | "Optometry group"
  | "Private GP"
  | "Corporate healthcare"
  | "Ophthalmology";

export type DbRelationshipStatus = "Strategic" | "Active" | "Developing" | "New" | "Dormant" | "At risk";

export type DbTaskPriority = "High" | "Medium" | "Low";

export type DbUpdateCategory =
  | "Clinic update"
  | "Education"
  | "CPD"
  | "Services"
  | "Partner resources"
  | "Case study";

export type DbUpdateAudience = "all" | "partner" | "clinic";

export type DbSyncStatus = "running" | "success" | "partial" | "failed";

export type DbTimelineStep = {
  stage: string;
  date?: string;
  note?: string;
  staffInitials?: string;
  complete: boolean;
}

export type PartnerRow = {
  id: string;
  external_id: string | null;
  name: string;
  category: DbPartnerCategory;
  professional: string;
  role: string;
  location: string;
  referrals_count: number;
  consultations_count: number;
  treatment_bookings_count: number;
  conversion: number;
  estimated_value: number;
  last_referral_date: string | null;
  last_contacted_date: string | null;
  last_login_date: string | null;
  relationship_status: DbRelationshipStatus;
  owner: string;
  engagement_score: number;
  most_viewed_tab: string | null;
  resources_downloaded: number | null;
  education_views: number | null;
  cpd_attendance: number | null;
  created_at: string;
  updated_at: string;
}

export type ProfileRow = {
  user_id: string;
  portal_role: PortalRole;
  partner_id: string | null;
  display_name: string;
  email: string;
  contact_number: string;
  practice_name: string;
  professional_role: string;
  onboarding_complete: boolean;
  location: string | null;
  member_since: string;
  greeting_name: string | null;
  created_at: string;
  updated_at: string;
}

export type ReferralRow = {
  id: string;
  external_id: string | null;
  reference: string;
  patient_label: string;
  pathway_id: string;
  pathway_name: string;
  reason: string;
  referral_date: string;
  stage: DbReferralStage;
  consultant: string | null;
  appointment_date: string | null;
  last_update: string;
  partner_id: string;
  professional_name: string;
  practice_location: string;
  estimated_value: number;
  owner: string;
  next_action: string;
  conversion_probability: DbConversionProbability;
  timeline: DbTimelineStep[];
  highlight_context: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskRow = {
  id: string;
  external_id: string | null;
  title: string;
  reason: string;
  due_date: string | null;
  priority: DbTaskPriority;
  partner_id: string | null;
  partner_name: string | null;
  assigned_to: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type UpdateRow = {
  id: string;
  external_id: string | null;
  title: string;
  description: string;
  publish_date: string;
  category: DbUpdateCategory;
  audience: DbUpdateAudience;
  created_at: string;
  updated_at: string;
}

export type NotificationRow = {
  id: string;
  recipient_user_id: string;
  message: string;
  category: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export type SyncRunRow = {
  id: string;
  source: string;
  file_id: string | null;
  file_name: string | null;
  sheet_name: string | null;
  started_at: string;
  finished_at: string | null;
  status: DbSyncStatus;
  inserted_count: number;
  updated_count: number;
  skipped_count: number;
  error_count: number;
  errors: unknown[];
  triggered_by: string;
  created_at: string;
}

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

export type EclV2Database = {
  eclv2: {
    Tables: {
      partners: { Row: PartnerRow; Insert: Partial<PartnerRow>; Update: Partial<PartnerRow>; Relationships: Relationship[] };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow>;
        Update: Partial<ProfileRow>;
        Relationships: [
          {
            foreignKeyName: "profiles_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
        ];
      };
      referrals: {
        Row: ReferralRow;
        Insert: Partial<ReferralRow>;
        Update: Partial<ReferralRow>;
        Relationships: [
          {
            foreignKeyName: "referrals_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: TaskRow;
        Insert: Partial<TaskRow>;
        Update: Partial<TaskRow>;
        Relationships: [
          {
            foreignKeyName: "tasks_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      updates: { Row: UpdateRow; Insert: Partial<UpdateRow>; Update: Partial<UpdateRow>; Relationships: Relationship[] };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow>;
        Update: Partial<NotificationRow>;
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey";
            columns: ["recipient_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      sync_runs: { Row: SyncRunRow; Insert: Partial<SyncRunRow>; Update: Partial<SyncRunRow>; Relationships: Relationship[] };
    };
    Views: Record<string, never>;
    Functions: {
      complete_partner_onboarding: {
        Args: {
          p_display_name: string;
          p_practice_name: string;
          p_professional_role: string;
          p_contact_number: string;
        };
        Returns: ProfileRow;
      };
      update_my_partner_profile: {
        Args: {
          p_display_name: string;
          p_practice_name: string;
          p_professional_role: string;
          p_contact_number: string;
        };
        Returns: ProfileRow;
      };
      admin_update_partner_profile: {
        Args: {
          p_target_partner_id: string;
          p_display_name: string;
          p_practice_name: string;
          p_professional_role: string;
          p_contact_number: string;
        };
        Returns: ProfileRow;
      };
    };
    Enums: Record<string, never>;
  };
}
