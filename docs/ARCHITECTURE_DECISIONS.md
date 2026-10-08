# 📐 ARCHITECTURE DECISIONS

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Last Updated: 2026-10-08

---

## ADR Index

| ID     | Title                                    | Status   | Date       |
| ------ | ---------------------------------------- | -------- | ---------- |
| ADR-01 | Next.js 15 App Router Architecture       | Accepted | 2026-10-08 |
| ADR-02 | Supabase as Backend-as-a-Service         | Accepted | 2026-10-08 |
| ADR-03 | Authentication & Session Strategy        | Accepted | 2026-10-08 |
| ADR-04 | Role-Based Access Control Design         | Accepted | 2026-10-08 |
| ADR-05 | GIS Technology Selection                 | Accepted | 2026-10-08 |
| ADR-06 | Multi-Agency Data Isolation              | Accepted | 2026-10-08 |
| ADR-07 | Real-Time Data Strategy                  | Accepted | 2026-10-08 |
| ADR-08 | Deployment & CI/CD Strategy              | Accepted | 2026-10-08 |
| ADR-09 | Security Architecture                    | Accepted | 2026-10-08 |
| ADR-10 | UI Component Library Strategy            | Accepted | 2026-10-08 |

---

## ADR-01: Next.js 15 App Router Architecture

**Status**: Accepted
**Date**: 2026-10-08
**Context**: The platform requires server-side rendering for SEO on public pages, dynamic rendering for dashboards, API routes for backend logic, and middleware for auth/security.

**Decision**: Use Next.js 15 with the App Router, leveraging:
- **Server Components** as the default for data-fetching pages
- **Client Components** only where interactivity is required (maps, forms, real-time feeds)
- **Route Groups** for layout segmentation: `(auth)`, `(dashboard)`, `(public)`
- **Server Actions** for form mutations where appropriate
- **Middleware** for authentication checks, CSRF validation, and rate limiting
- **API Routes** (`app/api/`) for webhook handlers, external API integrations, and complex server logic

**Consequences**:
- Improved initial page load performance via SSR/SSG
- Better SEO for public-facing pages
- Increased complexity in understanding server vs. client component boundaries
- Requires careful management of "use client" directives

---

## ADR-02: Supabase as Backend-as-a-Service

**Status**: Accepted
**Date**: 2026-10-08
**Context**: The project requires PostgreSQL, authentication, real-time subscriptions, storage, and edge functions. A managed service reduces operational burden.

**Decision**: Use Supabase for:
- **PostgreSQL Database**: Primary data store with PostGIS extension for GIS data
- **Supabase Auth**: Authentication with MFA, email verification, and OAuth providers
- **Row-Level Security (RLS)**: Database-level authorization enforcement
- **Realtime**: WebSocket subscriptions for live dashboard updates
- **Edge Functions**: Serverless functions for background processing (Deno runtime)
- **Storage**: Secure file storage for uploads (images, documents)

**Consequences**:
- Vendor lock-in to Supabase (mitigated by standard PostgreSQL underneath)
- RLS policies add complexity but provide defense-in-depth security
- Edge Functions use Deno, not Node.js — requires awareness of API differences
- Cost scales with database size and bandwidth

---

## ADR-03: Authentication & Session Strategy

**Status**: Accepted
**Date**: 2026-10-08
**Context**: Government-grade security requires MFA, no client-side token storage, and server-side session validation.

**Decision**:
- Use **Supabase Auth** with `@supabase/ssr` for server-side cookie management
- Sessions stored in **HTTP-only, Secure, SameSite=Lax cookies**
- **No tokens in localStorage or sessionStorage** — eliminates XSS token theft
- **MFA enforced** for all administrative/agency accounts
- **Email verification required** before account activation
- Session tokens refreshed via Supabase's built-in refresh mechanism
- **Middleware validates session** on every protected route request

**Consequences**:
- More complex auth flow than simple JWT-in-localStorage
- Requires proper cookie handling in middleware and API routes
- MFA adds friction but is non-negotiable for government systems
- Server-side validation on every request adds slight latency

---

## ADR-04: Role-Based Access Control Design

**Status**: Accepted
**Date**: 2026-10-08
**Context**: Multiple agencies (CDRRMO, BFP, hospitals, utilities) need isolated access. A flexible RBAC system is required.

**Decision**:
- **Roles**: `super_admin`, `city_admin`, `agency_admin`, `agency_operator`, `agency_viewer`, `public_user`
- **Permissions**: Granular permission strings (e.g., `advisory:create`, `incident:update`, `report:export`)
- **Role-Permission mapping** stored in database (`role_permissions` table)
- **Agency scoping**: Users belong to an agency; data access is scoped by agency unless role overrides
- **RLS policies** enforce agency-level data isolation at the database level
- **Middleware** checks role and permissions before rendering protected pages
- **Server-side helpers** (`checkPermission()`) used in API routes and Server Actions

**Consequences**:
- Flexible enough to add new roles/permissions without code changes
- RLS + application-level checks provide defense-in-depth
- Complexity in managing role hierarchies and permission inheritance
- Requires careful testing of permission boundaries

---

## ADR-05: GIS Technology Selection

**Status**: Accepted
**Date**: 2026-10-08
**Context**: The platform requires interactive mapping for incident visualization, affected area polygons, and real-time location tracking.

**Decision**:
- Use **Mapbox GL JS** for client-side map rendering
- Use **PostGIS** (PostgreSQL extension) for server-side geospatial queries
- Store geospatial data as **GeoJSON** in PostgreSQL `geometry` columns
- Implement custom map layers for each agency module (incidents, affected areas, resources)
- Use **Mapbox Geocoding API** for address-to-coordinate conversion
- Map component built as a reusable React component with pluggable layer system

**Consequences**:
- Mapbox GL provides excellent performance and customization
- PostGIS enables complex spatial queries (proximity, intersection, containment)
- Mapbox requires an API key and has usage-based pricing
- Large GeoJSON datasets may require optimization (vector tiles, clustering)

---

## ADR-06: Multi-Agency Data Isolation

**Status**: Accepted
**Date**: 2026-10-08
**Context**: Multiple agencies operate on the same platform. Data must be isolated by default, with controlled cross-agency visibility.

**Decision**:
- Every data table includes an `agency_id` foreign key
- **RLS policies** filter data by the user's `agency_id` by default
- **Cross-agency views** are read-only and require explicit permissions
- **Shared data** (advisories, public alerts) uses a dedicated `is_public` flag
- **Conflict Detection module** has read access across agencies (controlled by RLS)
- **Super Admin** and **City Admin** roles bypass agency scoping

**Consequences**:
- Strong data isolation at the database level
- Cross-agency features require careful RLS policy design
- Shared/public data needs clear ownership and publishing workflows
- Testing must cover agency-scoped and cross-agency scenarios

---

## ADR-07: Real-Time Data Strategy

**Status**: Accepted
**Date**: 2026-10-08
**Context**: Emergency operations require real-time updates (new incidents, advisory changes, dispatch status).

**Decision**:
- Use **Supabase Realtime** (WebSocket-based) for database change subscriptions
- Subscribe to specific tables/channels based on the user's role and agency
- **Optimistic UI updates** for user-initiated actions (show immediately, confirm via subscription)
- **Polling fallback** for non-critical data (analytics, reports) — 30-second intervals
- **Rate limit subscriptions** to prevent excessive database notifications
- Real-time channels managed via a custom `useRealtimeSubscription` hook

**Consequences**:
- Live updates enhance situational awareness for emergency operations
- WebSocket connections consume resources — must limit concurrent subscriptions
- Optimistic updates may show briefly incorrect data if server rejects mutation
- Supabase Realtime has limits on concurrent connections per project

---

## ADR-08: Deployment & CI/CD Strategy

**Status**: Accepted
**Date**: 2026-10-08
**Context**: The platform requires reliable deployment with preview environments, automated testing, and security scanning.

**Decision**:
- **Vercel** for Next.js hosting (automatic preview deployments per PR)
- **GitHub Actions** for CI/CD pipeline:
  - Lint + type-check on every PR
  - Unit + integration tests on every PR
  - E2E tests on `main` branch merges
  - Security scanning (dependency audit, secret scanning)
  - Supabase migration deployment on `main` merge
- **Branch strategy**: `main` (production), `staging`, feature branches
- **Environment variables** managed via Vercel + GitHub Secrets (never committed)

**Consequences**:
- Preview deployments enable stakeholder review before merge
- Automated testing reduces regression risk
- Multiple environments add complexity but ensure quality
- Vercel's serverless functions have cold start and execution time limits

---

## ADR-09: Security Architecture

**Status**: Accepted
**Date**: 2026-10-08
**Context**: Government system handling emergency data requires defense-in-depth security.

**Decision**: Implement layered security:

| Layer           | Implementation                                              |
| --------------- | ----------------------------------------------------------- |
| Network         | HTTPS everywhere, HSTS, CSP headers                        |
| Authentication  | Supabase Auth, MFA, email verification, HTTP-only cookies   |
| Authorization   | RBAC + RLS + middleware + API route guards                   |
| Input           | Zod validation on all inputs, server-side sanitization       |
| Database        | RLS policies, parameterized queries, no raw SQL              |
| API             | Rate limiting, CSRF tokens, webhook signature verification   |
| Files           | Type validation, size limits, virus scanning (future)        |
| Monitoring      | Immutable audit logs, anomaly detection (future)             |
| CI/CD           | Secret scanning, dependency audit, SAST (future)             |

**Consequences**:
- Defense-in-depth means a single vulnerability doesn't compromise the system
- Multiple security layers add development and testing overhead
- Audit logging generates significant data volume — requires retention policy
- Some security features (virus scanning, SAST) are deferred to later phases

---

## ADR-10: UI Component Library Strategy

**Status**: Accepted
**Date**: 2026-10-08
**Context**: The platform needs a consistent, accessible, and professional UI suitable for government use.

**Decision**:
- Use **Tailwind CSS** for utility-first styling
- Use **ShadCN UI** as the component library (copy-paste components, not a package dependency)
- Customize ShadCN's theme to match Palayan City branding
- All components must meet **WCAG 2.1 AA** accessibility standards
- Responsive design: desktop-first for agency dashboards, mobile-first for public portal
- **Dark mode** support for agency dashboards (reduces eye strain during extended use)

**Consequences**:
- ShadCN components are owned in the codebase — full control over customization
- Tailwind CSS ensures consistent spacing, color, and typography
- Accessibility compliance adds development effort but is required for government sites
- Dual responsive strategies (desktop-first vs. mobile-first) need clear documentation

---

> **Template for new ADRs:**
> ```
> ## ADR-XX: [Title]
> **Status**: Proposed | Accepted | Deprecated | Superseded
> **Date**: YYYY-MM-DD
> **Context**: [Why is this decision needed?]
> **Decision**: [What was decided?]
> **Consequences**: [What are the trade-offs?]
> ```
