import { useState, useMemo } from "react";
import {
  Receipt,
  IndianRupee,
  FileCheck,
  AlertCircle,
  Paperclip,
  Plus,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface ExpenseLogEntry {
  id: string;
  voucherNo: string;
  timestamp: string;
  category: "Kitchen Raw Materials" | "Gas & Cylinder" | "Repairs & Maintenance" | "Staff Meals & Tea" | "Disposables & Cleaning";
  amount: number;
  paymentMode: "Petty Cash Drawer" | "UPI Transfer" | "Credit Card";
  vendor: string;
  recordedBy: string;
  hasReceipt: boolean;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  notes: string;
}

const INITIAL_LOGS: ExpenseLogEntry[] = [
  {
    id: "exp-001",
    voucherNo: "EXP-2026-0881",
    timestamp: "2026-10-09 09:20:15",
    category: "Kitchen Raw Materials",
    amount: 1450,
    paymentMode: "Petty Cash Drawer",
    vendor: "Local Fresh Market (Manoj Sabzi Mandi)",
    recordedBy: "Chef Vikas",
    hasReceipt: true,
    approvalStatus: "Approved",
    notes: "Emergency purchase of fresh mint, coriander, and lemons for morning prep.",
  },
  {
    id: "exp-002",
    voucherNo: "EXP-2026-0880",
    timestamp: "2026-10-09 08:45:00",
    category: "Gas & Cylinder",
    amount: 3200,
    paymentMode: "UPI Transfer",
    vendor: "Bharat Gas Agency",
    recordedBy: "Sunil Verma (Cashier)",
    hasReceipt: true,
    approvalStatus: "Approved",
    notes: "2 Commercial 19kg LPG cylinders refill delivery.",
  },
  {
    id: "exp-003",
    voucherNo: "EXP-2026-0879",
    timestamp: "2026-10-08 21:10:30",
    category: "Staff Meals & Tea",
    amount: 380,
    paymentMode: "Petty Cash Drawer",
    vendor: "Shree Ganesh Tea Stall",
    recordedBy: "Priya Sharma (Captain)",
    hasReceipt: false,
    approvalStatus: "Approved",
    notes: "Night shift tea and snacks for floor and kitchen team.",
  },
  {
    id: "exp-004",
    voucherNo: "EXP-2026-0878",
    timestamp: "2026-10-08 17:30:00",
    category: "Repairs & Maintenance",
    amount: 850,
    paymentMode: "Petty Cash Drawer",
    vendor: "Apex Electric Works",
    recordedBy: "Sunil Verma (Cashier)",
    hasReceipt: true,
    approvalStatus: "Approved",
    notes: "Replaced faulty plug socket on beverage cooler.",
  },
  {
    id: "exp-005",
    voucherNo: "EXP-2026-0877",
    timestamp: "2026-10-08 14:15:22",
    category: "Disposables & Cleaning",
    amount: 2100,
    paymentMode: "UPI Transfer",
    vendor: "Khurana Packaging Supplies",
    recordedBy: "Ayush Mishra (Manager)",
    hasReceipt: true,
    approvalStatus: "Pending",
    notes: "Takeaway delivery meal boxes (500 pcs) and tissue packs.",
  },
];

export function ExpenseLogsView() {
  const [logs] = useState<ExpenseLogEntry[]>(INITIAL_LOGS);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (categoryFilter !== "All" && log.category !== categoryFilter) return false;
      if (statusFilter !== "All" && log.approvalStatus !== statusFilter) return false;
      return true;
    });
  }, [logs, categoryFilter, statusFilter]);

  const totalExpenseToday = useMemo(() => {
    return logs
      .filter((l) => l.timestamp.startsWith("2026-10-09"))
      .reduce((sum, l) => sum + l.amount, 0);
  }, [logs]);

  const columns: PosDataGridColumn<ExpenseLogEntry>[] = [
    {
      id: "voucherNo",
      header: "Voucher No",
      accessorKey: "voucherNo",
      sortable: true,
      defaultWidth: 145,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-teal-700">{r.voucherNo}</span>
      ),
    },
    {
      id: "timestamp",
      header: "Timestamp",
      accessorKey: "timestamp",
      sortable: true,
      defaultWidth: 155,
      render: (_, r) => (
        <span className="font-mono text-[12px] text-slate-600 font-medium">{r.timestamp}</span>
      ),
    },
    {
      id: "category",
      header: "Expense Category",
      accessorKey: "category",
      sortable: true,
      defaultWidth: 190,
      render: (_, r) => (
        <span className="font-bold text-[12.5px] text-slate-900">{r.category}</span>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      defaultWidth: 130,
      render: (_, r) => (
        <span className="font-mono text-[13px] font-extrabold text-slate-900">
          ₹ {r.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "paymentMode",
      header: "Payment Mode",
      accessorKey: "paymentMode",
      sortable: true,
      defaultWidth: 160,
      render: (_, r) => (
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
          {r.paymentMode}
        </span>
      ),
    },
    {
      id: "vendor",
      header: "Payee / Vendor",
      accessorKey: "vendor",
      defaultWidth: 190,
      render: (_, r) => (
        <div className="text-[12px] font-semibold text-slate-800 truncate">{r.vendor}</div>
      ),
    },
    {
      id: "approvalStatus",
      header: "Status",
      accessorKey: "approvalStatus",
      sortable: true,
      defaultWidth: 120,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700";
        if (r.approvalStatus === "Approved") style = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
        if (r.approvalStatus === "Pending") style = "bg-amber-50 text-amber-700 border-amber-200 font-bold";
        if (r.approvalStatus === "Rejected") style = "bg-rose-50 text-rose-700 border-rose-200 font-bold";
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] border ${style}`}>
            {r.approvalStatus}
          </span>
        );
      },
    },
    {
      id: "receipt",
      header: "Receipt",
      defaultWidth: 100,
      align: "center",
      render: (_, r) => (
        r.hasReceipt ? (
          <button
            type="button"
            onClick={() => toast.info(`Viewing receipt for voucher ${r.voucherNo}`)}
            className="text-teal-600 hover:text-teal-800 transition cursor-pointer"
            title="View Receipt"
          >
            <Paperclip className="h-4 w-4 mx-auto" />
          </button>
        ) : (
          <span className="text-[11px] text-slate-400">None</span>
        )
      ),
    },
    {
      id: "recordedBy",
      header: "Recorded By",
      accessorKey: "recordedBy",
      defaultWidth: 160,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-medium">{r.recordedBy}</div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="h-5 w-5 text-teal-600" />
            Petty Cash & Expense Logs
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Audit trail of daily cash disbursements, grocery purchases, kitchen repairs, and vendor vouchers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Record New Petty Cash Expense opened")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Expense Entry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Expenses Today</span>
            <IndianRupee className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">
            ₹ {totalExpenseToday.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">2 Vouchers logged</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Petty Cash Drawer</span>
            <Receipt className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">₹ 1,450</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Disbursed from Counter 1</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Pending Approvals</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-amber-600">1 Voucher</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">₹ 2,100 (Disposables)</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Receipt Attachment</span>
            <FileCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">80%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">4 of 5 have digital bills</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filters:
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Categories</option>
          <option value="Kitchen Raw Materials">Kitchen Raw Materials</option>
          <option value="Gas & Cylinder">Gas & Cylinder</option>
          <option value="Repairs & Maintenance">Repairs & Maintenance</option>
          <option value="Staff Meals & Tea">Staff Meals & Tea</option>
          <option value="Disposables & Cleaning">Disposables & Cleaning</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search vouchers, vendors, or notes..."
      />
    </div>
  );
}
