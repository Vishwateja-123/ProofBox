# ProofBox 2.0 — GitHub Collaboration & Academic Contribution Plan

> **CRITICAL NOTE:** In accordance with university development safety protocols, all active development is currently maintained **locally on the primary machine**. No remote Git operations (`git commit`, `git push`, `git merge`) will be executed until explicitly authorized by the project lead. This document outlines the pre-planned workflow for future multi-developer collaboration.

---

## 1. Collaborative Git Branching Strategy

When remote GitHub collaboration is initiated, the team will follow a strict **Feature Branch Workflow** based on `main`:

```
main (Production Baseline — Protected)
  │
  ├── feature/integration          (Member 1: Paidipelly Vishwa Teja)
  ├── feature/authentication       (Member 2: Kuchana Vyshnavi)
  ├── feature/frontend-dashboard   (Member 3: Arpula Anjali)
  ├── feature/backend-database     (Member 4: Adapala Vamshi Krishna)
  └── feature/warranty-receipts    (Member 5: Jetti Mukesh)
```

### Branch Rules:
1. `main` is protected: direct commits to `main` are prohibited.
2. Every feature branch is branched directly from the verified `main` baseline.
3. Every student works solely on their designated branch.
4. Pull requests must pass automated tests (`npm test`) and receive at least one peer review before merging.

---

## 2. Step-by-Step GitHub Onboarding Workflow (When Authorized)

### Step 1: Clone and Branch
```bash
git clone <repository-url>
cd ProofBox
git checkout main
git pull origin main

# Switch to your assigned feature branch
git checkout -b feature/<assigned-feature-name>
```

### Step 2: Local Verification Before Editing
Before writing new code, verify the working baseline:
```bash
npm install
npm test
npm run build
```

### Step 3: Implement Assigned Tasks & Make Meaningful Commits
Make small, frequent, descriptive commits adhering to Conventional Commits:

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New functionality | `feat(auth): add real-time password strength meter` |
| `fix` | Bug resolution | `fix(warranty): resolve timezone skew in expiry calculation` |
| `test` | Automated test suites | `test(api): add NoSQL injection integration test` |
| `docs` | Documentation update | `docs(database): document compound index selectivity` |
| `style` | Formatting & CSS | `style(ui): refine product card typography and focus rings` |

### Step 4: Run Tests Locally Before Pushing
```bash
# Verify all backend and frontend tests pass
npm test

# Verify production bundle compiles
npm run build
```

### Step 5: Push Branch & Open Pull Request
```bash
git push -u origin feature/<assigned-feature-name>
```
Open a GitHub Pull Request against `main` including:
- Summary of changes implemented.
- Files modified.
- Screenshots of UI changes (if applicable).
- Test execution output.

---

## 3. Code Review & Verification Gatekeeper

Every Pull Request must be reviewed by the Team Lead or assigned peer reviewer:

### Reviewer Checklist:
- [ ] Does the code adhere to the established project coding style?
- [ ] Are all database operations scoped with `{ ownerId: req.user._id }`?
- [ ] Are secrets or credentials absent from code, comments, and logs?
- [ ] Do all 44 automated tests pass without regressions?
- [ ] Does `npm run build` compile cleanly without warnings or errors?

---

## 4. University Evaluation & Viva Presentation Division

During the SR University project demonstration, presentation responsibilities are divided according to domain ownership:

| Student | Presentation Topic | Live Demonstration Segment |
|---------|--------------------|----------------------------|
| **Paidipelly Vishwa Teja** | Architecture Overview, MERN Integration, Port Management | System startup, health check endpoint, overall architecture |
| **Kuchana Vyshnavi** | Security Architecture, Bcrypt, JWT Cookies | Registration, Login, Protected routes, Logout |
| **Arpula Anjali** | UI/UX Design System, Apple Aesthetic, Responsive Layout | Homepage editorial metrics, Product collection, Search & filters |
| **Adapala Vamshi Krishna** | MongoDB Schemas, Mongoose ODM, Query Performance | Product CRUD, MongoDB database verification, Data isolation |
| **Jetti Mukesh** | Warranty Calculator, Expiry Math, Receipt Vault | Adding purchase, live expiry preview, 30-day radar, Receipt modal |

