# 🗺️ ROADMAP

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Last Updated: 2026-10-08

---

## Phase Overview

```
Phase 0 ━━━━━━━━ Phase 1 ━━━━━━━━ Phase 2 ━━━━━━━━ Phase 3 ━━━━━━━━ Phase 4
Planning        Foundation       Core Modules     Advanced         Production
& Architecture  & Security       & Data Entry     Features         & Launch
(Current)
```

---

## Phase 0 — Planning & Architecture ← CURRENT

**Duration**: 1 week
**Goal**: Complete all planning documents, architecture decisions, and project setup.

| Task                                | Status         | Owner    |
| ----------------------------------- | -------------- | -------- |
| Repository structure                | ✅ Complete     | —        |
| Documentation system                | ✅ Complete     | —        |
| Production Requirements Document    | ✅ Complete     | —        |
| Technical Requirements Document     | ✅ Complete     | —        |
| Application Flow Document           | ✅ Complete     | —        |
| Design Brief Document               | ✅ Complete     | —        |
| Database Schema Document            | ✅ Complete     | —        |
| Implementation Plan Document        | ✅ Complete     | —        |
| Next.js 15 project initialization   | ✅ Complete     | —        |
| Supabase project setup              | 🔴 Not Started | —        |
| CI/CD pipeline configuration        | ✅ Complete     | —        |

---

## Phase 1 — Foundation & Security

**Duration**: 2–3 weeks
**Goal**: Authentication, RBAC, agency management, audit logging.
**Modules**: 1–4

| Milestone                           | Depends On     | Status         |
| ----------------------------------- | -------------- | -------------- |
| Supabase Auth integration           | Phase 0        | 🔴 Not Started |
| MFA enrollment flow                 | Auth           | 🔴 Not Started |
| Email verification flow             | Auth           | 🔴 Not Started |
| HTTP-only cookie session management | Auth           | 🔴 Not Started |
| RBAC schema + RLS policies          | Auth           | 🔴 Not Started |
| Role management UI                  | RBAC           | 🔴 Not Started |
| Agency CRUD + hierarchy             | RBAC           | 🔴 Not Started |
| Immutable audit log system          | Auth, RBAC     | 🔴 Not Started |
| Security middleware (CSRF, XSS)     | Auth           | 🔴 Not Started |
| Rate limiting                       | Middleware      | 🔴 Not Started |

---

## Phase 2 — Core Modules & Data Entry

**Duration**: 4–6 weeks
**Goal**: All agency-specific modules operational with data entry and management.
**Modules**: 5–12

| Milestone                           | Depends On     | Status         |
| ----------------------------------- | -------------- | -------------- |
| Official Advisories system          | Phase 1        | 🔴 Not Started |
| Advisory publishing workflow        | Advisories     | 🔴 Not Started |
| Facebook Graph API integration      | Advisories     | 🔴 Not Started |
| Hospital heat illness tracking      | Phase 1        | 🔴 Not Started |
| Patient data entry + reporting      | Hospital       | 🔴 Not Started |
| CDRRMO dispatch tracking            | Phase 1, GIS   | 🔴 Not Started |
| BFP fire incident management        | Phase 1, GIS   | 🔴 Not Started |
| Water interruption management       | Phase 1        | 🔴 Not Started |
| Power interruption management       | Phase 1        | 🔴 Not Started |
| Public dashboard (read-only)        | Advisories     | 🔴 Not Started |

---

## Phase 3 — Advanced Features

**Duration**: 3–4 weeks
**Goal**: GIS mapping, conflict detection, analytics, and the public portal.
**Modules**: 13–16

| Milestone                           | Depends On     | Status         |
| ----------------------------------- | -------------- | -------------- |
| GIS incident mapping (Mapbox GL)    | Core modules   | 🔴 Not Started |
| Multi-layer map visualization       | GIS            | 🔴 Not Started |
| Inter-agency conflict detection     | All agencies   | 🔴 Not Started |
| Conflict resolution workflow        | Conflict det.  | 🔴 Not Started |
| Analytics dashboards                | All data       | 🔴 Not Started |
| Report generation + export          | Analytics      | 🔴 Not Started |
| Public portal (citizen-facing)      | Dashboard, GIS | 🔴 Not Started |
| Mobile-responsive public views      | Public portal  | 🔴 Not Started |

---

## Phase 4 — Production & Launch

**Duration**: 2–3 weeks
**Goal**: Performance optimization, security hardening, UAT, and production deployment.

| Milestone                           | Depends On     | Status         |
| ----------------------------------- | -------------- | -------------- |
| Performance audit (Lighthouse 95+)  | All modules    | 🔴 Not Started |
| Security penetration testing        | All modules    | 🔴 Not Started |
| User Acceptance Testing (UAT)       | All modules    | 🔴 Not Started |
| Load testing                        | All modules    | 🔴 Not Started |
| Production environment setup        | All tests pass | 🔴 Not Started |
| DNS + SSL configuration             | Prod env       | 🔴 Not Started |
| Data migration (if applicable)      | Prod env       | 🔴 Not Started |
| Go-live                             | All above      | 🔴 Not Started |
| Post-launch monitoring              | Go-live        | 🔴 Not Started |

---

## Future Considerations (Post-Launch)

- Mobile native app (React Native)
- SMS alert system integration
- AI-powered incident classification
- Predictive analytics for climate events
- Integration with PAGASA weather API
- Integration with PHIVOLCS earthquake data
- Automated report generation with AI summaries
- Multi-language support (Filipino, Ilocano)
- Offline-first capability for field operations
- Integration with NDRRMC reporting system
