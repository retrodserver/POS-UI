import { useState, useMemo } from "react";
import {
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface StoreLogEntry {
  id: string;
  timestamp: string;
  platform: "Retrod Online Store" | "Zomato" | "Swiggy" | "Direct QR Ordering";
  event: "STORE_ONLINE" | "STORE_OFFLINE" | "AUTO_PAUSED" | "SURGE_MODE";
  operator: string;
  reason: string;
  durationOffline?: string;
  status: "Success" | "Warning" | "Error";
}

const INITIAL_LOGS: StoreLogEntry[] = [
  {
    id: "str-001",
    timestamp: "2026-10-09 09:30:14",
    platform: "Retrod Online Store",
    event: "STORE_ONLINE",
    operator: "Ayush Mishra (Store Manager)",
    reason: "Scheduled morning store opening routine.",
    status: "Success",
  },
  {
    id: "str-002",
    timestamp: "2026-10-09 09:30:15",
    platform: "Zomato",
    event: "STORE_ONLINE",
    operator: "System Auto-Sync",
    reason: "Aggregator webhook confirmed online status.",
    status: "Success",
  },
  {
    id: "str-003",
    timestamp: "2026-10-09 09:30:18",
    platform: "Swiggy",
    event: "STORE_ONLINE",
    operator: "System Auto-Sync",
    reason: "Store switched online via API integration.",
    status: "Success",
  },
  {
    id: "str-004",
    timestamp: "2026-10-08 23:15:40",
    platform: "Retrod Online Store",
    event: "STORE_OFFLINE",
    operator: "Sunil Verma (Cashier)",
    reason: "Closing shift shutdown.",
    durationOffline: "10 hrs 15 mins",
    status: "Success",
  },
  {
    id: "str-005",
    timestamp: "2026-10-08 20:10:02",
    platform: "Swiggy",
    event: "AUTO_PAUSED",
    operator: "Retrod Kitchen Guard",
    reason: "Kitchen prep buffer overload (> 18 pending orders).",
    durationOffline: "25 mins",
    status: "Warning",
  },
  {
    id: "str-006",
    timestamp: "2026-10-08 20:35:12",
    platform: "Swiggy",
    event: "STORE_ONLINE",
    operator: "Chef Vikas (Kitchen Display)",
    reason: "Kitchen cleared queue; resumed accepting delivery orders.",
    status: "Success",
  },
  {
    id: "str-007",
    timestamp: "2026-10-08 17:40:00",
    platform: "Direct QR Ordering",
    event: "SURGE_MODE",
    operator: "Ayush Mishra (Store Manager)",
    reason: "Peak happy-hour dining rush limit enabled.",
    status: "Warning",
  },
];

export function OnlineStoreLogsView() {
  const [logs] = useState<StoreLogEntry[]>(INITIAL_LOGS);
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [eventFilter, setEventFilter] = useState<string>("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (platformFilter !== "All" && log.platform !== platformFilter) return false;
      if (eventFilter !== "All" && log.event !== eventFilter) return false;
      return true;
    });
  }, [logs, platformFilter, eventFilter]);

  const columns: PosDataGridColumn<StoreLogEntry>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      accessorKey: "timestamp",
      sortable: true,
      defaultWidth: 160,
      render: (_, r) => (
        <div className="font-mono text-[12px] text-slate-700 font-medium">{r.timestamp}</div>
      ),
    },
    {
      id: "platform",
      header: "Sales Channel / Store",
      accessorKey: "platform",
      sortable: true,
      defaultWidth: 190,
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-teal-600" />
          <span className="font-bold text-[12.5px] text-slate-800">{r.platform}</span>
        </div>
      ),
    },
    {
      id: "event",
      header: "Event Type",
      accessorKey: "event",
      sortable: true,
      defaultWidth: 150,
      render: (_, r) => {
        let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (r.event === "STORE_OFFLINE")
          badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
        if (r.event === "AUTO_PAUSED")
          badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
        if (r.event === "SURGE_MODE")
          badgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${badgeStyle}`}
          >
            {r.event === "STORE_ONLINE" ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {r.event.replace("_", " ")}
          </span>
        );
      },
    },
    {
      id: "reason",
      header: "Trigger / Details",
      accessorKey: "reason",
      defaultWidth: 260,
      render: (_, r) => (
        <div>
          <p className="text-[12px] text-slate-700 font-medium">{r.reason}</p>
          {r.durationOffline && (
            <span className="text-[11px] text-slate-400 font-mono">
              Offline for: {r.durationOffline}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "operator",
      header: "Action By",
      accessorKey: "operator",
      defaultWidth: 180,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-semibold">{r.operator}</div>
      ),
    },
    {
      id: "status",
      header: "Sync Status",
      accessorKey: "status",
      defaultWidth: 120,
      render: (_, r) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            r.status === "Success"
              ? "bg-teal-50 text-teal-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-600" />
            Online Store Logs
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Real-time audit log of store online/offline status changes, channel syncs, and emergency pauses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.success("Refreshed online store sync status")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            Sync Now
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Online Uptime</span>
            <Wifi className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">99.8%</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> All channels operational
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Active Channels</span>
            <Globe className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">3 / 3</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Retrod Store, Zomato, Swiggy
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Pauses Today</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">1</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Auto kitchen pause (25 mins)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Last Status Change</span>
            <RefreshCw className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900 truncate">09:30 AM</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Morning opening sequence</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filters:
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Channels</option>
          <option value="Retrod Online Store">Retrod Online Store</option>
          <option value="Zomato">Zomato</option>
          <option value="Swiggy">Swiggy</option>
          <option value="Direct QR Ordering">Direct QR Ordering</option>
        </select>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Event Types</option>
          <option value="STORE_ONLINE">Store Online</option>
          <option value="STORE_OFFLINE">Store Offline</option>
          <option value="AUTO_PAUSED">Auto Paused</option>
          <option value="SURGE_MODE">Surge Mode</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search store events, reasons, or operators..."
      />
    </div>
  );
}
