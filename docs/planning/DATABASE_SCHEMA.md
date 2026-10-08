# 🗄️ DATABASE SCHEMA DOCUMENT

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Version: 1.0 | Date: 2026-10-08

---

## 1. Database Configuration

```sql
-- Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";         -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "postgis";          -- Geospatial support
```

---

## 2. Enum Types

```sql
-- User account status
CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'pending_verification'
);

-- System role types
CREATE TYPE role_type AS ENUM (
  'super_admin',
  'city_admin',
  'agency_admin',
  'agency_operator',
  'agency_viewer',
  'public_user'
);

-- Agency types
CREATE TYPE agency_type AS ENUM (
  'cdrrmo',
  'bfp',
  'hospital',
  'water_utility',
  'power_utility',
  'city_admin_office',
  'other'
);

-- Advisory status lifecycle
CREATE TYPE advisory_status AS ENUM (
  'draft',
  'under_review',
  'published',
  'archived',
  'expired'
);

-- Advisory severity levels
CREATE TYPE advisory_severity AS ENUM (
  'info',
  'watch',
  'warning',
  'critical',
  'emergency'
);

-- Incident status lifecycle
CREATE TYPE incident_status AS ENUM (
  'reported',
  'responding',
  'contained',
  'resolved',
  'closed'
);

-- Dispatch status
CREATE TYPE dispatch_status AS ENUM (
  'pending',
  'dispatched',
  'en_route',
  'on_scene',
  'resolved',
  'cancelled'
);

-- Fire alarm levels
CREATE TYPE fire_alarm_level AS ENUM (
  'first_alarm',
  'second_alarm',
  'third_alarm',
  'fourth_alarm',
  'fifth_alarm',
  'general_alarm'
);

-- Heat illness severity
CREATE TYPE heat_illness_severity AS ENUM (
  'mild',
  'moderate',
  'severe',
  'fatal'
);

-- Heat illness case status
CREATE TYPE case_status AS ENUM (
  'admitted',
  'under_treatment',
  'discharged',
  'transferred',
  'deceased'
);

-- Utility interruption status
CREATE TYPE interruption_status AS ENUM (
  'scheduled',
  'ongoing',
  'restored',
  'cancelled'
);

-- Interruption type
CREATE TYPE interruption_type AS ENUM (
  'scheduled_maintenance',
  'emergency',
  'load_management',
  'natural_disaster',
  'equipment_failure',
  'other'
);

-- Conflict detection status
CREATE TYPE conflict_status AS ENUM (
  'detected',
  'acknowledged',
  'resolving',
  'resolved',
  'ignored'
);

-- Conflict types
CREATE TYPE conflict_type AS ENUM (
  'advisory_overlap',
  'schedule_overlap',
  'geographic_overlap',
  'severity_mismatch',
  'information_conflict'
);

-- Audit log actions
CREATE TYPE audit_action AS ENUM (
  'create',
  'read',
  'update',
  'delete',
  'login',
  'logout',
  'login_failed',
  'mfa_enroll',
  'mfa_verify',
  'password_reset',
  'export',
  'publish',
  'archive',
  'dispatch',
  'resolve',
  'assign_role',
  'revoke_role',
  'unauthorized_access'
);

-- Notification status
CREATE TYPE notification_status AS ENUM (
  'pending',
  'sent',
  'failed',
  'read'
);
```

---

## 3. Core Tables

### 3.1 Users & Authentication

```sql
-- Extended user profiles (Supabase auth.users is the primary auth table)
CREATE TABLE public.users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT NOT NULL UNIQUE,
  full_name         TEXT NOT NULL,
  phone             TEXT,
  avatar_url        TEXT,
  status            user_status NOT NULL DEFAULT 'pending_verification',
  mfa_enabled       BOOLEAN NOT NULL DEFAULT false,
  agency_id         UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  last_login_at     TIMESTAMPTZ,
  login_count       INTEGER NOT NULL DEFAULT 0,
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  locked_until      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$')
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3.2 RBAC Tables

```sql
-- Role definitions
CREATE TABLE public.roles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            role_type NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  description     TEXT,
  is_system_role  BOOLEAN NOT NULL DEFAULT false,  -- Cannot be deleted
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Permission definitions
CREATE TABLE public.permissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT NOT NULL UNIQUE,       -- e.g., 'advisory:create'
  module          TEXT NOT NULL,              -- e.g., 'advisories'
  action          TEXT NOT NULL,              -- e.g., 'create'
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT permissions_code_format CHECK (code ~* '^[a-z_]+:[a-z_]+$')
);

-- Role-to-permission mapping
CREATE TABLE public.role_permissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id         UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id   UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (role_id, permission_id)
);

-- User-to-role assignment
CREATE TABLE public.user_roles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id         UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, role_id)
);
```

### 3.3 Agency Management

```sql
-- Government agencies
CREATE TABLE public.agencies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  code            TEXT NOT NULL UNIQUE,         -- e.g., 'CDRRMO', 'BFP'
  type            agency_type NOT NULL,
  description     TEXT,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  head_name       TEXT,                         -- Agency head name
  head_title      TEXT,                         -- Agency head title
  logo_url        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  parent_id       UUID REFERENCES public.agencies(id),  -- Hierarchy
  facebook_page_id TEXT,                        -- Connected FB page
  metadata        JSONB DEFAULT '{}',           -- Flexible metadata
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Agency membership (linking users to agencies with roles)
CREATE TABLE public.agency_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  position        TEXT,                         -- Job title within agency
  is_primary      BOOLEAN NOT NULL DEFAULT true, -- Primary agency assignment
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (agency_id, user_id)
);
```

### 3.4 Audit Logs

```sql
-- Immutable audit log (INSERT only, no UPDATE/DELETE)
CREATE TABLE public.audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  agency_id       UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  action          audit_action NOT NULL,
  module          TEXT NOT NULL,                 -- e.g., 'advisories', 'auth'
  entity_type     TEXT,                          -- e.g., 'advisory', 'user'
  entity_id       UUID,                          -- ID of affected entity
  description     TEXT NOT NULL,                 -- Human-readable description
  old_values      JSONB,                         -- Previous state (for updates)
  new_values      JSONB,                         -- New state (for creates/updates)
  ip_address      INET,
  user_agent      TEXT,
  request_id      UUID,                          -- For correlating related actions
  metadata        JSONB DEFAULT '{}',            -- Additional context
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent updates and deletes on audit logs
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_no_update
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

CREATE TRIGGER audit_logs_no_delete
  BEFORE DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
```

---

## 4. Module Tables

### 4.1 Advisories

```sql
-- Official advisories
CREATE TABLE public.advisories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  created_by      UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  published_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,                  -- Rich text / markdown
  severity        advisory_severity NOT NULL DEFAULT 'info',
  status          advisory_status NOT NULL DEFAULT 'draft',
  is_city_wide    BOOLEAN NOT NULL DEFAULT false,
  affected_barangays UUID[] DEFAULT '{}',         -- Array of barangay IDs
  location        GEOMETRY(Point, 4326),          -- Optional point location
  affected_area   GEOMETRY(Polygon, 4326),        -- Optional affected polygon
  effective_from  TIMESTAMPTZ,
  effective_until TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  archived_at     TIMESTAMPTZ,
  review_notes    TEXT,                            -- Admin review feedback
  version         INTEGER NOT NULL DEFAULT 1,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT advisories_date_check CHECK (
    effective_until IS NULL OR effective_from IS NULL OR effective_until > effective_from
  )
);

CREATE TRIGGER advisories_updated_at
  BEFORE UPDATE ON public.advisories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Advisory file attachments
CREATE TABLE public.advisory_attachments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisory_id     UUID NOT NULL REFERENCES public.advisories(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  file_type       TEXT NOT NULL,                  -- MIME type
  file_size       INTEGER NOT NULL,               -- Bytes
  storage_path    TEXT NOT NULL,                   -- Supabase Storage path
  uploaded_by     UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT attachments_file_size CHECK (file_size > 0 AND file_size <= 10485760)  -- 10MB max
);
```

### 4.2 Facebook Integration

```sql
-- Facebook page connections
CREATE TABLE public.facebook_connections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL UNIQUE REFERENCES public.agencies(id) ON DELETE CASCADE,
  page_id         TEXT NOT NULL,
  page_name       TEXT NOT NULL,
  access_token    TEXT NOT NULL,                   -- Encrypted at app level
  token_expires_at TIMESTAMPTZ,
  connected_by    UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER facebook_connections_updated_at
  BEFORE UPDATE ON public.facebook_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Facebook post log
CREATE TABLE public.facebook_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisory_id     UUID NOT NULL REFERENCES public.advisories(id) ON DELETE CASCADE,
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  facebook_post_id TEXT,                           -- FB post ID (null if failed)
  status          TEXT NOT NULL DEFAULT 'pending', -- pending, posted, failed
  error_message   TEXT,
  posted_by       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  posted_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.3 Hospital Heat Illness

```sql
-- Heat illness cases
CREATE TABLE public.heat_illness_cases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  reported_by     UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  -- Patient demographics (no PII beyond what's needed)
  patient_age     INTEGER NOT NULL,
  patient_sex     TEXT NOT NULL CHECK (patient_sex IN ('male', 'female', 'other')),
  patient_barangay_id UUID REFERENCES public.barangays(id),
  -- Clinical data
  diagnosis       TEXT NOT NULL,                  -- Heat exhaustion, heat stroke, etc.
  severity        heat_illness_severity NOT NULL,
  symptoms        TEXT[],                          -- Array of symptoms
  treatment       TEXT,
  -- Status tracking
  status          case_status NOT NULL DEFAULT 'admitted',
  admitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  discharged_at   TIMESTAMPTZ,
  transferred_to  TEXT,                            -- Facility name if transferred
  outcome_notes   TEXT,
  -- Context
  location_of_onset TEXT,                         -- Where the illness occurred
  activity_during   TEXT,                         -- What patient was doing
  ambient_temp    DECIMAL(5,2),                   -- Temperature at time of onset (°C)
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT case_age_check CHECK (patient_age >= 0 AND patient_age <= 150)
);

CREATE TRIGGER heat_illness_cases_updated_at
  BEFORE UPDATE ON public.heat_illness_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.4 CDRRMO Dispatch

```sql
-- Emergency dispatch incidents
CREATE TABLE public.dispatch_incidents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  reported_by     UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  incident_number TEXT NOT NULL UNIQUE,            -- Auto-generated: INC-YYYYMMDD-XXXX
  type            TEXT NOT NULL,                    -- flood, landslide, vehicular, etc.
  description     TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status          incident_status NOT NULL DEFAULT 'reported',
  -- Location
  location        GEOMETRY(Point, 4326) NOT NULL,
  address         TEXT,
  barangay_id     UUID REFERENCES public.barangays(id),
  -- Response
  responding_agencies UUID[] DEFAULT '{}',         -- Other agencies involved
  casualties      INTEGER DEFAULT 0,
  injuries        INTEGER DEFAULT 0,
  evacuees        INTEGER DEFAULT 0,
  -- Timeline
  reported_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispatched_at   TIMESTAMPTZ,
  arrived_at      TIMESTAMPTZ,
  contained_at    TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  closed_at       TIMESTAMPTZ,
  resolution_notes TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER dispatch_incidents_updated_at
  BEFORE UPDATE ON public.dispatch_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Dispatch resources (personnel, vehicles, equipment)
CREATE TABLE public.dispatch_resources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id     UUID NOT NULL REFERENCES public.dispatch_incidents(id) ON DELETE CASCADE,
  resource_type   TEXT NOT NULL CHECK (resource_type IN ('personnel', 'vehicle', 'equipment')),
  name            TEXT NOT NULL,                    -- Resource name/identifier
  quantity        INTEGER NOT NULL DEFAULT 1,
  status          dispatch_status NOT NULL DEFAULT 'pending',
  dispatched_at   TIMESTAMPTZ,
  returned_at     TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.5 BFP Fire Monitoring

```sql
-- Fire incidents
CREATE TABLE public.fire_incidents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  reported_by     UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  incident_number TEXT NOT NULL UNIQUE,
  alarm_level     fire_alarm_level NOT NULL DEFAULT 'first_alarm',
  status          incident_status NOT NULL DEFAULT 'reported',
  -- Location
  location        GEOMETRY(Point, 4326) NOT NULL,
  address         TEXT,
  barangay_id     UUID REFERENCES public.barangays(id),
  -- Fire details
  fire_type       TEXT,                             -- structural, vehicular, grass, etc.
  cause           TEXT,                             -- determined cause
  estimated_damage DECIMAL(15,2),                  -- PHP amount
  structures_affected INTEGER DEFAULT 0,
  families_affected INTEGER DEFAULT 0,
  casualties      INTEGER DEFAULT 0,
  injuries        INTEGER DEFAULT 0,
  -- Timeline
  alarm_time      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fire_out_time   TIMESTAMPTZ,
  -- Investigation
  investigation_status TEXT DEFAULT 'pending',
  investigator    TEXT,
  investigation_notes TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER fire_incidents_updated_at
  BEFORE UPDATE ON public.fire_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.6 Utility Interruptions

```sql
-- Water service interruptions
CREATE TABLE public.water_interruptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  created_by      UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  type            interruption_type NOT NULL,
  status          interruption_status NOT NULL DEFAULT 'scheduled',
  -- Schedule
  start_time      TIMESTAMPTZ NOT NULL,
  estimated_end   TIMESTAMPTZ NOT NULL,
  actual_end      TIMESTAMPTZ,
  -- Impact
  affected_area   GEOMETRY(MultiPolygon, 4326),
  affected_barangays UUID[] DEFAULT '{}',
  affected_households INTEGER,
  -- Resolution
  resolution_notes TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT water_schedule_check CHECK (estimated_end > start_time)
);

CREATE TRIGGER water_interruptions_updated_at
  BEFORE UPDATE ON public.water_interruptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Water interruption affected area details
CREATE TABLE public.water_affected_areas (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interruption_id     UUID NOT NULL REFERENCES public.water_interruptions(id) ON DELETE CASCADE,
  barangay_id         UUID NOT NULL REFERENCES public.barangays(id),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Power service interruptions (same structure as water)
CREATE TABLE public.power_interruptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  created_by      UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  type            interruption_type NOT NULL,
  status          interruption_status NOT NULL DEFAULT 'scheduled',
  start_time      TIMESTAMPTZ NOT NULL,
  estimated_end   TIMESTAMPTZ NOT NULL,
  actual_end      TIMESTAMPTZ,
  affected_area   GEOMETRY(MultiPolygon, 4326),
  affected_barangays UUID[] DEFAULT '{}',
  affected_households INTEGER,
  resolution_notes TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT power_schedule_check CHECK (estimated_end > start_time)
);

CREATE TRIGGER power_interruptions_updated_at
  BEFORE UPDATE ON public.power_interruptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Power interruption affected area details
CREATE TABLE public.power_affected_areas (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interruption_id     UUID NOT NULL REFERENCES public.power_interruptions(id) ON DELETE CASCADE,
  barangay_id         UUID NOT NULL REFERENCES public.barangays(id),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.7 GIS & Reference Data

```sql
-- Palayan City barangays (reference table)
CREATE TABLE public.barangays (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL UNIQUE,
  code            TEXT NOT NULL UNIQUE,             -- PSGC code
  population      INTEGER,
  area_sqkm       DECIMAL(10,4),
  boundary        GEOMETRY(MultiPolygon, 4326),     -- Barangay boundary polygon
  center_point    GEOMETRY(Point, 4326),             -- Centroid for labels
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unified incidents view for GIS (materialized for performance)
-- This table aggregates all incident types for map display
CREATE TABLE public.gis_incidents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type     TEXT NOT NULL,                     -- 'dispatch', 'fire', 'advisory'
  source_id       UUID NOT NULL,                     -- ID in source table
  agency_id       UUID NOT NULL REFERENCES public.agencies(id),
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL,                     -- flood, fire, health, etc.
  severity        TEXT NOT NULL,
  status          TEXT NOT NULL,
  location        GEOMETRY(Point, 4326) NOT NULL,
  affected_area   GEOMETRY(Polygon, 4326),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  started_at      TIMESTAMPTZ NOT NULL,
  resolved_at     TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (source_type, source_id)
);

CREATE TRIGGER gis_incidents_updated_at
  BEFORE UPDATE ON public.gis_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Map layer configurations
CREATE TABLE public.map_layers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  category        TEXT NOT NULL,                     -- 'incident', 'utility', 'boundary'
  source_table    TEXT NOT NULL,
  style           JSONB NOT NULL,                    -- Mapbox layer style JSON
  is_default_on   BOOLEAN NOT NULL DEFAULT false,
  min_zoom        INTEGER DEFAULT 0,
  max_zoom        INTEGER DEFAULT 22,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.8 Conflict Detection

```sql
-- Detected inter-agency conflicts
CREATE TABLE public.conflicts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            conflict_type NOT NULL,
  status          conflict_status NOT NULL DEFAULT 'detected',
  severity        TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description     TEXT NOT NULL,
  -- Involved parties
  agency_ids      UUID[] NOT NULL,                   -- All involved agencies
  -- Related entities
  entity_a_type   TEXT NOT NULL,                     -- e.g., 'advisory', 'water_interruption'
  entity_a_id     UUID NOT NULL,
  entity_b_type   TEXT NOT NULL,
  entity_b_id     UUID NOT NULL,
  -- Geographic overlap (if applicable)
  overlap_area    GEOMETRY(Polygon, 4326),
  overlap_barangays UUID[] DEFAULT '{}',
  -- Resolution
  acknowledged_by UUID REFERENCES public.users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_by     UUID REFERENCES public.users(id),
  resolved_at     TIMESTAMPTZ,
  resolution_notes TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER conflicts_updated_at
  BEFORE UPDATE ON public.conflicts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.9 System Tables

```sql
-- In-app notification queue
CREATE TABLE public.notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,                     -- 'conflict', 'advisory', 'system'
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  link            TEXT,                              -- In-app link to navigate to
  status          notification_status NOT NULL DEFAULT 'pending',
  read_at         TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- System configuration (key-value store)
CREATE TABLE public.system_config (
  key             TEXT PRIMARY KEY,
  value           JSONB NOT NULL,
  description     TEXT,
  updated_by      UUID REFERENCES public.users(id),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 5. Indexes

```sql
-- Users
CREATE INDEX idx_users_agency_id ON public.users(agency_id);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_email ON public.users(email);

-- RBAC
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);

-- Audit Logs (heavy read table)
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_agency_id ON public.audit_logs(agency_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_module ON public.audit_logs(module);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_created_at_brin ON public.audit_logs USING BRIN (created_at);

-- Advisories
CREATE INDEX idx_advisories_agency_id ON public.advisories(agency_id);
CREATE INDEX idx_advisories_status ON public.advisories(status);
CREATE INDEX idx_advisories_severity ON public.advisories(severity);
CREATE INDEX idx_advisories_published_at ON public.advisories(published_at DESC);
CREATE INDEX idx_advisories_location ON public.advisories USING GIST (location);
CREATE INDEX idx_advisories_affected_area ON public.advisories USING GIST (affected_area);

-- Dispatch Incidents
CREATE INDEX idx_dispatch_agency_id ON public.dispatch_incidents(agency_id);
CREATE INDEX idx_dispatch_status ON public.dispatch_incidents(status);
CREATE INDEX idx_dispatch_location ON public.dispatch_incidents USING GIST (location);
CREATE INDEX idx_dispatch_reported_at ON public.dispatch_incidents(reported_at DESC);
CREATE INDEX idx_dispatch_barangay ON public.dispatch_incidents(barangay_id);

-- Fire Incidents
CREATE INDEX idx_fire_agency_id ON public.fire_incidents(agency_id);
CREATE INDEX idx_fire_status ON public.fire_incidents(status);
CREATE INDEX idx_fire_alarm_level ON public.fire_incidents(alarm_level);
CREATE INDEX idx_fire_location ON public.fire_incidents USING GIST (location);
CREATE INDEX idx_fire_alarm_time ON public.fire_incidents(alarm_time DESC);

-- Water Interruptions
CREATE INDEX idx_water_agency_id ON public.water_interruptions(agency_id);
CREATE INDEX idx_water_status ON public.water_interruptions(status);
CREATE INDEX idx_water_schedule ON public.water_interruptions(start_time, estimated_end);
CREATE INDEX idx_water_affected_area ON public.water_interruptions USING GIST (affected_area);

-- Power Interruptions
CREATE INDEX idx_power_agency_id ON public.power_interruptions(agency_id);
CREATE INDEX idx_power_status ON public.power_interruptions(status);
CREATE INDEX idx_power_schedule ON public.power_interruptions(start_time, estimated_end);
CREATE INDEX idx_power_affected_area ON public.power_interruptions USING GIST (affected_area);

-- Heat Illness Cases
CREATE INDEX idx_heat_illness_agency_id ON public.heat_illness_cases(agency_id);
CREATE INDEX idx_heat_illness_status ON public.heat_illness_cases(status);
CREATE INDEX idx_heat_illness_severity ON public.heat_illness_cases(severity);
CREATE INDEX idx_heat_illness_admitted_at ON public.heat_illness_cases(admitted_at DESC);
CREATE INDEX idx_heat_illness_barangay ON public.heat_illness_cases(patient_barangay_id);

-- GIS Incidents
CREATE INDEX idx_gis_incidents_location ON public.gis_incidents USING GIST (location);
CREATE INDEX idx_gis_incidents_affected_area ON public.gis_incidents USING GIST (affected_area);
CREATE INDEX idx_gis_incidents_active ON public.gis_incidents(is_active) WHERE is_active = true;
CREATE INDEX idx_gis_incidents_source ON public.gis_incidents(source_type, source_id);
CREATE INDEX idx_gis_incidents_agency_id ON public.gis_incidents(agency_id);

-- Conflicts
CREATE INDEX idx_conflicts_status ON public.conflicts(status);
CREATE INDEX idx_conflicts_created_at ON public.conflicts(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, status) WHERE status = 'pending';

-- Barangays
CREATE INDEX idx_barangays_boundary ON public.barangays USING GIST (boundary);
CREATE INDEX idx_barangays_center ON public.barangays USING GIST (center_point);
```

---

## 6. Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all user-facing tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heat_illness_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fire_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_interruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_affected_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_interruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_affected_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gis_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Note: Detailed RLS policies per table are implemented during module build.
-- Helper function for checking user's agency
CREATE OR REPLACE FUNCTION public.get_user_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function for checking user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS role_type AS $$
  SELECT r.name FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = auth.uid()
  ORDER BY
    CASE r.name
      WHEN 'super_admin' THEN 1
      WHEN 'city_admin' THEN 2
      WHEN 'agency_admin' THEN 3
      WHEN 'agency_operator' THEN 4
      WHEN 'agency_viewer' THEN 5
      WHEN 'public_user' THEN 6
    END
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function for checking permissions
CREATE OR REPLACE FUNCTION public.has_permission(permission_code TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = permission_code
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

## 7. Entity Relationship Summary

```
auth.users ──1:1──▶ public.users ──M:N──▶ public.roles (via user_roles)
                          │                       │
                          │                       └──M:N──▶ public.permissions (via role_permissions)
                          │
                          ├──M:1──▶ public.agencies
                          │               │
                          │               ├──1:M──▶ public.advisories
                          │               ├──1:M──▶ public.dispatch_incidents
                          │               ├──1:M──▶ public.fire_incidents
                          │               ├──1:M──▶ public.heat_illness_cases
                          │               ├──1:M──▶ public.water_interruptions
                          │               ├──1:M──▶ public.power_interruptions
                          │               └──1:1──▶ public.facebook_connections
                          │
                          └──1:M──▶ public.audit_logs

public.advisories ──1:M──▶ public.advisory_attachments
                  ──1:M──▶ public.facebook_posts

public.dispatch_incidents ──1:M──▶ public.dispatch_resources

public.barangays ◀── Referenced by all location-aware tables

public.gis_incidents ── Aggregation of dispatch_incidents, fire_incidents, advisories

public.conflicts ── References entities from multiple tables
```
