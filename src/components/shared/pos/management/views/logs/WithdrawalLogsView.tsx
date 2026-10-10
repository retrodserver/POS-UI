import { useState, useMemo } from "react";
import {
  ArrowDownCircle,
  IndianRupee,
  Building,
  ShieldCheck,
  Vault,
  Plus,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface WithdrawalLogEntry {
  id: string;
  withdrawalId: string;
  timestamp: string;
  terminal: string;
  amount: number;
  reason: "Bank Deposit Drop" | "Safe Box Transfer" | "Owner Draw" | "Emergency Vendor Payout";
  handedTo: string;
  approvedBy: string;
  remainingDrawerBalance: number;
  acknowledgmentStatus: "Verified & Signed" | "Pending Handover Receipt";
}

const INITIAL_LOGS: WithdrawalLogEntry[] = [
  {
    id: "wth-001",
    withdrawalId: "WTH-2026-102",
    timestamp: "2026-10-09 09:30:00",
    terminal: "Terminal POS 1 (Counter)",
    amount: 15000,
    reason: "Bank Deposit Drop",
    handedTo: "HDFC Cash Courier / Armor",
    approvedBy: "Ayush Mishra (Store Manager)",
    remainingDrawerBalance: 5000,
    acknowledgmentStatus: "Verified & Signed",
  },
  {
    id: "wth-002",
    withdrawalId: "WTH-2026-101",
    timestamp: "2026-10-08 23:45:10",
    terminal: "Terminal POS 2 (Bar)",
    amount: 8500,
    reason: "Safe Box Transfer",
    handedTo: "Priya Sharma (Captain)",
    approvedBy: "Ayush Mishra (Store Manager)",
    remainingDrawerBalance: 3000,
    acknowledgmentStatus: "Verified & Signed",
  },
  {
    id: "wth-003",
    withdrawalId: "WTH-2026-100",
    timestamp: "2026-10-08 17:00:20",
    terminal: "Terminal POS 1 (Counter)",
    amount: 5000,
    reason: "Owner Draw",
    handedTo: "Rajesh Singhania (Owner)",
    approvedBy: "Ayush Mishra (Store Manager)",
    remainingDrawerBalance: 7200,
    acknowledgmentStatus: "Verified & Signed",
  },
  {
    id: "wth-004",
    withdrawalId: "WTH-2026-099",
    timestamp: "2026-10-07 14:30:00",
    terminal: "Terminal POS 1 (Counter)",
    amount: 3500,
    reason: "Emergency Vendor Payout",
    handedTo: "Kashmir Dairy Supplier",
    approvedBy: "Chef Vikas / Manager",
    remainingDrawerBalance: 4100,
    acknowledgmentStatus: "Verified & Signed",
  },
];

export function WithdrawalLogsView() {
  const [logs] = useState<WithdrawalLogEntry[]>(INITIAL_LOGS);
  const [reasonFilter, setReasonFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (reasonFilter !== "All" && log.reason !== reasonFilter) return false;
      return true;
    });
  }, [logs, reasonFilter]);

  const totalWithdrawnToday = useMemo(() => {
    return logs
      .filter((l) => l.timestamp.startsWith("2026-10-09"))
      .reduce((sum, l) => sum + l.amount, 0);
  }, [logs]);

  const columns: PosDataGridColumn<WithdrawalLogEntry>[] = [
    {
      id: "withdrawalId",
      header: "Slip Ref",
      accessorKey: "withdrawalId",
      sortable: true,
      defaultWidth: 145,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-slate-800">{r.withdrawalId}</span>
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
      id: "terminal",
      header: "Cash Drawer / Station",
      accessorKey: "terminal",
      sortable: true,
      defaultWidth: 180,
      render: (_, r) => (
        <span className="font-semibold text-[12.5px] text-slate-900">{r.terminal}</span>
      ),
    },
    {
      id: "amount",
      header: "Amount Drawn",
      accessorKey: "amount",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[13.5px] font-black text-rose-600">
          - ₹ {r.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "reason",
      header: "Purpose / Destination",
      accessorKey: "reason",
      sortable: true,
      defaultWidth: 180,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700 border-slate-200";
        if (r.reason === "Bank Deposit Drop")
          style = "bg-blue-50 text-blue-800 border-blue-200 font-bold";
        if (r.reason === "Safe Box Transfer")
          style = "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
        if (r.reason === "Owner Draw")
          style = "bg-purple-50 text-purple-800 border-purple-200 font-bold";
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] border ${style}`}>
            {r.reason}
          </span>
        );
      },
    },
    {
      id: "handedTo",
      header: "Handed Over To",
      accessorKey: "handedTo",
      defaultWidth: 190,
      render: (_, r) => (
        <div className="text-[12px] text-slate-800 font-semibold">{r.handedTo}</div>
      ),
    },
    {
      id: "remainingDrawerBalance",
      header: "Remaining Drawer",
      accessorKey: "remainingDrawerBalance",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[12px] text-slate-700 font-semibold">
          ₹ {r.remainingDrawerBalance.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "approvedBy",
      header: "Manager Auth",
      accessorKey: "approvedBy",
      defaultWidth: 180,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-medium">{r.approvedBy}</div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-teal-600" />
            Cash Drawer Withdrawal Logs
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Track authorized cash withdrawals, bank deposit drop-offs, safe vault transfers, and partner payouts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Record New Cash Drawer Payout opened")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Log Withdrawal / Drop
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Withdrawn Today</span>
            <IndianRupee className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">
            ₹ {totalWithdrawnToday.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">1 Bank deposit drop</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Bank Drop Courier</span>
            <Building className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-blue-600">₹ 15,000</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Signed by Armor Courier</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Safe Vault Drops</span>
            <Vault className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">₹ 8,500</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Night closure drop</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Audit Verification</span>
            <ShieldCheck className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-teal-600">100%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">All slips manager-signed</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filter Reason:
        </div>

        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Purposes</option>
          <option value="Bank Deposit Drop">Bank Deposit Drop</option>
          <option value="Safe Box Transfer">Safe Box Transfer</option>
          <option value="Owner Draw">Owner Draw</option>
          <option value="Emergency Vendor Payout">Emergency Vendor Payout</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search slips, terminals, or payees..."
      />
    </div>
  );
}
