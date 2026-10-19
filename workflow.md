# ✈️ Sidekick Travel Platform

> **7-Week Implementation Roadmap • 3-Day Sprint Cadence • Architecture & Delivery Blueprint**  
> *Based on Sidekick Travel Platform PRD v1.0 | Planning Baseline: October 2026*

---

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [Platform Pillars & Product Loop](#-platform-pillars--product-loop)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Scope Guardrails: MVP vs. V2 vs. V3](#-scope-guardrails-mvp-vs-v2-vs-v3)
- [Suggested Weekly Milestones](#-suggested-weekly-milestones)
- [Sprint-by-Sprint Implementation Roadmap](#-sprint-by-sprint-implementation-roadmap)
  - [Sprint Matrix](#sprint-matrix)
  - [Phase 1: Foundation & Public Catalog (Days 1–15)](#phase-1-foundation--public-catalog-days-115)
  - [Phase 2: Customer Itinerary Planner & Budget Engine (Days 16–33)](#phase-2-customer-itinerary-planner--budget-engine-days-1633)
  - [Phase 3: CRM, Lead Management & Communication (Days 34–42)](#phase-3-crm-lead-management--communication-days-3442)
  - [Phase 4: QA, Hardening & Staging Release (Days 43–49)](#phase-4-qa-hardening--staging-release-days-4349)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Risks & Mitigations](#-risks--mitigations)
- [Key Decisions for Days 1–3](#-key-decisions-for-days-13)
- [MVP Acceptance Checklist](#-mvp-acceptance-checklist)
- [Team Operating Rhythm](#-team-operating-rhythm)
- [Release Note Template](#-release-note-template)

---

## 📌 Executive Summary

This roadmap defines a concrete, realistic delivery schedule for a small engineering team to launch the **Sidekick Travel Platform MVP in 7 weeks (49 days)**. 

### Delivery Cadence
- **Total Duration:** 7 Weeks (49 Calendar Days)
- **Sprint Length:** 16 three-day sprints (Days 1–48)
- **Final Release Gate:** Day 49 (Go / No-Go sign-off)
- **Core Strategy:** Build the complete end-to-end user loop first with seeded data before optimizing secondary CRM workflows or waiting for third-party integrations.

```
[Discover / Browse] ➔ [Planner Questionnaire] ➔ [Rule Recommendations] ➔ [Custom Itinerary Builder] ➔ [Price Snapshot] ➔ [Submit Enquiry] ➔ [CRM Pipeline & Revision]
```

---

## 🏛️ Platform Pillars & Product Loop

Sidekick is an integrated platform where three functional surfaces share a single unified PostgreSQL database:

| Pillar | Target Users | Core Responsibilities |
| :--- | :--- | :--- |
| **1. Public Website** | Prospective Travellers | Destination discovery, package browsing, featured collections, SEO landing pages, and calls-to-action directing to the itinerary builder. |
| **2. Customer Itinerary Builder** | Self-serve Travellers | Multi-step requirements questionnaire, rule-based package recommendation, interactive day-by-day customization, live budget calculation, and enquiry submission. |
| **3. CRM / Admin Portal** | Sales Agents & Admins | Destination/product/inventory management, catalog publishing controls, lead pipeline tracking, customer itinerary review/editing, and communication history. |

### The Central Product Loop
1. **Admin** creates destinations, products, and inventory items with transparent base pricing and publishes them.
2. **Traveller** browses published destinations, launches the trip planner, and specifies preferences (dates, budget, pax count, tags).
3. **Recommendation Engine** matches structured packages/templates matching traveler criteria.
4. **Traveller** clones a template into an independent customer itinerary, customizes items per day, views the budget calculation, and submits an enquiry.
5. **System** freezes prices into an immutable **Price Snapshot**, records the lead, and notifies the CRM.
6. **Agent** inspects the enquiry in CRM, creates audited revisions, and communicates with the customer via email / messaging.

---

## 💻 Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│         (TypeScript • Tailwind CSS • shadcn/ui)         │
├──────────────────────────┬─────────────────────────────┤
│  Public & Planner UI     │   Protected Admin / CRM     │
└────────────┬─────────────┴──────────────┬──────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────────────────────────────────────┐
│                 Drizzle ORM / Server API               │
│            Server-side Role & Authorization            │
├────────────────────────────────────────────────────────┤
│                 Supabase Infrastructure                 │
│  • PostgreSQL DB   • Auth & RLS   • Blob Storage       │
└────────────┬────────────────────────────┬──────────────┘
             │                            │
             ▼                            ▼
┌─────────────────────────┐  ┌───────────────────────────┐
│     Resend (Email)      │  │ WhatsApp Business API     │
│   Transactional Alerts  │  │ (Direct / Adapter Mode)   │
└─────────────────────────┘  └───────────────────────────┘
```

| Layer | Recommended Technology | Notes |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router) + TypeScript** | Server components for catalog SEO; interactive client components for builder. |
| **Styling & Components** | **Tailwind CSS + shadcn/ui** | Accessible, responsive, customizable design system without bloat. |
| **Database & Auth** | **Supabase (PostgreSQL + Supabase Auth)** | Native Row Level Security (RLS), role-based claims (`traveller`, `staff`, `admin`). |
| **Data Access Layer** | **Drizzle ORM** | Type-safe SQL migrations, schema definitions, and performant server queries. |
| **File / Media Storage** | **Supabase Storage** | CDN-backed asset storage for destination galleries and hotel/activity photos. |
| **Email Service** | **Resend** | Transactional lead confirmations and itinerary share emails. |
| **Messaging** | **WhatsApp Business API** | Cloud API with adapter pattern (mock/test fallback if verification is delayed). |
| **Monitoring & Quality** | **Sentry & PostHog** | Error tracking and user funnel telemetry. |

### Initial Data Entities
- **Identity & Access:** `profiles`, `roles` (`admin`, `staff`, `traveller`)
- **Catalog:** `destinations`, `products`, `media`
- **Inventory & Pricing:** `hotels`, `activities`, `transport`, `price_records`
- **Templates:** `itinerary_templates`, `template_days`, `template_items`
- **Customer Trips:** `itineraries`, `itinerary_days`, `itinerary_items`, `price_snapshots`
- **CRM & Comms:** `customers`, `leads`, `communication_history`, `email_templates`

> [!IMPORTANT]
> **Data Integrity Golden Rule:** Template itineraries and customer-owned itineraries are kept in separate tables. When a user selects a template, it is deeply cloned. Edits made by administrators to templates never mutate existing customer itineraries or alter saved price snapshots.

---

## 🛡️ Scope Guardrails: MVP vs. V2 vs. V3

To guarantee release on Day 49, clear boundaries must be preserved:

| Feature / Domain | MVP (Weeks 1–7) 🟢 | V2 Backlog 🟡 | V3 Future Vision ⚪ |
| :--- | :--- | :--- | :--- |
| **Recommendations** | Deterministic rule & tag filters | User behavior-based weighting | Full LLM / AI conversational agent |
| **Itinerary Customization** | Reorder, swap, add/remove items | Multi-room complex splits | Automated itinerary routing optimization |
| **Pricing Engine** | Formula calculation + frozen snapshot | Dynamic seasonal markups & vouchers | Live supplier GDS / BedBank rate integration |
| **Bookings & Payments** | Enquiry capture ➔ CRM handoff | Razorpay / Stripe direct checkout | Automated supplier reservation dispatch |
| **Communication** | Email triggers + WhatsApp adapter | Bi-directional chat inbox in CRM | Omnichannel AI assistant |
| **User Accounts** | Anonymous draft + session / Lead ID | Registered customer portal | Social sharing & co-traveler collaboration |

---

## 📅 Suggested Weekly Milestones

| Timeline | Milestone Focus | Major Deliverables |
| :--- | :--- | :--- |
| **Week 1** (Days 1–7) | **Foundation & Public Shell** | Repo initialized, Supabase + Auth ready, design system, responsive homepage live. |
| **Week 2** (Days 8–14) | **Catalog & Admin CRUD** | Destination & product listings, admin CRUD portal, published/draft status toggle. |
| **Week 3** (Days 15–21) | **Inventory & Trip Planner** | Activity/hotel inventory, multi-step questionnaire, rule-based recommendation logic. |
| **Week 4** (Days 22–28) | **Itinerary Builder** | Day-by-day itinerary renderer, item insertion/deletion, drag-and-drop reordering. |
| **Week 5** (Days 29–35) | **Budget Engine & Enquiry** | Itemized budget calculation, price snapshots, lead capture & customer record link. |
| **Week 6** (Days 36–42) | **CRM Pipeline & Messaging** | Admin lead dashboard, agent itinerary revisioning, Resend email triggers. |
| **Week 7** (Days 43–49) | **QA, Staging & Launch** | End-to-end journey validation, security audit, staging deployment, sign-off. |

---

## 🚀 Sprint-by-Sprint Implementation Roadmap

### Sprint Matrix

| Sprint | Days | Phase | Core Deliverable |
| :---: | :---: | :--- | :--- |
| **01** | 1–3 | Setup | Scope lock, repo initialization, Next.js + Tailwind + shadcn/ui design tokens. |
| **02** | 4–6 | Database | Supabase schema migrations, seed data, auth guards, protected `/admin` route. |
| **03** | 7–9 | Public Web | Responsive homepage, destination directory, hero search CTA, dynamic header/footer. |
| **04** | 10–12 | Catalog | Product detail pages, gallery, inclusions/exclusions, admin CRUD operations. |
| **05** | 13–15 | Inventory | Hotels, activities, transport models, standardized pricing units and selectors. |
| **06** | 16–18 | Questionnaire | Multi-step trip planner questionnaire with persistent session state & validation. |
| **07** | 19–21 | Matching | Rule-based package recommendation engine with fallback no-match states. |
| **08** | 22–24 | Itinerary Core | Itinerary data model, day-by-day views, template-to-customer cloning. |
| **09** | 25–27 | Customization | Reorder items, add/remove inventory, day duration adjustments, keyboard accessibility. |
| **10** | 28–30 | Pricing Engine | Live budget calculator, per-person/unit multipliers, immutable price snapshotting. |
| **11** | 31–33 | Lead Capture | Enquiry submission form, customer linking, automated CRM lead creation. |
| **12** | 34–36 | CRM Pipeline | Lead management dashboard, status transitions, notes, search and filters. |
| **13** | 37–39 | Agent Edits | Staff itinerary revision tool, version history keeping customer copy intact. |
| **14** | 40–42 | Comms | Resend email triggers, notification history, WhatsApp Business API adapter. |
| **15** | 43–45 | Hardening | Full customer journey QA, mobile responsive check, Sentry logging, bug fixing. |
| **16** | 46–48 | Staging | Staging deploy, non-developer usability testing, runbooks & backup plan. |
| **Gate** | 49 | Release | Go/No-Go final evaluation, operational handover, V2 backlog lockdown. |

---

### Phase 1: Foundation & Public Catalog (Days 1–15)

#### Sprint 01 • Days 1–3 — Scope, Repo & UI Skeleton
- [ ] Confirm MVP boundary; defer V2/V3 features; assign sprint task owners.
- [ ] Initialize repository with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
- [ ] Configure ESLint, Prettier, TypeScript strict rules, and `.env.example`.
- [ ] Set up design system tokens: typography, responsive container scale, colors, buttons, cards, badges, and empty/loading states.
> **Exit Criteria:** App boots locally with zero warnings; clean `main` branch; README instructions verified by a second developer.

#### Sprint 02 • Days 4–6 — Database & Authentication Foundation
- [ ] Provision Supabase environments for development and staging.
- [ ] Write initial Drizzle migrations: `profiles`, `roles`, `destinations`, `products`, `inventory`, timestamps.
- [ ] Implement Supabase Auth for staff/admin with server-side middleware role validation on `/admin/*`.
- [ ] Seed reproducible test data: 2 destinations, 3 multi-day packages, baseline inventory records.
> **Exit Criteria:** Staff can authenticate; unauthorized visitors receive 403/redirect on `/admin`; reproducible database seed script works.

#### Sprint 03 • Days 7–9 — Public Website Shell
- [ ] Implement responsive global layout: navigation bar, mobile drawer, and footer.
- [ ] Build homepage: Hero section with "Plan Your Trip" CTA, featured destinations, trust badges, and testimonials.
- [ ] Create dynamic destination grid and destination detail pages (`/destinations/[slug]`).
- [ ] Connect public queries to display only active, published destinations with loading skeletons and error states.
> **Exit Criteria:** Homepage and destination pages render live database data; unpublished records remain hidden.

#### Sprint 04 • Days 10–12 — Product Catalogue & Admin CRUD
- [ ] Build product list and product detail page (`/packages/[slug]`) with duration, starting price, highlights, inclusions/exclusions, FAQ accordions, and default itinerary preview.
- [ ] Build admin CRUD views (`/admin/products`, `/admin/destinations`): create, edit, archive, feature, and toggle publish status.
- [ ] Implement image uploads to Supabase Storage with dimension validation.
- [ ] Verify that public site reflects catalog updates in real time.
> **Exit Criteria:** Admin can create/edit/publish a package and immediately view the updated listing on the public site without code deployments.

#### Sprint 05 • Days 13–15 — Inventory & Pricing Baseline
- [ ] Build admin CRUD for reusable inventory: `activities` and `hotels` (and optional `transport`).
- [ ] Standardize price schema: currency (INR), base amount, unit type (`per_person`, `per_room_night`, `flat_fee`), and tax flags.
- [ ] Implement inventory selector modals for attaching catalog items to itinerary days.
- [ ] Seed comprehensive demo inventory with edge cases (free items, per-group costs).
> **Exit Criteria:** Admin can manage hotels and activities with standardized pricing; selectors can query inventory reliably.

---

### Phase 2: Customer Itinerary Planner & Budget Engine (Days 16–33)

#### Sprint 06 • Days 16–18 — Trip Questionnaire
- [ ] Build accessible multi-step wizard:
  1. Destination selection
  2. Travel dates / flexible month & duration
  3. Travellers breakdown (adults, children, infants)
  4. Budget preference
  5. Interest tags (e.g. Adventure, Heritage, Leisure, Nature, Family)
- [ ] Add client-side validation, previous/next step transitions, and progress bar indicator.
- [ ] Persist answers in local/session state across page reloads.
> **Exit Criteria:** User completes all steps on mobile and desktop without state loss; generates a validated requirements payload.

#### Sprint 07 • Days 19–21 — Rule-Based Recommendations
- [ ] Implement matching logic filtering products/templates by destination, duration, budget range, and tags.
- [ ] Display ranked recommendation cards showing starting price, highlights, and "Customize This Trip" action.
- [ ] Build clean empty / no-match fallback screen with options to adjust criteria or request custom consultation.
- [ ] Verify standard test cases (e.g., Kashmir • 7 Days • 2 Adults • ₹60,000 budget • Nature/Adventure).
> **Exit Criteria:** Deterministic input yields predictable recommendations; out-of-budget options are cleanly separated.

#### Sprint 08 • Days 22–24 — Itinerary Template & Day Structure
- [ ] Model template hierarchy: `itinerary_templates` ➔ `template_days` ➔ `template_items`.
- [ ] On template selection, deep-clone the template into an independent `itineraries` record.
- [ ] Build day-by-day itinerary view with daily summaries, activity badges, hotel accommodations, and price indicators.
> **Exit Criteria:** Selected template clones into a distinct customer itinerary; modifying the template does not alter existing customer copies.

#### Sprint 09 • Days 25–27 — Customization & Reorder
- [ ] Implement item actions: add from inventory, remove item, swap activity.
- [ ] Implement drag-and-drop item reordering within and across days (with keyboard up/down fallback controls).
- [ ] Support adjusting total itinerary duration (add/remove days) with boundary safeguards.
- [ ] Persist user modifications via draft ID or session storage.
> **Exit Criteria:** User can reorder and swap items across multiple days; customized itinerary survives browser reload.

#### Sprint 10 • Days 28–30 — Budget Engine & Price Snapshots
- [ ] Build shared calculation module:
  $$\text{Total} = \sum (\text{Hotel} \times \text{Rooms} \times \text{Nights}) + \sum (\text{Activity} \times \text{Pax}) + \text{Transport} + \text{Taxes}$$
- [ ] Recalculate and display itemized category breakdowns (Stays, Activities, Transport) alongside total estimate.
- [ ] Clearly label all figures as **"Estimated Total"**.
- [ ] When an itinerary is saved or submitted, freeze all calculated values into an immutable `price_snapshots` record.
> **Exit Criteria:** Category breakdown matches total exactly; subsequent admin edits to base inventory do not change saved snapshots.

#### Sprint 11 • Days 31–33 — Save Itinerary & Enquiry-to-Lead
- [ ] Build enquiry submission drawer/modal: Full Name, Email, Phone, Preferred Dates, Traveller Counts, Notes.
- [ ] Implement input sanitization and privacy/consent checkboxes.
- [ ] Execute atomic database transaction: Create/Link Customer ➔ Create Lead ➔ Attach Itinerary ➔ Attach Price Snapshot.
- [ ] Show submission confirmation screen with unique reference number.
> **Exit Criteria:** Submitting enquiry creates a complete lead package in database with customer, itinerary, and snapshot attached.

---

### Phase 3: CRM, Lead Management & Communication (Days 34–42)

#### Sprint 12 • Days 34–36 — CRM Dashboard & Lead Pipeline
- [ ] Build `/admin/leads` dashboard with search, status filters, and date sorting.
- [ ] Implement lead state pipeline:
  $$\text{New} \longrightarrow \text{Contacted} \longrightarrow \text{Qualified} \longrightarrow \text{Itinerary Sent} \longrightarrow \text{Negotiation} \longrightarrow \text{Confirmed} \mid \text{Lost}$$
- [ ] Build lead detail view: customer contact details, travel preferences, complete attached itinerary, and staff notes timeline.
- [ ] Enforce role-based access control ensuring staff/admins only can access CRM endpoints.
> **Exit Criteria:** Staff can open any incoming lead, inspect customer requirements, view the exact itinerary, and update status.

#### Sprint 13 • Days 37–39 — Agent Itinerary Editing & Versioning
- [ ] Allow staff to edit an itinerary on behalf of a customer (add discounts, swap hotels, add custom items).
- [ ] Create audited revisions (`v1_customer_original`, `v2_agent_revised`) instead of overwriting customer input.
- [ ] Add internal margin and custom price override controls for authorized staff.
> **Exit Criteria:** Staff can make revisions; original customer submission remains untouched and accessible for historical comparison.

#### Sprint 14 • Days 40–42 — Email, WhatsApp Readiness & History
- [ ] Integrate Resend transactional email:
  - Lead submission acknowledgement to customer.
  - New lead alert to sales team.
  - Revised itinerary link delivery.
- [ ] Create abstract communication adapter interface and `communication_history` logger.
- [ ] Configure WhatsApp Business API integration; if credentials/templates are pending verification, provide a mock adapter with clear status logging.
> **Exit Criteria:** Transactional emails arrive in test inboxes; outbox logs record status; WhatsApp service does not block deployment.

---

### Phase 4: QA, Hardening & Staging Release (Days 43–49)

#### Sprint 15 • Days 43–45 — End-to-End QA, Security & Polish
- [ ] Execute full end-to-end user journeys:
  `Browse ➔ Questionnaire ➔ Recommendations ➔ Customize ➔ Estimate ➔ Submit Enquiry ➔ CRM Review ➔ Agent Revision`
- [ ] Security audit: Verify Supabase Row Level Security (RLS), protect API routes, confirm zero secrets in client bundles.
- [ ] Mobile viewport audit across iOS Safari and Android Chrome.
- [ ] Add Sentry error boundaries, fallbacks, and user feedback toast alerts.
> **Exit Criteria:** 100% of checklist passes; zero known critical/high security or data integrity bugs.

#### Sprint 16 • Days 46–48 — Staging Release & Acceptance
- [ ] Deploy build to staging with production-equivalent secrets, migrations, and storage buckets.
- [ ] Conduct unassisted user test with a non-technical participant; log and address UX friction points.
- [ ] Verify automated database backup and restore procedures.
- [ ] Prepare operational documentation: deployment runbook, known limitations, and admin user guide.
> **Exit Criteria:** Staging environment fully demo-ready; client/product owner reviews and confirms feature completeness.

#### Day 49 • Final Release Gate — Go / No-Go & Handover
- [ ] Re-run critical smoke test suite on staging.
- [ ] Review all open backlog tickets: categorize into Accepted Non-Blockers or Blockers.
- [ ] Execute production deployment upon formal sign-off.
- [ ] Lock down V2 backlog with prioritized items.
> **Exit Criteria:** Documented release sign-off; platform operational in production.

---

## 🔒 Definition of Done (DoD)

A user story or sprint task is considered **DONE** only when:

1. **Code Quality:** Code is written in TypeScript, passes strict linting, and is merged to `main` via reviewed Pull Request.
2. **Acceptance Criteria:** Tested across both the happy path and common edge/failure cases.
3. **Database Integrity:** Schema modifications include reproducible Drizzle migrations and seed updates.
4. **Security & Permissions:** Authorization is strictly enforced on the server; zero service keys or secrets exposed to the browser.
5. **UI & Accessibility:** Responsive on mobile (375px+) and desktop viewports; supports keyboard navigation.
6. **State Handling:** Includes proper loading skeletons, empty states, input validation, and user-facing error toasts.
7. **Documentation:** README, API contracts, or operator guides are updated whenever features or environment variables change.
8. **Demonstrability:** Working software is showcased at the sprint demo meeting against the exit criteria.

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Probability | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Scope Creep** | High | High | Strict adherence to V1 guardrails; enforce Day 1–3 decision to defer payments and live GDS inventory. |
| **Late Data Model Shifts** | High | Medium | Finalize core schema (destinations, packages, itineraries, pricing) by Day 6; use Drizzle migrations for all changes. |
| **Pricing Inconsistencies** | High | Medium | Use a single centralized server-side calculation utility; store immutable price snapshots at enquiry submission. |
| **Template Overwrites** | High | Low | Always perform deep cloning from `itinerary_templates` into independent `itineraries` instances. |
| **Data Leakage / Security** | Critical | Low | Implement Supabase RLS policies and server-side session checks; run automated negative permission tests. |
| **WhatsApp Approval Delay** | Medium | High | Build a provider-agnostic notification adapter; rely on email for launch if template approval is delayed. |
| **Merge / Team Conflicts** | Medium | Medium | Keep sprint tickets small; enforce branch protection, shared TypeScript interfaces, and daily PR reviews. |
| **Deployment Surprises** | High | Low | Stand up the staging pipeline by Week 2; deploy continuously at the end of each sprint. |

---

## 🔑 Key Decisions for Days 1–3

The following technical and business decisions must be locked down before Sprint 02 commences:

1. **Team Ownership Matrix:** Designate exactly one task per time when to do
2. **Pricing Engine Rules:**
   - Define exact formula for: `per_person`, `per_room_night`, flat activity fees, child discounts, taxes (GST), and service markups.
3. **Session vs. Anonymous Persistence:**
   - Confirm traveller questionnaire and itinerary builder will persist state via secure local session tokens, converted to full customer accounts only upon enquiry submission.
4. **Draft Itinerary Storage:**
   - Recommend saving draft itineraries in database with temporary UUIDs to facilitate cross-device sharing or recovery.
5. **Provider Accounts:**
   - Ensure credentials for Supabase, Resend, Sentry, and Meta WhatsApp Business Manager are provisioned immediately.
6. **Content & Asset Sourcing:**
   - Confirm licensing and CDN hosting for destination photos and catalog assets.

---

## ✅ MVP Acceptance Checklist

Track overall project readiness using this release checklist:

### Public Website & Discovery
- [ ] Responsive global header, navigation menu, and footer.
- [ ] Homepage with hero search, destination showcases, and value propositions.
- [ ] Destination catalog listing and detail pages with live database data.
- [ ] Product package pages with galleries, inclusions/exclusions, and default itinerary preview.
- [ ] Unpublished/draft destinations and products are excluded from public queries.

### Questionnaire & Planner
- [ ] Multi-step questionnaire collecting destination, dates, group size, budget, and interests.
- [ ] Form validation prevents invalid step transitions.
- [ ] Questionnaire selections persist across browser refreshes.
- [ ] Rule-based recommendation engine ranks matching packages accurately.
- [ ] Informative empty state displays when no packages match criteria.

### Itinerary Builder & Budgeting
- [ ] Selecting a package creates an independent clone of the itinerary template.
- [ ] Day-by-day planner allows adding, removing, and swapping activities/hotels.
- [ ] Drag-and-drop or step controls allow reordering items and adjusting days.
- [ ] Live price engine recalculates itemized and total budgets upon each modification.
- [ ] Immutable price snapshot is frozen when an enquiry is created.

### Lead Management & CRM
- [ ] Enquiry submission creates/links customer record and opens a new lead.
- [ ] Staff can view leads in `/admin/leads` and update status through the full pipeline.
- [ ] Staff can inspect attached customer itineraries and notes.
- [ ] Staff can create revisions of customer itineraries while preserving original copy.
- [ ] Server-side role authorization strictly protects all admin APIs and views.

### Integrations & Operational Readiness
- [ ] Resend transactional emails fire on enquiry submission.
- [ ] Communication history table logs all outbound notifications.
- [ ] WhatsApp notification adapter in place (live or fallback logging mode).
- [ ] Staging environment running latest migrations and seed data.
- [ ] Automated database backup policy configured and documented.
- [ ] Formal Go / No-Go acceptance sign-off completed.

---

## ⏱️ Team Operating Rhythm

Maintain delivery velocity with this lightweight 3-day sprint rhythm:

| Time | Duration | Activity |
| :--- | :---: | :--- |
| **Morning Standup (Daily)** | 10 mins | Identify the day's priority sprint task; state exact definition of done; raise blockers. |
| **Mid-Day Focus** | Core | Focus on small, atomic commits; keep PRs under 300 lines; keep secrets out of source control. |
| **End of Day Wrap-Up** | 10 mins | Run linter/typecheck; verify local build; push branches; update ticket board. |
| **Sprint Review (Every 3rd Day)** | 30 mins | Demo working features against sprint exit criteria; merge to `main`; update roadmap status. |

---

## 📝 Release Note Template

Use this template during the Day 49 release gate review:

```markdown

#### 1. Scope & Delivered Features
- [x] Public Website & Catalog Browsing
- [x] Questionnaire & Rule-based Recommendation Engine
- [x] Day-by-day Custom Itinerary Builder with Drag-and-Drop
- [x] Real-time Itemized Budget Engine with Price Snapshotting
- [x] Enquiry Submission & CRM Lead Management Pipeline
- [x] Agent Itinerary Revisioning System
- [x] Transactional Email Confirmations (Resend)

#### 2. Deferred Scope (V2 Backlog)
- Direct online booking & payment gateway (Razorpay)
- Registered traveler user portals & social itinerary sharing
- Live airline/hotel inventory GDS supplier sync

#### 3. Verification & Test Summary
- Smoke Test Checklist: [ ] PASS  [ ] FAIL
- Security & RLS Audit: [ ] PASS  [ ] FAIL
- Mobile Layout Verification: [ ] PASS  [ ] FAIL

#### 4. Release Decision
- [ ] GO (Release to Production)
- [ ] GO WITH ACCEPTED MINOR ISSUES
- [ ] HOLD (Blockers Identified)

