# 🔌 API REGISTRY

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Last Updated: 2026-10-08

---

## API Overview

| Property             | Value                                       |
| -------------------- | ------------------------------------------- |
| **Base URL**         | `https://{domain}/api`                      |
| **Auth Method**      | HTTP-only session cookies (Supabase Auth)   |
| **Rate Limiting**    | Per-endpoint (see individual entries)       |
| **Content Type**     | `application/json`                          |
| **Error Format**     | `{ error: string, code: string, details?: any }` |

---

## Authentication Endpoints

| Method | Path                          | Auth     | Rate Limit    | Status         | Description                        |
| ------ | ----------------------------- | -------- | ------------- | -------------- | ---------------------------------- |
| POST   | `/api/auth/login`             | Public   | 5/min/IP      | 🔴 Pending      | Email + password login             |
| POST   | `/api/auth/logout`            | Required | 10/min        | 🔴 Pending      | Session termination                |
| POST   | `/api/auth/verify-email`      | Public   | 3/min/IP      | 🔴 Pending      | Email verification callback        |
| POST   | `/api/auth/mfa/enroll`        | Required | 3/min         | 🔴 Pending      | MFA TOTP enrollment                |
| POST   | `/api/auth/mfa/verify`        | Required | 5/min         | 🔴 Pending      | MFA TOTP verification              |
| POST   | `/api/auth/mfa/challenge`     | Required | 5/min         | 🔴 Pending      | Request MFA challenge              |
| POST   | `/api/auth/forgot-password`   | Public   | 3/min/IP      | 🔴 Pending      | Password reset request             |
| POST   | `/api/auth/reset-password`    | Public   | 3/min/IP      | 🔴 Pending      | Password reset completion          |
| GET    | `/api/auth/session`           | Required | 30/min        | 🔴 Pending      | Current session info               |

---

## User & RBAC Endpoints

| Method | Path                          | Auth         | Rate Limit | Status         | Description                        |
| ------ | ----------------------------- | ------------ | ---------- | -------------- | ---------------------------------- |
| GET    | `/api/users`                  | Admin        | 30/min     | 🔴 Pending      | List users (paginated)             |
| GET    | `/api/users/:id`              | Admin/Self   | 30/min     | 🔴 Pending      | Get user profile                   |
| PATCH  | `/api/users/:id`              | Admin/Self   | 10/min     | 🔴 Pending      | Update user profile                |
| DELETE | `/api/users/:id`              | Super Admin  | 5/min      | 🔴 Pending      | Deactivate user                    |
| GET    | `/api/roles`                  | Admin        | 30/min     | 🔴 Pending      | List roles                         |
| POST   | `/api/users/:id/roles`        | Admin        | 10/min     | 🔴 Pending      | Assign role to user                |
| DELETE | `/api/users/:id/roles/:roleId`| Admin        | 10/min     | 🔴 Pending      | Remove role from user              |

---

## Agency Endpoints

| Method | Path                          | Auth         | Rate Limit | Status         | Description                        |
| ------ | ----------------------------- | ------------ | ---------- | -------------- | ---------------------------------- |
| GET    | `/api/agencies`               | Authenticated| 30/min     | 🔴 Pending      | List agencies                      |
| POST   | `/api/agencies`               | Super Admin  | 5/min      | 🔴 Pending      | Create agency                      |
| GET    | `/api/agencies/:id`           | Authenticated| 30/min     | 🔴 Pending      | Get agency details                 |
| PATCH  | `/api/agencies/:id`           | Agency Admin | 10/min     | 🔴 Pending      | Update agency                      |
| GET    | `/api/agencies/:id/members`   | Agency Admin | 30/min     | 🔴 Pending      | List agency members                |
| POST   | `/api/agencies/:id/members`   | Agency Admin | 10/min     | 🔴 Pending      | Add agency member                  |

---

## Advisory Endpoints

| Method | Path                          | Auth         | Rate Limit | Status         | Description                        |
| ------ | ----------------------------- | ------------ | ---------- | -------------- | ---------------------------------- |
| GET    | `/api/advisories`             | Public/Auth  | 60/min     | 🔴 Pending      | List advisories (public: published only) |
| POST   | `/api/advisories`             | Operator+    | 10/min     | 🔴 Pending      | Create advisory (draft)            |
| GET    | `/api/advisories/:id`         | Public/Auth  | 60/min     | 🔴 Pending      | Get advisory details               |
| PATCH  | `/api/advisories/:id`         | Operator+    | 10/min     | 🔴 Pending      | Update advisory                    |
| POST   | `/api/advisories/:id/publish` | Admin+       | 5/min      | 🔴 Pending      | Publish advisory                   |
| POST   | `/api/advisories/:id/archive` | Admin+       | 5/min      | 🔴 Pending      | Archive advisory                   |
| DELETE | `/api/advisories/:id`         | Admin+       | 5/min      | 🔴 Pending      | Delete advisory (soft)             |

---

## Facebook Integration Endpoints

| Method | Path                              | Auth         | Rate Limit | Status         | Description                      |
| ------ | --------------------------------- | ------------ | ---------- | -------------- | -------------------------------- |
| POST   | `/api/facebook/connect`           | Agency Admin | 3/min      | 🔴 Pending      | Initiate Facebook OAuth          |
| GET    | `/api/facebook/callback`          | System       | 10/min     | 🔴 Pending      | OAuth callback handler           |
| POST   | `/api/facebook/post`              | Operator+    | 5/min      | 🔴 Pending      | Post advisory to Facebook        |
| GET    | `/api/facebook/status/:postId`    | Operator+    | 30/min     | 🔴 Pending      | Check Facebook post status       |

---

## Hospital Module Endpoints

| Method | Path                              | Auth         | Rate Limit | Status         | Description                      |
| ------ | --------------------------------- | ------------ | ---------- | -------------- | -------------------------------- |
| GET    | `/api/hospital/cases`             | Hospital+    | 30/min     | 🔴 Pending      | List heat illness cases          |
| POST   | `/api/hospital/cases`             | Hospital Op  | 20/min     | 🔴 Pending      | Record new case                  |
| PATCH  | `/api/hospital/cases/:id`         | Hospital Op  | 20/min     | 🔴 Pending      | Update case                      |
| GET    | `/api/hospital/reports`           | Hospital+    | 10/min     | 🔴 Pending      | Get aggregated reports           |
| POST   | `/api/hospital/reports/generate`  | Hospital Adm | 5/min      | 🔴 Pending      | Generate report                  |

---

## CDRRMO Endpoints

| Method | Path                              | Auth         | Rate Limit | Status         | Description                      |
| ------ | --------------------------------- | ------------ | ---------- | -------------- | -------------------------------- |
| GET    | `/api/cdrrmo/incidents`           | CDRRMO+      | 30/min     | 🔴 Pending      | List dispatch incidents          |
| POST   | `/api/cdrrmo/incidents`           | CDRRMO Op    | 20/min     | 🔴 Pending      | Create incident                  |
| PATCH  | `/api/cdrrmo/incidents/:id`       | CDRRMO Op    | 20/min     | 🔴 Pending      | Update incident                  |
| POST   | `/api/cdrrmo/incidents/:id/dispatch` | CDRRMO Op | 10/min     | 🔴 Pending      | Dispatch resources               |
| GET    | `/api/cdrrmo/resources`           | CDRRMO+      | 30/min     | 🔴 Pending      | List available resources         |

---

## BFP Endpoints

| Method | Path                              | Auth         | Rate Limit | Status         | Description                      |
| ------ | --------------------------------- | ------------ | ---------- | -------------- | -------------------------------- |
| GET    | `/api/bfp/incidents`              | BFP+         | 30/min     | 🔴 Pending      | List fire incidents              |
| POST   | `/api/bfp/incidents`              | BFP Op       | 20/min     | 🔴 Pending      | Report fire incident             |
| PATCH  | `/api/bfp/incidents/:id`          | BFP Op       | 20/min     | 🔴 Pending      | Update fire incident             |
| GET    | `/api/bfp/reports`                | BFP+         | 10/min     | 🔴 Pending      | Get fire reports                 |

---

## Utility Endpoints (Water & Power)

| Method | Path                                    | Auth          | Rate Limit | Status         | Description                    |
| ------ | --------------------------------------- | ------------- | ---------- | -------------- | ------------------------------ |
| GET    | `/api/water/interruptions`              | Public/Auth   | 60/min     | 🔴 Pending      | List water interruptions       |
| POST   | `/api/water/interruptions`              | Water Op      | 10/min     | 🔴 Pending      | Create interruption notice     |
| PATCH  | `/api/water/interruptions/:id`          | Water Op      | 10/min     | 🔴 Pending      | Update interruption            |
| GET    | `/api/power/interruptions`              | Public/Auth   | 60/min     | 🔴 Pending      | List power interruptions       |
| POST   | `/api/power/interruptions`              | Power Op      | 10/min     | 🔴 Pending      | Create interruption notice     |
| PATCH  | `/api/power/interruptions/:id`          | Power Op      | 10/min     | 🔴 Pending      | Update interruption            |

---

## GIS Endpoints

| Method | Path                              | Auth         | Rate Limit | Status         | Description                      |
| ------ | --------------------------------- | ------------ | ---------- | -------------- | -------------------------------- |
| GET    | `/api/gis/incidents`              | Public/Auth  | 60/min     | 🔴 Pending      | Get GeoJSON incident data        |
| GET    | `/api/gis/layers`                 | Auth         | 30/min     | 🔴 Pending      | Get available map layers         |
| GET    | `/api/gis/barangays`              | Public       | 30/min     | 🔴 Pending      | Get barangay boundaries          |
| POST   | `/api/gis/geocode`                | Auth         | 20/min     | 🔴 Pending      | Geocode address                  |

---

## Analytics Endpoints

| Method | Path                              | Auth         | Rate Limit | Status         | Description                      |
| ------ | --------------------------------- | ------------ | ---------- | -------------- | -------------------------------- |
| GET    | `/api/analytics/dashboard`        | Admin+       | 10/min     | 🔴 Pending      | Dashboard summary stats          |
| GET    | `/api/analytics/reports/:type`    | Admin+       | 5/min      | 🔴 Pending      | Generate specific report type    |
| GET    | `/api/analytics/export/:format`   | Admin+       | 3/min      | 🔴 Pending      | Export data (CSV/PDF)            |

---

## Webhook Endpoints

| Method | Path                              | Auth             | Rate Limit | Status         | Description                    |
| ------ | --------------------------------- | ---------------- | ---------- | -------------- | ------------------------------ |
| POST   | `/api/webhooks/supabase`          | Signature Verify | 100/min    | 🔴 Pending      | Supabase database webhooks     |
| POST   | `/api/webhooks/facebook`          | Signature Verify | 50/min     | 🔴 Pending      | Facebook webhook callbacks     |

---

## Common Response Codes

| Code | Description                                            |
| ---- | ------------------------------------------------------ |
| 200  | Success                                                |
| 201  | Created                                                |
| 400  | Bad Request — validation error (see `details` field)   |
| 401  | Unauthorized — no valid session                        |
| 403  | Forbidden — insufficient permissions                   |
| 404  | Not Found                                              |
| 409  | Conflict — duplicate or state conflict                 |
| 422  | Unprocessable Entity — business rule violation         |
| 429  | Too Many Requests — rate limit exceeded                |
| 500  | Internal Server Error                                  |
