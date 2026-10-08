# 📄 PRODUCTION REQUIREMENTS DOCUMENT (PRD)

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Version: 1.0 | Date: 2026-10-08 | Status: Approved

---

## 1. Executive Summary

The Palayan City Climate Resilience, Emergency Operations & Public Information Hub is a unified digital platform designed to consolidate climate-related advisories, emergency response operations, utility service disruptions, and public information dissemination for Palayan City, Nueva Ecija, Philippines.

The system serves two primary audiences:
1. **Government agency operators** — staff from CDRRMO, BFP, hospitals, water/power utilities, and city administration who manage incidents, publish advisories, and coordinate responses
2. **Citizens of Palayan City** — residents who need timely, accurate information about emergencies, utility interruptions, and climate-related advisories

---

## 2. Problem Statement

Palayan City currently faces the following operational challenges:

1. **Fragmented information systems** — Each agency maintains separate records, leading to duplicated efforts and information gaps
2. **Delayed public communication** — Advisories and alerts reach citizens late due to manual multi-channel publishing
3. **No centralized incident tracking** — Emergency incidents lack geospatial visualization and cross-agency awareness
4. **Inter-agency coordination gaps** — Overlapping advisories and conflicting information from different agencies confuse the public
5. **No data-driven decision making** — Lack of aggregated analytics prevents trend analysis and proactive planning
6. **Heat illness underreporting** — No standardized system for hospitals to report and track climate-related health data
7. **Manual utility disruption notices** — Water and power interruption announcements are inconsistent and delayed

---

## 3. Product Vision

> A single platform where every Palayan City agency can manage its operations, publish verified information, and coordinate with other agencies — while citizens receive accurate, timely, and consolidated public information.

---

## 4. User Personas

### 4.1 Super Administrator
- **Role**: System owner (IT department or City Administrator's office)
- **Goals**: Full system control, user management, security oversight
- **Access**: All modules, all agencies, system configuration

### 4.2 City Administrator
- **Role**: City government leadership
- **Goals**: Cross-agency visibility, city-wide dashboards, report generation
- **Access**: Read access to all agency data, publish city-wide advisories

### 4.3 Agency Administrator
- **Role**: Department head (e.g., CDRRMO Chief, Fire Marshal)
- **Goals**: Manage their agency's operations, approve publications, manage staff
- **Access**: Full access within their agency, read-only cross-agency visibility

### 4.4 Agency Operator
- **Role**: Day-to-day staff (dispatchers, nurses, utility engineers)
- **Goals**: Data entry, incident management, routine reporting
- **Access**: Create/update within their agency module

### 4.5 Agency Viewer
- **Role**: Support staff or observers
- **Goals**: View agency data for reference
- **Access**: Read-only within their agency

### 4.6 Public User (Citizen)
- **Role**: Palayan City resident
- **Goals**: View active advisories, check utility interruptions, see incident maps
- **Access**: Public portal and dashboard only (no authentication required for public data)

---

## 5. Functional Requirements

### 5.1 Authentication & Security (Module 1)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-101 | Email + password login with server-side session management         | P0       | Session stored in HTTP-only cookie, no localStorage tokens         |
| FR-102 | Multi-Factor Authentication (MFA) for all agency accounts          | P0       | TOTP-based MFA enrollment and verification                        |
| FR-103 | Email verification before account activation                       | P0       | Verification email sent, account locked until verified             |
| FR-104 | Password reset via email                                           | P0       | Secure token-based password reset flow                             |
| FR-105 | Session expiry and automatic logout                                | P0       | Configurable session duration, idle timeout                        |
| FR-106 | Brute-force protection                                             | P0       | Account lockout after 5 failed attempts, progressive delays       |
| FR-107 | Secure logout (invalidate session)                                 | P0       | Server-side session termination                                    |

### 5.2 Role-Based Access Control (Module 2)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-201 | Six-tier role hierarchy                                            | P0       | Roles enforced at middleware, API, and database levels             |
| FR-202 | Granular permission system                                         | P0       | Permissions map to specific actions (create, read, update, delete) |
| FR-203 | Agency-scoped data isolation                                       | P0       | Users see only their agency's data by default                     |
| FR-204 | Role assignment and management UI                                  | P0       | Admins can assign/revoke roles                                     |
| FR-205 | Permission inheritance within role hierarchy                       | P1       | Higher roles inherit lower role permissions                        |

### 5.3 Agency Management (Module 3)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-301 | Agency CRUD (create, read, update, deactivate)                     | P0       | Super admin can manage all agencies                                |
| FR-302 | Agency member management                                           | P0       | Agency admins can add/remove members                               |
| FR-303 | Agency profile with contact info and jurisdiction                   | P1       | Each agency has configurable profile                               |
| FR-304 | Agency hierarchy (parent-child relationships)                      | P2       | Support organizational sub-units                                   |

### 5.4 Audit Logging (Module 4)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-401 | Immutable audit trail for all data modifications                   | P0       | Every create/update/delete logged with user, timestamp, changes    |
| FR-402 | Login/logout event logging                                         | P0       | All auth events logged with IP and user agent                      |
| FR-403 | Audit log viewer with filtering                                    | P0       | Searchable by user, action, module, date range                     |
| FR-404 | Audit log export (CSV)                                             | P1       | Export filtered audit logs for compliance                          |
| FR-405 | Tamper-proof audit records                                         | P0       | Append-only table, no UPDATE or DELETE permissions                 |

### 5.5 Official Advisories (Module 6)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-601 | Advisory creation with severity levels                             | P0       | Info, Watch, Warning, Critical, Emergency                          |
| FR-602 | Draft → Published → Archived lifecycle                             | P0       | Approval workflow before public visibility                         |
| FR-603 | Advisory attachments (images, PDFs)                                | P1       | File upload with validation                                        |
| FR-604 | Advisory targeting (city-wide or per-barangay)                     | P1       | Geographic scope selection                                         |
| FR-605 | Advisory expiry management                                         | P1       | Automatic expiry or manual archival                                |
| FR-606 | Advisory history and version tracking                              | P2       | Changes tracked for accountability                                 |

### 5.6 Facebook Graph API Integration (Module 7)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-701 | OAuth connection to Facebook Page                                  | P1       | Agency can connect their official Facebook Page                    |
| FR-702 | Auto-post published advisories to Facebook                         | P1       | Advisory publishes to Facebook upon approval                       |
| FR-703 | Post status tracking                                               | P1       | Visibility into whether Facebook post succeeded                    |
| FR-704 | Manual post trigger                                                | P2       | Operator can manually trigger a Facebook post                      |

### 5.7 Hospital Heat Illness Monitoring (Module 8)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-801 | Heat illness case registration                                     | P1       | Record patient demographics, diagnosis, severity, barangay         |
| FR-802 | Case status tracking (admitted → discharged/transferred)           | P1       | Status updates with timestamps                                     |
| FR-803 | Daily/weekly/monthly aggregated reports                             | P1       | Automated report generation with trends                            |
| FR-804 | Heat illness dashboard                                             | P1       | Visual summary of cases by barangay, severity, time                |
| FR-805 | Data export for DOH reporting                                      | P2       | CSV/Excel export in DOH format                                     |

### 5.8 CDRRMO Dispatch Tracking (Module 9)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-901 | Incident creation with location (GIS)                              | P1       | Map-based incident pinning                                         |
| FR-902 | Resource dispatch management                                       | P1       | Track dispatched vehicles, personnel, equipment                    |
| FR-903 | Incident status lifecycle                                          | P1       | Reported → Responding → Contained → Resolved → Closed             |
| FR-904 | Incident timeline                                                  | P1       | Chronological event log per incident                               |
| FR-905 | Multi-agency coordination tagging                                  | P2       | Tag other agencies involved in response                            |

### 5.9 BFP Fire Monitoring (Module 10)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1001| Fire incident registration with alarm level                        | P1       | 1st through General Alarm classification                           |
| FR-1002| Fire incident location (GIS)                                      | P1       | Map-based fire location                                            |
| FR-1003| Fire investigation tracking                                       | P2       | Post-incident investigation records                                |
| FR-1004| Fire statistical reports                                           | P2       | Monthly/annual fire statistics                                     |

### 5.10 Water Interruption Management (Module 11)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1101| Interruption notice creation                                      | P1       | Schedule, affected areas, reason, estimated restoration            |
| FR-1102| Affected barangay mapping                                         | P1       | Select affected barangays with GIS visualization                   |
| FR-1103| Status updates (scheduled → ongoing → restored)                   | P1       | Real-time status tracking                                          |
| FR-1104| Public notification of interruptions                               | P1       | Automatic visibility on public dashboard                           |

### 5.11 Power Interruption Management (Module 12)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1201| Interruption notice creation                                      | P1       | Schedule, affected areas, reason, estimated restoration            |
| FR-1202| Affected barangay mapping                                         | P1       | Select affected barangays with GIS visualization                   |
| FR-1203| Status updates (scheduled → ongoing → restored)                   | P1       | Real-time status tracking                                          |
| FR-1204| Public notification of interruptions                               | P1       | Automatic visibility on public dashboard                           |

### 5.12 GIS Incident Mapping (Module 13)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1301| Interactive Mapbox GL map component                                | P1       | Pan, zoom, click, layer toggle                                     |
| FR-1302| Multi-layer visualization                                         | P1       | Separate layers for each agency's incidents                        |
| FR-1303| Barangay boundary overlay                                         | P1       | Palayan City barangay boundaries on map                            |
| FR-1304| Incident clustering for dense areas                                | P2       | Automatic clustering at lower zoom levels                          |
| FR-1305| Affected area polygon drawing                                     | P2       | Draw polygons for affected zones                                   |

### 5.13 Inter-Agency Conflict Detection (Module 14)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1401| Detect overlapping advisories                                     | P2       | Alert when two agencies issue conflicting advisories               |
| FR-1402| Detect schedule conflicts (utility interruptions)                  | P2       | Warn if water and power interruptions overlap geographically       |
| FR-1403| Conflict notification to involved agencies                         | P2       | Automatic notification to agency admins                            |
| FR-1404| Conflict resolution workflow                                       | P2       | Acknowledge → Resolve conflict with notes                          |

### 5.14 Analytics & Reporting (Module 15)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1501| City-wide dashboard with aggregated KPIs                           | P2       | Total incidents, advisories, cases by time period                  |
| FR-1502| Per-agency analytics                                               | P2       | Agency-specific trends and metrics                                 |
| FR-1503| Report generation (PDF/CSV)                                        | P2       | Exportable reports for executive briefings                         |
| FR-1504| Trend analysis visualizations                                      | P2       | Charts showing trends over time                                    |

### 5.15 Public Portal (Module 16)

| ID     | Requirement                                                        | Priority | Acceptance Criteria                                                |
| ------ | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| FR-1601| Public dashboard with active advisories                            | P1       | No login required, mobile-responsive                               |
| FR-1602| Active utility interruption display                                | P1       | Current water/power interruptions with schedules                   |
| FR-1603| Public incident map                                                | P1       | Read-only map with active incidents                                |
| FR-1604| Advisory severity color coding                                     | P1       | Visual severity indicators                                         |
| FR-1605| Mobile-responsive design                                           | P0       | Full functionality on mobile devices                               |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID      | Requirement                                  | Target                  |
| ------- | -------------------------------------------- | ----------------------- |
| NFR-101 | Page load time (initial)                     | < 3 seconds             |
| NFR-102 | Page load time (subsequent)                  | < 1 second              |
| NFR-103 | API response time (95th percentile)          | < 500ms                 |
| NFR-104 | Lighthouse Performance score                 | ≥ 95                    |
| NFR-105 | Lighthouse Accessibility score               | ≥ 95                    |
| NFR-106 | Concurrent users supported                   | 500+                    |
| NFR-107 | Database query response time                 | < 200ms (indexed)       |
| NFR-108 | Real-time update latency                     | < 2 seconds             |

### 6.2 Availability

| ID      | Requirement                                  | Target                  |
| ------- | -------------------------------------------- | ----------------------- |
| NFR-201 | Uptime SLA                                   | 99.5%                   |
| NFR-202 | Planned maintenance window                   | < 30 min/month          |
| NFR-203 | Recovery Time Objective (RTO)                | < 1 hour                |
| NFR-204 | Recovery Point Objective (RPO)               | < 24 hours              |

### 6.3 Security

| ID      | Requirement                                  | Standard                |
| ------- | -------------------------------------------- | ----------------------- |
| NFR-301 | Authentication                               | MFA mandatory           |
| NFR-302 | Data encryption at rest                      | AES-256                 |
| NFR-303 | Data encryption in transit                   | TLS 1.3                 |
| NFR-304 | Session management                           | HTTP-only cookies       |
| NFR-305 | Audit trail retention                        | 7 years minimum         |
| NFR-306 | OWASP Top 10 compliance                      | All mitigated           |

### 6.4 Scalability

| ID      | Requirement                                  | Target                  |
| ------- | -------------------------------------------- | ----------------------- |
| NFR-401 | Horizontal scaling                           | Vercel auto-scale       |
| NFR-402 | Database scaling                             | Supabase managed        |
| NFR-403 | File storage scaling                         | Supabase Storage        |

---

## 7. Constraints

| Constraint | Description |
| ---------- | ----------- |
| Budget | Government budget cycle — platform must be cost-effective using managed services |
| Timeline | Phased delivery; MVP (Phase 1-2) within 2 months |
| Technology | Must use specified stack (Next.js 15, Supabase, Mapbox GL) |
| Compliance | Must comply with Philippine Data Privacy Act (RA 10173) |
| Language | English primary, Filipino labels for public-facing elements |
| Hosting | Vercel for frontend, Supabase for backend — no self-hosted infrastructure |

---

## 8. Success Metrics

| Metric | Target | Measurement |
| ------ | ------ | ----------- |
| Advisory publication time | < 5 minutes from creation to public | Time-to-publish tracking |
| Agency adoption | 100% of target agencies onboarded | Agency activation count |
| Public engagement | 1,000+ unique monthly visitors | Analytics tracking |
| Incident response coordination | 30% improvement in response time | Pre/post comparison |
| Data accuracy | Zero conflicting advisories published | Conflict detection module |
| System uptime | 99.5% | Monitoring dashboard |

---

## 9. Assumptions

1. Palayan City agencies will designate trained operators for the system
2. Agencies have reliable internet connectivity
3. Supabase free/pro tier is sufficient for initial deployment
4. Mapbox free tier provides sufficient map loads for initial launch
5. Facebook Pages for agencies are already established
6. Barangay boundary GeoJSON data is available or can be sourced
7. Mobile devices used by field personnel have modern browsers

---

## 10. Risks

| Risk | Probability | Impact | Mitigation |
| ---- | ----------- | ------ | ---------- |
| Agency resistance to adoption | Medium | High | Training programs, gradual rollout |
| Internet connectivity issues | Medium | Medium | Offline-capable future enhancement |
| Data privacy violations | Low | Critical | RLS, encryption, audit logs, RA 10173 compliance |
| Vendor lock-in (Supabase) | Low | Medium | Standard PostgreSQL, documented migration path |
| Budget constraints | Medium | High | Managed services minimize infrastructure cost |
| Facebook API policy changes | Medium | Low | Fallback to manual posting |

---

## 11. Approval

| Role | Name | Status | Date |
| ---- | ---- | ------ | ---- |
| Project Sponsor | TBD | Pending | — |
| Technical Lead | System Architect | Approved | 2026-10-08 |
| Security Officer | TBD | Pending | — |
