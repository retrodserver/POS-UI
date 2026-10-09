import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface AutoAcceptLogEntry {
  id: string;
  timestamp: string;
  platform: "Swiggy" | "Zomato" | "Retrod Online Store" | "ONDC Delivery";
  previousState: boolean;
  newState: boolean;
  prepTimeBuffer: string;
  maxActiveOrdersLimit: string;
  operator: string;
  role: string;
  reason: string;
  terminalIp: string;
}

const INITIAL_LOGS: AutoAcceptLogEntry[] = [
  {
    id: "aac-001",
    timestamp: "2026-10-09 08:30:00",
    platform: "Swiggy",
    previousState: false,
    newState: true,
    prepTimeBuffer: "20 Mins",
    maxActiveOrdersLimit: "15 Concurrent Orders",
    operator: "Ayush Mishra",
    role: "Store Manager",
    reason: "Enabled morning breakfast shift auto-acceptance.",
    terminalIp: "192.168.1.101 (Manager Desk)",
  },
  {
    id: "aac-002",
    timestamp: "2026-10-09 08:30:05",
    platform: "Zomato",
    previousState: false,
    newState: true,
    prepTimeBuffer: "25 Mins",
    maxActiveOrdersLimit: "20 Concurrent Orders",
    operator: "Ayush Mishra",
    role: "Store Manager",
    reason: "Enabled morning breakfast shift auto-acceptance.",
    terminalIp: "192.168.1.101 (Manager Desk)",
  },
  {
    id: "aac-003",
    timestamp: "2026-10-08 20:45:10",
    platform: "Swiggy",
    previousState: true,
    newState: false,
    prepTimeBuffer: "30 Mins",
    maxActiveOrdersLimit: "Manual Kitchen Approval",
    operator: "Priya Sharma",
    role: "Floor Captain",
    reason: "High dine-in footfall peak; switched to manual approval to prevent kitchen backlogs.",
    terminalIp: "192.168.1.104 (Captain Tab 1)",
  },
  {
    id: "aac-004",
    timestamp: "2026-10-08 13:00:22",
    platform: "Retrod Online Store",
    previousState: true,
    newState: true,
    prepTimeBuffer: "15 Mins -> 25 Mins",
    maxActiveOrdersLimit: "Unlimited",
    operator: "Ayush Mishra",
    role: "Store Manager",
    reason: "Increased prep buffer during Friday lunch surge.",
    terminalIp: "192.168.1.101 (Manager Desk)",
  },
  {
    id: "aac-005",
    timestamp: "2026-10-07 23:00:00",
    platform: "ONDC Delivery",
    previousState: true,
    newState: false,
    prepTimeBuffer: "20 Mins",
    maxActiveOrdersLimit: "0",
    operator: "Sunil Verma",
    role: "Cashier",
    reason: "End of daily delivery dispatch window.",
    terminalIp: "192.168.1.102 (Counter POS 1)",
  },
];

export function AutoAcceptLogsView() {
  const [logs] = useState<AutoAcceptLogEntry[]>(INITIAL_LOGS);
  const [platformFilter, setPlatformFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (platformFilter !== "All" && log.platform !== platformFilter) return false;
      return true;
    });
  }, [logs, platformFilter]);

  const columns: PosDataGridColumn<AutoAcceptLogEntry>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      accessorKey: "timestamp",
      sortable: true,
      defaultWidth: 155,
      render: (_, r) => (
        <span className="font-mono text-[12px] text-slate-700 font-medium">{r.timestamp}</span>
      ),
    },
    {
      id: "platform",
      header: "Platform",
      accessorKey: "platform",
      sortable: true,
      defaultWidth: 170,
      render: (_, r) => (
        <span className="font-bold text-[13px] text-slate-900">{r.platform}</span>
      ),
    },
    {
      id: "newState",
      header: "Mode / Change",
      accessorKey: "newState",
      sortable: true,
      defaultWidth: 170,
      render: (_, r) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold border ${
            r.newState
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {r.newState ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          {r.newState ? "Auto-Accept ON" : "Manual Accept"}
        </span>
      ),
    },
    {
      id: "prepTimeBuffer",
      header: "Prep Buffer & Limit",
      accessorKey: "prepTimeBuffer",
      defaultWidth: 200,
      render: (_, r) => (
        <div>
          <div className="text-[12px] text-slate-800 font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" /> Prep: {r.prepTimeBuffer}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">{r.maxActiveOrdersLimit}</div>
        </div>
      ),
    },
    {
      id: "reason",
      header: "Reason for Change",
      accessorKey: "reason",
      defaultWidth: 260,
      render: (_, r) => (
        <div className="text-[12px] text-slate-700 font-medium">{r.reason}</div>
      ),
    },
    {
      id: "operator",
      header: "Authorized By",
      accessorKey: "operator",
      defaultWidth: 180,
      render: (_, r) => (
        <div>
          <div className="text-[12px] text-slate-900 font-bold">{r.operator}</div>
          <div className="text-[11px] text-teal-700 font-medium">{r.role}</div>
        </div>
      ),
    },
    {
      id: "terminalIp",
      header: "Station / IP",
      accessorKey: "terminalIp",
      defaultWidth: 170,
      render: (_, r) => (
        <span className="font-mono text-[11.5px] text-slate-500">{r.terminalIp}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-teal-600" />
          Auto Accept Change Logs
        </h2>
        <p className="text-[12.5px] text-slate-500">
          History of changes made to order auto-acceptance toggles, kitchen rush limits, and preparation time buffers.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Swiggy Auto-Accept</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">Active</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Prep Buffer: 20 mins</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Zomato Auto-Accept</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">Active</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Prep Buffer: 25 mins</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Retrod Web Store</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">Active</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Prep Buffer: 15 mins</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Total Toggles Today</span>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">2 Changes</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">By Ayush Mishra (Manager)</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filter Platform:
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Platforms</option>
          <option value="Swiggy">Swiggy</option>
          <option value="Zomato">Zomato</option>
          <option value="Retrod Online Store">Retrod Online Store</option>
          <option value="ONDC Delivery">ONDC Delivery</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search platforms, operators, or reasons..."
      />
    </div>
  );
}
