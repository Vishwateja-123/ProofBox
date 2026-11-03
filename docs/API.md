# ProofBox — REST API Documentation

**Institution:** SR University  
**Project:** ProofBox — Warranty & Receipt Vault  
**Base URL:** `http://localhost:5001/api`  
**Authentication Scheme:** JSON Web Tokens (JWT) via `Authorization: Bearer <token>` header or `token` HttpOnly cookie.

---

## 1. Authentication & User Management

### 1.1 User Registration
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public (Rate limited to 100 req/15min)
- **Description:** Registers a new user account with hashed password and generates a signed JWT.

**Request Body:**
```json
{
  "name": "Paidipelly Vishwateja",
  "email": "demo@proofbox.com",
  "password": "DemoPassword123!"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6ae0d116527401b7165902f0",
    "name": "Paidipelly Vishwateja",
    "email": "demo@proofbox.com",
    "createdAt": "2026-10-27T16:00:00.000Z"
  }
}
```

**Errors:**
- `400 Bad Request`: Validation failure (name < 2 chars, invalid email, password < 6 chars).
- `409 Conflict`: Email address is already in use.

---

### 1.2 User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public (Rate limited to 100 req/15min)
- **Description:** Authenticates user credentials and issues a JWT token and session cookie.

**Request Body:**
```json
{
  "email": "demo@proofbox.com",
  "password": "DemoPassword123!"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6ae0d116527401b7165902f0",
    "name": "Paidipelly Vishwateja",
    "email": "demo@proofbox.com",
    "createdAt": "2026-10-27T16:00:00.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid email or password.

---

### 1.3 Google OAuth 2.0 Sign-In
- **Endpoint:** `POST /api/auth/google`
- **Access:** Public (Rate limited)
- **Description:** Verifies Google Identity Services ID token via `google-auth-library`. Automatically registers new Google users or signs in existing users, issuing a standard ProofBox JWT session token.

**Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...GoogleIdToken..."
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Google authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6ae0d116527401b7165902f0",
    "name": "Paidipelly Vishwateja",
    "email": "vishwateja@gmail.com",
    "avatar": "https://lh3.googleusercontent.com/a/...",
    "authProvider": "google",
    "createdAt": "2026-11-02T16:00:00.000Z"
  }
}
```

**Errors:**
- `400 Bad Request`: Google ID token missing from request body.
- `401 Unauthorized`: Invalid or expired Google token, or unverified Google email address.
- `409 Conflict`: An account with this email address already exists using local password authentication (prevents account takeover).
- `500 Internal Server Error`: `GOOGLE_CLIENT_ID` not configured in `backend/.env`.

---

### 1.4 User Logout
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Authenticated
- **Description:** Clears the HttpOnly authentication cookie.

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### 1.4 Get Profile
- **Endpoint:** `GET /api/auth/profile` (or `GET /api/auth/me`)
- **Access:** Authenticated
- **Description:** Returns the profile of the currently authenticated user.

**Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": "6ae0d116527401b7165902f0",
    "name": "Paidipelly Vishwateja",
    "email": "demo@proofbox.com",
    "createdAt": "2026-10-27T16:00:00.000Z"
  }
}
```

---

## 2. Purchase Records Management

### 2.1 List Purchases
- **Endpoint:** `GET /api/purchases`
- **Access:** Authenticated (Owner-Scoped)
- **Description:** Retrieves all purchases belonging to the authenticated user with optional search, filtering, and sorting.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | `""` | Case-insensitive regex search across `productName` and `seller`. |
| `category` | string | `All` | Exact match on category (`Electronics`, `Appliances`, etc.). |
| `status` | string | `all` | Filter by warranty status (`active`, `expiring_soon`, `expired`). |
| `sortBy` | string | `purchaseDate` | Sort field (`purchaseDate`, `warrantyExpiryDate`, `price`, `productName`). |
| `order` | string | `desc` | Sort direction (`asc` or `desc`). |
| `page` | number | `1` | Pagination page number. |
| `limit` | number | `50` | Max items per page. |

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 7,
  "total": 7,
  "page": 1,
  "totalPages": 1,
  "purchases": [
    {
      "_id": "6ae0d116527401b7165902f3",
      "ownerId": "6ae0d116527401b7165902f0",
      "productName": "Apple MacBook Air M3 (16GB, 512GB)",
      "category": "Electronics",
      "seller": "Apple Store Online",
      "purchaseDate": "2026-07-27T00:00:00.000Z",
      "price": 134900,
      "warrantyMonths": 12,
      "warrantyExpiryDate": "2027-07-27T23:59:59.999Z",
      "receiptUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "notes": "Serial: C02GM3PROOFBOX",
      "createdAt": "2026-10-27T16:00:00.000Z",
      "warrantyStatus": "active",
      "daysRemaining": 273,
      "isExpiringSoon": false,
      "isExpired": false,
      "isActive": true
    }
  ]
}
```

---

### 2.2 Create Purchase
- **Endpoint:** `POST /api/purchases`
- **Access:** Authenticated
- **Description:** Adds a purchase record to MongoDB. The backend authoritatively calculates `warrantyExpiryDate` using leap-year and month-end safe calendar math.

**Request Body:**
```json
{
  "productName": "Kindle Paperwhite 11th Gen",
  "category": "Electronics",
  "seller": "Amazon India",
  "purchaseDate": "2026-05-01",
  "price": 14999,
  "warrantyMonths": 12,
  "receiptUrl": "https://example.com/receipt.pdf",
  "notes": "Serial: B09SWW583J"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Purchase record saved successfully.",
  "purchase": {
    "_id": "6ae0d5560b05df46c2eb8085",
    "ownerId": "6ae0d116527401b7165902f0",
    "productName": "Kindle Paperwhite 11th Gen",
    "category": "Electronics",
    "seller": "Amazon India",
    "purchaseDate": "2026-05-01T00:00:00.000Z",
    "price": 14999,
    "warrantyMonths": 12,
    "warrantyExpiryDate": "2027-05-01T23:59:59.999Z",
    "receiptUrl": "https://example.com/receipt.pdf",
    "notes": "Serial: B09SWW583J",
    "createdAt": "2026-10-27T16:45:00.000Z",
    "warrantyStatus": "active",
    "daysRemaining": 186,
    "isExpiringSoon": false,
    "isExpired": false,
    "isActive": true
  }
}
```

---

### 2.3 Get Expiring Purchases
- **Endpoint:** `GET /api/purchases/expiring`
- **Access:** Authenticated
- **Description:** Returns purchases whose warranty expires within the inclusive 30-day window (`0 <= daysRemaining <= 30`), ordered ascending by expiry date.

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 3,
  "purchases": [
    {
      "_id": "...",
      "productName": "Bosch 8kg Front Load Washing Machine",
      "warrantyExpiryDate": "2026-11-01T23:59:59.999Z",
      "daysRemaining": 5,
      "warrantyStatus": "expiring_soon"
    }
  ]
}
```

---

### 2.4 Get Purchase By ID
- **Endpoint:** `GET /api/purchases/:id`
- **Access:** Authenticated (Owner-Scoped)
- **Description:** Returns full details of a specific purchase record. Returns `404 Not Found` if the record does not belong to the user.

---

### 2.5 Update Purchase
- **Endpoint:** `PATCH /api/purchases/:id`
- **Access:** Authenticated (Owner-Scoped)
- **Description:** Updates purchase details. If `purchaseDate` or `warrantyMonths` is modified, the backend automatically recalculates `warrantyExpiryDate`.

---

### 2.6 Delete Purchase
- **Endpoint:** `DELETE /api/purchases/:id`
- **Access:** Authenticated (Owner-Scoped)
- **Description:** Permanently removes the purchase record from MongoDB.

---

## 3. Analytics & Dashboard

### 3.1 Get Dashboard Summary
- **Endpoint:** `GET /api/dashboard/summary`
- **Access:** Authenticated
- **Description:** Aggregates real-time metrics across the user's purchase vault.

**Response (`200 OK`):**
```json
{
  "success": true,
  "summary": {
    "totalPurchases": 7,
    "activeWarranties": 3,
    "expiringSoon": 3,
    "expiredWarranties": 1,
    "totalSpend": 457270,
    "categoryBreakdown": [
      { "category": "Electronics", "count": 2, "totalValue": 161890 },
      { "category": "Appliances", "count": 2, "totalValue": 84490 },
      { "category": "Furniture", "count": 1, "totalValue": 115000 },
      { "category": "Home & Kitchen", "count": 1, "totalValue": 52900 },
      { "category": "Sports & Outdoors", "count": 1, "totalValue": 42990 }
    ],
    "recentPurchases": [...],
    "upcomingExpirations": [...]
  }
}
```

---

## 4. Vault Receipt Uploads

### 4.1 Upload Local Receipt File
- **Endpoint:** `POST /api/receipts/upload`
- **Access:** Authenticated
- **Content-Type:** `multipart/form-data`
- **Form Field:** `receipt` (file: JPG, PNG, WEBP, PDF, max 10MB)

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Receipt uploaded successfully.",
  "receiptUrl": "/uploads/receipt-invoice-1730048123-98234.pdf",
  "filename": "receipt-invoice-1730048123-98234.pdf",
  "size": 184592
}
```

---

## 5. Health Check

### 5.1 System Health
- **Endpoint:** `GET /api/health`
- **Access:** Public
- **Description:** Verifies Express server and MongoDB connection state.

**Response (`200 OK`):**
```json
{
  "success": true,
  "status": "healthy",
  "service": "ProofBox API Server",
  "version": "1.0.0",
  "timestamp": "2026-10-27T16:43:01.499Z",
  "database": {
    "status": "connected",
    "host": "127.0.0.1",
    "name": "proofbox"
  }
}
```

---

## 6. Visual Product Search & Hardware Catalog

### 6.1 Search Products & Variants
- **Endpoint:** `GET /api/products/search`
- **Access:** Public
- **Description:** Searches official consumer electronics, Apple models, colors, finishes, and specs with high-resolution photography and dynamic external product search.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `q` | `string` | `""` | Search query (e.g. `iphone 16`, `macbook air`, `sony wh-1000xm5`) |

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 4,
  "query": "iphone",
  "products": [
    {
      "id": "apple-iphone-16-pro",
      "name": "iPhone 16 Pro",
      "brand": "Apple",
      "tagline": "Titanium. So strong. So light. Built for Apple Intelligence.",
      "category": "Electronics",
      "defaultSeller": "Apple Store",
      "defaultWarrantyMonths": 12,
      "basePrice": 999,
      "models": ["iPhone 16 Pro (6.3-inch)", "iPhone 16 Pro Max (6.9-inch)"],
      "colors": [
        {
          "name": "Desert Titanium",
          "hex": "#C5B49F",
          "image": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=940&hei=1112&fmt=png-alpha"
        }
      ],
      "variants": [
        { "id": "128gb", "label": "128 GB", "priceDelta": 0 },
        { "id": "256gb", "label": "256 GB", "priceDelta": 100 }
      ],
      "specs": ["A18 Pro chip", "Camera Control", "48MP Fusion Camera"]
    }
  ]
}
```

### 6.2 Popular Flagships
- **Endpoint:** `GET /api/products/popular`
- **Access:** Public
- **Description:** Returns top trending flagship devices across Apple, Sony, Samsung, Dyson, and Nintendo.

