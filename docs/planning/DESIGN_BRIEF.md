# 🎨 DESIGN BRIEF DOCUMENT

> **Palayan City Climate Resilience, Emergency Operations & Public Information Hub**
> Version: 1.0 | Date: 2026-10-08

---

## 1. Design Vision

A **professional, authoritative, and accessible** government digital platform that communicates trust, urgency, and clarity. The design must convey the seriousness of emergency operations while remaining approachable for citizens of all technical literacy levels.

**Design Principles:**
1. **Clarity First** — Information hierarchy must be immediately obvious
2. **Trust & Authority** — Government-grade aesthetic (not startup/consumer)
3. **Urgency Communication** — Alert levels must be visually unmistakable
4. **Accessibility** — WCAG 2.1 AA compliant, usable on all devices
5. **Operational Efficiency** — Dashboard UX optimized for rapid data entry and monitoring

---

## 2. Brand Identity

### 2.1 Color System

#### Primary Palette (Government / Authority)

| Token                     | Light Mode          | Dark Mode            | Usage                              |
| ------------------------- | ------------------- | -------------------- | ---------------------------------- |
| `--primary`               | `hsl(215, 65%, 36%)`| `hsl(215, 65%, 55%)` | Primary buttons, active nav, links |
| `--primary-foreground`    | `hsl(0, 0%, 100%)`  | `hsl(0, 0%, 100%)`  | Text on primary                    |
| `--secondary`             | `hsl(160, 45%, 40%)`| `hsl(160, 45%, 50%)` | Secondary actions, success states  |
| `--secondary-foreground`  | `hsl(0, 0%, 100%)`  | `hsl(0, 0%, 100%)`  | Text on secondary                  |
| `--accent`                | `hsl(35, 85%, 55%)` | `hsl(35, 85%, 60%)`  | Highlights, warnings               |
| `--accent-foreground`     | `hsl(0, 0%, 10%)`   | `hsl(0, 0%, 10%)`   | Text on accent                     |

#### Semantic Colors (Alert Severity)

| Severity    | Color                   | Background             | Usage                          |
| ----------- | ----------------------- | ---------------------- | ------------------------------ |
| Info        | `hsl(210, 60%, 50%)`   | `hsl(210, 60%, 95%)`  | Informational advisories       |
| Watch       | `hsl(45, 85%, 50%)`    | `hsl(45, 85%, 95%)`   | Monitoring situation           |
| Warning     | `hsl(30, 90%, 50%)`    | `hsl(30, 90%, 95%)`   | Elevated threat                |
| Critical    | `hsl(0, 80%, 50%)`     | `hsl(0, 80%, 95%)`    | Immediate danger               |
| Emergency   | `hsl(330, 85%, 45%)`   | `hsl(330, 85%, 95%)`  | Life-threatening emergency     |

#### Status Colors

| Status      | Color                   | Usage                          |
| ----------- | ----------------------- | ------------------------------ |
| Active      | `hsl(145, 63%, 42%)`   | Active/normal/online           |
| Pending     | `hsl(45, 85%, 50%)`    | Awaiting action                |
| Inactive    | `hsl(215, 14%, 60%)`   | Disabled/offline               |
| Error       | `hsl(0, 72%, 51%)`     | Error states                   |

#### Neutral Palette

| Token                     | Light Mode           | Dark Mode              |
| ------------------------- | -------------------- | ---------------------- |
| `--background`            | `hsl(0, 0%, 100%)`  | `hsl(222, 47%, 11%)`  |
| `--foreground`            | `hsl(222, 47%, 11%)`| `hsl(210, 40%, 98%)`  |
| `--card`                  | `hsl(0, 0%, 100%)`  | `hsl(222, 47%, 14%)`  |
| `--card-foreground`       | `hsl(222, 47%, 11%)`| `hsl(210, 40%, 98%)`  |
| `--muted`                 | `hsl(210, 40%, 96%)`| `hsl(217, 33%, 17%)`  |
| `--muted-foreground`      | `hsl(215, 16%, 47%)`| `hsl(215, 20%, 65%)`  |
| `--border`                | `hsl(214, 32%, 91%)`| `hsl(217, 33%, 25%)`  |
| `--ring`                  | `hsl(215, 65%, 36%)`| `hsl(215, 65%, 55%)`  |

### 2.2 Typography

| Element        | Font Family          | Weight   | Size       | Line Height |
| -------------- | -------------------- | -------- | ---------- | ----------- |
| Display        | Inter                | 700      | 36px       | 1.2         |
| H1             | Inter                | 700      | 30px       | 1.2         |
| H2             | Inter                | 600      | 24px       | 1.3         |
| H3             | Inter                | 600      | 20px       | 1.3         |
| H4             | Inter                | 600      | 16px       | 1.4         |
| Body           | Inter                | 400      | 14px       | 1.6         |
| Body Small     | Inter                | 400      | 13px       | 1.5         |
| Caption        | Inter                | 400      | 12px       | 1.4         |
| Monospace      | JetBrains Mono       | 400      | 13px       | 1.5         |
| Data/Numbers   | Inter (Tabular Nums) | 500      | 14px       | 1.4         |

**Font loading**: `next/font` with Inter (variable) and JetBrains Mono (monospace).

### 2.3 Spacing & Layout

| Token     | Value | Usage                              |
| --------- | ----- | ---------------------------------- |
| `space-1` | 4px   | Tight gaps, inline spacing         |
| `space-2` | 8px   | Element padding, small gaps        |
| `space-3` | 12px  | Card padding, medium gaps          |
| `space-4` | 16px  | Section spacing                    |
| `space-5` | 20px  | Component separation               |
| `space-6` | 24px  | Large section spacing              |
| `space-8` | 32px  | Page section separation            |
| `space-10`| 40px  | Major layout divisions             |
| `space-12`| 48px  | Hero/banner spacing                |

### 2.4 Border Radius

| Token          | Value | Usage                    |
| -------------- | ----- | ------------------------ |
| `radius-sm`    | 4px   | Small elements, badges   |
| `radius`       | 6px   | Default (buttons, inputs)|
| `radius-md`    | 8px   | Cards, dialogs           |
| `radius-lg`    | 12px  | Large cards, panels      |
| `radius-xl`    | 16px  | Hero sections            |
| `radius-full`  | 9999px| Avatars, pills           |

### 2.5 Shadows

| Token          | Value                                          | Usage              |
| -------------- | ---------------------------------------------- | ------------------ |
| `shadow-sm`    | `0 1px 2px rgba(0,0,0,0.05)`                 | Buttons, badges    |
| `shadow`       | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards   |
| `shadow-md`    | `0 4px 6px rgba(0,0,0,0.1)`                  | Dropdowns, popovers|
| `shadow-lg`    | `0 10px 15px rgba(0,0,0,0.1)`                | Dialogs, modals    |
| `shadow-xl`    | `0 20px 25px rgba(0,0,0,0.1)`                | Notifications      |

---

## 3. Layout Specifications

### 3.1 Dashboard Layout

```
┌──────────────────────────────────────────────────────┐
│  HEADER (h: 64px)                               [👤] │
│  Logo + System Name           Search    Notifications │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  SIDEBAR   │  MAIN CONTENT                           │
│  (w: 256px)│  (flex: 1)                              │
│            │                                         │
│  Collapsed:│  ┌─────────────────────────────────┐    │
│  (w: 72px) │  │ Page Header                     │    │
│            │  │ Title + Breadcrumbs + Actions    │    │
│  Nav items │  └─────────────────────────────────┘    │
│  with icons│                                         │
│  + labels  │  ┌─────────────────────────────────┐    │
│            │  │ Content Area                    │    │
│  Collaps-  │  │ (scrollable)                    │    │
│  ible      │  │                                 │    │
│  sections  │  │ Max-width: 1400px               │    │
│            │  │ Padding: 24px                   │    │
│            │  └─────────────────────────────────┘    │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

### 3.2 Public Portal Layout

```
┌──────────────────────────────────────────────────────┐
│  NAVBAR (h: 72px)                                     │
│  City Logo + Platform Name        Nav Links    [🌙]   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌───────────────────────────────────────────────┐   │
│  │ ALERT BANNER (conditional)                     │   │
│  │ Animated, color-coded by severity              │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  MAIN CONTENT                                         │
│  (full-width, responsive)                             │
│  Max-width: 1200px (centered)                         │
│                                                       │
│                                                       │
├──────────────────────────────────────────────────────┤
│  FOOTER                                               │
│  City seal + Contact info + Links                     │
└──────────────────────────────────────────────────────┘
```

### 3.3 Breakpoints

| Breakpoint | Width    | Target                   | Layout Adjustments          |
| ---------- | -------- | ------------------------ | --------------------------- |
| `sm`       | 640px    | Mobile (landscape)       | Stack columns               |
| `md`       | 768px    | Tablet                   | 2-column grids              |
| `lg`       | 1024px   | Laptop                   | Sidebar visible             |
| `xl`       | 1280px   | Desktop                  | Full layout                 |
| `2xl`      | 1536px   | Large desktop            | Max-width constraints       |

---

## 4. Component Design Specifications

### 4.1 Advisory Card

```
┌─────────────────────────────────────────────┐
│ 🔴 CRITICAL                    Oct 8, 2026  │  ← Severity badge + date
│                                              │
│ Typhoon Warning: Signal #2 Over Nueva Ecija │  ← Title (H3, semibold)
│                                              │
│ All residents in low-lying barangays are     │  ← Description (Body, truncated)
│ advised to evacuate immediately...           │
│                                              │
│ 📍 City-wide    🏢 CDRRMO     📎 2 files    │  ← Metadata row
│                                              │
│ [View Details]              [Share] [Export] │  ← Action buttons
└─────────────────────────────────────────────┘
```

### 4.2 Incident Map Marker

```
      ┌─────┐
      │ 🔥  │  ← Icon by type (fire, flood, accident, etc.)
      │     │
      └──┬──┘
         │
    Pin on map

On click → Popup:
┌────────────────────────────────┐
│ Fire Incident - 3rd Alarm      │
│ Brgy. Atencio, Palayan City   │
│ Status: Responding             │
│ Reported: 2h ago               │
│                                │
│ [View Full Details]            │
└────────────────────────────────┘
```

### 4.3 Status Dashboard Widget

```
┌────────────────────────┐
│  Active Incidents    ↗ │  ← Title + trend arrow
│                        │
│      12                │  ← Large number (Display)
│                        │
│  ▂▃▅▆▇█▅▃ (sparkline) │  ← 7-day trend sparkline
│                        │
│  +3 from yesterday     │  ← Comparison text
└────────────────────────┘
```

### 4.4 Data Table

```
┌─────────────────────────────────────────────────────────┐
│ [Search...🔍]  [Filter ▾]  [Date Range]  [+ New]       │  ← Toolbar
├──────┬──────────────┬──────────┬────────┬───────┬───────┤
│  ID  │ Title        │ Agency   │ Status │ Date  │ Act.  │  ← Column headers
├──────┼──────────────┼──────────┼────────┼───────┼───────┤
│ A-42 │ Heat Advisory│ CDRRMO   │ 🟢 Pub │ Oct 8 │ ••• │  ← Data rows
│ A-41 │ Water Notice │ Water    │ 🟡 Dra │ Oct 7 │ ••• │
│ A-40 │ Fire Warning │ BFP      │ 🔴 Exp │ Oct 6 │ ••• │
├──────┴──────────────┴──────────┴────────┴───────┴───────┤
│ Showing 1-10 of 42          [< 1 2 3 4 5 >]            │  ← Pagination
└─────────────────────────────────────────────────────────┘
```

---

## 5. Animation & Interaction Specifications

### 5.1 Micro-Animations

| Element              | Animation                          | Duration | Easing              |
| -------------------- | ---------------------------------- | -------- | -------------------- |
| Page transitions     | Fade + slide up (8px)              | 200ms    | `ease-out`           |
| Modal open           | Scale (0.95→1) + fade              | 200ms    | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal close          | Scale (1→0.95) + fade              | 150ms    | `ease-in`            |
| Sidebar expand       | Width transition                   | 200ms    | `ease-in-out`        |
| Button hover         | Background color transition        | 150ms    | `ease`               |
| Card hover           | Subtle shadow elevation            | 200ms    | `ease-out`           |
| Toast notification   | Slide in from right + fade         | 300ms    | `spring(1, 80, 10)`  |
| Loading skeleton     | Shimmer pulse                      | 1500ms   | `ease-in-out` loop   |
| Alert banner         | Slide down from top                | 300ms    | `ease-out`           |
| Status badge update  | Brief scale pulse (1→1.1→1)       | 300ms    | `ease-in-out`        |

### 5.2 Loading States

| State          | Behavior                                                |
| -------------- | ------------------------------------------------------- |
| Page load      | Skeleton components matching layout                     |
| Data fetch     | Skeleton rows in tables                                 |
| Form submit    | Button spinner + disabled state                         |
| Map load       | Blurred placeholder → map render                        |
| Image load     | Blur-up placeholder → full image                        |
| Infinite scroll| Skeleton cards at bottom during fetch                   |

---

## 6. Accessibility Requirements

| Requirement              | Implementation                                           |
| ------------------------ | -------------------------------------------------------- |
| Color contrast           | Minimum 4.5:1 (AA) for text, 3:1 for large text        |
| Keyboard navigation      | All interactive elements focusable + operable            |
| Screen reader support    | Semantic HTML + ARIA labels where needed                 |
| Focus indicators         | Visible focus ring on all interactive elements            |
| Motion reduction         | `prefers-reduced-motion` media query support             |
| Text scaling             | Layout stable up to 200% text zoom                       |
| Error messages           | Associated with form fields via `aria-describedby`       |
| Status announcements     | `aria-live` regions for dynamic updates                  |
| Alt text                 | All images have descriptive alt text                     |
| Skip links               | "Skip to main content" link for keyboard users           |

---

## 7. Dark Mode Specification

- **Toggle**: Manual toggle in header (icon button)
- **Persistence**: `localStorage` preference, respects `prefers-color-scheme` initially
- **Implementation**: CSS custom properties via Tailwind's `dark:` prefix
- **Transition**: 200ms color transition on theme switch
- **Scope**: All dashboard and public portal pages

---

## 8. Iconography

| Category          | Source         | Style           |
| ----------------- | -------------- | --------------- |
| UI Icons          | Lucide React   | Outlined, 1.5px |
| Module Icons      | Lucide React   | Outlined, 1.5px |
| Map Markers       | Custom SVG     | Filled, colored |
| Severity Icons    | Lucide React   | Filled variants |
| Agency Logos      | Uploaded assets| Per-agency      |
| City Seal         | Official asset | Full color      |

---

## 9. Responsive Behavior Summary

| Component        | Desktop (≥1024px) | Tablet (768-1023px) | Mobile (<768px)     |
| ---------------- | ----------------- | ------------------- | ------------------- |
| Dashboard Sidebar| Expanded (256px)  | Collapsed (72px)    | Overlay drawer      |
| Data Tables      | Full columns      | Scrollable          | Card view           |
| Map View         | Side panel + map  | Full-screen map     | Full-screen map     |
| Dashboard Widgets| 4-column grid     | 2-column grid       | 1-column stack      |
| Forms            | 2-column          | 2-column            | 1-column            |
| Public Portal    | 3-column grid     | 2-column grid       | 1-column stack      |
| Alert Banner     | Full-width, 1 line| Full-width, 2 lines | Full-width, stacked |
