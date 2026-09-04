# Retrod POS — Product SRS (home dashboard & modules)

Canonical module map for this SPA. Routes live under `/pos`. Login lands on the Dashboard.

## 1. Dashboard (default after login — `/pos`)

| ID | Section | Summary |
|---|---|---|
| 1.1 | Purpose & Business Value | Owner / Manager / Accounts live ops + financial health |
| 1.2 | Sales Statistics Panel | Total, Not Paid, Cash, Card, Online, Other |
| 1.3 | Sales Graph | Successful / Complementary / Cancelled |
| 1.4 | Leakage Indicators | KOT leakage + Bill leakage |
| 1.5 | Order Type Counts | Dine In / Pick Up / Delivery |
| 1.6 | Expenses, Withdrawals & Cash Top-up | Counts + amounts for shift float |
| 1.7 | Online Order Panel | Aggregator (Swiggy/Zomato/…) day summary |
| 1.8 | Role-wise Access | Owner full; Manager full read; Accounts financial; Biller none (web) |

## 2. Daily Operation

| ID | Screen | Route |
|---|---|---|
| 2.1 | Live Orders | `/pos/orders` |
| 2.2 | All Orders | `/pos/orders/all` |
| 2.3 | Online Orders | `/pos/orders/online` |
| 2.4 | KOT | `/pos/kot` |
| 2.5 | Due Payment Settlement | `/pos/settlement` |

## 3. Menu

| ID | Screen | Route / View |
|---|---|---|
| 3.1 | Menu & Discounts (All-in-One Menu & Virtual Outlets) | `/pos/menu` (`menu_management`) |
| 3.2 | Multi-Item Images Upload (Bulk matching & deploy) | `/pos/menu` (`upload_item_images`) |
| 3.3 | Menu on/off (Channel & aggregator stock toggling) | `/pos/menu` (`item_on_off`) |
| 3.4 | Special Note (Kitchen & KOT customization notes) | `/pos/menu` (`special_note_list`) |
| 3.5 | Set Item Commission (Item & addon commission setup) | `/pos/menu` (`menucommission_list`) |
| 3.6 | Schedule Changes (Channel & time-slot scheduling) | `/pos/menu` (`menu_scheduling`) |
| 3.7 | Physical Menu (Digital file archive & print layout) | `/pos/menu` (`physical_menu`) |

## 4. Inventory

| ID | Screen | Route |
|---|---|---|
| 4.1 | Stock Purchase (Purchase List) | `/pos/inventory` |
| 4.2 | Purchase Order (Purchase Order List) | `/pos/inventory/order` |
| 4.3 | Purchase Return (Debit Note List) | `/pos/inventory/return` |


## 5. Marketing Automation — `/pos/marketing`

## 6. Reports — `/pos/reports`

## 7. Management — `/pos/management`

## 8. CRM — `/pos/crm`

## 9. Aggregator Center — `/pos/aggregators`

## Architecture

See [architecture.md](./architecture.md) and root [AGENTS.md](../AGENTS.md). Screens are `*Manager` components; reuse `components/ui` + `Primitives` + `components/shared/pos/*` panels.
