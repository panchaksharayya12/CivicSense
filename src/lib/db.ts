import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  User,
  Complaint,
  Incident,
  IncidentComplaintLink,
  StatusHistory,
  Notification,
  Department,
  Helpline,
  ComplaintStatus,
  CivicDomain,
  ComplaintSeverity,
} from "@/types";
import { INITIAL_DEPARTMENTS, INITIAL_HELPLINES } from "./constants";

interface DatabaseSchema {
  users: (User & { password_hash: string })[];
  complaints: Complaint[];
  incidents: Incident[];
  incident_complaints: IncidentComplaintLink[];
  status_history: StatusHistory[];
  notifications: Notification[];
  departments: Department[];
  helplines: Helpline[];
  last_app_sequence: number;
  last_incident_sequence: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "civicsense.json");

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  const rashmiSalt = bcrypt.genSaltSync(10);
  const rashmiHash = bcrypt.hashSync("citizen123", rashmiSalt);

  const adminSalt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync("admin123", adminSalt);

  const users: (User & { password_hash: string })[] = [
    {
      id: "usr-rashmi",
      name: "Rashmi G",
      email: "rashmi@civicsense.in",
      phone: "+91 98765 43210",
      role: "citizen",
      preferred_language: "en",
      created_at: "2026-04-10T09:00:00.000Z",
      password_hash: rashmiHash,
    },
    {
      id: "usr-admin",
      name: "Municipal Admin Officer",
      email: "admin@civicsense.in",
      phone: "+91 80 2222 1111",
      role: "admin",
      preferred_language: "en",
      created_at: "2026-04-01T08:00:00.000Z",
      password_hash: adminHash,
    },
  ];

  return {
    users,
    complaints: [],
    incidents: [],
    incident_complaints: [],
    status_history: [],
    notifications: [],
    departments: INITIAL_DEPARTMENTS,
    helplines: INITIAL_HELPLINES,
    last_app_sequence: 0,
    last_incident_sequence: 0,
  };
}

export class CivicDatabase {
  private static instance: CivicDatabase;
  private data: DatabaseSchema;

  private constructor() {
    this.data = this.readFromDisk();
  }

  public static getInstance(): CivicDatabase {
    if (!CivicDatabase.instance) {
      CivicDatabase.instance = new CivicDatabase();
    }
    return CivicDatabase.instance;
  }

  private readFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading database file, resetting to initial seed:", err);
    }
    const initial = getInitialData();
    this.writeToDisk(initial);
    return initial;
  }

  private writeToDisk(data: DatabaseSchema) {
    try {
      ensureDirectoryExists(DB_FILE);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing to database file:", err);
    }
  }

  private commit() {
    this.writeToDisk(this.data);
  }

  // Sequence Generators
  public getNextApplicationId(): string {
    this.data.last_app_sequence += 1;
    const year = new Date().getFullYear();
    const seq = this.data.last_app_sequence.toString().padStart(5, "0");
    this.commit();
    return `CS-${year}-${seq}`;
  }

  public getNextIncidentId(category: CivicDomain): string {
    this.data.last_incident_sequence += 1;
    const prefixMap: Record<CivicDomain, string> = {
      traffic: "PTH",
      water: "WTR",
      waste: "WST",
      streetlights: "LGT",
      emergency: "EMG",
      accessibility: "ACS",
      public_transport: "TRN",
      civic_intelligence: "CVC",
    };
    const prefix = prefixMap[category] || "INC";
    this.commit();
    return `${prefix}-${this.data.last_incident_sequence}`;
  }

  // Users
  public getUsers(): User[] {
    return this.data.users.map(({ password_hash, ...user }) => user);
  }

  public getUserByEmail(email: string): (User & { password_hash: string }) | undefined {
    return this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
  }

  public getUserById(id: string): User | undefined {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  public createUser(userData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: "citizen" | "admin";
    preferred_language?: string;
  }): User {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);
    const id = `usr-${Date.now()}`;
    const user: User & { password_hash: string } = {
      id,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone,
      role: userData.role || "citizen",
      preferred_language: userData.preferred_language || "en",
      created_at: new Date().toISOString(),
      password_hash: hash,
    };
    this.data.users.push(user);
    this.commit();
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  // Complaints
  public getComplaints(filter?: {
    userId?: string;
    category?: string;
    status?: string;
    severity?: string;
  }): Complaint[] {
    let list = [...this.data.complaints];
    if (filter?.userId) {
      list = list.filter((c) => c.user_id === filter.userId);
    }
    if (filter?.category && filter.category !== "all") {
      list = list.filter((c) => c.category === filter.category);
    }
    if (filter?.status && filter.status !== "all") {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter?.severity && filter.severity !== "all") {
      list = list.filter((c) => c.severity === filter.severity);
    }
    return list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.data.complaints.find((c) => c.id === id);
  }

  public getComplaintByApplicationId(appId: string): Complaint | undefined {
    return this.data.complaints.find(
      (c) => c.application_id.toUpperCase() === appId.toUpperCase().trim()
    );
  }

  public createComplaint(data: Omit<Complaint, "id" | "application_id" | "created_at" | "updated_at">): Complaint {
    const id = `cmp-${Date.now()}`;
    const application_id = this.getNextApplicationId();
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id,
      application_id,
      created_at: now,
      updated_at: now,
    };

    this.data.complaints.unshift(newComplaint);

    // Initial Status History
    this.data.status_history.push({
      id: `sh-${Date.now()}`,
      complaint_id: id,
      old_status: "submitted",
      new_status: "submitted",
      changed_by: "System",
      note: "Application submitted and received in Municipal Grievance Core.",
      created_at: now,
    });

    // In-app Notification for Citizen
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: data.user_id,
      complaint_id: id,
      application_id,
      title: "Your complaint has been received",
      message: `Application ${application_id} has been submitted successfully. Our AI system has logged your complaint.`,
      type: "status_update",
      read: false,
      created_at: now,
    });

    this.commit();
    return newComplaint;
  }

  public updateComplaintStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    changedBy: string,
    note?: string
  ): Complaint | null {
    const complaint = this.data.complaints.find(
      (c) => c.id === complaintId || c.application_id === complaintId
    );
    if (!complaint) return null;

    const oldStatus = complaint.status;
    complaint.status = newStatus;
    complaint.updated_at = new Date().toISOString();

    const historyNote =
      note || `Complaint status updated from ${oldStatus} to ${newStatus}.`;

    // Add status history record
    this.data.status_history.push({
      id: `sh-${Date.now()}`,
      complaint_id: complaint.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
      note: historyNote,
      created_at: complaint.updated_at,
    });

    // Create Notification for the citizen
    const statusTitles: Record<ComplaintStatus, string> = {
      submitted: "Complaint Received",
      verified: "Complaint Verified",
      assigned: "Department Assigned",
      in_progress: "Status updated to In Progress",
      resolved: "Your complaint is resolved",
      rejected: "Complaint Closed",
    };

    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: complaint.user_id,
      complaint_id: complaint.id,
      application_id: complaint.application_id,
      title: statusTitles[newStatus] || "Status updated",
      message: `Application ${complaint.application_id} is now ${newStatus.replace("_", " ")}. ${note || ""}`,
      type: newStatus === "resolved" ? "status_update" : "status_update",
      read: false,
      created_at: complaint.updated_at,
    });

    this.commit();
    return complaint;
  }

  public updateComplaint(complaintId: string, updates: Partial<Complaint>): Complaint | null {
    const complaint = this.data.complaints.find(
      (c) => c.id === complaintId || c.application_id === complaintId
    );
    if (!complaint) return null;

    Object.assign(complaint, updates);
    complaint.updated_at = new Date().toISOString();
    this.commit();
    return complaint;
  }

  public assignDepartment(
    complaintId: string,
    department: string,
    officer: string,
    changedBy: string
  ): Complaint | null {
    const complaint = this.data.complaints.find(
      (c) => c.id === complaintId || c.application_id === complaintId
    );
    if (!complaint) return null;

    complaint.assigned_department = department;
    complaint.assigned_officer = officer;
    complaint.status = "assigned";
    complaint.updated_at = new Date().toISOString();

    this.data.status_history.push({
      id: `sh-${Date.now()}`,
      complaint_id: complaint.id,
      old_status: complaint.status,
      new_status: "assigned",
      changed_by: changedBy,
      note: `Assigned to ${department} (Officer: ${officer}).`,
      created_at: complaint.updated_at,
    });

    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: complaint.user_id,
      complaint_id: complaint.id,
      application_id: complaint.application_id,
      title: "Department assigned",
      message: `Your complaint ${complaint.application_id} has been assigned to ${department}.`,
      type: "assignment",
      read: false,
      created_at: complaint.updated_at,
    });

    this.commit();
    return complaint;
  }

  // Incidents
  public getIncidents(): Incident[] {
    return [...this.data.incidents].sort(
      (a, b) => new Date(b.latest_reported_at).getTime() - new Date(a.latest_reported_at).getTime()
    );
  }

  public getIncidentById(incidentId: string): (Incident & { linkedComplaints: Complaint[] }) | null {
    const inc = this.data.incidents.find(
      (i) => i.id === incidentId || i.incident_id === incidentId
    );
    if (!inc) return null;

    const links = this.data.incident_complaints.filter(
      (l) => l.incident_id === inc.incident_id
    );

    // Find linked complaints from actual records or matching IDs
    const linkedComplaints = this.data.complaints.filter(
      (c) => c.incident_id === inc.incident_id
    );

    return {
      ...inc,
      linkedComplaints,
    };
  }

  public createIncident(incidentData: Omit<Incident, "id" | "incident_id" | "created_at" | "updated_at">): Incident {
    const id = `inc-${Date.now()}`;
    const incident_id = this.getNextIncidentId(incidentData.category);
    const now = new Date().toISOString();

    const incident: Incident = {
      ...incidentData,
      id,
      incident_id,
      created_at: now,
      updated_at: now,
    };

    this.data.incidents.unshift(incident);
    this.commit();
    return incident;
  }

  public linkComplaintToIncident(
    incidentId: string,
    complaintId: string,
    similarityScore: number,
    matchedReason: string
  ): boolean {
    const inc = this.data.incidents.find(
      (i) => i.id === incidentId || i.incident_id === incidentId
    );
    const comp = this.data.complaints.find(
      (c) => c.id === complaintId || c.application_id === complaintId
    );

    if (!inc || !comp) return false;

    comp.incident_id = inc.incident_id;
    inc.report_count += 1;
    inc.latest_reported_at = new Date().toISOString();

    this.data.incident_complaints.push({
      incident_id: inc.incident_id,
      complaint_id: comp.application_id,
      similarity_score: similarityScore,
      matched_reason: matchedReason,
      created_at: new Date().toISOString(),
    });

    // Notify citizen about incident consolidation
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: comp.user_id,
      complaint_id: comp.id,
      application_id: comp.application_id,
      title: "Incident update",
      message: `Multiple reports found for the same issue (${comp.issue_type}). Your complaint has been linked to city incident ${inc.incident_id} for high-priority municipal action.`,
      type: "incident_linked",
      read: false,
      created_at: new Date().toISOString(),
    });

    this.commit();
    return true;
  }

  // Status History
  public getStatusHistory(complaintId: string): StatusHistory[] {
    const comp = this.data.complaints.find(
      (c) => c.id === complaintId || c.application_id === complaintId
    );
    if (!comp) return [];
    return this.data.status_history
      .filter((sh) => sh.complaint_id === comp.id)
      .sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }

  // Notifications
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications
      .filter((n) => n.user_id === userId)
      .sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  public markNotificationAsRead(id: string, userId: string): boolean {
    const notif = this.data.notifications.find(
      (n) => n.id === id && n.user_id === userId
    );
    if (notif) {
      notif.read = true;
      this.commit();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): boolean {
    let changed = false;
    for (const notif of this.data.notifications) {
      if (notif.user_id === userId && !notif.read) {
        notif.read = true;
        changed = true;
      }
    }
    if (changed) this.commit();
    return true;
  }

  // Departments & Helplines
  public getDepartments(): Department[] {
    return this.data.departments;
  }

  public updateDepartment(id: string, update: Partial<Department>): Department | null {
    const dept = this.data.departments.find((d) => d.id === id);
    if (!dept) return null;
    Object.assign(dept, update);
    this.commit();
    return dept;
  }

  public getHelplines(category?: string): Helpline[] {
    if (category && category !== "all") {
      return this.data.helplines.filter(
        (h) => h.category === category || h.category === "general"
      );
    }
    return this.data.helplines;
  }

  public updateHelpline(id: string, update: Partial<Helpline>): Helpline | null {
    const hl = this.data.helplines.find((h) => h.id === id);
    if (!hl) return null;
    Object.assign(hl, update);
    this.commit();
    return hl;
  }

  public createHelpline(helplineData: Omit<Helpline, "id">): Helpline {
    const hl: Helpline = {
      ...helplineData,
      id: `hl-${Date.now()}`,
    };
    this.data.helplines.push(hl);
    this.commit();
    return hl;
  }

  // Admin Metrics
  public getAdminMetrics() {
    const totalReports = this.data.complaints.length;
    const pending = this.data.complaints.filter(
      (c) => c.status === "submitted" || c.status === "verified"
    ).length;
    const inProgress = this.data.complaints.filter(
      (c) => c.status === "in_progress" || c.status === "assigned"
    ).length;
    const resolved = this.data.complaints.filter(
      (c) => c.status === "resolved"
    ).length;
    const activeIncidents = this.data.incidents.length;
    const highPriority = this.data.complaints.filter(
      (c) => c.severity === "high" || c.severity === "critical"
    ).length;

    return {
      totalReports,
      pending,
      inProgress,
      resolved,
      activeIncidents,
      highPriority,
    };
  }

  public resetApplications() {
    this.data.complaints = [];
    this.data.status_history = [];
    this.data.notifications = [];
    this.data.incident_complaints = [];
    this.data.incidents = [];
    this.data.last_app_sequence = 0;
    this.data.last_incident_sequence = 0;
    this.commit();
    return { success: true, count: 0 };
  }

  public reloadFromDisk() {
    this.data = this.readFromDisk();
    return { success: true };
  }
}

export const db = CivicDatabase.getInstance();
