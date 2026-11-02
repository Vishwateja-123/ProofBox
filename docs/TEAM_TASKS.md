# ProofBox 2.0 — Concrete Student Development Tasks & Code Assignments

This document specifies the exact code-level tasks for each student. Each task is grounded in real files within the ProofBox repository, with concrete steps, testing criteria, and academic defense notes.

---

## Member 1: Paidipelly Vishwa Teja (Team Lead & Integration)

### Task 1.1: Automated Health Check Telemetry & System Status Indicator
- **Objective:** Enhance the client-side navbar to periodically poll the backend health endpoint (`/api/health`) and display a subtle, real-time database connectivity indicator.
- **Files Involved:**
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/services/api.js`
  - `backend/src/app.js`
- **Implementation Steps:**
  1. Add a background polling hook (60s interval) in `Navbar.jsx` that queries `/api/health`.
  2. Render an accessible status dot in the header (green for healthy, amber for degraded/disconnected).
  3. Ensure network disconnections fail silently without blocking client navigation.
- **Testing Criteria:**
  - When MongoDB is running, indicator displays green "Operational".
  - If MongoDB is stopped, indicator turns amber without throwing unhandled React runtime errors.

### Task 1.2: Cross-Platform Process Supervision Script (Windows & Linux Support)
- **Objective:** Provide a PowerShell and cross-platform start script alongside `scripts/start-all.sh` to allow teammates running Windows or Linux to execute the full stack with one command.
- **Files Involved:**
  - `scripts/start-all.ps1`
  - `package.json`
  - `README.md`
- **Implementation Steps:**
  1. Create `scripts/start-all.ps1` handling port checks, MongoDB verification, and dual background server launching on Windows.
  2. Add `"dev:win": "powershell -ExecutionPolicy Bypass -File scripts/start-all.ps1"` to root `package.json`.
  3. Document Windows setup in `README.md`.
- **Testing Criteria:**
  - Windows teammate can execute `npm run dev:win` and launch both frontend (5173) and backend (5001).

### Task 1.3: Continuous Integration & Production Build Gatekeeper
- **Objective:** Configure an npm script pipeline verifying test suites and bundle builds before any branch merge.
- **Files Involved:**
  - `package.json`
  - `frontend/vite.config.js`
- **Implementation Steps:**
  1. Create `"verify": "npm run test && npm run build"` in root `package.json`.
  2. Ensure non-zero exit codes block deployment if any unit test fails.
- **Testing Criteria:**
  - Running `npm run verify` exits with code 0 only when all 44 tests pass and Vite dist bundles successfully.

---

## Member 2: Kuchana Vyshnavi (Authentication & Security)

### Task 2.1: Password Strength Indicator & Real-Time Client Validation
- **Objective:** Add a real-time visual strength meter on the registration screen enforcing NIST/OWASP password criteria (length >= 8, mixed case, numbers, special characters).
- **Files Involved:**
  - `frontend/src/pages/RegisterPage.jsx`
  - `backend/src/middleware/validate.js`
  - `frontend/src/index.css`
- **Implementation Steps:**
  1. Create a password strength evaluator function calculating entropy score (0 to 4).
  2. Render a 4-segment progress bar below the password field with dynamic color feedback.
  3. Update backend validation in `validate.js` to ensure server-side parity.
- **Testing Criteria:**
  - Weak passwords (e.g., `123456`) are rejected with clear user guidance.
  - Strong passwords render green "Strong Password" confirmation.

### Task 2.2: Profile Password Change & Re-Authentication Endpoint
- **Objective:** Enable logged-in users to securely update their password from the Account settings page with verification of their existing password.
- **Files Involved:**
  - `backend/src/controllers/authController.js`
  - `backend/src/routes/authRoutes.js`
  - `frontend/src/pages/ProfilePage.jsx`
  - `frontend/src/services/authService.js`
- **Implementation Steps:**
  1. Implement `POST /api/auth/change-password` requiring `currentPassword` and `newPassword`.
  2. Compare `currentPassword` hash using `User.comparePassword()`.
  3. Hash `newPassword` with Bcrypt and update the database document.
  4. Add an edit modal or password section on `ProfilePage.jsx`.
- **Testing Criteria:**
  - Incorrect current password returns 401 Unauthorized.
  - Successful update allows login with new password and invalidates old credentials.

### Task 2.3: Automated Authentication Security Regression Suite
- **Objective:** Expand the automated security tests to verify protection against SQL/NoSQL injection in the login query.
- **Files Involved:**
  - `backend/tests/auth.test.js`
- **Implementation Steps:**
  1. Add tests attempting NoSQL injection payloads in the email field (e.g., `{"$ne": null}`).
  2. Verify that Mongoose and type validation reject or sanitize the object, returning 400 Bad Request instead of logging in.
- **Testing Criteria:**
  - Test passes asserting `res.status === 400` and no unauthorized JWT is issued.

---

## Member 3: Arpula Anjali (Frontend & UI/UX Developer)

### Task 3.1: Category-Specific SVG Badges & High-DPI Category Illustrations
- **Objective:** Replace generic text tags with original, Apple-style category iconography across all product cards and the product details view.
- **Files Involved:**
  - `frontend/src/components/PurchaseCard.jsx`
  - `frontend/src/pages/PurchaseDetailsPage.jsx`
  - `frontend/src/components/CategoryIcon.jsx` (New Component)
  - `frontend/src/index.css`
- **Implementation Steps:**
  1. Create a reusable `CategoryIcon.jsx` component mapping categories (Electronics, Appliances, Vehicles, Furniture, etc.) to Lucide icons with subtle tinted backgrounds.
  2. Integrate the component into `PurchaseCard.jsx`, `PurchaseTable.jsx`, and `PurchaseDetailsPage.jsx`.
- **Testing Criteria:**
  - Each product card renders a distinctive, elegant category badge with consistent alignment and padding.

### Task 3.2: Keyboard Accessibility & Focus Rings (WCAG 2.1 AA Compliance)
- **Objective:** Audit and implement visible, high-contrast keyboard navigation rings and ARIA attributes for all interactive elements.
- **Files Involved:**
  - `frontend/src/index.css`
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/components/PurchaseCard.jsx`
  - `frontend/src/components/ReceiptModal.jsx`
- **Implementation Steps:**
  1. Define `:focus-visible` styles with a 2px offset ring (`--primary`) in `index.css`.
  2. Add `aria-expanded` and `aria-controls` to the mobile drawer toggle in `Navbar.jsx`.
  3. Implement Escape key handling on `ReceiptModal.jsx` and `DeleteConfirmModal.jsx`.
- **Testing Criteria:**
  - User can navigate through the entire interface using `Tab`, `Shift+Tab`, `Enter`, and `Escape` keys with clear focus visibility.

### Task 3.3: Empty State Illustrations & Quick Actions
- **Objective:** Polish the empty states across My Products, Expiring Soon, and Receipt Vault with friendly, action-oriented messaging.
- **Files Involved:**
  - `frontend/src/pages/PurchasesPage.jsx`
  - `frontend/src/pages/ExpiringSoonPage.jsx`
  - `frontend/src/pages/ReceiptVaultPage.jsx`
- **Implementation Steps:**
  1. Standardize `.empty-state` styling with Apple-style rounded icon circles, subtle borders, and prominent CTA buttons.
  2. Provide clear differential copy for filtered vs. zero-record empty states.
- **Testing Criteria:**
  - Filtering by a non-existent product shows "Clear Filters" CTA.
  - Zero purchases state shows "Add Your First Product" CTA.

---

## Member 4: Adapala Vamshi Krishna (Backend & MongoDB Developer)

### Task 4.1: Component-Level Warranty Schema & Sub-Document Support
- **Objective:** Extend the Mongoose `PurchaseRecord` schema to support optional component-level warranties (e.g., refrigerator compressor, washing machine motor).
- **Files Involved:**
  - `backend/src/models/PurchaseRecord.js`
  - `backend/src/controllers/purchaseController.js`
  - `backend/tests/purchase.test.js`
- **Implementation Steps:**
  1. Add an optional sub-document array `components: [{ name: String, warrantyMonths: Number, warrantyExpiryDate: Date, notes: String }]` to `PurchaseRecord.js`.
  2. Implement an automatic pre-validate hook calculating `warrantyExpiryDate` for each component sub-document.
  3. Ensure complete backward compatibility so existing records without components remain valid.
- **Testing Criteria:**
  - Creating a record with component warranties calculates and persists each component's expiry.
  - Fetching the record returns the populated component sub-documents.

### Task 4.2: High-Performance Compound Database Indexing & Query Benchmarking
- **Objective:** Optimize MongoDB query execution plans for large vaults using compound indexes on `ownerId`, `category`, and `warrantyExpiryDate`.
- **Files Involved:**
  - `backend/src/models/PurchaseRecord.js`
  - `docs/DATABASE.md`
- **Implementation Steps:**
  1. Add compound indexes:
     - `purchaseRecordSchema.index({ ownerId: 1, warrantyExpiryDate: 1 });`
     - `purchaseRecordSchema.index({ ownerId: 1, category: 1 });`
     - `purchaseRecordSchema.index({ ownerId: 1, productName: 'text', seller: 'text' });`
  2. Document index selectivity and execution explain plans in `docs/DATABASE.md`.
- **Testing Criteria:**
  - MongoDB `explain('executionStats')` confirms queries use `IXSCAN` rather than `COLLSCAN`.

### Task 4.3: Automated Database Maintenance & Orphan Document Cleanup Routine
- **Objective:** Implement a database maintenance script verifying referential integrity and ensuring no orphan records exist.
- **Files Involved:**
  - `backend/src/scripts/dbAudit.js` (New Script)
  - `package.json`
- **Implementation Steps:**
  1. Create a read-only script querying `purchaserecords` and verifying that every `ownerId` maps to an existing document in `users`.
  2. Output an audit table displaying record counts, storage size, and index health.
- **Testing Criteria:**
  - Running `node backend/src/scripts/dbAudit.js` completes without errors and prints vault statistics.

---

## Member 5: Jetti Mukesh (Warranty & Receipt Developer)

### Task 5.1: Export Vault Data to CSV / JSON Backup
- **Objective:** Allow users to export their complete product and warranty inventory as a structured CSV or JSON backup.
- **Files Involved:**
  - `backend/src/controllers/purchaseController.js`
  - `backend/src/routes/purchaseRoutes.js`
  - `frontend/src/pages/PurchasesPage.jsx`
  - `frontend/src/services/purchaseService.js`
- **Implementation Steps:**
  1. Add `GET /api/purchases/export?format=csv` endpoint generating a downloadable CSV file with headers (`Product Name`, `Category`, `Seller`, `Purchase Date`, `Price`, `Warranty Expiry`, `Days Remaining`, `Status`).
  2. Add an "Export Vault" button on the `PurchasesPage.jsx` toolbar.
- **Testing Criteria:**
  - Clicking "Export Vault" downloads a valid CSV file containing all records owned by the logged-in user.

### Task 5.2: Receipt Upload Drag-and-Drop Dropzone with Live Preview
- **Objective:** Upgrade the receipt file upload from a basic file input to an interactive drag-and-drop dropzone with instant client-side thumbnail preview.
- **Files Involved:**
  - `frontend/src/pages/AddPurchasePage.jsx`
  - `frontend/src/pages/EditPurchasePage.jsx`
  - `frontend/src/index.css`
- **Implementation Steps:**
  1. Implement HTML5 dragover, dragleave, and drop event listeners on the receipt upload box.
  2. Use `URL.createObjectURL(file)` to generate an instant image thumbnail before upload finishes.
  3. Provide a clear "Remove" button allowing users to clear or re-select files.
- **Testing Criteria:**
  - Dragging a receipt image onto the dropzone highlights the border and renders the image preview upon drop.

### Task 5.3: Automated Leap-Year & Month-End Boundary Unit Test Suite
- **Objective:** Expand unit test coverage for `warrantyCalculator.js` to assert century leap year rules (e.g., Year 2000 vs. Year 2100) and daylight saving neutrality.
- **Files Involved:**
  - `backend/tests/warranty.test.js`
  - `docs/TESTING.md`
- **Implementation Steps:**
  1. Add test cases asserting leap century calculations (Feb 29, 2024; Feb 29, 2000).
  2. Assert that duration = 0 expires on the exact purchase calendar date in UTC.
  3. Assert that inclusive 30-day window accurately classifies item on day 30 vs. day 31.
- **Testing Criteria:**
  - All new test cases pass with `node --test backend/tests/warranty.test.js`.

