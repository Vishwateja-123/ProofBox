# ProofBox 2.0 — Live Demonstration & Evaluator Presentation Guide

**Institution:** SR University  
**Department:** Computer Science & Engineering  
**Project:** ProofBox 2.0 — Warranty & Receipt Vault  
**Demonstration Time:** ~10–15 Minutes  
**Audience:** University Evaluation Committee & External Evaluators  

---

## 1. Quick Startup & Demonstration URLs

Before the demonstration, verify that the services are active:

```bash
# Verify services are running locally
curl -s http://localhost:5001/api/health
# If not started, run:
npm run dev
```

| Service | Local Address | Description |
|---------|---------------|-------------|
| **Frontend Web App** | `http://localhost:5173` | React 18 / Vite Single Page Application |
| **Backend REST API** | `http://localhost:5001/api` | Express.js REST API Server |
| **Health Endpoint** | `http://localhost:5001/api/health` | Real Express & MongoDB connectivity status |
| **Demo Account** | `demo@proofbox.com` | Password: `DemoPassword123!` |

---

## 2. Step-by-Step Evaluator Walkthrough

### Step 1: System Health & Architecture Verification
1. Open browser to `http://localhost:5001/api/health`.
2. **Explain to Evaluators:**
   - Demonstrates a live Express server and active connection to MongoDB (`"database": {"status": "connected", "name": "proofbox"}`).
   - Port 5001 is used on macOS to prevent port 5000 collisions with native Apple AirPlay receiver.

---

### Step 2: Apple-Inspired Authentication Experience
1. Navigate to `http://localhost:5173/login`.
2. **Visual Highlight:**
   - Completely removes the generic dark template.
   - Editorial split-screen desktop layout: left side features ProofBox brand storytelling and security guarantees; right side contains a focused white authentication card with SF-inspired typography.
3. Click the **"Fill Demo Credentials (Local Dev)"** button.
4. Click **"Sign In"**.
5. **Technical Highlights for Viva:**
   - Password is never stored in plain text (Bcrypt with 10 salt rounds).
   - Dual authentication token: Bearer Authorization header and secure signed cookies.

---

### Step 3: Product-First Homepage (Overview)
1. Upon login, the user lands on the **Overview** page (`/`).
2. **Visual & Functional Highlights:**
   - Hero headline: **"Everything you own. Beautifully protected."**
   - Editorial metrics: **Protected Value** (₹4,57,270), **Active Warranties** (3), **Expiring Soon** (3), and **Expired Coverage** (1).
   - **Action Recommended Banner:** Highlights 3 items with warranties expiring within the inclusive 30-day window.
   - **Warranty Radar:** Real-time countdown list showing upcoming expirations.
   - **Vault Distribution:** Category breakdown showing asset allocation across Electronics, Appliances, Furniture, etc.
   - **Recently Added to Vault:** Grid of recently protected purchases.

---

### Step 4: Top Horizontal Navigation
1. Point out the top sticky horizontal navigation bar:
   - **ProofBox | Overview | My Products | Warranties | Expiring (3) | Receipts | Account**
   - Active state indicators and pill badge for expiring warranties.
   - Quick **"+ Add Purchase"** primary button accessible from every page.
   - Mobile responsive drawer on viewports under 860px.

---

### Step 5: My Products — Premium Collection View
1. Click **"My Products"** (`/purchases`).
2. **Demonstrate Collection Features:**
   - **Live Search:** Type `Apple` or `Sony` in the search box; notice debounced live filtering.
   - **Category Dropdown:** Filter by `Electronics`, `Appliances`, etc.
   - **Status Filter:** Filter by `Active Only`, `Expiring Soon (30d)`, or `Expired Only`.
   - **View Toggle:** Seamlessly switch between the **Product Grid View** and **Data Table View**.
   - Clear active filters pill tags with one click.

---

### Step 6: Adding a New Product with Real-Time Expiry Engine
1. Click **"+ Add Purchase"** (`/purchases/new`).
2. Point out the headline: **"Add something worth keeping."**
3. Fill in a new test purchase:
   - **Product Name:** `Sony Bravia 65" 4K Google TV`
   - **Category:** `Electronics`
   - **Seller:** `Reliance Digital`
   - **Purchase Price:** `149900`
   - **Purchase Date:** Today's date
   - **Warranty Months:** `24`
4. **Highlight the Interactive Preview:**
   - As `24` is typed, the reactive calculation card immediately computes the exact expiration date 2 years into the future (`2028`) and renders the green `Active (730d)` badge.
   - Emphasize that the UTC date math avoids the timezone shift (+1 calendar day) in Indian Standard Time (IST).
5. Add a receipt URL and click **"Save Product"**.

---

### Step 7: Product Detail Page & Coverage Timeline
1. The app automatically transitions to `/purchases/:id`.
2. **Showcase:**
   - Visual **Coverage Timeline Bar** displaying percentage elapsed and days remaining.
   - Purchase price in INR (`₹1,49,900`), seller, and purchase date.
   - Interactive **Receipt Viewer**: Click the receipt to open the lightbox modal; test the "Open in Tab" link.

---

### Step 8: Expiring Soon Action Center & Checklist
1. Click **"Expiring"** (`/expiring`).
2. Point out the headline: **"A little reminder. Right on time."**
3. Showcase the **Recommended Preparation Checklist**:
   - Inspect products for hardware wear or defects.
   - Confirm receipt evidence is safely archived.
   - Note down serial numbers before contacting the seller.

---

### Step 9: Receipt Vault & Document Library
1. Click **"Receipts"** (`/receipts`).
2. Showcase the centralized document gallery displaying receipts, PDFs, and invoices for all protected assets.
3. Click any receipt thumbnail to trigger the modal lightbox.

---

### Step 10: Account Profile & University Project Metadata
1. Click **"Account"** (`/profile`).
2. Point out the customer account design: User Name, Email, Member Since, and Protected Valuation summary.
3. Click **"About ProofBox (SR University Project)"** to expand the university project metadata, MERN technology stack description, and five-student engineering team roles.
