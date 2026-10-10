import { useState, useMemo } from "react";
import {
  Send,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
  Filter,
} from "lucide-react";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface MenuTriggerLogEntry {
  id: string;
  syncId: string;
  timestamp: string;
  platforms: string[];
  triggerType: "Price Revision" | "New Item Publish" | "Tax Rate Update" | "Combo Discount" | "Category Sort";
  itemsAffectedCount: number;
  status: "Success" | "Queued" | "Failed";
  operator: string;
  details: string;
}

const INITIAL_LOGS: MenuTriggerLogEntry[] = [
  {
    id: "mt-001",
    syncId: "SYNC-2026-904",
    timestamp: "2026-10-09 09:10:00",
    platforms: ["Swiggy", "Zomato", "Retrod Store"],
    triggerType: "Price Revision",
    itemsAffectedCount: 8,
    status: "Success",
    operator: "Ayush Mishra (Store Manager)",
    details: "Pushed 5% weekend price revision on Tandoori platters and Starters.",
  },
  {
    id: "mt-002",
    syncId: "SYNC-2026-903",
    timestamp: "2026-10-09 08:30:15",
    platforms: ["Retrod Store"],
    triggerType: "New Item Publish",
    itemsAffectedCount: 2,
    status: "Success",
    operator: "Chef Vikas / Manager",
    details: "Published seasonal dessert 'Kesar Pista Kulfi' and 'Rabri Jalebi Bowl'.",
  },
  {
    id: "mt-003",
    syncId: "SYNC-2026-902",
    timestamp: "2026-10-08 21:00:10",
    platforms: ["Swiggy", "Zomato"],
    triggerType: "Combo Discount",
    itemsAffectedCount: 5,
    status: "Success",
    operator: "Ayush Mishra (Store Manager)",
    details: "Pushed 'Dinner for 2' 20% discount combo pricing for night delivery.",
  },
  {
    id: "mt-004",
    syncId: "SYNC-2026-901",
    timestamp: "2026-10-08 16:15:00",
    platforms: ["All Outlets & Aggregators"],
    triggerType: "Tax Rate Update",
    itemsAffectedCount: 142,
    status: "Success",
    operator: "System Admin (Audit)",
    details: "Verified 5% GST structure across all food items; zero alcohol tax exception.",
  },
  {
    id: "mt-005",
    syncId: "SYNC-2026-900",
    timestamp: "2026-10-07 18:20:45",
    platforms: ["Zomato"],
    triggerType: "Category Sort",
    itemsAffectedCount: 12,
    status: "Success",
    operator: "Priya Sharma (Captain)",
    details: "Re-ordered 'Chef Specials' to the top category position.",
  },
];

export function MenuTriggerLogsView() {
  const [logs] = useState<MenuTriggerLogEntry[]>(INITIAL_LOGS);
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (typeFilter !== "All" && log.triggerType !== typeFilter) return false;
      return true;
    });
  }, [logs, typeFilter]);

  const columns: PosDataGridColumn<MenuTriggerLogEntry>[] = [
    {
      id: "syncId",
      header: "Sync ID",
      accessorKey: "syncId",
      sortable: true,
      defaultWidth: 145,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-slate-800">{r.syncId}</span>
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
      id: "triggerType",
      header: "Trigger Action",
      accessorKey: "triggerType",
      sortable: true,
      defaultWidth: 170,
      render: (_, r) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11.5px] font-bold text-teal-800 border border-teal-200">
          <Sparkles className="h-3 w-3 text-teal-600" />
          {r.triggerType}
        </span>
      ),
    },
    {
      id: "platforms",
      header: "Target Platforms",
      accessorKey: "platforms",
      defaultWidth: 190,
      render: (_, r) => (
        <div className="flex flex-wrap gap-1">
          {r.platforms.map((p) => (
            <span
              key={p}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200"
            >
              {p}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "itemsAffectedCount",
      header: "Items Pushed",
      accessorKey: "itemsAffectedCount",
      sortable: true,
      defaultWidth: 130,
      render: (_, r) => (
        <span className="font-mono font-bold text-[12px] text-slate-800">
          {r.itemsAffectedCount} Items
        </span>
      ),
    },
    {
      id: "status",
      header: "Sync Status",
      accessorKey: "status",
      sortable: true,
      defaultWidth: 130,
      render: (_, r) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" />
          {r.status}
        </span>
      ),
    },
    {
      id: "details",
      header: "Trigger Notes",
      accessorKey: "details",
      defaultWidth: 260,
      render: (_, r) => (
        <div className="text-[12px] text-slate-700 font-medium truncate max-w-sm" title={r.details}>
          {r.details}
        </div>
      ),
    },
    {
      id: "operator",
      header: "Published By",
      accessorKey: "operator",
      defaultWidth: 180,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-semibold">{r.operator}</div>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Send className="h-5 w-5 text-teal-600" />
          Menu Trigger & Sync Logs
        </h2>
        <p className="text-[12.5px] text-slate-500">
          Track menu updates, pricing changes, tax revisions, and catalog synchronizations pushed to online aggregators and POS terminals.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Syncs Today</span>
            <Send className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">2 Published</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Prices & New items</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Total Items Synced</span>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">10 Items</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Across 3 platforms</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Sync Success Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">100%</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">0 API timeouts</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Last Push Time</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900 truncate">09:10 AM</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">By Ayush Mishra</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filter Action:
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Actions</option>
          <option value="Price Revision">Price Revision</option>
          <option value="New Item Publish">New Item Publish</option>
          <option value="Tax Rate Update">Tax Rate Update</option>
          <option value="Combo Discount">Combo Discount</option>
          <option value="Category Sort">Category Sort</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search sync actions, platforms, or operators..."
      />
    </div>
  );
}
