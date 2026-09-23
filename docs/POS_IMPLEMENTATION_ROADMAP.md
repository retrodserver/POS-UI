# Retrod POS — Complete Implementation Roadmap & Architecture Blueprint

**Document Version:** 1.0  
**Project:** Retrod Point of Sale (POS) Web Application  
**Current Phase:** Phase 1 — Complete UI/UX Screen & Component Implementation  
**Target Delivery:** Full-featured, Production-grade POS System

---

## 1. Executive Summary & Working Methodology

This document outlines the end-to-end roadmap for building and deploying the **Retrod POS** application. The project is designed with a modern, modular frontend architecture leveraging **Vite, React, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, and Axios**.

### How We Work (The POS Implementation Pipeline)

To ensure rapid delivery, high code quality, and seamless backend integration, our implementation is executed in **5 structured phases**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Phase 1: UI/UX & Component Implementation (CURRENT STAGE)                            │
│  • Pixel-perfect responsive screens & management dashboards                            │
│  • Domain-agnostic design system (Tables, Modals, Stat Tiles, Badges, KOT Cards)       │
│  • Realistic mock data & interactive local state (filters, dialogs, tabs)              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Phase 2: Client State Management & Mock Workflows                                     │
│  • Cart calculations (taxes, discounts, service charge, round-off)                     │
│  • KOT workflow simulations (New -> Preparing -> Ready -> Served)                      │
│  • Due settlement split-payments & cash float register handling                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Phase 3: Backend API Integration & Services Wiring                                    │
│  • DTO typing (`types/{domain}Api.ts`) & UI models (`types/{domain}.ts`)               │
│  • Centralized service layer (`services/{domain}Service.ts`) with `httpClient`         │
│  • TanStack Query hooks (`hooks/queries/`) with caching and optimistic updates         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Phase 4: Real-time Sync & POS Hardware Integrations                                   │
│  • WebSocket / SSE for Live Orders, Online Aggregator pings, and Kitchen Displays      │
│  • Thermal Receipt Printer (ESC/POS) & KOT printing support                            │
│  • Cash drawer triggers & barcode scanner inputs                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Phase 5: Performance Optimization, RBAC Hardening & Production Rollout                │
│  • Role-Based Access Control (Owner, Manager, Cashier/Biller, Kitchen, Accounts)       │
│  • Audit logging, end-of-day (Z-Report) reconciliation, and stress testing             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Scope Breakdown: What We Are Including in POS

The Retrod POS system covers **10 core operational pillars**:

```
                                 ┌─────────────────────────┐
                                 │   Retrod POS Platform   │
                                 └────────────┬────────────┘
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
┌────────┴────────┐                  ┌────────┴────────┐                  ┌────────┴────────┐
│   OPERATIONS    │                  │  COMMERCIAL &   │                  │  ANALYTICS &    │
│   & ORDERING    │                  │   INVENTORY     │                  │  ADMINISTRATION │
├─────────────────┤                  ├─────────────────┤                  ├─────────────────┤
│ • Dashboard     │                  │ • Menu Catalog  │                  │ • Reports & BI  │
│ • Live Orders   │                  │ • Stock Hub     │                  │ • CRM & Loyalty │
│ • Quick Billing │                  │ • Recipes & BOM │                  │ • Marketing     │
│ • KOT & Kitchen │                  │ • Vendors & POs │                  │ • Aggregators   │
│ • Due Settlement│                  │ • Wastage Log   │                  │ • Staff & RBAC  │
└─────────────────┘                  └─────────────────┘                  └─────────────────┘
```

---

### Pillar 1: Executive Dashboard (`/pos`)

_Real-time executive nerve center for Owners, Store Managers, and Accounts._

- **1.1 Sales KPI Strip:** Total revenue, Unpaid orders, Cash vs Card vs UPI/Online splits, Complementary/Discounts.
- **1.2 Real-time Sales Graph:** Hourly trends, Dine-in vs Takeaway vs Delivery breakdown, Successful vs Cancelled orders.
- **1.3 Leakage & Risk Indicators:** High-risk indicators tracking voided bills, cancelled KOT items after printing, and manual discounts.
- **1.4 Order Type Distribution:** Volume distribution across Dine-In, Takeaway, In-house Delivery, and Aggregators.
- **1.5 Shift Cash Float Panel:** Shift opening cash, cash additions, expense withdrawals, and closing balance forecast.
- **1.6 Online Aggregator Summary:** Live health, open issues, and order intake totals for Zomato, Swiggy, and direct ordering.

---

### Pillar 2: Daily Operations & Order Hub (`/pos/orders`, `/pos/kot`, `/pos/settlement`)

_High-velocity order execution and table/kitchen coordination._

- **2.1 Live Orders (`/pos/orders`):**
  - Grid and List views with color-coded status badges (`Pending`, `Kitchen`, `Ready`, `Delivered`, `Billed`).
  - Table selection, quick order modification, item addition, and instant bill generation.
- **2.2 Order History & Search (`/pos/orders/all`):**
  - Searchable audit log of all completed, cancelled, and modified orders with date/biller/payment filters.
- **2.3 Online Order Desk (`/pos/orders/online`):**
  - Aggregator-specific incoming queue with 1-click Accept, Food Ready, Rider Assigned, and Rider Dispatched triggers.
- **2.4 Kitchen Order Ticket (KOT) Display (`/pos/kot`):**
  - Kitchen Display System (KDS) card-view with preparation timers, urgency indicators (Green/Yellow/Red overdue), item-level strike-off, and reprint KOT functions.
- **2.5 Due Payment & Split Settlement (`/pos/settlement`):**
  - Outstanding corporate/room ledger settlements, partial payments, split bills by item or equal amounts, credit customer ledger tracking.

---

### Pillar 3: Fast POS / Quick Billing Terminal (`/pos/billing`)

_Rapid touch-friendly checkout terminal designed for sub-10 second billing speed._

- **3.1 Category & Item Quick Grid:** Visual touch tiles with search, favorites, dietary badges (Veg/Non-Veg/Vegan), and variant popups.
- **3.2 Interactive Cart Panel:** Dynamic quantity modifiers, special cooking instructions, custom discounts, and customer tag-in.
- **3.3 Multi-mode Payment Box:** Quick-cash buttons, QR code generation for UPI, Credit/Debit card machine trigger, split payment, and complementary billing.
- **3.4 Instant Print & E-Bill:** Automatic thermal receipt generation, SMS/WhatsApp digital invoice dispatch.

---

### Pillar 4: Menu & Pricing Management (`/pos/menu`)

_Comprehensive digital catalog control across all channels._

- **4.1 Item Catalog & Categorization:** Multi-level categories, sub-categories, food items with prices, tax slabs (GST/VAT), and codes (SKU/Barcode).
- **4.2 Variants & Modifier Groups:** Add-on groups (e.g., Extra Cheese, Size choices, Toppings, Spice levels) with independent pricing.
- **4.3 Channel Availability & Item On/Off:** Instant toggle to mark items "In Stock" or "86'd / Sold Out" across POS, QR menus, Swiggy, and Zomato simultaneously.
- **4.4 Discounts & Promo Engine:** Percentage, flat amount, minimum cart value, BOGO, and time-restricted happy-hour discounts.

---

### Pillar 5: Inventory & Supply Chain Hub (`/pos/inventory`)

_End-to-end raw material and recipe stock management._

- **5.1 Raw Material Master:** Units of measurement (UOM), reorder levels, current stock, and cost prices.
- **5.2 Recipe Management & Bill of Materials (BOM):** Automatic deduction of ingredients from stock upon KOT punch.
- **5.3 Purchase Orders & GRN (Goods Received Note):** Vendor purchase orders, receiving validation against invoices, and vendor credit records.
- **5.4 Stock Audits & Wastage Logs:** Physical count reconciliation, wastage registration with reason codes (spoilage, burnt, expired), and discrepancy reports.

---

### Pillar 6: Customer Relationship Management (CRM) (`/pos/crm`)

_Customer retention, history, and loyalty tracking._

- **6.1 Customer Directory:** Profile details, total spend, visit frequency, average order value (AOV), and preferred dishes.
- **6.2 Loyalty Points & Cashback:** Configurable points earning rules, redemption during billing, and tier memberships (Silver/Gold/Platinum).
- **6.3 Credit / Khata Ledger:** Customer credit limits, balance statements, payment recording, and reminder triggers.

---

### Pillar 7: Marketing & Growth Automation (`/pos/marketing`)

_Targeted campaigns and customer engagement._

- **7.1 SMS & WhatsApp Campaigns:** Automated birthday/anniversary wishes, win-back offers for dormant customers, and event broadcasts.
- **7.2 Feedback & Rating Collection:** Post-meal digital feedback integration via QR/SMS with alert notifications for negative feedback.

---

### Pillar 8: Reports & Business Intelligence (`/pos/reports`)

_Exhaustive financial, operational, and tax auditing._

- **8.1 Sales & Revenue Reports:** Item-wise, Category-wise, Payment Mode-wise, Biller-wise, and Hourly sales reports.
- **8.2 End-of-Day (EOD) & Shift Reconciliation:** Shift-wise cash tally, expected vs physical cash variance, and Z-report printing.
- **8.3 Tax & Audit Reports:** GST/VAT summaries, cancelled bills register, discount audit log, and KOT modification logs.
- **8.4 Cost & Margin Analysis:** Food cost percentage analysis, high-margin stars vs low-margin underperformers matrix.

---

### Pillar 9: Aggregator & Delivery Center (`/pos/aggregators`)

_Centralized integration console for third-party platforms._

- **9.1 Multi-Brand / Cloud Kitchen Console:** Manage multiple virtual restaurant brands from a single screen.
- **9.2 Aggregator Integrations:** Direct sync status for Zomato, Swiggy, DotPe, and direct web ordering.
- **9.3 Rider Dispatch & Delivery Tracking:** Rider assignation, dispatch timing, and delivery handover confirmation.

---

### Pillar 10: System Management & RBAC (`/pos/management`)

_Store settings, peripherals, and granular security._

- **10.1 Role-Based Access Control (RBAC):** Permissions matrix for Owner, Manager, Cashier/Biller, Captain/Waiter, Chef/Kitchen Staff, and Accountant.
- **10.2 Store Profile & Tax Configuration:** FSSAI/GST numbers, outlet address, invoice header/footer notes, service charge settings.
- **10.3 Hardware & Peripherals Setup:** IP/Bluetooth thermal printer configuration, KOT routing rules (e.g., Bar drinks to Bar printer, Starters to Main Kitchen).

---

## 3. Current Focus: UI Implementation Plan (Phase 1)

The current working phase is **Phase 1: UI Implementation**. The goal is to build out all screens with rich, modern aesthetics, responsive ergonomics, and interactive local behavior.

### Deliverables & Screen Implementation Status

| Section               | Route                | Screen / Manager Component       | Status                 | Key Deliverables & UI Specs                                    |
| --------------------- | -------------------- | -------------------------------- | ---------------------- | -------------------------------------------------------------- |
| **0. Auth**           | `/login`             | `LoginPageFeature.tsx`           | Complete               | Branded login screen, role switcher, validation                |
| **1. Dashboard**      | `/pos`               | `PosDashboardManager.tsx`        | Complete               | KPI strip, Sales graph, Leakage panel, Cash float, Aggregators |
| **2.1 Live Orders**   | `/pos/orders`        | `PosOrdersListManager.tsx`       | In Progress (Refining) | Live table cards, status filters, order action drawer          |
| **2.2 All Orders**    | `/pos/orders/all`    | `PosAllOrdersManager.tsx`        | In Progress            | Full search table, date range picker, receipt preview modal    |
| **2.3 Online Orders** | `/pos/orders/online` | `PosOnlineOrdersManager.tsx`     | In Progress            | Swiggy/Zomato tabs, live countdown timer, 1-click accept       |
| **2.4 KOT Screen**    | `/pos/kot`           | `PosKotManager.tsx`              | In Progress            | Kitchen Display cards, overdue warnings, item checkboxes       |
| **2.5 Settlement**    | `/pos/settlement`    | `PosSettlementManager.tsx`       | In Progress            | Due payments ledger, split-bill modal, receipt reconciliation  |
| **3. Fast Billing**   | `/pos/billing`       | `PosBillingManager.tsx`          | Next Up                | Visual touch catalog, interactive cart, payment popup          |
| **4. Menu Hub**       | `/pos/menu`          | `PosMenuManager.tsx`             | Next Up                | Category manager, item creation drawer, 86'ing switches        |
| **5. Inventory Hub**  | `/pos/inventory`     | `PosInventoryManager.tsx`        | Next Up                | Stock overview table, low stock alerts, purchase order form    |
| **6. Reports Hub**    | `/pos/reports`       | `PosReportsManager.tsx`          | Next Up                | Report category sidebar, interactive charts, CSV/PDF export    |
| **7. Management**     | `/pos/management`    | `PosManagementManager.tsx`       | Next Up                | Staff RBAC table, printer routing config, store settings       |
| **8. CRM Hub**        | `/pos/crm`           | `PosCrmManager.tsx`              | Next Up                | Customer ledger table, profile drawer, loyalty points manager  |
| **9. Marketing**      | `/pos/marketing`     | `PosMarketingManager.tsx`        | Next Up                | Campaign builder, SMS template picker, audience filters        |
| **10. Aggregators**   | `/pos/aggregators`   | `PosAggregatorCenterManager.tsx` | Next Up                | Channel toggles, commission reports, menu mapping              |

---

## 4. UI Architecture & Engineering Guidelines (AGENTS.md Compliance)

All screens and components are developed under strict architectural standards:

1. **Thin Routes:** `src/routes/pos.*.tsx` only handles route definitions and renders the corresponding `*Manager` component. No inline business logic or large JSX trees in route files.
2. **Standardized Component Hierarchy:**
   ```
   src/
   ├── routes/                      # Thin route wrappers
   ├── components/
   │   ├── shared/pos/              # Screen Managers (e.g., PosDashboardManager, PosBillingManager)
   │   │   ├── panels/              # Reusable section panels (e.g., PosSalesStatsPanel, PosKotCard)
   │   ├── ui/                      # Domain-agnostic UI primitives (Card, Button, Dialog, Badge, Input)
   │   └── form/                    # Reusable form elements (SelectField, DatePicker, SwitchField)
   ├── hooks/
   │   ├── queries/                 # TanStack Query data fetching hooks
   │   └── useAuth.ts               # Core authentication hook
   ├── services/                    # API client layer (e.g., posOrderService.ts) using httpClient
   └── types/                       # Wire DTOs (*Api.ts) and UI View Models (*.ts)
   ```
3. **Design System & Aesthetics:**
   - Dark/Light theme support via established tokens (`bg-background`, `bg-surface`, `border-border`, `text-foreground`).
   - High-contrast visual hierarchy with clear typography (`font-display`, `label-uppercase`).
   - Zero placeholder states — complete with empty states, skeleton loaders, and interactive transitions.

---

## 5. Next Immediate Action Items

1. **Complete all pending Phase 1 UI Managers & Panels** in `src/components/shared/pos/`.
2. **Review with Leadership & Stakeholders** for UX flow sign-off.
3. **Transition to Phase 2 & 3** (Cart calculation state machine & Backend API integration).
