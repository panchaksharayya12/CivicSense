export type UserRole = "citizen" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string; // For municipal admin officers
  preferred_language: string;
  created_at: string;
}

export type CivicDomain =
  | "waste"
  | "traffic"
  | "water"
  | "streetlights"
  | "emergency"
  | "accessibility"
  | "public_transport"
  | "civic_intelligence";

export interface DomainMeta {
  id: CivicDomain;
  name: string;
  description: string;
  icon: string;
  issues: string[];
  recommendedDepartment: string;
}

export type ComplaintStatus =
  | "submitted"
  | "verified"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected";

export type ComplaintSeverity = "low" | "medium" | "high" | "critical";

export interface Complaint {
  id: string;
  application_id: string; // e.g. CS-2026-00147
  user_id: string;
  user_name?: string;
  user_phone?: string;
  category: CivicDomain;
  issue_type: string;
  description_original: string;
  description_normalized: string;
  language: string;
  latitude?: number;
  longitude?: number;
  address: string;
  location_source: "gps" | "manual";
  image_url?: string;
  video_url?: string;
  progress_photo_url?: string;
  progress_media_url?: string;
  progress_media_type?: "photo" | "video";
  severity: ComplaintSeverity;
  urgency: "low" | "normal" | "high" | "emergency";
  ai_confidence: number; // 0 - 100
  recommended_department: string;
  assigned_department?: string;
  assigned_officer?: string;
  status: ComplaintStatus;
  incident_id?: string; // e.g. PTH-1042
  photo_authenticity?: PhotoAuthenticityResult;
  created_at: string;
  updated_at: string;
}

export interface PhotoAuthenticityResult {
  is_authentic: boolean;
  confidence: number;
  status: "authentic" | "suspicious" | "unrelated" | "no_photo";
  label: string;
  reason: string;
  checks: string[];
}

export interface Incident {
  id: string;
  incident_id: string; // e.g. PTH-1042
  title: string;
  category: CivicDomain;
  issue_type: string;
  latitude: number;
  longitude: number;
  address: string;
  severity: ComplaintSeverity;
  department: string;
  assigned_officer?: string;
  status: "open" | "investigating" | "in_progress" | "resolved";
  ai_confidence: number;
  grouping_reason: string;
  report_count: number;
  first_reported_at: string;
  latest_reported_at: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentComplaintLink {
  incident_id: string;
  complaint_id: string;
  similarity_score: number;
  matched_reason: string;
  created_at: string;
}

export interface StatusHistory {
  id: string;
  complaint_id: string;
  old_status: ComplaintStatus;
  new_status: ComplaintStatus;
  changed_by: string;
  note: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  complaint_id?: string;
  application_id?: string;
  title: string;
  message: string;
  type: "status_update" | "assignment" | "incident_linked" | "system" | "emergency";
  read: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  officer_count: number;
  active: boolean;
}

export interface Helpline {
  id: string;
  name: string;
  number: string;
  description: string;
  category: CivicDomain | "general";
  is_emergency: boolean;
  active: boolean;
}

export interface AIComplaintAnalysisResult {
  category: CivicDomain;
  issue_type: string;
  severity: ComplaintSeverity;
  urgency: "low" | "normal" | "high" | "emergency";
  recommended_department: string;
  keywords: string[];
  ai_confidence: number;
  summary: string;
  english_translation?: string;
  detected_language?: string;
  suggested_category_correction?: {
    original: string;
    suggested: CivicDomain;
    reason: string;
  };
  possible_duplicate_incident?: {
    incident_id: string;
    similarity_score: number;
    reason: string;
  };
  photo_authenticity?: PhotoAuthenticityResult;
}

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  language?: string;
  actionButton?: {
    label: string;
    href: string;
    domain?: CivicDomain;
    issue?: string;
  };
  timestamp: string;
}
