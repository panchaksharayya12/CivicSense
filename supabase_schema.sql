-- ========================================================
-- CivicSense: Smart City Municipal Intelligence Core Schema
-- Database: PostgreSQL / Supabase
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    preferred_language VARCHAR(20) DEFAULT 'en',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INCIDENTS TABLE (Consolidated Civic Work Orders)
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. PTH-1042
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    department VARCHAR(255) NOT NULL,
    assigned_officer VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'in_progress', 'resolved')),
    ai_confidence INTEGER DEFAULT 95,
    grouping_reason TEXT,
    report_count INTEGER DEFAULT 1,
    first_reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    latest_reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMPLAINTS TABLE (Individual Citizen Applications)
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. CS-2026-00147
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    description_original TEXT NOT NULL,
    description_normalized TEXT,
    language VARCHAR(20) DEFAULT 'en',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT NOT NULL,
    location_source VARCHAR(20) DEFAULT 'manual' CHECK (location_source IN ('gps', 'manual')),
    image_url TEXT,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    urgency VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'emergency')),
    ai_confidence INTEGER DEFAULT 95,
    recommended_department VARCHAR(255) NOT NULL,
    assigned_department VARCHAR(255),
    assigned_officer VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected')),
    incident_id VARCHAR(50) REFERENCES incidents(incident_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INCIDENT_COMPLAINTS (Join Table for Consolidation)
CREATE TABLE IF NOT EXISTS incident_complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id VARCHAR(50) NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    complaint_id VARCHAR(50) NOT NULL REFERENCES complaints(application_id) ON DELETE CASCADE,
    similarity_score INTEGER DEFAULT 90,
    matched_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STATUS_HISTORY TABLE (Full Timeline Audit)
CREATE TABLE IF NOT EXISTS status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    application_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'status_update',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    officer_count INTEGER DEFAULT 10,
    active BOOLEAN DEFAULT TRUE
);

-- 8. HELPLINES TABLE
CREATE TABLE IF NOT EXISTS helplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_emergency BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE
);

-- ========================================================
-- INDEXES FOR HIGH QUERY PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_complaints_application_id ON complaints(application_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_incident_id ON complaints(incident_id);
CREATE INDEX IF NOT EXISTS idx_incidents_incident_id ON incidents(incident_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Citizens can view their own complaints
CREATE POLICY "Citizens can view own complaints"
ON complaints FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all complaints
CREATE POLICY "Admins can view all complaints"
ON complaints FOR ALL
USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Notifications RLS
CREATE POLICY "Citizens view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);
