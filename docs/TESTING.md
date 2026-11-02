# ProofBox 2.0 — Automated Testing & Verification Documentation

**Institution:** SR University  
**Project:** ProofBox — Warranty & Receipt Vault  
**Test Frameworks:** Node.js Native Test Runner (`node:test`, `node:assert/strict`), Supertest, Vitest, React Testing Library  
**Overall Test Status:** 44 Passed, 0 Failed (100% Pass Rate)

---

## 1. Test Suite Summary

| Layer | Test Suite File | Type | Tests | Status | Execution Duration |
|-------|-----------------|------|-------|--------|--------------------|
| **Backend** | `backend/tests/warranty.test.js` | Unit Tests | 11 | ✅ PASS | ~5 ms |
| **Backend** | `backend/tests/auth.test.js` | API Integration | 8 | ✅ PASS | ~250 ms |
| **Backend** | `backend/tests/purchase.test.js` | CRUD & Search | 11 | ✅ PASS | ~160 ms |
| **Backend** | `backend/tests/authorization.test.js` | Data Isolation | 5 | ✅ PASS | ~200 ms |
| **Frontend** | `frontend/src/test/dateUtils.test.js` | Unit Tests (incl. UTC anniversary invariance) | 6 | ✅ PASS | ~45 ms |
| **Frontend** | `frontend/src/test/WarrantyBadge.test.jsx` | UI Component | 3 | ✅ PASS | ~35 ms |
| **Total** | **All Automated Test Suites** | — | **44** | **✅ 100% PASS** | **< 2.5s** |

---

## 2. Test Suites Detailed Coverage

### 2.1 Warranty Calculator Unit Tests (`warranty.test.js`)
- ✔ Correctly calculates expiry for standard 12-month duration.
- ✔ Correctly handles leap year February (`2024-01-31` + 1 month = `2024-02-29`).
- ✔ Correctly handles non-leap year February (`2023-01-31` + 1 month = `2023-02-28`).
- ✔ Correctly handles 31-day month to 30-day month rollover (March 31 -> April 30).
- ✔ Correctly handles 0-month warranty (expires on purchase date at end of day).
- ✔ Throws an error for invalid date input.
- ✔ Identifies active warranty when days remaining > 30.
- ✔ Identifies expiring-soon status at exactly 30 days remaining (inclusive).
- ✔ Identifies expiring-soon status at zero days remaining (today).
- ✔ Identifies expired status when days remaining < 0.
- ✔ `augmentPurchaseWithWarranty` correctly enhances purchase object with computed status flags.

### 2.2 Authentication API Tests (`auth.test.js`)
- ✔ `POST /api/auth/register` — Registers new user and verifies password hash is never exposed.
- ✔ `POST /api/auth/register` — Rejects duplicate email registration with `409 Conflict`.
- ✔ `POST /api/auth/register` — Validates email format and minimum password length (6 chars).
- ✔ `POST /api/auth/login` — Successfully authenticates valid credentials.
- ✔ `POST /api/auth/login` — Rejects incorrect passwords with `401 Unauthorized`.
- ✔ `GET /api/auth/profile` — Accesses protected user profile with valid Bearer token.
- ✔ `GET /api/auth/profile` — Rejects unauthenticated requests with `401 Unauthorized`.
- ✔ `POST /api/auth/logout` — Logs out and clears authentication cookie.

### 2.3 Purchase CRUD & Search Tests (`purchase.test.js`)
- ✔ `GET /api/health` — Verifies Express server and MongoDB live status.
- ✔ `POST /api/purchases` — Creates valid purchase record with calculated authoritative expiry.
- ✔ `POST /api/purchases` — Rejects negative price and malformed dates with `400 Bad Request`.
- ✔ `GET /api/purchases` — Retrieves paginated purchase records with metadata.
- ✔ `GET /api/purchases/:id` — Retrieves single purchase record by valid ID.
- ✔ `GET /api/purchases/:id` — Rejects invalid hexadecimal MongoDB ID with `400 Bad Request`.
- ✔ `PATCH /api/purchases/:id` — Updates purchase price and duration; verifies expiry recalculation.
- ✔ `GET /api/purchases?search=Sony` — Case-insensitive search across product names and sellers.
- ✔ `GET /api/purchases/expiring` — Correctly routes and returns records in 30-day window.
- ✔ `GET /api/dashboard/summary` — Generates aggregated KPI counts and total spend sums.
- ✔ `DELETE /api/purchases/:id` — Deletes purchase and verifies subsequent 404.

### 2.4 Cross-User Data Isolation Tests (`authorization.test.js`)
- ✔ User B cannot view User A's private purchase by ID (returns `404 Not Found`).
- ✔ User B cannot modify User A's private purchase (returns `404 Not Found`).
- ✔ User B cannot delete User A's private purchase (returns `404 Not Found`).
- ✔ User B's purchase list does not expose User A's records.
- ✔ User B cannot discover User A's items via search queries.

### 2.5 Frontend Date and Badge Tests (`dateUtils.test.js` & `WarrantyBadge.test.jsx`)
- ✔ Formats valid dates to readable string.
- ✔ Preserves exact calendar date for UTC end-of-day warranty expiries without timezone day shift (prevents the +1 day rollover in timezones east of UTC).
- ✔ Handles invalid or empty dates gracefully (`—`).
- ✔ Formats numbers into INR currency representation.
- ✔ Calculates local expiry date and status correctly for 12 months.
- ✔ Handles month-end clamping (Jan 31 + 1 mo in leap year 2024 -> Feb 29).
- ✔ Renders Active badge with days remaining.
- ✔ Renders Expiring Soon badge within 30 days.
- ✔ Renders Expired badge when past warranty period.

---

## 3. How to Run the Tests

### 3.1 Run All Tests (Backend + Frontend)
```bash
npm test
```

### 3.2 Run Backend Tests Only
```bash
npm run test:backend
# Or directly:
cd backend && npm test
```

### 3.3 Run Frontend Tests Only
```bash
npm run test:frontend
# Or directly:
cd frontend && npm test
```

---

## 4. Production Build Verification

```bash
npm run build
```
Build output:
```text
vite v5.4.21 building for production...
dist/index.html                   1.02 kB │ gzip:  0.55 kB
dist/assets/index-wEz8InF5.css   15.75 kB │ gzip:  3.70 kB
dist/assets/index-CERhte8e.js   289.68 kB │ gzip: 76.49 kB
✓ built in 751ms
```
