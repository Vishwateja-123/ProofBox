# ProofBox 2.0 — Five-Member Team Roles & Domain Ownership

**Institution:** SR University  
**Department:** Computer Science & Engineering  
**Academic Year:** 2026  
**Course:** Full-Stack Web Development Mini-Project  
**Project:** ProofBox — Warranty & Receipt Vault  

---

## 1. Academic Integrity & Development Philosophy

ProofBox 2.0 has been initialized as an integrated, production-quality local demonstration baseline. To ensure complete academic integrity and prepare every student for independent viva examinations and faculty evaluations, project ownership is partitioned across five distinct engineering domains.

No artificial Git histories or falsified past commits are manufactured. Each student owns their technical domain, understands the underlying architectural mechanisms, and is assigned concrete, code-level future deliverables to implement, test, and defend.

---

## 2. Team Member Ownership Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Paidipelly Vishwa Teja                            │
│                 Team Lead & Integration Engineer                       │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
         ┌─────────┴─────────┐             ┌─────────┴─────────┐
         │  Kuchana Vyshnavi │             │   Arpula Anjali   │
         │  Auth & Security  │             │  Frontend & UI/UX │
         └─────────┬─────────┘             └─────────┬─────────┘
                   │                                 │
         ┌─────────┴─────────┐             ┌─────────┴─────────┐
         │   Adapala Vamshi  │             │   Jetti Mukesh    │
         │  Backend & Mongoose│             │ Warranty & Receipt│
         └───────────────────┘             └───────────────────┘
```

---

### Member 1: Paidipelly Vishwa Teja
- **Role:** Team Lead & Integration Engineer
- **Assigned Branch:** `feature/integration`
- **Core Domain:** End-to-end architecture, process orchestration, cross-service coordination, environment stabilization, test harness execution, production build pipelines.
- **Key Codebase Touchpoints:**
  - `package.json` (root workspace coordination)
  - `scripts/start-all.sh` (macOS process lifecycle & daemon supervision)
  - `frontend/vite.config.js` (proxy configuration, port harmonization)
  - `backend/src/server.js` (graceful shutdown, signal management)
  - `docs/ARCHITECTURE.md`, `README.md`
- **Viva Defense Competencies:**
  - Architecture trade-offs between monolithic MERN vs. microservices.
  - Port conflict resolution on macOS (ControlCenter AirPlay port 5000 vs. port 5001).
  - Cross-Origin Resource Sharing (CORS) credentials and preflight request flow.

---

### Member 2: Kuchana Vyshnavi
- **Role:** Authentication & Security Developer
- **Assigned Branch:** `feature/authentication`
- **Core Domain:** User lifecycle, identity verification, cryptographic password hashing, JWT token generation & verification, HTTP-only cookie security, rate limiting, and route protection.
- **Key Codebase Touchpoints:**
  - `backend/src/controllers/authController.js` (registration, login, profile, logout)
  - `backend/src/middleware/auth.js` (JWT Bearer & Cookie extractor, token verification)
  - `backend/src/middleware/rateLimiter.js` (brute-force defense)
  - `backend/src/models/User.js` (Bcrypt salt rounds, password hash validation)
  - `frontend/src/context/AuthContext.jsx` (client-side auth state & token persistence)
  - `frontend/src/components/ProtectedRoute.jsx` (client route guards)
- **Viva Defense Competencies:**
  - Bcrypt hashing algorithm vs. SHA-256 (adaptive work factor against GPU cracking).
  - JWT structure (Header, Payload, Signature) and HMAC-SHA256 signing mechanics.
  - Defense against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).

---

### Member 3: Arpula Anjali
- **Role:** Frontend & UI/UX Developer
- **Assigned Branch:** `feature/frontend-dashboard`
- **Core Domain:** Apple-inspired responsive user experience, design token architecture, editorial layout hierarchies, client routing, search/filter UX, and interactive micro-interactions.
- **Key Codebase Touchpoints:**
  - `frontend/src/index.css` (Apple design tokens, light theme palette, typography scale)
  - `frontend/src/components/Navbar.jsx` (top sticky horizontal navigation)
  - `frontend/src/components/Sidebar.jsx` (mobile slide-out drawer)
  - `frontend/src/pages/DashboardPage.jsx` (editorial metrics, radar, vault distribution)
  - `frontend/src/pages/PurchasesPage.jsx` (product collection, grid/table view toggle)
  - `frontend/src/components/PurchaseCard.jsx` (product-first card composition)
  - `frontend/src/components/PurchaseTable.jsx` (responsive data table)
- **Viva Defense Competencies:**
  - CSS custom properties (variables) for scalable design systems and themes.
  - Component lifecycle, React Router DOM v6 declarative routing, and URL query params.
  - Debounced search filtering to prevent client-side render thrashing.

---

### Member 4: Adapala Vamshi Krishna
- **Role:** Backend & MongoDB Developer
- **Assigned Branch:** `feature/backend-database`
- **Core Domain:** Database schema modeling, Mongoose ODM lifecycle hooks, RESTful API controllers, input validation schemas, database index strategy, and query performance.
- **Key Codebase Touchpoints:**
  - `backend/src/models/PurchaseRecord.js` (schema definition, types, validators, compound indexes)
  - `backend/src/controllers/purchaseController.js` (CRUD operations, pagination, search queries)
  - `backend/src/controllers/dashboardController.js` (MongoDB aggregation pipelines)
  - `backend/src/middleware/validate.js` (request body sanitization and constraints)
  - `backend/src/config/db.js` (MongoDB connection pool management)
- **Viva Defense Competencies:**
  - MongoDB compound indexing (`{ ownerId: 1, warrantyExpiryDate: 1 }`) for fast range queries.
  - Strict ownership isolation to prevent Insecure Direct Object References (IDOR).
  - Mongoose aggregation pipelines vs. in-memory filtering.

---

### Member 5: Jetti Mukesh
- **Role:** Warranty & Receipt Developer
- **Assigned Branch:** `feature/warranty-receipts`
- **Core Domain:** Warranty date arithmetic, leap-year and month-end boundary handling, expiration status algorithms, 30-day window intelligence, receipt file uploads, and document security.
- **Key Codebase Touchpoints:**
  - `backend/src/utils/warrantyCalculator.js` (core calculation engine, status categorizer)
  - `backend/src/controllers/receiptController.js` (Multer upload pipeline, MIME verification)
  - `backend/src/routes/receiptRoutes.js` (upload route protection)
  - `frontend/src/pages/WarrantyTrackerPage.jsx` (timeline progress bars, status sorting)
  - `frontend/src/pages/ExpiringSoonPage.jsx` (inclusive 30-day radar, claim checklists)
  - `frontend/src/pages/ReceiptVaultPage.jsx` (document gallery, PDF preview)
  - `frontend/src/components/ReceiptModal.jsx` (document lightbox viewer)
- **Viva Defense Competencies:**
  - Calendar math edge cases: February 29 leap years, 30-day vs. 31-day month rollovers.
  - Timezone neutrality: why UTC 23:59:59.999 is used and how client timezone skew is avoided.
  - Secure file handling: Multer disk storage, extension whitelisting, and file size limits.

