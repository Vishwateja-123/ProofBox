# ProofBox — System Architecture Documentation

**Institution:** SR University  
**Project:** ProofBox — Warranty & Receipt Vault  
**Author:** Paidipelly Vishwateja  

---

## 1. High-Level Architecture Overview

ProofBox is built using a modern, decoupled **MERN (MongoDB, Express.js, React, Node.js)** full-stack architecture running natively on Apple Silicon (macOS arm64).

```mermaid
graph TD
    User([User / Web Browser]) -->|HTTP / React Router| Frontend[React 18 + Vite SPA Client]
    Frontend -->|REST APIs + JWT Cookies/Headers| Backend[Express.js REST API Server]
    
    subgraph Frontend Tier [Frontend Tier (Port 5173)]
        Pages[Pages: Dashboard, Purchases, Vault, Tracker]
        Context[Context: AuthContext, ToastContext]
        Services[Services: api.js, purchaseService.js]
        CSS[Vanilla CSS Design System + Plus Jakarta Sans]
    end

    subgraph Backend Tier [Backend Tier (Port 5001)]
        Middleware[Middleware: Helmet, CORS, RateLimiter, Auth, Validation]
        Controllers[Controllers: auth, purchase, dashboard, receipt]
        Engine[Authoritative Warranty Calculation Engine]
        Models[Mongoose Models: User, PurchaseRecord]
        Uploads[(Local File Storage: backend/uploads)]
    end

    subgraph Database Tier [Database Tier (Port 27017)]
        Mongo[(MongoDB Database 'proofbox')]
    end

    Backend --> Models
    Controllers --> Engine
    Controllers --> Uploads
    Models --> Mongo
```

---

## 2. Frontend Tier Architecture

The frontend is implemented with **React 18** bundled using **Vite 5**:

1. **Routing & Code Organization (`react-router-dom v6`)**:
   - `ProtectedRoute` wrapper guarding all private application pages.
   - Distinct views for Dashboard, All Purchases, Add Purchase, Edit Purchase, Purchase Details, Warranty Tracker, Expiring Soon, Receipt Vault, and Profile.
2. **State Management**:
   - `AuthContext`: Manages current user session, persistent token verification against `/api/auth/profile`, and automatic logout upon session expiry.
   - `ToastContext`: High-visibility notification dispatching animated toasts for success, error, and validation warnings.
3. **Design System & Aesthetics (`index.css`)**:
   - Handcrafted modern SaaS dark theme with curated HSL slate tokens (`#0b0f19`, `#111827`, `#1a2234`).
   - Radiant status color indicators (Emerald `#10b981` for Active, Amber `#f59e0b` for Expiring Soon, Rose `#f43f5e` for Expired).
   - Glassmorphism overlays (`backdrop-filter: blur(12px)`) and micro-animations.
   - Google Font: Plus Jakarta Sans for high-legibility enterprise typography.
4. **Vite Development Reverse Proxy**:
   - Configured in `vite.config.js` to route `/api` and `/uploads` directly to `http://localhost:5001`. Prevents cross-origin credential issues in development while mirroring production reverse-proxy semantics.

---

## 3. Backend Tier Architecture

The backend is built with **Node.js v25 (LTS compatible)** and **Express.js v4**:

1. **Security & Middleware Stack**:
   - `helmet`: Sets HTTP security headers (CSP, HSTS, X-Frame-Options, Cross-Origin-Resource-Policy).
   - `cors`: Strict origin validation against `http://localhost:5173` with credentials support.
   - `express-rate-limit`: Brute-force protection on authentication routes (100 req / 15 min) and API abuse rate limiter (1000 req / 15 min).
   - `cookie-parser`: Signed HttpOnly cookie parsing.
   - `validate.js`: Centralized request validation middleware for registration, login, and purchase payloads.
   - `errorHandler.js`: Normalized JSON error formatting capturing Mongoose CastErrors, duplicate keys, and validation errors.
2. **Authoritative Expiration Engine (`warrantyCalculator.js`)**:
   - Solves the JavaScript date rollover bug (e.g. January 31 + 1 month overflowing into March).
   - Enforces calendar-month clamping (Jan 31 + 1 month in leap year 2024 = Feb 29; in non-leap year 2023 = Feb 28).
   - Uses UTC midnight date normalization to eliminate timezone daylight savings discrepancies.
   - Authoritative backend calculation runs both in Mongoose pre-validate hooks and dynamically on queries.
3. **Receipt Management Pipeline**:
   - Supports direct external web URLs (CDN images, Google Drive links, AWS S3 links, PDF links).
   - Supports local MacBook file uploads via `multer` storing into `/backend/uploads` with MIME type enforcement (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) and size capping (10 MB).

---

## 4. Data Security & Multi-Tenant Isolation

1. **Password Security**: Passwords hashed using Bcrypt with 10 salt rounds (`bcryptjs`).
2. **JWT Token Signing**: Signed using HMAC-SHA256 with 7-day expiration.
3. **Strict User Scoping**: Every MongoDB query strictly enforces `{ ownerId: req.user._id }`.
4. **Zero Client Trust**: Ownership IDs sent from the client are discarded; ownership is exclusively derived from the verified JWT payload.
