import { useState, useMemo, useRef } from "react";
import {
  Star,
  Search,
  Filter,
  Utensils,
  Calendar,
  Package,
  Tags,
  Users,
  Percent,
  FileText,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Download,
  Printer,
  Columns,
  Check,
  ChevronDown,
  RefreshCw,
  TrendingUp,
  CreditCard,
  Receipt,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { DataTableHeader, DataTableFooter, type DataTableColumn } from "@/components/common";
import { exportToExcel } from "@/utils/exportUtils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportCard {
  id: string;
  category: string;
  title: string;
  description: string;
  isFavorite: boolean;
}

// ---------------------------------------------------------
// DATASETS TAILORED FOR EACH REPORT TYPE
// ---------------------------------------------------------

const DATASETS: Record<string, { columns: DataTableColumn<any>[]; data: any[] }> = {
  "REP-01": {
    // All Restaurant Sales Report
    columns: [
      { id: "date", label: "Date", sortable: true, getValue: (r) => r.date },
      { id: "outlet", label: "Outlet Name", sortable: true, filterable: true, getValue: (r) => r.outlet },
      { id: "totalBills", label: "Total Bills", align: "right", sortable: true, getValue: (r) => String(r.totalBills) },
      { id: "dineInSales", label: "Dine-In (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.dineInSales.toLocaleString()}` },
      { id: "takeawaySales", label: "Takeaway (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.takeawaySales.toLocaleString()}` },
      { id: "deliverySales", label: "Delivery (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.deliverySales.toLocaleString()}` },
      { id: "grossSales", label: "Gross Sales (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.grossSales.toLocaleString()}` },
      { id: "discounts", label: "Discounts (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.discounts.toLocaleString()}` },
      { id: "taxes", label: "Taxes (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.taxes.toLocaleString()}` },
      { id: "netSales", label: "Net Sales (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.netSales.toLocaleString()}` },
    ],
    data: [
      { id: "1", date: "2026-09-02", outlet: "HIGHWAY INN BAR & RESTAURANT", totalBills: 84, dineInSales: 48200, takeawaySales: 12400, deliverySales: 18900, grossSales: 79500, discounts: 3200, taxes: 3815, netSales: 80115 },
      { id: "2", date: "2026-09-02", outlet: "HIGHWAY INN BANQUET", totalBills: 6, dineInSales: 115000, takeawaySales: 0, deliverySales: 0, grossSales: 115000, discounts: 5000, taxes: 5500, netSales: 115500 },
      { id: "3", date: "2026-09-01", outlet: "HIGHWAY INN BAR & RESTAURANT", totalBills: 92, dineInSales: 54100, takeawaySales: 14200, deliverySales: 21500, grossSales: 89800, discounts: 4100, taxes: 4285, netSales: 89985 },
      { id: "4", date: "2026-09-01", outlet: "HIGHWAY INN BANQUET", totalBills: 4, dineInSales: 85000, takeawaySales: 0, deliverySales: 0, grossSales: 85000, discounts: 3000, taxes: 4100, netSales: 86100 },
      { id: "5", date: "2026-08-31", outlet: "HIGHWAY INN BAR & RESTAURANT", totalBills: 78, dineInSales: 42000, takeawaySales: 10800, deliverySales: 16400, grossSales: 69200, discounts: 2800, taxes: 3320, netSales: 69720 },
      { id: "6", date: "2026-08-30", outlet: "HIGHWAY INN BAR & RESTAURANT", totalBills: 110, dineInSales: 68500, takeawaySales: 18900, deliverySales: 28400, grossSales: 115800, discounts: 5600, taxes: 5510, netSales: 115710 },
      { id: "7", date: "2026-08-29", outlet: "HIGHWAY INN BAR & RESTAURANT", totalBills: 105, dineInSales: 64200, takeawaySales: 17100, deliverySales: 26000, grossSales: 107300, discounts: 4900, taxes: 5120, netSales: 107520 },
    ],
  },
  "REP-02": {
    // Outlet-Item Wise Report (Row)
    columns: [
      { id: "itemCode", label: "Item Code", sortable: true, getValue: (r) => r.itemCode },
      { id: "itemName", label: "Item Name", sortable: true, getValue: (r) => r.itemName },
      { id: "category", label: "Category", sortable: true, filterable: true, getValue: (r) => r.category },
      { id: "outlet", label: "Outlet", sortable: true, getValue: (r) => r.outlet },
      { id: "unitPrice", label: "Unit Rate (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.unitPrice}` },
      { id: "qtySold", label: "Quantity Sold", align: "right", sortable: true, getValue: (r) => String(r.qtySold) },
      { id: "grossRevenue", label: "Gross (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.grossRevenue.toLocaleString()}` },
      { id: "discountAmount", label: "Discount (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.discountAmount.toLocaleString()}` },
      { id: "netRevenue", label: "Net Revenue (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.netRevenue.toLocaleString()}` },
    ],
    data: [
      { id: "1", itemCode: "ITM-101", itemName: "Murgh Dum Biryani (Handi)", category: "Main Course", outlet: "HIGHWAY INN BAR & RESTAURANT", unitPrice: 480, qtySold: 142, grossRevenue: 68160, discountAmount: 3400, netRevenue: 64760 },
      { id: "2", itemCode: "ITM-102", itemName: "Paneer Butter Masala", category: "Main Course", outlet: "HIGHWAY INN BAR & RESTAURANT", unitPrice: 360, qtySold: 118, grossRevenue: 42480, discountAmount: 2100, netRevenue: 40380 },
      { id: "3", itemCode: "ITM-103", itemName: "Tandoori Pomfret", category: "Starters & Tandoor", outlet: "HIGHWAY INN BAR & RESTAURANT", unitPrice: 650, qtySold: 64, grossRevenue: 41600, discountAmount: 1800, netRevenue: 39800 },
      { id: "4", itemCode: "ITM-104", itemName: "Butter Garlic Naan", category: "Breads", outlet: "HIGHWAY INN BAR & RESTAURANT", unitPrice: 75, qtySold: 410, grossRevenue: 30750, discountAmount: 900, netRevenue: 29850 },
      { id: "5", itemCode: "ITM-105", itemName: "Classic Mojito", category: "Bar & Cocktails", outlet: "HIGHWAY INN BAR & RESTAURANT", unitPrice: 280, qtySold: 96, grossRevenue: 26880, discountAmount: 1200, netRevenue: 25680 },
      { id: "6", itemCode: "ITM-106", itemName: "Dal Makhani Royal", category: "Main Course", outlet: "HIGHWAY INN BAR & RESTAURANT", unitPrice: 310, qtySold: 88, grossRevenue: 27280, discountAmount: 1100, netRevenue: 26180 },
      { id: "7", itemCode: "ITM-107", itemName: "Banquet Buffet Spread A", category: "Banquet Catering", outlet: "HIGHWAY INN BANQUET", unitPrice: 1250, qtySold: 160, grossRevenue: 200000, discountAmount: 10000, netRevenue: 190000 },
    ],
  },
  "REP-03": {
    // Invoice Report: All Restaurants
    columns: [
      { id: "invoiceNo", label: "Invoice #", sortable: true, getValue: (r) => r.invoiceNo },
      { id: "timestamp", label: "Date & Time", sortable: true, getValue: (r) => r.timestamp },
      { id: "outlet", label: "Outlet", sortable: true, getValue: (r) => r.outlet },
      { id: "orderType", label: "Order Type", sortable: true, filterable: true, getValue: (r) => r.orderType },
      { id: "tableToken", label: "Table / Token", sortable: true, getValue: (r) => r.tableToken },
      { id: "customer", label: "Customer", sortable: true, getValue: (r) => r.customer },
      { id: "paymentMode", label: "Payment Mode", sortable: true, filterable: true, getValue: (r) => r.paymentMode },
      { id: "subTotal", label: "Subtotal (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.subTotal}` },
      { id: "tax", label: "Tax (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.tax}` },
      { id: "grandTotal", label: "Total Paid (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.grandTotal}` },
      { id: "status", label: "Status", sortable: true, filterable: true, getValue: (r) => r.status },
    ],
    data: [
      { id: "1", invoiceNo: "INV-2026-0901", timestamp: "2026-09-02 21:40", outlet: "HIGHWAY INN", orderType: "Dine-In", tableToken: "Table T-04", customer: "Rahul Sharma", paymentMode: "UPI / GPay", subTotal: 2450, tax: 122.5, grandTotal: 2572.5, status: "Paid" },
      { id: "2", invoiceNo: "INV-2026-0902", timestamp: "2026-09-02 21:15", outlet: "HIGHWAY INN", orderType: "Delivery (Zomato)", tableToken: "ZOM-8921", customer: "Pooja Verma", paymentMode: "Aggregator Online", subTotal: 890, tax: 44.5, grandTotal: 934.5, status: "Settled" },
      { id: "3", invoiceNo: "INV-2026-0903", timestamp: "2026-09-02 20:50", outlet: "HIGHWAY INN", orderType: "Takeaway", tableToken: "Token #14", customer: "Anand Gupta", paymentMode: "Card / Pine Labs", subTotal: 1280, tax: 64.0, grandTotal: 1344.0, status: "Paid" },
      { id: "4", invoiceNo: "INV-2026-0904", timestamp: "2026-09-02 20:20", outlet: "HIGHWAY INN", orderType: "Dine-In", tableToken: "Table T-12", customer: "Siddharth Rao", paymentMode: "Cash", subTotal: 3400, tax: 170.0, grandTotal: 3570.0, status: "Paid" },
      { id: "5", invoiceNo: "INV-2026-0905", timestamp: "2026-09-02 19:45", outlet: "BANQUET HALL", orderType: "Banquet Event", tableToken: "Hall A", customer: "Verma Corporate Reception", paymentMode: "Bank Transfer", subTotal: 48000, tax: 2400.0, grandTotal: 50400.0, status: "Paid" },
      { id: "6", invoiceNo: "INV-2026-0906", timestamp: "2026-09-02 19:10", outlet: "HIGHWAY INN", orderType: "Dine-In", tableToken: "Table T-02", customer: "Deepak Mehta", paymentMode: "UPI / Paytm", subTotal: 1980, tax: 99.0, grandTotal: 2079.0, status: "Paid" },
    ],
  },
  "REP-04": {
    // Pax Sales Report: Biller Wise
    columns: [
      { id: "billerName", label: "Biller / Captain Name", sortable: true, getValue: (r) => r.billerName },
      { id: "empId", label: "Staff ID", sortable: true, getValue: (r) => r.empId },
      { id: "outlet", label: "Outlet", sortable: true, getValue: (r) => r.outlet },
      { id: "shift", label: "Shift", sortable: true, filterable: true, getValue: (r) => r.shift },
      { id: "totalPax", label: "Total Pax / Covers", align: "right", sortable: true, getValue: (r) => String(r.totalPax) },
      { id: "totalBills", label: "Total Bills", align: "right", sortable: true, getValue: (r) => String(r.totalBills) },
      { id: "totalSales", label: "Total Sales (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.totalSales.toLocaleString()}` },
      { id: "avgPerPax", label: "Avg Spend / Pax (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.avgPerPax}` },
      { id: "avgPerBill", label: "Avg Ticket Size (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.avgPerBill}` },
    ],
    data: [
      { id: "1", billerName: "Sunil Verma (Cashier)", empId: "EMP-041", outlet: "HIGHWAY INN", shift: "Evening Shift", totalPax: 148, totalBills: 52, totalSales: 54600, avgPerPax: 368.9, avgPerBill: 1050 },
      { id: "2", billerName: "Ramesh Patel (Captain)", empId: "EMP-048", outlet: "HIGHWAY INN", shift: "Evening Shift", totalPax: 96, totalBills: 31, totalSales: 38200, avgPerPax: 397.9, avgPerBill: 1232 },
      { id: "3", billerName: "Priya Sharma (Manager)", empId: "EMP-012", outlet: "HIGHWAY INN", shift: "Day & Evening", totalPax: 64, totalBills: 18, totalSales: 28900, avgPerPax: 451.5, avgPerBill: 1605 },
      { id: "4", billerName: "Kailash (Counter Staff)", empId: "EMP-055", outlet: "HIGHWAY INN", shift: "Day Shift", totalPax: 82, totalBills: 29, totalSales: 24500, avgPerPax: 298.7, avgPerBill: 844 },
    ],
  },
  "REP-05": {
    // Order Report: Sub-Order Wise
    columns: [
      { id: "subOrderType", label: "Sub-Order Type", sortable: true, getValue: (r) => r.subOrderType },
      { id: "channel", label: "Channel Source", sortable: true, filterable: true, getValue: (r) => r.channel },
      { id: "totalOrders", label: "Total Orders", align: "right", sortable: true, getValue: (r) => String(r.totalOrders) },
      { id: "deliveredOrders", label: "Delivered / Completed", align: "right", sortable: true, getValue: (r) => String(r.deliveredOrders) },
      { id: "cancelledOrders", label: "Cancelled", align: "right", sortable: true, getValue: (r) => String(r.cancelledOrders) },
      { id: "grossAmount", label: "Gross Amount (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.grossAmount.toLocaleString()}` },
      { id: "netSettled", label: "Net Settled (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.netSettled.toLocaleString()}` },
    ],
    data: [
      { id: "1", subOrderType: "Dine-In AC Section", channel: "POS Table Desk", totalOrders: 142, deliveredOrders: 140, cancelledOrders: 2, grossAmount: 98400, netSettled: 96800 },
      { id: "2", subOrderType: "Dine-In Garden Bar", channel: "POS Table Desk", totalOrders: 88, deliveredOrders: 86, cancelledOrders: 2, grossAmount: 64200, netSettled: 63100 },
      { id: "3", subOrderType: "Zomato Delivery", channel: "Aggregator Integration", totalOrders: 74, deliveredOrders: 72, cancelledOrders: 2, grossAmount: 42100, netSettled: 34500 },
      { id: "4", subOrderType: "Swiggy Delivery", channel: "Aggregator Integration", totalOrders: 58, deliveredOrders: 57, cancelledOrders: 1, grossAmount: 32900, netSettled: 26900 },
      { id: "5", subOrderType: "Direct Counter Takeaway", channel: "POS Walk-In", totalOrders: 49, deliveredOrders: 49, cancelledOrders: 0, grossAmount: 21800, netSettled: 21800 },
      { id: "6", subOrderType: "Room Service", channel: "Hotel PMS Interop", totalOrders: 18, deliveredOrders: 18, cancelledOrders: 0, grossAmount: 14200, netSettled: 14200 },
    ],
  },
  "REP-06": {
    // All Restaurant Report: Day Wise
    columns: [
      { id: "date", label: "Date", sortable: true, getValue: (r) => r.date },
      { id: "dayOfWeek", label: "Day", sortable: true, getValue: (r) => r.dayOfWeek },
      { id: "dineInRev", label: "Dine-In (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.dineInRev.toLocaleString()}` },
      { id: "takeawayRev", label: "Takeaway (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.takeawayRev.toLocaleString()}` },
      { id: "deliveryRev", label: "Delivery (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.deliveryRev.toLocaleString()}` },
      { id: "totalBills", label: "Total Bills", align: "right", sortable: true, getValue: (r) => String(r.totalBills) },
      { id: "totalNetRev", label: "Total Net Revenue (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.totalNetRev.toLocaleString()}` },
    ],
    data: [
      { id: "1", date: "2026-09-02", dayOfWeek: "Wednesday", dineInRev: 48200, takeawayRev: 12400, deliveryRev: 18900, totalBills: 84, totalNetRev: 79500 },
      { id: "2", date: "2026-09-01", dayOfWeek: "Tuesday", dineInRev: 54100, takeawayRev: 14200, deliveryRev: 21500, totalBills: 92, totalNetRev: 89800 },
      { id: "3", date: "2026-08-31", dayOfWeek: "Monday", dineInRev: 42000, takeawayRev: 10800, deliveryRev: 16400, totalBills: 78, totalNetRev: 69200 },
      { id: "4", date: "2026-08-30", dayOfWeek: "Sunday", dineInRev: 68500, takeawayRev: 18900, deliveryRev: 28400, totalBills: 110, totalNetRev: 115800 },
      { id: "5", date: "2026-08-29", dayOfWeek: "Saturday", dineInRev: 64200, takeawayRev: 17100, deliveryRev: 26000, totalBills: 105, totalNetRev: 107300 },
      { id: "6", date: "2026-08-28", dayOfWeek: "Friday", dineInRev: 58900, takeawayRev: 15400, deliveryRev: 22800, totalBills: 98, totalNetRev: 97100 },
      { id: "7", date: "2026-08-27", dayOfWeek: "Thursday", dineInRev: 49800, takeawayRev: 11900, deliveryRev: 19100, totalBills: 86, totalNetRev: 80800 },
    ],
  },
  "REP-07": {
    // Discount & Comp Audit Report
    columns: [
      { id: "billNo", label: "Bill / Order No", sortable: true, getValue: (r) => r.billNo },
      { id: "timestamp", label: "Date & Time", sortable: true, getValue: (r) => r.timestamp },
      { id: "authorizedBy", label: "Authorized By", sortable: true, getValue: (r) => r.authorizedBy },
      { id: "reason", label: "Discount Reason", sortable: true, filterable: true, getValue: (r) => r.reason },
      { id: "discountType", label: "Type", sortable: true, getValue: (r) => r.discountType },
      { id: "originalAmount", label: "Bill Amount (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.originalAmount}` },
      { id: "discountValue", label: "Discount (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.discountValue}` },
      { id: "finalBill", label: "Final Paid (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.finalBill}` },
    ],
    data: [
      { id: "1", billNo: "RET-2026-0812", timestamp: "2026-09-02 22:30", authorizedBy: "Priya Sharma (Manager)", reason: "VIP Guest Courtesy", discountType: "Percentage (15%)", originalAmount: 3000, discountValue: 450, finalBill: 2550 },
      { id: "2", billNo: "RET-2026-0814", timestamp: "2026-09-02 21:10", authorizedBy: "Sunil Verma (Cashier)", reason: "Happy Hour Special", discountType: "Flat ₹200", originalAmount: 1850, discountValue: 200, finalBill: 1650 },
      { id: "3", billNo: "RET-2026-0822", timestamp: "2026-09-01 20:15", authorizedBy: "Priya Sharma (Manager)", reason: "Food Quality / Delayed Order", discountType: "Comp Item 100%", originalAmount: 2400, discountValue: 480, finalBill: 1920 },
      { id: "4", billNo: "RET-2026-0830", timestamp: "2026-08-31 19:40", authorizedBy: "Amitabh Verma (Owner)", reason: "Owner Friends & Family", discountType: "Percentage (25%)", originalAmount: 4500, discountValue: 1125, finalBill: 3375 },
    ],
  },
  "REP-08": {
    // Category Contribution Analysis
    columns: [
      { id: "categoryName", label: "Category Name", sortable: true, getValue: (r) => r.categoryName },
      { id: "itemCount", label: "Active Items", align: "right", sortable: true, getValue: (r) => String(r.itemCount) },
      { id: "qtySold", label: "Total Qty Sold", align: "right", sortable: true, getValue: (r) => String(r.qtySold) },
      { id: "totalRevenue", label: "Total Revenue (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.totalRevenue.toLocaleString()}` },
      { id: "contributionPct", label: "Revenue Share (%)", align: "right", sortable: true, getValue: (r) => `${r.contributionPct}%` },
      { id: "profitMargin", label: "Est. Margin (%)", align: "right", sortable: true, getValue: (r) => `${r.profitMargin}%` },
    ],
    data: [
      { id: "1", categoryName: "Main Course (Gravy & Biryani)", itemCount: 34, qtySold: 640, totalRevenue: 182400, contributionPct: 42.5, profitMargin: 68 },
      { id: "2", categoryName: "Bar, Beer & Cocktails", itemCount: 28, qtySold: 390, totalRevenue: 109200, contributionPct: 25.4, profitMargin: 74 },
      { id: "3", categoryName: "Starters, Kebabs & Tandoor", itemCount: 22, qtySold: 310, totalRevenue: 86800, contributionPct: 20.2, profitMargin: 65 },
      { id: "4", categoryName: "Indian Breads & Rotis", itemCount: 10, qtySold: 850, totalRevenue: 34000, contributionPct: 7.9, profitMargin: 82 },
      { id: "5", categoryName: "Desserts & Mocktails", itemCount: 12, qtySold: 115, totalRevenue: 17250, contributionPct: 4.0, profitMargin: 70 },
    ],
  },
  "REP-09": {
    // Customer Repeat Order Matrix
    columns: [
      { id: "customerName", label: "Customer Name", sortable: true, getValue: (r) => r.customerName },
      { id: "phone", label: "Mobile No", sortable: true, getValue: (r) => r.phone },
      { id: "segment", label: "Customer Tier", sortable: true, filterable: true, getValue: (r) => r.segment },
      { id: "totalVisits", label: "Total Visits", align: "right", sortable: true, getValue: (r) => String(r.totalVisits) },
      { id: "lastVisit", label: "Last Visit", sortable: true, getValue: (r) => r.lastVisit },
      { id: "lifetimeSpend", label: "Lifetime Spend (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.lifetimeSpend.toLocaleString()}` },
      { id: "avgOrderValue", label: "Avg Ticket (₹)", align: "right", sortable: true, getValue: (r) => `₹${r.avgOrderValue}` },
    ],
    data: [
      { id: "1", customerName: "Rahul Sharma", phone: "9876543210", segment: "Platinum VIP", totalVisits: 18, lastVisit: "2026-09-02", lifetimeSpend: 42500, avgOrderValue: 2361 },
      { id: "2", customerName: "Pooja Verma", phone: "9812345678", segment: "Gold Regular", totalVisits: 12, lastVisit: "2026-09-02", lifetimeSpend: 24800, avgOrderValue: 2066 },
      { id: "3", customerName: "Vikram Malhotra", phone: "9823456789", segment: "Gold Regular", totalVisits: 9, lastVisit: "2026-08-30", lifetimeSpend: 19400, avgOrderValue: 2155 },
      { id: "4", customerName: "Deepak Mehta", phone: "9834567890", segment: "Silver Returning", totalVisits: 5, lastVisit: "2026-08-28", lifetimeSpend: 9200, avgOrderValue: 1840 },
      { id: "5", customerName: "Ananya Roy", phone: "9845678901", segment: "New Guest", totalVisits: 2, lastVisit: "2026-08-25", lifetimeSpend: 3100, avgOrderValue: 1550 },
    ],
  },
};

export function MainOtherReportsView() {
  const [activeCategory, setActiveCategory] = useState<
    | "favourite"
    | "all_restaurant"
    | "order_related"
    | "item_related"
    | "category_related"
    | "customer_related"
    | "discount_related"
    | "others"
  >("favourite");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  // ---------------------------------------------------------
  // DRILLDOWN REPORT VIEW STATE
  // ---------------------------------------------------------
  const [fromDate, setFromDate] = useState("2026-08-27");
  const [toDate, setToDate] = useState("2026-09-02");
  const [reportSearch, setReportSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  const categories = [
    {
      id: "favourite",
      label: "Favourite",
      icon: Star,
      desc: "All reports which are marked as favorites to refer frequently",
    },
    {
      id: "all_restaurant",
      label: "All Restaurant Report",
      icon: Utensils,
      desc: "Get insights to all your restaurant & sales related activities",
    },
    {
      id: "order_related",
      label: "Order Related Reports",
      icon: Calendar,
      desc: "Detailed breakdown of orders, dining types, and time slots",
    },
    {
      id: "item_related",
      label: "Item Related Reports",
      icon: Package,
      desc: "Menu item sales volume, popularity, and modifiers",
    },
    {
      id: "category_related",
      label: "Category Related Reports",
      icon: Tags,
      desc: "Revenue generation by food and beverage categories",
    },
    {
      id: "customer_related",
      label: "Customer Related Reports",
      icon: Users,
      desc: "Customer retention, average ticket spend, and visit frequencies",
    },
    {
      id: "discount_related",
      label: "Discount Related Reports",
      icon: Percent,
      desc: "Manager comps, coupons, aggregator offers, and discount audits",
    },
    {
      id: "others",
      label: "Others Reports",
      icon: FileText,
      desc: "Taxes, biller metrics, cancelled orders, and shift audit logs",
    },
  ] as const;

  const [reports, setReports] = useState<ReportCard[]>([
    {
      id: "REP-01",
      category: "all_restaurant",
      title: "All Restaurant Sales Report",
      description: "Total sales of all your restaurant",
      isFavorite: true,
    },
    {
      id: "REP-02",
      category: "item_related",
      title: "Outlet-Item Wise Report (Row)",
      description: "Consolidated Summary of Item sales with outlets in row format",
      isFavorite: true,
    },
    {
      id: "REP-03",
      category: "all_restaurant",
      title: "Invoice Report: All Restaurants",
      description: "Total invoice of all your restaurants",
      isFavorite: true,
    },
    {
      id: "REP-04",
      category: "order_related",
      title: "Pax Sales Report: Biller Wise",
      description: "Sales per pax made by each biller",
      isFavorite: false,
    },
    {
      id: "REP-05",
      category: "order_related",
      title: "Order Report: Sub-Order Wise",
      description: "Proper bifurcation of orders based on its sub-order type",
      isFavorite: false,
    },
    {
      id: "REP-06",
      category: "all_restaurant",
      title: "All Restaurant Report: Day Wise",
      description: "Total sales of all your restaurant per day",
      isFavorite: true,
    },
    {
      id: "REP-07",
      category: "discount_related",
      title: "Discount & Comp Audit Report",
      description: "Summary of discounts provided across dine-in, takeaway, and aggregators",
      isFavorite: false,
    },
    {
      id: "REP-08",
      category: "category_related",
      title: "Category Contribution Analysis",
      description: "Percentage contribution of appetizers, main course, beverages, and desserts",
      isFavorite: false,
    },
    {
      id: "REP-09",
      category: "customer_related",
      title: "Customer Repeat Order Matrix",
      description: "Identification of VIP repeat guests and loyalty reward redemptions",
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)));
    toast.success("Favorite preference updated");
  };

  const filteredReports = reports.filter((r) => {
    if (activeCategory === "favourite" && !r.isFavorite) return false;
    if (activeCategory !== "favourite" && r.category !== activeCategory) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const currentCategoryMeta = categories.find((c) => c.id === activeCategory);

  // ---------------------------------------------------------
  // DRILLDOWN REPORT COMPUTATIONS
  // ---------------------------------------------------------
  const currentReportConfig = useMemo(() => {
    if (!selectedReport) return null;
    const cfg = DATASETS[selectedReport.id] || DATASETS["REP-01"];
    return cfg;
  }, [selectedReport]);

  const allColumns = useMemo(() => {
    return currentReportConfig?.columns || [];
  }, [currentReportConfig]);

  // Initialize visible columns when report changes
  const handleOpenReport = (report: ReportCard) => {
    setSelectedReport(report);
    const cfg = DATASETS[report.id] || DATASETS["REP-01"];
    const initialVis: Record<string, boolean> = {};
    cfg.columns.forEach((c) => {
      if (c.id) initialVis[c.id] = true;
    });
    setVisibleColumns(initialVis);
    setPage(1);
    setSelectedIds([]);
    setReportSearch("");
    setSortConfig(null);
  };

  const activeColumns = useMemo(() => {
    return allColumns.filter((c) => (c.id ? visibleColumns[c.id] !== false : true));
  }, [allColumns, visibleColumns]);

  const reportDataset = useMemo(() => {
    if (!currentReportConfig) return [];
    let rows = currentReportConfig.data;

    // Date range filtering (if row has date)
    if (fromDate || toDate) {
      rows = rows.filter((r) => {
        if (!r.date && !r.timestamp && !r.lastVisit) return true;
        const rowDate = r.date || (r.timestamp ? r.timestamp.slice(0, 10) : r.lastVisit);
        if (fromDate && rowDate < fromDate) return false;
        if (toDate && rowDate > toDate) return false;
        return true;
      });
    }

    // Global Search filtering
    if (reportSearch.trim()) {
      const q = reportSearch.toLowerCase();
      rows = rows.filter((r) => {
        return Object.values(r).some((val) =>
          String(val).toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    if (sortConfig) {
      const { colId, direction } = sortConfig;
      rows = [...rows].sort((a, b) => {
        const valA = a[colId];
        const valB = b[colId];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (typeof valA === "number" && typeof valB === "number") {
          return direction === "asc" ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return direction === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    return rows;
  }, [currentReportConfig, fromDate, toDate, reportSearch, sortConfig]);

  const totalPages = Math.ceil(reportDataset.length / pageSize) || 1;
  const paginatedReportData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return reportDataset.slice(start, start + pageSize);
  }, [reportDataset, page, pageSize]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(reportDataset.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportExcel = () => {
    if (!selectedReport) return;
    const exportRows = reportDataset.map((row) => {
      const formatted: Record<string, any> = {};
      activeColumns.forEach((col) => {
        if (col.id) {
          formatted[col.label] = col.getValue ? col.getValue(row) : row[col.id];
        }
      });
      return formatted;
    });

    exportToExcel(exportRows, `${selectedReport.title}_${fromDate}_to_${toDate}`);
    toast.success(`Exported ${exportRows.length} records to Excel`);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Sent report to printer / preview");
  };

  const toggleColumnVisibility = (colId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };

  // ---------------------------------------------------------
  // RENDER: REPORT DRILLDOWN TABULAR VIEW
  // ---------------------------------------------------------
  if (selectedReport) {
    return (
      <div className="space-y-4 print:p-0">
        {/* Top Breadcrumb / Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-teal-600 transition cursor-pointer"
              title="Back to Reports"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
                  {selectedReport.title}
                </h2>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 border border-teal-200">
                  {selectedReport.id}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">{selectedReport.description}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Choose Columns Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  <Columns className="h-3.5 w-3.5 text-slate-500" />
                  <span>Choose Columns</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 shadow-lg rounded-xl" align="end">
                <div className="space-y-2">
                  <div className="text-[12px] font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                    Toggle Visible Columns
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1.5 pt-1">
                    {allColumns.map((col) => {
                      if (!col.id) return null;
                      const isChecked = visibleColumns[col.id] !== false;
                      return (
                        <label
                          key={col.id}
                          className="flex items-center gap-2 px-1.5 py-1 text-[12px] text-slate-700 hover:bg-slate-50 rounded cursor-pointer select-none"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleColumnVisibility(col.id!)}
                          />
                          <span className="truncate">{col.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Export to Excel Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export to Excel</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Date Filter + Global Search */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 print:hidden">
          <div className="flex flex-wrap items-end justify-between gap-3">
            {/* Date Pickers */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-600">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-600">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 pb-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setFromDate("2026-09-02");
                    setToDate("2026-09-02");
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFromDate("2026-08-27");
                    setToDate("2026-09-02");
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFromDate("2026-08-01");
                    setToDate("2026-09-02");
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="flex items-center gap-2 min-w-[280px]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search within report..."
                  value={reportSearch}
                  onChange={(e) => {
                    setReportSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              {(reportSearch || fromDate !== "2026-08-27" || toDate !== "2026-09-02") && (
                <button
                  type="button"
                  onClick={() => {
                    setReportSearch("");
                    setFromDate("2026-08-27");
                    setToDate("2026-09-02");
                    setPage(1);
                    toast.info("Reset report filters");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Print Header banner (Only visible on paper print) */}
        <div className="hidden print:block mb-4 border-b border-slate-400 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">HIGHWAY INN BAR & RESTAURANT</h1>
              <h2 className="text-sm font-semibold text-slate-700">{selectedReport.title}</h2>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>Period: {fromDate} to {toDate}</div>
              <div>Generated on: {new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Tabular Data with DataTableHeader and DataTableFooter */}
        {reportDataset.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-xs space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <Search className="h-8 w-8" />
            </div>
            <div className="text-[14.5px] font-bold text-slate-700">No Matching Report Data</div>
            <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto">
              We couldn't find any records for the selected date range or search keyword.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <DataTableHeader
                  columns={activeColumns}
                  data={reportDataset}
                  sortConfig={sortConfig}
                  onSortChange={setSortConfig}
                  visibleColumns={visibleColumns}
                  onVisibleColumnsChange={setVisibleColumns}
                  themeVariant="primary"
                />
                <tbody className="divide-y divide-slate-100">
                  {paginatedReportData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition">
                      {activeColumns.map((col) => (
                        <td
                          key={col.id}
                          className={`py-3 px-3.5 align-middle ${
                            col.align === "center"
                              ? "text-center"
                              : col.align === "right"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {col.getValue ? (
                            <span
                              className={
                                col.align === "right"
                                  ? "font-mono font-medium text-slate-800"
                                  : "text-slate-800 font-medium"
                              }
                            >
                              {col.getValue(row)}
                            </span>
                          ) : (
                            String((row as any)[col.id || ""] || "")
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DataTableFooter
              totalRecords={reportDataset.length}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(sz) => {
                setPageSize(sz);
                setPage(1);
              }}
              selectedCount={selectedIds.length}
              onExport={(fmt) => {
                if (fmt === "csv" || fmt === "xlsx") {
                  handleExportExcel();
                } else {
                  toast.success(`Exporting report as ${fmt.toUpperCase()}...`);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: DEFAULT REPORTS CATALOG VIEW
  // ---------------------------------------------------------
  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Reports</h2>

      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left Category Panel matching Screenshots 2 & 3 */}
        <div className="w-full lg:w-[260px] shrink-0 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 text-[13px]">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 font-medium transition cursor-pointer flex items-center gap-3 ${
                    isActive
                      ? "border-l-4 border-teal-600 bg-teal-50/40 text-slate-900 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? cat.id === "favourite"
                          ? "text-amber-500 fill-amber-500"
                          : "text-teal-600"
                        : "text-slate-400"
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Reports Grid matching Screenshots 2 & 3 */}
        <div className="flex-1 w-full space-y-4">
          {/* Top Search Filter matching Screenshot */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for reports here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none shadow-2xs"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 p-1 rounded-md text-teal-600 hover:bg-teal-50"
              title="Filter"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Subheader info matching Screenshot */}
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">{currentCategoryMeta?.label}</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">{currentCategoryMeta?.desc}</p>
          </div>

          {/* Reports Grid matching Screenshot */}
          {filteredReports.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
              No reports found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-300 hover:shadow-sm transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[14px] font-bold text-slate-900">{r.title}</h4>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(r.id)}
                        className="text-slate-300 hover:text-amber-500 transition cursor-pointer"
                        title={r.isFavorite ? "Unfavorite" : "Favorite"}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            r.isFavorite
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 hover:text-slate-400"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{r.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenReport(r)}
                      className="text-[12.5px] font-semibold text-teal-600 hover:text-teal-700 cursor-pointer inline-flex items-center gap-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

