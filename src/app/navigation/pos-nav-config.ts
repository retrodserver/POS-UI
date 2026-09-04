import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Grid3X3,
  BedDouble,
  UtensilsCrossed,
  Package,
  Megaphone,
  PieChart,
  Settings2,
  Users,
  Truck,
  HelpCircle,
  Settings,
} from "lucide-react";

export type PosNavChild = {
  id: string;
  label: string;
  to?: string;
  children?: PosNavChild[];
};

export type PosNavItem = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
  children?: PosNavChild[];
};

/** SRS module nav — Exact alignment with POS Design System */
export const POS_NAV_ITEMS: PosNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: "/pos",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    id: "billing",
    label: "POS Billing",
    to: "/pos/billing",
    icon: CreditCard,
  },
  {
    id: "daily",
    label: "Daily Operations",
    to: "/pos/orders",
    icon: ShoppingBag,
    children: [
      { id: "live-orders", label: "Live Orders", to: "/pos/orders" },
      { id: "all-orders", label: "All Orders", to: "/pos/orders/all" },
      { id: "online-orders", label: "Online Orders", to: "/pos/orders/online" },
      { id: "kot", label: "KOT", to: "/pos/kot" },
      { id: "settlement", label: "Due Settlement", to: "/pos/settlement" },
    ],
  },
  { id: "tables", label: "Table Management", to: "/pos/tables", icon: Grid3X3 },
  { id: "room-service", label: "Room Service", to: "/pos/room-service", icon: BedDouble },
  {
    id: "menu",
    label: "Menu",
    to: "/pos/menu",
    icon: UtensilsCrossed,
    children: [
      { id: "menu-discounts", label: "Menu & Discounts", to: "/pos/menu" },
      { id: "menu-images", label: "Multi-Item Images", to: "/pos/menu/images" },
      { id: "menu-onoff", label: "Menu on/off", to: "/pos/menu/on-off" },
      { id: "menu-notes", label: "Special Note", to: "/pos/menu/special-notes" },
      { id: "menu-commission", label: "Set Item Commission", to: "/pos/menu/commission" },
      { id: "menu-schedule", label: "Schedule Changes", to: "/pos/menu/schedule" },
      { id: "menu-physical", label: "Physical Menu", to: "/pos/menu/physical" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    to: "/pos/inventory",
    icon: Package,
    children: [
      { id: "inv-dashboard", label: "Dashboard", to: "/pos/inventory" },
      {
        id: "purchase-group",
        label: "Purchase",
        children: [
          { id: "stock-purchase", label: "Stock Purchase", to: "/pos/inventory/purchase" },
          { id: "purchase-order", label: "Purchase Order", to: "/pos/inventory/order" },
          { id: "purchase-return", label: "Purchase Return", to: "/pos/inventory/return" },
        ],
      },
      {
        id: "manage-stock-group",
        label: "Manage Stock",
        children: [
          { id: "available-stock", label: "Available Stock", to: "/pos/inventory/available-stock" },
          { id: "closing-stock", label: "Closing Stock", to: "/pos/inventory/closing-stock" },
        ],
      },
      {
        id: "consumption-group",
        label: "Consumption",
        children: [
          { id: "inv-sales", label: "Sales", to: "/pos/inventory/sales" },
          { id: "inv-transfer", label: "Transfer", to: "/pos/inventory/transfer" },
          { id: "inv-wastage", label: "Wastage", to: "/pos/inventory/wastage" },
          { id: "inv-sales-return", label: "Sales Return", to: "/pos/inventory/sales-return" },
        ],
      },
      {
        id: "production-group",
        label: "Production",
        children: [
          { id: "inv-prod-master", label: "Production Master", to: "/pos/inventory/production" },
          { id: "inv-prod-exec", label: "Production Execution", to: "/pos/inventory/production/execution" },
          { id: "inv-barcode-gen", label: "Barcode Generation", to: "/pos/inventory/production/barcode" },
        ],
      },
      {
        id: "reports-group",
        label: "Reports",
        children: [
          { id: "inv-rep-current", label: "Current Stock", to: "/pos/inventory/reports" },
          { id: "inv-rep-summary", label: "Stock Summary", to: "/pos/inventory/reports/stock-summary" },
          { id: "inv-rep-orderwise", label: "Orderwise Consumption", to: "/pos/inventory/reports/orderwise-consumption" },
          { id: "inv-rep-other", label: "Other Reports", to: "/pos/inventory/reports/other-reports" },
        ],
      },
      {
        id: "masters-group",
        label: "Masters",
        children: [
          { id: "inv-raw-materials", label: "Raw Materials", to: "/pos/inventory/masters/raw-materials" },
          { id: "inv-recipes", label: "Item Recipes", to: "/pos/inventory/masters/recipes" },
          {
            id: "suppliers-group",
            label: "Suppliers",
            children: [
              { id: "inv-suppliers-list", label: "Suppliers/Third Party", to: "/pos/inventory/masters/suppliers" },
              { id: "inv-purchase-payments", label: "Purchase Bill Payments", to: "/pos/inventory/masters/purchase-payments" },
            ],
          },
          { id: "inv-invoice-templates", label: "Invoice Templates", to: "/pos/inventory/masters/invoice-templates" },
          { id: "inv-units", label: "Units", to: "/pos/inventory/masters/units" },
        ],
      },
      { id: "inv-settings", label: "Settings", to: "/pos/inventory/settings" },
    ],
  },
  { id: "marketing", label: "Marketing", to: "/pos/marketing", icon: Megaphone },
  {
    id: "reports",
    label: "Reports",
    to: "/pos/reports",
    icon: PieChart,
    children: [
      { id: "rep-day-end", label: "Day End Summary", to: "/pos/reports/day-end" },
      { id: "rep-other", label: "Other Reports", to: "/pos/reports/other" },
      { id: "rep-notifications", label: "Report Notification", to: "/pos/reports/notifications" },
      { id: "rep-delivery", label: "Delivery Management", to: "/pos/reports/delivery" },
    ],
  },
  {
    id: "management",
    label: "Management",
    to: "/pos/management",
    icon: Settings2,
    children: [
      {
        id: "configuration-group",
        label: "Configuration",
        children: [
          { id: "cfg-outlet", label: "Outlet Configuration", to: "/pos/management/configuration/outlet" },
          { id: "cfg-sub-order", label: "Sub Order Type", to: "/pos/management/configuration/sub-order-type" },
          { id: "cfg-delivery-distance", label: "Delivery Distance", to: "/pos/management/configuration/delivery-distance" },
          { id: "cfg-area-charges", label: "Area/Locality Wise Delivery...", to: "/pos/management/configuration/area-delivery-charges" },
          { id: "cfg-floor-plan", label: "Floor Plan", to: "/pos/management/configuration/floor-plan" },
          { id: "cfg-email-template", label: "Email Template Settings", to: "/pos/management/configuration/email-templates" },
        ],
      },
      {
        id: "accounting-group",
        label: "Accounting",
        children: [
          {
            id: "payments-group",
            label: "Payments",
            children: [
              { id: "acc-pay-info", label: "Payment Information", to: "/pos/management/accounting/payments/information" },
              { id: "acc-pay-wallet", label: "Virtual Wallet", to: "/pos/management/accounting/payments/wallet" },
            ],
          },
          { id: "acc-recon", label: "Online Order Reconciliation", to: "/pos/management/accounting/online-reconciliation" },
          { id: "acc-gst", label: "GST Information", to: "/pos/management/accounting/gst" },
          { id: "acc-bank", label: "Bank Details", to: "/pos/management/accounting/bank-details" },
          { id: "acc-kyc", label: "KYC Details", to: "/pos/management/accounting/kyc" },
          { id: "acc-utility", label: "Utility Bills", to: "/pos/management/accounting/utility-bills" },
          { id: "acc-expenses", label: "Expense & Withdrawal", to: "/pos/management/accounting/expenses" },
          { id: "acc-service", label: "Service Payment History", to: "/pos/management/accounting/service-payments" },
          { id: "acc-loans", label: "Loan Information", to: "/pos/management/accounting/loans" },
          { id: "acc-denom", label: "Denomination", to: "/pos/management/accounting/denomination" },
        ],
      },
      {
        id: "user-management-group",
        label: "User Management",
        children: [
          { id: "usr-biller-app", label: "Biller App", to: "/pos/management/users/biller-app" },
          { id: "usr-biller-groups", label: "Biller Group Management", to: "/pos/management/users/biller-groups" },
          { id: "usr-admin-groups", label: "Admin Group Management", to: "/pos/management/users/admin-groups" },
          { id: "usr-admin-mgmt", label: "Admin Management", to: "/pos/management/users/admin-management" },
        ],
      },
      {
        id: "user-logs-group",
        label: "User Logs",
        children: [
          { id: "log-online-store", label: "Online Store Logs", to: "/pos/management/logs/online-store" },
          { id: "log-online-items", label: "Online Item On/Off Logs", to: "/pos/management/logs/online-store" },
          { id: "log-auto-accept", label: "Auto Accept Change Logs", to: "/pos/management/logs/online-store" },
          { id: "log-support", label: "Support Management", to: "/pos/management/logs/support" },
          { id: "log-notifications", label: "Notification", to: "/pos/management/logs/support" },
          { id: "log-menu-trigger", label: "Menu Trigger Logs", to: "/pos/management/logs/online-store" },
          { id: "log-closing-hours", label: "Closing Hour Logs", to: "/pos/management/logs/online-store" },
          { id: "log-expense", label: "Expense Logs", to: "/pos/management/logs/online-store" },
          { id: "log-withdrawal", label: "Withdrawal Logs", to: "/pos/management/logs/online-store" },
          { id: "log-cash-topup", label: "Cash Top-Up Logs", to: "/pos/management/logs/online-store" },
        ],
      },
      {
        id: "explore-products-group",
        label: "Explore Products",
        children: [
          { id: "prod-marketplace", label: "Marketplace", to: "/pos/management/marketplace" },
          { id: "prod-marketplace-setting", label: "Marketplace Setting", to: "/pos/management/marketplace/settings" },
        ],
      },
      { id: "mgmt-audit", label: "Audit Trail", to: "/pos/management/audit-trail" },
      { id: "mgmt-data", label: "Data Management", to: "/pos/management/data-management" },
      { id: "mgmt-device", label: "Device Mapping", to: "/pos/management/device-mapping" },
      {
        id: "outlet-group",
        label: "Outlet",
        children: [
          { id: "out-ho", label: "Add New HO", to: "/pos/management/outlet/ho" },
          { id: "out-kitchen", label: "Add New Kitchen", to: "/pos/management/outlet/kitchen" },
        ],
      },
    ],
  },
  { id: "crm", label: "CRM", to: "/pos/crm", icon: Users },
  { id: "aggregators", label: "Aggregators", to: "/pos/aggregators", icon: Truck },
];

export const POS_FOOTER_NAV_ITEMS: PosNavItem[] = [
  { id: "help", label: "Help & Support", to: "/pos/help", icon: HelpCircle },
  { id: "settings", label: "Settings", to: "/pos/settings", icon: Settings },
];

export function getPosRouteMeta(pathname: string): { label: string; linkTo: string } {
  const allItems = [...POS_NAV_ITEMS, ...POS_FOOTER_NAV_ITEMS];
  for (const item of allItems) {
    if (item.children?.length) {
      const flattenChildren = (children: PosNavChild[]): Array<{ label: string; to: string }> => {
        const res: Array<{ label: string; to: string }> = [];
        for (const c of children) {
          if (c.to) res.push({ label: c.label, to: c.to });
          if (c.children?.length) res.push(...flattenChildren(c.children));
        }
        return res;
      };
      const allChildren = flattenChildren(item.children);
      const matched = [...allChildren]
        .sort((a, b) => b.to.length - a.to.length)
        .find((c) => pathname === c.to || pathname.startsWith(c.to + "/"));
      if (matched) return { label: matched.label, linkTo: matched.to };
    }
    if (item.exact) {
      if (pathname === item.to || pathname === `${item.to}/`) {
        return { label: item.label, linkTo: item.to };
      }
      continue;
    }
    if (pathname === item.to || pathname.startsWith(item.to + "/")) {
      return { label: item.label, linkTo: item.to };
    }
  }
  return { label: "Dashboard", linkTo: "/pos" };
}
