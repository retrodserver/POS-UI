import { useState, useMemo } from "react";
import {
  ArrowUpCircle,
  IndianRupee,
  Coins,
  ShieldCheck,
  Plus,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface CashTopUpLogEntry {
  id: string;
  topupId: string;
  timestamp: string;
  terminal: string;
  topupAmount: number;
  previousBalance: number;
  newBalance: number;
  reason: "Morning Opening Float" | "Small Change & Coin Refill" | "Peak Shift Buffer Float" | "Shift Handover";
  depositedBy: string;
  verifiedBy: string;
  notes: string;
}

const INITIAL_LOGS: CashTopUpLogEntry[] = [
  {
    id: "ctu-001",
    topupId: "TOP-2026-052",
    timestamp: "2026-10-09 09:00:00",
    terminal: "Terminal POS 1 (Counter)",
    topupAmount: 5000,
    previousBalance: 0,
    newBalance: 5000,
    reason: "Morning Opening Float",
    depositedBy: "Sunil Verma (Cashier)",
    verifiedBy: "Ayush Mishra (Store Manager)",
    notes: "Issued standard morning shift float (₹500x4, ₹200x5, ₹100x15, ₹50x10).",
  },
  {
    id: "ctu-002",
    topupId: "TOP-2026-051",
    timestamp: "2026-10-09 09:05:00",
    terminal: "Terminal POS 2 (Bar Station)",
    topupAmount: 3000,
    previousBalance: 0,
    newBalance: 3000,
    reason: "Morning Opening Float",
    depositedBy: "Sunil Verma (Cashier)",
    verifiedBy: "Ayush Mishra (Store Manager)",
    notes: "Issued bar terminal float.",
  },
  {
    id: "ctu-003",
    topupId: "TOP-2026-050",
    timestamp: "2026-10-08 20:15:30",
    terminal: "Terminal POS 1 (Counter)",
    topupAmount: 2000,
    previousBalance: 3800,
    newBalance: 5800,
    reason: "Small Change & Coin Refill",
    depositedBy: "Priya Sharma (Captain)",
    verifiedBy: "Ayush Mishra (Store Manager)",
    notes: "Added ₹10 and ₹20 denomination notes and ₹5 coin rolls for dinner peak change.",
  },
  {
    id: "ctu-004",
    topupId: "TOP-2026-049",
    timestamp: "2026-10-08 15:00:00",
    terminal: "Terminal POS 1 (Counter)",
    topupAmount: 5000,
    previousBalance: 4200,
    newBalance: 9200,
    reason: "Peak Shift Buffer Float",
    depositedBy: "Ayush Mishra (Store Manager)",
    verifiedBy: "Ayush Mishra (Store Manager)",
    notes: "Friday evening rush cash buffer provisioned.",
  },
];

export function CashTopUpLogsView() {
  const [logs] = useState<CashTopUpLogEntry[]>(INITIAL_LOGS);
  const [reasonFilter, setReasonFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (reasonFilter !== "All" && log.reason !== reasonFilter) return false;
      return true;
    });
  }, [logs, reasonFilter]);

  const totalTopUpToday = useMemo(() => {
    return logs
      .filter((l) => l.timestamp.startsWith("2026-10-09"))
      .reduce((sum, l) => sum + l.topupAmount, 0);
  }, [logs]);

  const columns: PosDataGridColumn<CashTopUpLogEntry>[] = [
    {
      id: "topupId",
      header: "Slip Ref",
      accessorKey: "topupId",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-teal-700">{r.topupId}</span>
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
      header: "Station / Drawer",
      accessorKey: "terminal",
      sortable: true,
      defaultWidth: 180,
      render: (_, r) => (
        <span className="font-semibold text-[12.5px] text-slate-900">{r.terminal}</span>
      ),
    },
    {
      id: "topupAmount",
      header: "Amount Added",
      accessorKey: "topupAmount",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[13.5px] font-black text-emerald-600">
          + ₹ {r.topupAmount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "balances",
      header: "Balance Change",
      defaultWidth: 170,
      render: (_, r) => (
        <div className="font-mono text-[11.5px] text-slate-600">
          ₹ {r.previousBalance.toLocaleString("en-IN")} &rarr;{" "}
          <span className="font-bold text-slate-900">
            ₹ {r.newBalance.toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      id: "reason",
      header: "Top-Up Reason",
      accessorKey: "reason",
      sortable: true,
      defaultWidth: 190,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700 border-slate-200";
        if (r.reason === "Morning Opening Float")
          style = "bg-teal-50 text-teal-800 border-teal-200 font-bold";
        if (r.reason === "Small Change & Coin Refill")
          style = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
        if (r.reason === "Peak Shift Buffer Float")
          style = "bg-indigo-50 text-indigo-800 border-indigo-200 font-bold";
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] border ${style}`}>
            {r.reason}
          </span>
        );
      },
    },
    {
      id: "depositedBy",
      header: "Cashier",
      accessorKey: "depositedBy",
      defaultWidth: 160,
      render: (_, r) => (
        <div className="text-[12px] text-slate-800 font-semibold">{r.depositedBy}</div>
      ),
    },
    {
      id: "verifiedBy",
      header: "Manager Auth",
      accessorKey: "verifiedBy",
      defaultWidth: 170,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-medium">{r.verifiedBy}</div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-teal-600" />
            Cash Top-Up & Float Addition Logs
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Track register opening float allocations, denomination coin top-ups, and mid-shift cash injections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Add Register Cash Float modal opened")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Float Top-Up
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Floats Added Today</span>
            <IndianRupee className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">
            ₹ {totalTopUpToday.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">2 Opening floats</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Terminal 1 Balance</span>
            <Coins className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-teal-600">₹ 5,000</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Active opening float</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Terminal 2 Balance</span>
            <Coins className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-indigo-600">₹ 3,000</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Bar counter register</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Manager Verified</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">100%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Dual-passcode verified</div>
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
          <option value="All">All Float Reasons</option>
          <option value="Morning Opening Float">Morning Opening Float</option>
          <option value="Small Change & Coin Refill">Small Change & Coin Refill</option>
          <option value="Peak Shift Buffer Float">Peak Shift Buffer Float</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search top-up slips, stations, or notes..."
      />
    </div>
  );
}
