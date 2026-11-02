# ProofBox — Team Contributions & Project Responsibilities

**Institution:** SR University  
**Academic Year:** 2026  
**Course:** Full-Stack Web Development Mini-Project  
**Project:** ProofBox — Warranty & Receipt Vault (Team 3)  

---

## 1. Project Lead & Core Development

### Paidipelly Vishwateja (Lead Full-Stack Developer & Software Architect)
- **Architecture & System Design:**
  - Designed the end-to-end MERN architecture (React 18 SPA + Express.js REST API + MongoDB Mongoose ODM).
  - Designed the authoritative date-calculation engine in `warrantyCalculator.js`, resolving date rollover and leap-year edge cases.
- **Backend Engineering:**
  - Implemented the modular Express API server, routes, controllers, and middleware (`auth.js`, `validate.js`, `errorHandler.js`, `rateLimiter.js`).
  - Configured secure password hashing using Bcrypt and dual JWT authentication (Authorization Bearer headers and HttpOnly signed cookies).
  - Implemented MongoDB Mongoose schemas (`User`, `PurchaseRecord`) with pre-validate recalculation hooks and compound query indexes.
  - Implemented receipt document upload pipeline with `multer` and MIME type verification.
- **Frontend Engineering:**
  - Created the complete responsive React application using Vite.
  - Handcrafted the dark-mode CSS design system in `index.css` with Plus Jakarta Sans typography, status color badges, and micro-animations.
  - Built 10 core pages: Dashboard, All Purchases, Add Purchase, Edit Purchase, Purchase Details, Warranty Tracker, Expiring Soon Action Center, Receipt Vault, Profile, and Login/Registration.
  - Developed real-time warranty preview calculation in add/edit forms.
- **Quality Assurance & DevOps:**
  - Authored 35 automated backend unit/integration tests and 8 frontend component/utility tests.
  - Verified 100% test pass rate across Node.js v25 native runner and Vitest.
  - Resolved macOS Apple Silicon AirPlay port 5000 conflict by standardizing backend on port 5001.
  - Authored automated database seed scripts, live E2E verification suites, and university technical documentation.

---

## 2. University Submission Deliverables Checklist

- [x] Complete source code (Frontend React SPA + Backend Express REST API)
- [x] Working MongoDB Mongoose database models & indexes
- [x] Complete REST API documentation (`docs/API.md`)
- [x] Database architecture & schema specification (`docs/DATABASE.md`)
- [x] Full-stack architecture & security documentation (`docs/ARCHITECTURE.md`)
- [x] Comprehensive test strategy & execution logs (`docs/TESTING.md`)
- [x] Live demonstration script & step-by-step walkthrough (`docs/DEMO.md`)
- [x] Environment configuration template (`backend/.env.example`)
- [x] Root execution & automated startup scripts (`scripts/start-all.sh`, `scripts/seed.js`)
