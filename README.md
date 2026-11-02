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
- **Authentication:** Google Authentication(Google Outh)
- **Security:** Helmet, CORS, Express-Rate-Limit, Strict Owner Data Isolation
- **Testing:** Node.js Native Test Runner (`node:test`, `node:assert`), Supertest, Vitest, React Testing Library

