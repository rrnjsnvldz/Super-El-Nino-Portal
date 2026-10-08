# 🚀 DEPLOYMENT STATUS

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Last Updated: 2026-10-08

---

## Environments

| Environment  | URL                          | Branch    | Status         | Last Deploy | Notes                     |
| ------------ | ---------------------------- | --------- | -------------- | ----------- | ------------------------- |
| Production   | TBD                          | `main`    | 🔴 Not Set Up   | —           | Vercel production         |
| Staging      | TBD                          | `staging` | 🔴 Not Set Up   | —           | Vercel preview            |
| Development  | `localhost:3000`             | Feature   | 🔴 Not Set Up   | —           | Local development         |

---

## Infrastructure Status

| Service              | Provider     | Status         | Configuration    | Notes                          |
| -------------------- | ------------ | -------------- | ---------------- | ------------------------------ |
| Next.js Hosting      | Vercel       | 🔴 Not Set Up   | —                | Automatic deployments          |
| Database             | Supabase     | 🔴 Not Set Up   | —                | PostgreSQL + PostGIS           |
| Auth Service         | Supabase     | 🔴 Not Set Up   | —                | Email + MFA                    |
| Edge Functions       | Supabase     | 🔴 Not Set Up   | —                | Deno runtime                   |
| File Storage         | Supabase     | 🔴 Not Set Up   | —                | Secure buckets                 |
| GIS/Maps             | Mapbox       | 🔴 Not Set Up   | —                | GL JS + Geocoding              |
| CI/CD                | GitHub Actions| 🔴 Not Set Up  | —                | Lint, test, deploy             |
| Domain/DNS           | TBD          | 🔴 Not Set Up   | —                | Custom domain                  |
| SSL/TLS              | Vercel       | 🔴 Not Set Up   | —                | Automatic via Let's Encrypt    |

---

## Environment Variables Required

| Variable                         | Environment | Set | Notes                              |
| -------------------------------- | ----------- | --- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | All         | ❌  | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | All         | ❌  | Supabase anonymous (public) key    |
| `SUPABASE_SERVICE_ROLE_KEY`      | Server only | ❌  | Supabase admin key (NEVER expose)  |
| `NEXT_PUBLIC_MAPBOX_TOKEN`       | All         | ❌  | Mapbox GL access token             |
| `FACEBOOK_APP_ID`                | Server only | ❌  | Meta App ID                        |
| `FACEBOOK_APP_SECRET`            | Server only | ❌  | Meta App Secret (NEVER expose)     |
| `CSRF_SECRET`                    | Server only | ❌  | CSRF token signing secret          |
| `WEBHOOK_SECRET`                 | Server only | ❌  | Webhook signature verification     |

---

## Deployment History

| Date | Environment | Version | Commit  | Status  | Notes |
| ---- | ----------- | ------- | ------- | ------- | ----- |
| —    | —           | —       | —       | —       | No deployments yet |

---

## CI/CD Pipeline Status

| Pipeline               | Trigger           | Status         | Last Run | Notes                    |
| ---------------------- | ----------------- | -------------- | -------- | ------------------------ |
| Lint + Type Check      | Every PR          | 🔴 Not Set Up   | —        | ESLint + tsc             |
| Unit Tests             | Every PR          | 🔴 Not Set Up   | —        | Vitest                   |
| Integration Tests      | Every PR          | 🔴 Not Set Up   | —        | Vitest                   |
| E2E Tests              | Main merge        | 🔴 Not Set Up   | —        | Playwright               |
| Security Scan          | Every PR          | 🔴 Not Set Up   | —        | npm audit + secret scan  |
| Preview Deploy         | Every PR          | 🔴 Not Set Up   | —        | Vercel preview           |
| Production Deploy      | Main merge        | 🔴 Not Set Up   | —        | Vercel production        |
| DB Migration           | Main merge        | 🔴 Not Set Up   | —        | Supabase migrations      |
