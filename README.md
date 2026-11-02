# ProofBox 2.0 — Warranty & Receipt Vault

[![SR University](https://img.shields.io/badge/SR%20University-Mini--Project-blue?style=flat-square)](https://sru.edu.in)
[![Design](https://img.shields.io/badge/Design-Apple--Inspired%20Consumer%20UI-black?style=flat-square)](#design-philosophy)
[![Stack](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)](#technology-stack)
[![Tests](https://img.shields.io/badge/Tests-52%20Passed-emerald?style=flat-square)](#automated-testing)
[![Platform](https://img.shields.io/badge/macOS-Apple%20Silicon%20M3-purple?style=flat-square)](#development-environment)

A full-stack MERN application for organizing product purchases, archiving digital receipts and invoices, authoritatively calculating warranty expiration timelines, and delivering timely expiration intelligence before coverage lapses.

---

## 1. Project Overview & Problem Statement

Consumers frequently misplace paper receipts, lose warranty cards, and lose track of warranty expiration dates. When hardware defects, battery degradation, or appliance breakdowns occur, users often find that their manufacturer coverage lapsed just days earlier or that they lack verifiable proof of purchase.

**ProofBox 2.0** solves this through a personal ownership vault:
1. **Product Registry:** Log purchases with product name, category, seller, price, and purchase date.
2. **Receipt Vault:** Safely archive invoices, paper receipt images, and PDF documents.
3. **Warranty Calculation Engine:** Authoritative date-math engine handling leap years, month-ends (e.g. Jan 31 + 1 mo = Feb 28/29), and UTC calendar consistency without timezone day drift.
4. **Expiring Soon Radar:** Timely countdowns and preparation checklists within an inclusive 30-day window.
5. **Apple-Caliber Consumer Design:** Minimal, elegant light theme (`#F5F5F7`), editorial typography, top horizontal sticky navigation, and product-first card/table views.

---

## 2. Technology Stack

- **Frontend:** React 18, Vite 5, React Router DOM v6, Lucide Icons, Custom Vanilla CSS Design System
- **Backend:** Node.js v25 (LTS compatible), Express.js v4, Multer (file uploads)
- **Database:** MongoDB v8.2.5 (Native Apple Silicon arm64), Mongoose v8.8.0 ODM
- **Authentication:** JWT (JSON Web Tokens), Bcrypt.js (10 salt rounds), HttpOnly signed cookies
- **Security:** Helmet, CORS, Express-Rate-Limit, Strict Owner Data Isolation
- **Testing:** Node.js Native Test Runner (`node:test`, `node:assert`), Supertest, Vitest, React Testing Library

---

## 3. Design Philosophy & ProofBox 2.0 Identity

Inspired by the design standards of **Apple.com** and human interface guidelines:
- **Canvas & Surfaces:** Crisp warm-grey background (`#F5F5F7`) with elevated white surfaces (`#FFFFFF`) and ultra-fine borders (`#E5E5E7`).
- **Typography:** Editorial hierarchy utilizing native Apple system font stacks (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text'`).
- **Signature Palette:** ProofBox Royal Cobalt (`#185ADB`) with soft semantic status pills (Forest Green `#065F46`, Amber `#92400E`, Crimson `#991B1B`).
- **Navigation:** Top horizontal sticky navigation (**ProofBox | Overview | My Products | Warranties | Expiring | Receipts | Account**) with a dedicated `+ Add Purchase` action and responsive mobile drawer.
- **Zero AI-Template Styling:** Replaces uniform dark backgrounds, glowing neon borders, and permanent sidebars with clean editorial layouts.

---

## 4. Five-Member Team Responsibilities

| Team Member | Role | Future Feature Branch | Primary Codebase Domain |
|:---|:---|:---|:---|
| **Paidipelly Vishwa Teja** | **Team Lead & Integration Engineer** | `feature/integration` | Architecture, process orchestration, build verification, cross-service integration |
| **Kuchana Vyshnavi** | **Authentication & Security Developer** | `feature/authentication` | Registration, login, Bcrypt hashing, JWT tokens, protected routes |
| **Arpula Anjali** | **Frontend & UI/UX Developer** | `feature/frontend-dashboard` | Apple-inspired UI, responsive layout, product collection, design tokens |
| **Adapala Vamshi Krishna** | **Backend & MongoDB Developer** | `feature/backend-database` | MongoDB schemas, Mongoose models, CRUD APIs, aggregation pipelines |
| **Jetti Mukesh** | **Warranty & Receipt Developer** | `feature/warranty-receipts` | Warranty calculator, leap-year math, Multer receipt pipeline, document vault |

*Detailed task assignments and codebase touchpoints are documented in [`docs/TEAM_TASKS.md`](docs/TEAM_TASKS.md) and [`docs/TEAM_ROLES.md`](docs/TEAM_ROLES.md).*

---

## 5. Quick Start (Local macOS Environment)

### Prerequisites
- macOS (Apple Silicon M-series or Intel)
- Node.js (v18+)
- MongoDB Community Server (`brew services` or `mongod`)

### Start Everything with One Command
From the project root directory:
```bash
npm run dev
```
> This starts MongoDB, the Express REST API server on **Port 5001**, and the React / Vite frontend on **Port 5173**.

### Service Addresses
- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5001](http://localhost:5001)
- **Health Check Endpoint:** [http://localhost:5001/api/health](http://localhost:5001/api/health)
- **Demo Account:** `demo@proofbox.com`
- **Demo Password:** `DemoPassword123!`

---

## 6. Automated Testing & Verification

Run the full test suite across backend and frontend:
```bash
npm test
```

### Verified Test Results (52 Tests, 100% Pass Rate)
- **Backend Tests (43 passed):**
  - 11 Warranty Calculator unit tests (leap years, month-ends, boundary days).
  - 8 Authentication integration tests (registration, duplicate checks, login, logout, profile).
  - 8 Google OAuth 2.0 integration tests (token verification, conflict protection, auto-registration).
  - 11 Purchase CRUD & Search integration tests (create, read, patch, delete, search, expiring).
  - 5 Cross-user authorization tests (strict multi-tenant data isolation).
- **Frontend Tests (9 passed):**
  - 6 Date & Currency utility tests (including UTC end-of-day anniversary formatting invariance).
  - 3 WarrantyBadge component render tests (Active, Expiring Soon, Expired).

### Production Build
```bash
npm run build
```
Compiles Vite bundle in < 800ms with zero errors.

---

## 7. University Documentation Deliverables

Complete university project documentation is available in the [`docs/`](docs/) directory:
- [`docs/API.md`](docs/API.md) — Comprehensive REST API documentation
- [`docs/DATABASE.md`](docs/DATABASE.md) — MongoDB schemas, indexes, and referential integrity
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Full-stack system architecture and security model
- [`docs/TESTING.md`](docs/TESTING.md) — Complete test strategy, execution logs, and coverage
- [`docs/DEMO.md`](docs/DEMO.md) — Step-by-step evaluator presentation guide
- [`docs/TEAM_ROLES.md`](docs/TEAM_ROLES.md) — Five-member domain ownership and viva competencies
- [`docs/TEAM_TASKS.md`](docs/TEAM_TASKS.md) — Concrete student deliverables and code assignments
- [`docs/CONTRIBUTION_PLAN.md`](docs/CONTRIBUTION_PLAN.md) — Planned GitHub branching workflow and PR gatekeepers
