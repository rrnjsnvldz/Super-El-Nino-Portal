# 🗄️ DATABASE REGISTRY

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Last Updated: 2026-10-08

---

## Database Overview

| Property             | Value                                      |
| -------------------- | ------------------------------------------ |
| **Engine**           | PostgreSQL 15 (Supabase)                   |
| **Extensions**       | PostGIS, pgcrypto, uuid-ossp               |
| **Connection Pool**  | Supabase pgBouncer (transaction mode)      |
| **RLS**              | Enabled on ALL user-facing tables          |
| **Encryption**       | At rest (AES-256), in transit (TLS 1.3)    |
| **Backups**          | Supabase automatic daily backups           |

---

## Schema Registry

### Core Schema (`public`)

| Table                    | Module            | RLS | Status         | Migration   | Description                          |
| ------------------------ | ----------------- | --- | -------------- | ----------- | ------------------------------------ |
| `users`                  | Auth              | ✅  | 🔴 Pending      | —           | Extended user profiles               |
| `roles`                  | RBAC              | ✅  | 🔴 Pending      | —           | Role definitions                     |
| `permissions`            | RBAC              | ✅  | 🔴 Pending      | —           | Permission definitions               |
| `role_permissions`       | RBAC              | ✅  | 🔴 Pending      | —           | Role-to-permission mappings          |
| `user_roles`             | RBAC              | ✅  | 🔴 Pending      | —           | User-to-role assignments             |
| `agencies`               | Agency Mgmt       | ✅  | 🔴 Pending      | —           | Government agency registry           |
| `agency_members`         | Agency Mgmt       | ✅  | 🔴 Pending      | —           | Agency membership                    |
| `audit_logs`             | Audit             | ✅  | 🔴 Pending      | —           | Immutable action log                 |
| `advisories`             | Advisories        | ✅  | 🔴 Pending      | —           | Official advisories                  |
| `advisory_attachments`   | Advisories        | ✅  | 🔴 Pending      | —           | Advisory file attachments            |
| `facebook_posts`         | Facebook          | ✅  | 🔴 Pending      | —           | Facebook integration log             |
| `facebook_tokens`        | Facebook          | ✅  | 🔴 Pending      | —           | Encrypted OAuth tokens               |
| `heat_illness_cases`     | Hospital          | ✅  | 🔴 Pending      | —           | Patient heat illness records         |
| `hospital_reports`       | Hospital          | ✅  | 🔴 Pending      | —           | Aggregated hospital reports          |
| `dispatch_incidents`     | CDRRMO            | ✅  | 🔴 Pending      | —           | Emergency dispatch records           |
| `dispatch_resources`     | CDRRMO            | ✅  | 🔴 Pending      | —           | Deployed resource tracking           |
| `fire_incidents`         | BFP               | ✅  | 🔴 Pending      | —           | Fire incident records                |
| `fire_reports`           | BFP               | ✅  | 🔴 Pending      | —           | Aggregated fire reports              |
| `water_interruptions`    | Water Utility     | ✅  | 🔴 Pending      | —           | Water service interruptions          |
| `water_affected_areas`   | Water Utility     | ✅  | 🔴 Pending      | —           | Affected barangay mapping            |
| `power_interruptions`    | Power Utility     | ✅  | 🔴 Pending      | —           | Power service interruptions          |
| `power_affected_areas`   | Power Utility     | ✅  | 🔴 Pending      | —           | Affected barangay mapping            |
| `incidents`              | GIS               | ✅  | 🔴 Pending      | —           | Unified incident table (geospatial)  |
| `incident_layers`        | GIS               | ✅  | 🔴 Pending      | —           | Map layer configurations             |
| `conflicts`              | Conflict Detect.  | ✅  | 🔴 Pending      | —           | Detected inter-agency conflicts      |
| `conflict_resolutions`   | Conflict Detect.  | ✅  | 🔴 Pending      | —           | Resolution records                   |
| `barangays`              | Reference         | ❌  | 🔴 Pending      | —           | Palayan City barangay list           |
| `notification_queue`     | System            | ✅  | 🔴 Pending      | —           | Queued notifications                 |

---

## Enum Types

| Enum Name                | Values                                                         | Module       |
| ------------------------ | -------------------------------------------------------------- | ------------ |
| `user_status`            | `active`, `inactive`, `suspended`, `pending_verification`      | Auth         |
| `role_type`              | `super_admin`, `city_admin`, `agency_admin`, `agency_operator`, `agency_viewer`, `public_user` | RBAC |
| `advisory_status`        | `draft`, `published`, `archived`, `expired`                    | Advisories   |
| `advisory_severity`      | `info`, `watch`, `warning`, `critical`, `emergency`            | Advisories   |
| `incident_status`        | `reported`, `responding`, `contained`, `resolved`, `closed`    | GIS/CDRRMO   |
| `dispatch_status`        | `pending`, `dispatched`, `en_route`, `on_scene`, `resolved`    | CDRRMO       |
| `fire_alarm_level`       | `first`, `second`, `third`, `fourth`, `fifth`, `general`       | BFP          |
| `interruption_status`    | `scheduled`, `ongoing`, `restored`, `cancelled`                | Water/Power  |
| `conflict_status`        | `detected`, `acknowledged`, `resolving`, `resolved`, `ignored` | Conflict     |
| `audit_action`           | `create`, `read`, `update`, `delete`, `login`, `logout`, `export`, `publish` | Audit |

---

## Index Registry

| Table                 | Index Name                        | Columns                      | Type     | Status         |
| --------------------- | --------------------------------- | ---------------------------- | -------- | -------------- |
| `audit_logs`          | `idx_audit_logs_user_id`          | `user_id`                    | B-tree   | 🔴 Pending      |
| `audit_logs`          | `idx_audit_logs_created_at`       | `created_at`                 | B-tree   | 🔴 Pending      |
| `audit_logs`          | `idx_audit_logs_action`           | `action`                     | B-tree   | 🔴 Pending      |
| `advisories`          | `idx_advisories_agency_id`        | `agency_id`                  | B-tree   | 🔴 Pending      |
| `advisories`          | `idx_advisories_status`           | `status`                     | B-tree   | 🔴 Pending      |
| `advisories`          | `idx_advisories_severity`         | `severity`                   | B-tree   | 🔴 Pending      |
| `incidents`           | `idx_incidents_location`          | `location`                   | GiST     | 🔴 Pending      |
| `incidents`           | `idx_incidents_agency_id`         | `agency_id`                  | B-tree   | 🔴 Pending      |
| `incidents`           | `idx_incidents_status`            | `status`                     | B-tree   | 🔴 Pending      |
| `dispatch_incidents`  | `idx_dispatch_status`             | `status`                     | B-tree   | 🔴 Pending      |
| `fire_incidents`      | `idx_fire_alarm_level`            | `alarm_level`                | B-tree   | 🔴 Pending      |
| `water_interruptions` | `idx_water_schedule`              | `start_time`, `end_time`     | B-tree   | 🔴 Pending      |
| `power_interruptions` | `idx_power_schedule`              | `start_time`, `end_time`     | B-tree   | 🔴 Pending      |

---

## RLS Policy Registry

> Detailed RLS policies will be documented per-table during implementation.

| Table           | Policy Name         | Operation      | Role Scope              | Status         |
| --------------- | ------------------- | -------------- | ----------------------- | -------------- |
| All tables      | `agency_isolation`  | SELECT/ALL     | Filter by `agency_id`   | 🔴 Pending      |
| `users`         | `own_profile`       | SELECT/UPDATE  | Own record only         | 🔴 Pending      |
| `audit_logs`    | `insert_only`       | INSERT         | Authenticated           | 🔴 Pending      |
| `audit_logs`    | `admin_read`        | SELECT         | Admin roles only        | 🔴 Pending      |
| `advisories`    | `public_published`  | SELECT         | Published + public      | 🔴 Pending      |

---

## Migration Log

| Migration ID | Date | Description | Author | Status |
| ------------ | ---- | ----------- | ------ | ------ |
| —            | —    | No migrations yet | — | —  |
