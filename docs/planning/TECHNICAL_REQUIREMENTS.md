# 🔧 TECHNICAL REQUIREMENTS DOCUMENT (TRD)

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Version: 1.0 | Date: 2026-10-08 | Status: Approved

---

## 1. Technology Stack

### 1.1 Frontend

| Technology       | Version  | Purpose                                       |
| ---------------- | -------- | --------------------------------------------- |
| Next.js          | 15.x     | Full-stack React framework (App Router)       |
| React            | 19.x     | UI library                                    |
| TypeScript       | 5.x      | Type safety and developer experience          |
| Tailwind CSS     | 4.x      | Utility-first CSS framework                   |
| ShadCN UI        | Latest   | Accessible component library (copy-paste)     |
| Mapbox GL JS     | 3.x      | Interactive GIS map rendering                 |
| Zod              | 3.x      | Schema validation (forms, API inputs)         |
| React Hook Form  | 7.x      | Form state management                         |
| Recharts         | 2.x      | Dashboard charts and analytics visualization  |
| Lucide React     | Latest   | Icon library (used by ShadCN)                 |

### 1.2 Backend

| Technology              | Version  | Purpose                                    |
| ----------------------- | -------- | ------------------------------------------ |
| Next.js API Routes      | 15.x     | REST API endpoints                         |
| Next.js Server Actions  | 15.x     | Form mutations and server-side logic       |
| Next.js Middleware       | 15.x    | Auth checks, CSRF, rate limiting           |
| Supabase JS Client      | 2.x     | Database, auth, storage, realtime          |
| Supabase SSR             | Latest  | Server-side cookie session management      |

### 1.3 Database

| Technology       | Version  | Purpose                                       |
| ---------------- | -------- | --------------------------------------------- |
| PostgreSQL       | 15.x     | Primary relational database (Supabase)        |
| PostGIS          | 3.x      | Geospatial extension for location data        |
| pgcrypto         | Built-in | Cryptographic functions                       |
| uuid-ossp        | Built-in | UUID generation                               |
| pgBouncer        | Built-in | Connection pooling (Supabase managed)         |

### 1.4 Infrastructure

| Technology       | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| Vercel           | Next.js hosting, CDN, edge functions, preview  |
| Supabase         | BaaS — database, auth, storage, edge functions |
| GitHub           | Source control, Actions CI/CD, secret scanning |
| GitHub Actions   | CI/CD pipeline automation                      |

### 1.5 Testing

| Technology       | Version  | Purpose                                       |
| ---------------- | -------- | --------------------------------------------- |
| Vitest           | Latest   | Unit and integration testing                  |
| Playwright       | Latest   | End-to-end browser testing                    |
| Testing Library  | Latest   | React component testing utilities             |

### 1.6 Development Tools

| Tool             | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| ESLint           | Code linting (Next.js + TypeScript config)     |
| Prettier         | Code formatting                                |
| Husky            | Git hooks (pre-commit lint/format)             |
| lint-staged      | Run linters on staged files only               |
| commitlint       | Conventional commit message enforcement        |

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTS                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Browser  │  │ Mobile   │  │ Facebook Webhook     │  │
│  │ (Public) │  │ Browser  │  │ (Inbound)            │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
└───────┼──────────────┼──────────────────┼───────────────┘
        │              │                  │
        ▼              ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   VERCEL (Edge Network)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Next.js 15 App Router                │   │
│  │  ┌──────────┐ ┌───────────┐ ┌─────────────────┐ │   │
│  │  │Middleware │ │Server     │ │ API Routes      │ │   │
│  │  │(Auth,CSRF │ │Components │ │ /api/*          │ │   │
│  │  │Rate Limit)│ │(SSR/SSG)  │ │ (REST)          │ │   │
│  │  └──────────┘ └───────────┘ └─────────────────┘ │   │
│  │  ┌──────────┐ ┌───────────┐ ┌─────────────────┐ │   │
│  │  │Client    │ │Server     │ │ Webhook         │ │   │
│  │  │Components│ │Actions    │ │ Handlers        │ │   │
│  │  │(Maps,    │ │(Mutations)│ │ (FB, Supabase)  │ │   │
│  │  │Forms)    │ │           │ │                 │ │   │
│  │  └──────────┘ └───────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│  ┌──────────┐ ┌───────────┐ ┌─────────────────────┐    │
│  │   Auth   │ │ PostgreSQL│ │   Storage            │    │
│  │  (MFA,   │ │  + PostGIS│ │   (Files,Images)     │    │
│  │  OAuth)  │ │  + RLS    │ │                      │    │
│  └──────────┘ └───────────┘ └─────────────────────┘    │
│  ┌──────────┐ ┌───────────┐                             │
│  │ Realtime │ │   Edge    │                             │
│  │(WebSocket│ │ Functions │                             │
│  │ Channels)│ │  (Deno)   │                             │
│  └──────────┘ └───────────┘                             │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES                          │
│  ┌──────────┐ ┌───────────┐                             │
│  │ Mapbox   │ │ Facebook  │                             │
│  │ GL JS    │ │ Graph API │                             │
│  │ Geocoding│ │ (Posts)   │                             │
│  └──────────┘ └───────────┘                             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Next.js App Router Structure

```
app/
├── (auth)/                     # Auth route group (login, register, reset)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify-email/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── mfa/
│   │   ├── enroll/page.tsx
│   │   └── verify/page.tsx
│   └── layout.tsx              # Auth layout (centered card)
├── (dashboard)/                # Protected dashboard route group
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── advisories/
│   │   ├── page.tsx            # Advisory list
│   │   ├── new/page.tsx        # Create advisory
│   │   └── [id]/
│   │       ├── page.tsx        # View advisory
│   │       └── edit/page.tsx   # Edit advisory
│   ├── agencies/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── hospital/
│   │   ├── cases/page.tsx
│   │   ├── cases/new/page.tsx
│   │   ├── cases/[id]/page.tsx
│   │   └── reports/page.tsx
│   ├── cdrrmo/
│   │   ├── incidents/page.tsx
│   │   ├── incidents/new/page.tsx
│   │   ├── incidents/[id]/page.tsx
│   │   └── dispatch/page.tsx
│   ├── bfp/
│   │   ├── incidents/page.tsx
│   │   ├── incidents/new/page.tsx
│   │   └── incidents/[id]/page.tsx
│   ├── water/
│   │   ├── interruptions/page.tsx
│   │   └── interruptions/new/page.tsx
│   ├── power/
│   │   ├── interruptions/page.tsx
│   │   └── interruptions/new/page.tsx
│   ├── gis/page.tsx            # Full GIS map view
│   ├── conflicts/page.tsx
│   ├── analytics/page.tsx
│   ├── audit/page.tsx
│   ├── users/page.tsx
│   ├── settings/page.tsx
│   └── layout.tsx              # Dashboard layout (sidebar + header)
├── (public)/                   # Public route group (no auth required)
│   ├── page.tsx                # Public homepage/dashboard
│   ├── advisories/page.tsx     # Public advisory list
│   ├── advisories/[id]/page.tsx
│   ├── map/page.tsx            # Public incident map
│   ├── interruptions/page.tsx  # Public utility status
│   └── layout.tsx              # Public layout (navbar + footer)
├── api/                        # API routes
│   ├── auth/
│   ├── users/
│   ├── agencies/
│   ├── advisories/
│   ├── facebook/
│   ├── hospital/
│   ├── cdrrmo/
│   ├── bfp/
│   ├── water/
│   ├── power/
│   ├── gis/
│   ├── analytics/
│   └── webhooks/
├── layout.tsx                  # Root layout
├── not-found.tsx               # 404 page
├── error.tsx                   # Error boundary
└── globals.css                 # Global styles + Tailwind directives
```

### 2.3 Component Architecture

```
components/
├── ui/                         # ShadCN UI components (auto-generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── card.tsx
│   ├── ...
│   └── (40+ ShadCN components)
├── layout/
│   ├── sidebar.tsx             # Dashboard sidebar navigation
│   ├── header.tsx              # Dashboard header with user menu
│   ├── navbar.tsx              # Public site navigation
│   ├── footer.tsx              # Public site footer
│   ├── breadcrumbs.tsx         # Navigation breadcrumbs
│   └── page-header.tsx         # Page title + actions
├── shared/
│   ├── data-table.tsx          # Reusable data table with pagination
│   ├── map-view.tsx            # Reusable Mapbox map component
│   ├── file-upload.tsx         # Secure file upload component
│   ├── status-badge.tsx        # Status indicator badges
│   ├── severity-badge.tsx      # Advisory severity badges
│   ├── loading-skeleton.tsx    # Skeleton loading states
│   ├── empty-state.tsx         # Empty state illustrations
│   ├── confirm-dialog.tsx      # Confirmation dialog
│   ├── date-range-picker.tsx   # Date range selection
│   └── search-filter.tsx       # Search + filter toolbar
```

---

## 3. Security Architecture

### 3.1 Authentication Flow

```
User Login Request
       │
       ▼
┌─────────────────────┐
│  Rate Limit Check   │──── Exceeded ──→ 429 Response
│  (5/min per IP)     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Input Validation   │──── Invalid ──→ 400 Response
│  (Zod schema)       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Supabase Auth      │──── Failed ──→ 401 Response
│  (email + password) │                  + audit log
└─────────┬───────────┘
          │ Success
          ▼
┌─────────────────────┐
│  MFA Required?      │──── Yes ──→ MFA Challenge
│  (check user config)│              ──→ TOTP Verify
└─────────┬───────────┘              ──→ Continue ↓
          │ No MFA / MFA Passed
          ▼
┌─────────────────────┐
│  Set HTTP-Only      │
│  Session Cookie     │
│  (Secure, SameSite) │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Audit Log: LOGIN   │
│  (user, IP, agent)  │
└─────────┬───────────┘
          │
          ▼
     Dashboard Redirect
```

### 3.2 Request Authorization Flow

```
Incoming Request
       │
       ▼
┌─────────────────────┐
│  Next.js Middleware  │
│  ┌────────────────┐ │
│  │ Extract Cookie  │ │──── No Cookie ──→ Redirect /login
│  │ Validate Session│ │──── Expired ───→ Redirect /login
│  │ Check CSRF      │ │──── Invalid ──→ 403 Response
│  │ Rate Limit      │ │──── Exceeded ──→ 429 Response
│  └────────────────┘ │
└─────────┬───────────┘
          │ Valid Session
          ▼
┌─────────────────────┐
│  Route Permission   │
│  ┌────────────────┐ │
│  │ Get User Role   │ │
│  │ Check Route ACL │ │──── Forbidden ──→ 403 Page
│  └────────────────┘ │
└─────────┬───────────┘
          │ Authorized
          ▼
┌─────────────────────┐
│  Page/API Handler   │
│  ┌────────────────┐ │
│  │ Fine-grained   │ │
│  │ Permission     │ │──── Forbidden ──→ 403 Response
│  │ Check (action) │ │
│  └────────────────┘ │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Database Query     │
│  (RLS auto-filters  │
│   by agency_id)     │
└─────────────────────┘
```

### 3.3 Security Headers

```typescript
// next.config.ts security headers
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.mapbox.com",
      "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://*.mapbox.com https://*.supabase.co",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://graph.facebook.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];
```

---

## 4. Data Flow Architecture

### 4.1 Advisory Publication Flow

```
Operator creates draft
       │
       ▼
Draft saved to `advisories` table (status: 'draft')
       │
       ▼
Operator submits for review
       │
       ▼
Agency Admin reviews
       │
  ┌────┴────┐
  │ Approve │ Reject → Back to Operator with feedback
  └────┬────┘
       │
       ▼
Status → 'published', `published_at` set
       │
       ├──→ Public Dashboard (Supabase Realtime subscription)
       │
       ├──→ GIS Map update (if has location)
       │
       └──→ Facebook auto-post (if agency has FB connected)
              │
              ▼
        Facebook Graph API POST
              │
              ▼
        `facebook_posts` table updated with post ID
              │
              ▼
        Audit log entry created
```

### 4.2 Real-Time Data Flow

```
Database Change (INSERT/UPDATE/DELETE)
       │
       ▼
Supabase Realtime (PostgreSQL logical replication)
       │
       ▼
WebSocket broadcast to subscribed channels
       │
       ▼
Client-side useRealtimeSubscription hook
       │
       ├──→ Update React state (optimistic)
       ├──→ Trigger toast notification (if relevant)
       └──→ Update map markers (if GIS data)
```

---

## 5. Performance Architecture

### 5.1 Rendering Strategy

| Page Type                   | Strategy    | Rationale                                    |
| --------------------------- | ----------- | -------------------------------------------- |
| Public homepage             | SSG + ISR   | Static content, revalidate every 60 seconds  |
| Public advisory list        | SSR         | Always-fresh data for citizens               |
| Public map                  | CSR         | Interactive Mapbox GL requires client-side   |
| Dashboard pages             | SSR         | Auth-gated, fresh data per request           |
| Data entry forms            | CSR         | Complex interactivity                        |
| Analytics/reports           | SSR         | Data-heavy, computed on server               |

### 5.2 Caching Strategy

| Layer              | Implementation                               | TTL              |
| ------------------ | -------------------------------------------- | ---------------- |
| Browser Cache      | Cache-Control headers for static assets      | 1 year (hashed)  |
| CDN Cache          | Vercel Edge Cache for SSG/ISR pages          | 60 seconds (ISR) |
| API Cache          | In-memory LRU for frequent queries           | 30 seconds       |
| Database Cache     | PostgreSQL query plan cache                  | Automatic        |
| React Cache        | React `cache()` for deduplicated requests    | Per-request      |

### 5.3 Optimization Techniques

| Technique                | Implementation                                            |
| ------------------------ | --------------------------------------------------------- |
| Image Compression        | Next.js `<Image>` with automatic optimization             |
| Lazy Loading             | Dynamic imports for heavy components (Map, Charts)        |
| Code Splitting           | Automatic per-route splitting (App Router)                |
| Skeleton Loading         | ShadCN Skeleton components during data fetch              |
| Pagination               | Cursor-based pagination for all list endpoints            |
| Connection Pooling       | Supabase pgBouncer (transaction mode)                     |
| Bundle Analysis          | `@next/bundle-analyzer` for monitoring bundle size        |
| Font Optimization        | `next/font` for zero-layout-shift font loading            |

---

## 6. Error Handling Strategy

### 6.1 Client-Side

```typescript
// Global error boundary: app/error.tsx
// Per-route error boundaries: [module]/error.tsx
// Toast notifications for non-critical errors
// Form validation errors inline with Zod + React Hook Form
```

### 6.2 Server-Side

```typescript
// Standardized API error response format
interface ApiError {
  error: string;        // Human-readable message
  code: string;         // Machine-readable code (e.g., 'AUTH_EXPIRED')
  details?: unknown;    // Validation errors or additional context
  requestId: string;    // For debugging and audit correlation
}

// All errors logged with structured logging
// Critical errors trigger alert (future: PagerDuty/Slack integration)
```

---

## 7. Development Standards

### 7.1 Code Conventions

| Convention            | Standard                                      |
| --------------------- | --------------------------------------------- |
| Language              | TypeScript strict mode (`"strict": true`)     |
| Component Pattern     | Functional components + hooks only            |
| File Naming           | `kebab-case` for files, `PascalCase` for components |
| Import Order          | React → Next → External → Internal → Types   |
| Error Handling        | No silent catches, always handle or propagate |
| Comments              | JSDoc for public APIs, inline for complex logic|
| Git Commits           | Conventional Commits (feat/fix/chore/docs)    |

### 7.2 Testing Requirements

| Test Type         | Coverage Target | Tools                     | When Run               |
| ----------------- | --------------- | ------------------------- | ---------------------- |
| Unit Tests        | 80% of utils    | Vitest                    | Pre-commit + CI        |
| Component Tests   | Critical paths  | Vitest + Testing Library  | CI                     |
| Integration Tests | API routes      | Vitest                    | CI                     |
| E2E Tests         | Happy paths     | Playwright                | Main branch merge      |

### 7.3 Branch Strategy

```
main ─────────────────────────────────────── (production)
  │
  ├── staging ────────────────────────────── (staging env)
  │     │
  │     ├── feat/auth-module ─────────────── (feature branch)
  │     ├── feat/rbac-system ─────────────── (feature branch)
  │     ├── fix/session-expiry ───────────── (bugfix branch)
  │     └── chore/update-deps ────────────── (maintenance branch)
```

---

## 8. Monitoring & Observability

| Aspect            | Tool/Method                                    | Status         |
| ----------------- | ---------------------------------------------- | -------------- |
| Error Tracking    | Vercel Analytics (built-in)                    | 🔴 Pending      |
| Performance       | Vercel Speed Insights                          | 🔴 Pending      |
| Uptime            | Vercel Monitoring                              | 🔴 Pending      |
| Audit Trail       | Custom audit_logs table                        | 🔴 Pending      |
| Database          | Supabase Dashboard                             | 🔴 Pending      |
| Security Events   | Custom security event logging                  | 🔴 Pending      |
