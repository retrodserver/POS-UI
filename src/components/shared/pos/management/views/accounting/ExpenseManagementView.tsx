import { useState, useMemo } from "react";
import {
  Plus,
  ArrowUpDown,
  TrendingDown,
  Edit2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid } from "@/components/ui/data-grid";
import type { DataGridColumn } from "@/components/ui/data-grid/types";

interface MasterItem {
  id: string;
  title: string;
  status: boolean;
  createdDate: string;
}

interface ListingItem {
  id: string;
  title: string;
  totalReported: number;
}

export function ExpenseManagementView() {
  const [activeTab, setActiveTab] = useState<
    | "expense_listing"
    | "expense_master"
    | "withdrawal_listing"
    | "withdrawal_master"
    | "cash_topup_listing"
    | "cash_topup_master"
  >("expense_listing");

  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-09-02");

  const tabs = [
    { id: "expense_listing", label: "Expense Listing" },
    { id: "expense_master", label: "Expense Master" },
    { id: "withdrawal_listing", label: "Withdrawal Listing" },
    { id: "withdrawal_master", label: "Withdrawal Master" },
    { id: "cash_topup_listing", label: "Cash Top-Up Listing" },
    { id: "cash_topup_master", label: "Cash Top-Up Master" },
  ] as const;

  // 1. Expense Listing Data
  const [expenseListing] = useState<ListingItem[]>([
    { id: "1", title: "Advance Salary", totalReported: 15000.0 },
    { id: "2", title: "Advertisement & Social Media", totalReported: 4500.0 },
    { id: "3", title: "Delivery Boy Fuel Allowance", totalReported: 2400.0 },
    { id: "4", title: "Electricity & Utility", totalReported: 18200.0 },
    { id: "5", title: "Commercial LPG Gas Cylinders", totalReported: 8900.0 },
    { id: "6", title: "Daily Groceries & Vegetables", totalReported: 32400.0 },
    { id: "7", title: "High-Speed Internet & POS Wi-Fi", totalReported: 1899.0 },
    { id: "8", title: "Kitchen Hood Maintenance", totalReported: 3500.0 },
    { id: "9", title: "Daily Dairy & Milk Procurement", totalReported: 14200.0 },
    { id: "10", title: "Eco-friendly Packaging Boxes", totalReported: 6800.0 },
  ]);

  // 2. Expense Master Data
  const [expenseMaster, setExpenseMaster] = useState<MasterItem[]>([
    { id: "em-1", title: "Petty Cash Settlement", status: true, createdDate: "24 May 2026" },
    { id: "em-2", title: "Other Miscellaneous Expenses", status: true, createdDate: "24 May 2026" },
    { id: "em-3", title: "Advertisement & Promotions", status: true, createdDate: "24 May 2026" },
    { id: "em-4", title: "Kitchen Maintenance & Repairs", status: true, createdDate: "24 May 2026" },
    { id: "em-5", title: "Mineral Water Can Supplies", status: true, createdDate: "24 May 2026" },
    { id: "em-6", title: "Broadband Internet", status: true, createdDate: "24 May 2026" },
    { id: "em-7", title: "Premises Rent", status: true, createdDate: "24 May 2026" },
    { id: "em-8", title: "Commercial Gas", status: true, createdDate: "24 May 2026" },
  ]);

  // 3. Withdrawal Listing Data
  const [withdrawalListing] = useState<ListingItem[]>([
    { id: "w-1", title: "Vendor Cheque Clearance", totalReported: 45000.0 },
    { id: "w-2", title: "Cash Deposited in Bank", totalReported: 85000.0 },
    { id: "w-3", title: "Drawings by Owner", totalReported: 20000.0 },
    { id: "w-4", title: "Direct Settlement to Supplier", totalReported: 12500.0 },
  ]);

  // 4. Withdrawal Master Data
  const [withdrawalMaster, setWithdrawalMaster] = useState<MasterItem[]>([
    { id: "wm-1", title: "To Supplier", status: true, createdDate: "24 May 2026" },
    { id: "wm-2", title: "To Owner", status: true, createdDate: "24 May 2026" },
    { id: "wm-3", title: "Cheque Given", status: true, createdDate: "24 May 2026" },
    { id: "wm-4", title: "In Bank", status: true, createdDate: "24 May 2026" },
  ]);

  // 5. Cash Top-Up Listing Data
  const [cashTopupListing] = useState<ListingItem[]>([
    { id: "ct-1", title: "Float From Store Manager", totalReported: 10000.0 },
    { id: "ct-2", title: "Emergency Cash Infusion from Owner", totalReported: 25000.0 },
  ]);

  // 6. Cash Top-Up Master Data
  const [cashTopupMaster, setCashTopupMaster] = useState<MasterItem[]>([
    { id: "cm-1", title: "From Owner", status: true, createdDate: "24 May 2026" },
    { id: "cm-2", title: "From Manager", status: true, createdDate: "24 May 2026" },
  ]);

  // Columns for Listing Views
  const listingColumns: DataGridColumn<ListingItem>[] = [
    {
      id: "title",
      header: "Expense / Category Title",
      sortable: true,
      filterable: true,
      width: 280,
      render: (val: any) => <span className="font-semibold text-foreground">{val}</span>,
    },
    {
      id: "totalReported",
      header: "Total Reported Amount (₹)",
      sortable: true,
      align: "right",
      width: 200,
      render: (val: any) => (
        <span className="font-mono font-bold text-foreground">₹{Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      align: "right",
      width: 140,
      render: (_: any, row: ListingItem) => (
        <button
          type="button"
          onClick={() => toast.info(`Viewing transactions for ${row.title}`)}
          className="text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          View Ledger
        </button>
      ),
    },
  ];

  // Columns for Master Views
  const masterColumns: DataGridColumn<MasterItem>[] = [
    {
      id: "title",
      header: "Master Category Title",
      sortable: true,
      filterable: true,
      width: 280,
      render: (val: any) => <span className="font-semibold text-foreground">{val}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      align: "center",
      width: 130,
      getValue: (r: MasterItem) => (r.status ? "Active" : "Inactive"),
      render: (val: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            val
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-slate-100 text-muted-foreground dark:bg-surface-2"
          }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "createdDate",
      header: "Created Date",
      sortable: true,
      width: 160,
      render: (val: any) => <span className="text-muted-foreground text-xs">{val}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      width: 120,
      render: (_: any, row: MasterItem) => (
        <div className="flex items-center justify-end gap-1 text-muted-foreground">
          <button
            type="button"
            onClick={() => toast.info(`Editing ${row.title}`)}
            className="p-1 hover:text-primary hover:bg-surface-2 rounded transition cursor-pointer"
            title="Edit Master"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toast.success(`Deleted ${row.title}`)}
            className="p-1 hover:text-red-500 hover:bg-surface-2 rounded transition cursor-pointer"
            title="Delete Master"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Petty Cash & Expense Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track daily operating expenses, owner withdrawals, cash top-ups, and petty float registers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Create new entry modal")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 shadow-xs transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expense Entry</span>
        </button>
      </div>

      {/* 2. Tab Navigation Bar */}
      <div className="border-b border-border flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold transition cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Date Filter Bar for Listing Tabs */}
      {(activeTab === "expense_listing" ||
        activeTab === "withdrawal_listing" ||
        activeTab === "cash_topup_listing") && (
        <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-36">
              <label className="block text-[11.5px] font-semibold text-muted-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="w-36">
              <label className="block text-[11.5px] font-semibold text-muted-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => toast.info("Filter applied")}
              className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-2 transition cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* 4. Tab Table View with PosDataGrid */}
      {activeTab === "expense_listing" && (
        <PosDataGrid
          data={expenseListing}
          columns={listingColumns}
          keyField="id"
          title="Expense Categories Summary"
          subtitle="Aggregated petty cash & invoice expense logs"
          showToolbar
          selectable
          storageKey="pos-accounting-expense-listing"
          themeVariant="primary"
          pageSize={10}
        />
      )}

      {activeTab === "expense_master" && (
        <PosDataGrid
          data={expenseMaster}
          columns={masterColumns}
          keyField="id"
          title="Expense Category Masters"
          subtitle="Configure allowed expense category labels and active flags"
          showToolbar
          selectable
          storageKey="pos-accounting-expense-master"
          themeVariant="primary"
          pageSize={10}
        />
      )}

      {activeTab === "withdrawal_listing" && (
        <PosDataGrid
          data={withdrawalListing}
          columns={listingColumns}
          keyField="id"
          title="Withdrawal Summary"
          subtitle="Summary of cash withdrawals to owner, bank, and suppliers"
          showToolbar
          selectable
          storageKey="pos-accounting-withdrawal-listing"
          themeVariant="primary"
          pageSize={10}
        />
      )}

      {activeTab === "withdrawal_master" && (
        <PosDataGrid
          data={withdrawalMaster}
          columns={masterColumns}
          keyField="id"
          title="Withdrawal Category Masters"
          subtitle="Manage withdrawal types"
          showToolbar
          selectable
          storageKey="pos-accounting-withdrawal-master"
          themeVariant="primary"
          pageSize={10}
        />
      )}

      {activeTab === "cash_topup_listing" && (
        <PosDataGrid
          data={cashTopupListing}
          columns={listingColumns}
          keyField="id"
          title="Cash Top-Up Summary"
          subtitle="Summary of cash float replenishments"
          showToolbar
          selectable
          storageKey="pos-accounting-cash-topup-listing"
          themeVariant="primary"
          pageSize={10}
        />
      )}

      {activeTab === "cash_topup_master" && (
        <PosDataGrid
          data={cashTopupMaster}
          columns={masterColumns}
          keyField="id"
          title="Cash Top-Up Masters"
          subtitle="Manage float sources and top-up category rules"
          showToolbar
          selectable
          storageKey="pos-accounting-cash-topup-master"
          themeVariant="primary"
          pageSize={10}
        />
      )}
    </div>
  );
}
