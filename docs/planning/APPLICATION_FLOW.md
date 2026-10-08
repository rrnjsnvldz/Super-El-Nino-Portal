# 🔄 APPLICATION FLOW DOCUMENT

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Version: 1.0 | Date: 2026-10-08

---

## 1. System Entry Points

```
                          ┌─────────────────────┐
                          │   palayan-hub.gov.ph │
                          │   (Entry Point)      │
                          └──────────┬──────────┘
                                     │
                        ┌────────────┼────────────┐
                        │            │            │
                        ▼            ▼            ▼
                ┌──────────┐ ┌──────────┐ ┌──────────┐
                │ Public   │ │ Agency   │ │  API     │
                │ Portal   │ │ Login    │ │ Webhook  │
                │ /        │ │ /login   │ │ /api/    │
                └──────────┘ └──────────┘ └──────────┘
```

---

## 2. Authentication Flows

### 2.1 Login Flow

```
┌──────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │────▶│ /login    │────▶│ Validate │────▶│ Supabase │────▶│ MFA      │
│      │     │ (form)    │     │ (Zod)    │     │ Auth     │     │ Required?│
└──────┘     └───────────┘     └──────────┘     └──────────┘     └─────┬────┘
                                                                   │       │
                                                              No MFA    MFA
                                                                   │       │
                                                                   ▼       ▼
                                                           ┌──────────┐ ┌──────────┐
                                                           │Set Cookie│ │/mfa/     │
                                                           │Redirect  │ │verify    │
                                                           │/dashboard│ │(TOTP)    │
                                                           └──────────┘ └─────┬────┘
                                                                              │
                                                                         Verified
                                                                              │
                                                                              ▼
                                                                       ┌──────────┐
                                                                       │Set Cookie│
                                                                       │Redirect  │
                                                                       │/dashboard│
                                                                       └──────────┘
```

### 2.2 Registration Flow (Admin-Initiated)

```
Admin creates user account
       │
       ▼
System generates invite
       │
       ▼
Email sent with verification link
       │
       ▼
User clicks link → /verify-email?token=xxx
       │
       ▼
Email verified, user sets password
       │
       ▼
MFA enrollment required → /mfa/enroll
       │
       ▼
User scans QR code, enters TOTP
       │
       ▼
Account fully activated → /dashboard
```

### 2.3 Password Reset Flow

```
User → /forgot-password → Enter email → Rate limit check
       │
       ▼
Supabase sends reset email (if account exists)
       │
       ▼
User clicks link → /reset-password?token=xxx
       │
       ▼
New password form (Zod validation: min 12 chars, complexity)
       │
       ▼
Password updated → Redirect /login
       │
       ▼
Audit log: PASSWORD_RESET
```

---

## 3. Dashboard Navigation Flow

### 3.1 Role-Based Navigation

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD LAYOUT                              │
│  ┌───────────────┐  ┌───────────────────────────────────────────┐   │
│  │   SIDEBAR     │  │              MAIN CONTENT                  │   │
│  │               │  │                                            │   │
│  │ ── Overview   │  │  ┌──────────────────────────────────────┐ │   │
│  │               │  │  │  PAGE HEADER                         │ │   │
│  │ ── My Agency  │  │  │  Title + Breadcrumbs + Actions       │ │   │
│  │    ├ Module 1 │  │  └──────────────────────────────────────┘ │   │
│  │    ├ Module 2 │  │                                            │   │
│  │    └ Module N │  │  ┌──────────────────────────────────────┐ │   │
│  │               │  │  │  PAGE CONTENT                        │ │   │
│  │ ── Map View   │  │  │  (Tables, Forms, Charts, Maps)       │ │   │
│  │               │  │  │                                      │ │   │
│  │ ── Analytics  │  │  │                                      │ │   │
│  │               │  │  └──────────────────────────────────────┘ │   │
│  │ ── Admin      │  │                                            │   │
│  │    ├ Users    │  │                                            │   │
│  │    ├ Agencies │  │                                            │   │
│  │    ├ Roles    │  │                                            │   │
│  │    └ Audit    │  │                                            │   │
│  │               │  │                                            │   │
│  │ ── Settings   │  │                                            │   │
│  └───────────────┘  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Sidebar Items by Role

| Menu Item          | Super Admin | City Admin | Agency Admin | Operator | Viewer |
| ------------------ | ----------- | ---------- | ------------ | -------- | ------ |
| Dashboard Overview | ✅          | ✅         | ✅           | ✅       | ✅     |
| Advisories         | ✅          | ✅         | ✅           | ✅       | ✅ (R) |
| Agency Module*     | All         | All (R)    | Own          | Own      | Own (R)|
| GIS Map            | ✅          | ✅         | ✅           | ✅       | ✅     |
| Conflicts          | ✅          | ✅         | ✅ (own)     | ❌       | ❌     |
| Analytics          | ✅          | ✅         | ✅ (own)     | ❌       | ❌     |
| User Management    | ✅          | ✅         | ✅ (own)     | ❌       | ❌     |
| Agency Management  | ✅          | ✅         | ❌           | ❌       | ❌     |
| Audit Logs         | ✅          | ✅         | ✅ (own)     | ❌       | ❌     |
| Settings           | ✅          | ✅         | ✅           | ✅       | ✅     |

*(R) = Read-only, *Agency Module = module specific to user's agency (Hospital, CDRRMO, BFP, Water, Power)*

---

## 4. Core Module Flows

### 4.1 Advisory Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADVISORY LIFECYCLE                         │
│                                                              │
│   ┌───────┐    ┌──────────┐    ┌───────────┐    ┌────────┐ │
│   │ DRAFT │───▶│ REVIEW   │───▶│ PUBLISHED │───▶│ARCHIVED│ │
│   │       │    │          │    │           │    │        │ │
│   └───┬───┘    └─────┬────┘    └─────┬─────┘    └────────┘ │
│       │              │               │                      │
│   Operator       Admin           Auto/Manual                │
│   creates       approves/        archival                   │
│                 rejects                                      │
│                    │               │                         │
│              ┌─────┘         ┌─────┘                        │
│              ▼               ▼                              │
│         Back to         ┌──────────┐                        │
│         Draft           │ TRIGGERS │                        │
│                         ├──────────┤                        │
│                         │ • Public Dashboard update         │
│                         │ • Facebook auto-post              │
│                         │ • GIS map update (if location)    │
│                         │ • Conflict check                  │
│                         │ • Audit log entry                 │
│                         └──────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Incident Management Flow (CDRRMO/BFP)

```
Incident Reported
       │
       ▼
┌─────────────────────┐
│ Create Incident     │
│ • Type / Category   │
│ • Location (map)    │
│ • Severity          │
│ • Description       │
│ • Reporting source  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│ STATUS: REPORTED    │────▶│ Dispatch Resources   │
│                     │     │ • Personnel          │
│ Appears on:        │     │ • Vehicles           │
│ • Dashboard        │     │ • Equipment          │
│ • GIS Map          │     └─────────┬───────────┘
│ • Conflict Check   │               │
└─────────────────────┘               ▼
                              ┌─────────────────────┐
                              │ STATUS: RESPONDING   │
                              │                     │
                              │ Timeline entries:   │
                              │ • Dispatched at     │
                              │ • En route at       │
                              │ • On scene at       │
                              └─────────┬───────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │ STATUS: CONTAINED   │
                              │ (for applicable)     │
                              └─────────┬───────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │ STATUS: RESOLVED     │
                              │                     │
                              │ • Resolution notes  │
                              │ • Resources released│
                              │ • Audit log         │
                              └─────────┬───────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │ STATUS: CLOSED       │
                              │                     │
                              │ • Final report      │
                              │ • Statistics updated│
                              └─────────────────────┘
```

### 4.3 Utility Interruption Flow (Water/Power)

```
Utility Operator
       │
       ▼
┌─────────────────────────┐
│ Create Interruption     │
│ • Type (scheduled/      │
│   emergency)            │
│ • Start date/time       │
│ • Est. end date/time    │
│ • Reason                │
│ • Affected barangays    │
│   (multi-select + map)  │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ STATUS: SCHEDULED       │
│                         │──→ Public Dashboard shows notice
│ Conflict Check runs:    │──→ GIS map shows affected area
│ • Water + Power overlap?│──→ Conflict alert if overlap
└─────────┬───────────────┘
          │ Start time reached
          ▼
┌─────────────────────────┐
│ STATUS: ONGOING         │
│                         │──→ Dashboard updates to ONGOING
│ Operator can:           │──→ Public sees active interruption
│ • Extend end time       │
│ • Add update notes      │
│ • Update affected areas │
└─────────┬───────────────┘
          │ Service restored
          ▼
┌─────────────────────────┐
│ STATUS: RESTORED        │
│                         │──→ Dashboard clears from active
│ • Actual end time       │──→ Audit log entry
│ • Resolution notes      │──→ Statistics updated
└─────────────────────────┘
```

### 4.4 Hospital Heat Illness Flow

```
Hospital Operator
       │
       ▼
┌─────────────────────────┐
│ Record New Case         │
│ • Patient demographics  │
│   (age, sex, barangay)  │
│ • Diagnosis type        │
│ • Severity (mild/       │
│   moderate/severe)      │
│ • Admission date/time   │
│ • Treating facility     │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Case Active             │
│                         │──→ Dashboard count updates
│ Operator can:           │──→ Barangay heatmap updates
│ • Update status         │
│ • Add treatment notes   │
│ • Record outcome        │
└─────┬───────┬───────────┘
      │       │
      ▼       ▼
┌──────────┐ ┌──────────────┐
│DISCHARGED│ │ TRANSFERRED  │
│          │ │ (to another  │
│ Outcome  │ │  facility)   │
│ recorded │ │              │
└──────────┘ └──────────────┘
      │
      ▼
Reports auto-aggregate:
• Daily summary
• Barangay breakdown
• Severity distribution
• Trend analysis
```

---

## 5. Inter-Agency Conflict Detection Flow

```
Trigger: New advisory published OR new interruption created
       │
       ▼
┌─────────────────────────────────────────────┐
│           CONFLICT DETECTION ENGINE          │
│                                              │
│  1. Geographic overlap check                 │
│     • Same barangay(s) affected?             │
│     • Overlapping GIS polygons?              │
│                                              │
│  2. Temporal overlap check                   │
│     • Same time period?                      │
│     • Overlapping schedules?                 │
│                                              │
│  3. Content conflict check                   │
│     • Contradictory severity levels?         │
│     • Conflicting instructions?              │
│                                              │
└──────────────────────┬──────────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
         No conflict      Conflict detected
              │                 │
              ▼                 ▼
          Continue        ┌─────────────────────┐
                          │ Create conflict      │
                          │ record               │
                          │ • Type               │
                          │ • Involved agencies  │
                          │ • Affected items     │
                          │ • Severity           │
                          └─────────┬───────────┘
                                    │
                                    ▼
                          ┌─────────────────────┐
                          │ Notify agency admins │
                          │ (realtime + in-app)  │
                          └─────────┬───────────┘
                                    │
                                    ▼
                          ┌─────────────────────┐
                          │ Resolution workflow  │
                          │ • Acknowledge        │
                          │ • Discuss            │
                          │ • Resolve with notes │
                          │ • Or ignore with     │
                          │   justification      │
                          └─────────────────────┘
```

---

## 6. Public Portal Flow

```
Citizen visits palayan-hub.gov.ph
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   PUBLIC HOMEPAGE                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ACTIVE ALERTS BANNER                             │   │
│  │  (Critical/Emergency advisories)                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐    │
│  │ Latest     │  │ Utility    │  │ Incident       │    │
│  │ Advisories │  │ Status     │  │ Map            │    │
│  │            │  │            │  │                │    │
│  │ • Weather  │  │ 💧 Water:  │  │ [Interactive   │    │
│  │ • Health   │  │   Normal   │  │  Mapbox map    │    │
│  │ • Safety   │  │            │  │  with layers]  │    │
│  │ • General  │  │ ⚡ Power:  │  │                │    │
│  │            │  │   2 active │  │                │    │
│  │ [View All] │  │   interr.  │  │                │    │
│  └────────────┘  └────────────┘  └────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  QUICK STATS                                      │   │
│  │  Active Incidents: 3  |  Heat Cases: 12 (today)  │   │
│  │  Active Advisories: 5 |  Last Updated: 2 min ago │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Data Export Flow

```
Admin/Operator requests export
       │
       ▼
┌─────────────────────────┐
│ Select export type      │
│ • Module data           │
│ • Audit logs            │
│ • Analytics report      │
│ • Incident report       │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Select parameters       │
│ • Date range            │
│ • Agency filter         │
│ • Status filter         │
│ • Format (CSV / PDF)    │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Permission check        │──→ Denied → 403
│ (can export this data?) │
└─────────┬───────────────┘
          │ Authorized
          ▼
┌─────────────────────────┐
│ Generate export         │
│ (server-side)           │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Audit log: EXPORT       │
│ (who, what, when)       │
└─────────┬───────────────┘
          │
          ▼
     File download
```

---

## 8. Error & Edge Case Flows

### 8.1 Session Expiry

```
User performing action → Middleware detects expired session
       │
       ▼
Save current URL as redirect target
       │
       ▼
Redirect to /login with message "Session expired"
       │
       ▼
After re-login → Redirect to saved URL
```

### 8.2 Unauthorized Access Attempt

```
User navigates to restricted page → Middleware checks permissions
       │
       ▼
Insufficient permissions
       │
       ▼
Show 403 page with explanation
       │
       ▼
Audit log: UNAUTHORIZED_ACCESS (user, attempted route)
```

### 8.3 Rate Limit Exceeded

```
API request → Rate limiter checks count
       │
       ▼
Limit exceeded
       │
       ▼
Return 429 with Retry-After header
       │
       ▼
Client shows "Too many requests, try again in X seconds"
```
