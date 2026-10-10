# CivicSense

**"From Citizen Voice to City Action."**

CivicSense is a production-style Smart City and Civic Technology platform designed to connect citizens with municipal departments through AI complaint understanding, location intelligence, duplicate incident consolidation, transparent status tracking, and automated government report generation.

---

## The Core Innovation: Incident Consolidation

Municipalities receive dozens of repetitive calls for the same physical civic failure (e.g. 47 citizens reporting the exact same road crater near a college gate). 

Traditional portals create 47 separate work tickets, leading to administrative clutter, duplicate contractor visits, and citizen frustration.

**The CivicSense Solution:**
```
Citizen Voice (Text / Voice in 13 Indian Languages)
       ↓
AI Understanding (NLP Domain & Severity Rating)
       ↓
Location-Aware Intelligence (GIS & Geospatial Proximity Clustering)
       ↓
Duplicate Incident Consolidation (47 Reports → 1 Incident: PTH-1042)
       ↓
Coordinated Municipal Action (Single Junior Engineer Work Order)
       ↓
Transparent Citizen Tracking (Automated Live Status Timeline & Notifications)
```

---

## Key Features

### A. Citizen Experience
* **Accessible Dashboard**: Simple, high-contrast, friendly layout designed for all demographics including senior citizens.
* **Smart Reporting Form**: 4-step streamlined process (Issue Details → Location → Add Photo → AI Review).
* **Real Speech-to-Text Voice Typing**: Supports English, Kannada, Hindi, Telugu, Tamil, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, and Urdu, with waveform visualizer and listening animation.
* **Non-Mandatory Photo Upload**: Upload Photo section is always visible with preview and removal, but complaints submit seamlessly without a photo.
* **Location Intelligence**: Browser Geolocation API auto-detection or manual address entry.
* **AI Complaint Analyzer (AI #1)**: Evaluates category, recommends departments, assesses severity, and detects category mismatches before submission.
* **CivicSense AI Chat (AI #2)**: Floating interactive guide that explains how to use the website and report problems, with action buttons (e.g. [Report a Pothole Now →]).
* **Unique Application Numbers**: Formatted permanently starting from CS-2026-00001.
* **5-Stage Visual Status Timeline**: Submitted → Verified → Assigned → In Progress → Resolved.
* **In-App Notifications**: Real-time updates with unread badges, multilingual translation, and one-click tracking.
* **Configurable Help & Emergency Desk**: Direct integration with 112, 101, 108, 1533, BWSSB, and BESCOM.

### B. Admin Municipal Command Dashboard
* **City Operations Dashboard**: Real-time KPI counters (Total Reports, Pending, In Progress, Resolved, Active Incidents, High Priority).
* **Interactive Charts**: Complaints by Domain (Donut), Weekly Trend Line, and Status Distribution.
* **Live City Map**: Geospatial pins, severity heatmaps, and consolidated incident popups with Bengaluru sectors (Koramangala, Indiranagar, Jayanagar).
* **Consolidated Incidents Hub**: View all linked citizen reports for a single incident (e.g. PTH-1042 with 47 linked applications).
* **Status Broadcast Engine**: Updating an incident status automatically dispatches in-app notifications and updates status timelines for all linked citizens.
* **Official Government Report Generator**: One-click printable and PDF export report generator for municipal corporators, ward commissioners, and MLAs.
* **Department & Helpline Management**: Configurable active toggles, officer counts, and emergency tags.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Next.js API Routes (Serverless / Node.js) |
| **Database** | Persistent Relational Engine (/data/civicsense.json) + Supabase PostgreSQL schema (supabase_schema.sql) |
| **Authentication** | JWT HTTP-Only Cookies, BCrypt Password Hashing, Role-Based Access Control |
| **Storage** | Multipart File Upload (/api/upload) with format and size validation |
| **AI Services** | Google Gemini API (GEMINI_API_KEY) with robust rule-engine heuristics fallback |
| **Maps** | Interactive SVG / Leaflet OpenStreetMap Geospatial Canvas |

---

## Pre-Seeded Demo Accounts (Instant Single-Click Login Available)

| Role | Email | Password | Details |
|---|---|---|---|
| **Citizen** | rashmi@civicsense.in | citizen123 | Pre-loaded with citizen complaints and notifications |
| **Admin** | admin@civicsense.in | admin123 | Full access to City Operations Dashboard, Incidents, Map, and Settings |

---

## Local Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Optionally set your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_key
```
*(If no API key is set, the system runs on the built-in intelligent NLP heuristic fallback without failing.)*

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Architecture & Supabase Deployment

CivicSense is ready for production PostgreSQL / Supabase.

1. Open your Supabase Dashboard.
2. Go to the **SQL Editor**.
3. Paste and run the entire contents of [`supabase_schema.sql`](./supabase_schema.sql).
4. Tables created:
   * `users`
   * `complaints`
   * `incidents`
   * `incident_complaints`
   * `status_history`
   * `notifications`
   * `departments`
   * `helplines`

---

## Clean Separation of AI Services

As mandated by design principles, the two AI services are completely segregated:

1. **CivicSense AI Chat** (`/src/services/ai/civicChat.ts`):
   * Accessible anywhere in the citizen portal via the floating button.
   * Answers questions, explains step-by-step reporting, understands Indian languages.
   * Provides direct navigation buttons (`Report a Pothole Now →`).
   * **Does NOT submit complaints directly. Does NOT accept photos.**

2. **Website Complaint Analyzer** (`/src/services/ai/complaintAnalyzer.ts`):
   * Triggered exclusively during complaint submission.
   * Assesses domain, issue, severity, department routing, photo authenticity, and checks for duplicate incident candidates.

3. **Incident Matcher** (`/src/services/ai/incidentMatcher.ts`):
   * Evaluates Haversine spatial distance, semantic word overlap, and category tokens to merge related complaints into consolidated work orders.

---

## License
Released under the MIT License for Smart City and Civic Technology advancement.
