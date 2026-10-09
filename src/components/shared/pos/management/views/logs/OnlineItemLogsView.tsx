import { useState, useMemo } from "react";
import {
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
  Layers,
  Clock,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface ItemLogEntry {
  id: string;
  timestamp: string;
  itemName: string;
  category: string;
  channels: string[];
  action: "TURNED_OFF" | "TURNED_ON";
  reason: "Out of Raw Material" | "Kitchen Rush Throttle" | "Chef Discretion" | "Restocked";
  operator: string;
  autoTurnOnTime?: string;
}

const INITIAL_LOGS: ItemLogEntry[] = [
  {
    id: "itm-001",
    timestamp: "2026-10-09 09:42:10",
    itemName: "Paneer Butter Masala",
    category: "Main Course",
    channels: ["Retrod Store", "Zomato", "Swiggy"],
    action: "TURNED_OFF",
    reason: "Out of Raw Material",
    operator: "Chef Vikas (Kitchen)",
    autoTurnOnTime: "Next Day 09:00 AM",
  },
  {
    id: "itm-002",
    timestamp: "2026-10-09 09:15:00",
    itemName: "Cold Coffee with Ice Cream",
    category: "Beverages",
    channels: ["Swiggy"],
    action: "TURNED_ON",
    reason: "Restocked",
    operator: "Sunil Verma (Cashier)",
  },
  {
    id: "itm-003",
    timestamp: "2026-10-08 21:30:12",
    itemName: "Chicken Biryani (Dum Handi)",
    category: "Biryani & Rice",
    channels: ["Retrod Store", "Zomato"],
    action: "TURNED_OFF",
    reason: "Kitchen Rush Throttle",
    operator: "Ayush Mishra (Store Manager)",
    autoTurnOnTime: "1 hr auto reset",
  },
  {
    id: "itm-004",
    timestamp: "2026-10-08 20:05:40",
    itemName: "Tandoori Roti (Butter)",
    category: "Breads",
    channels: ["All Channels"],
    action: "TURNED_OFF",
    reason: "Chef Discretion",
    operator: "Chef Vikas (Kitchen)",
  },
  {
    id: "itm-005",
    timestamp: "2026-10-08 19:10:22",
    itemName: "Gulab Jamun with Rabri",
    category: "Desserts",
    channels: ["Retrod Store", "Swiggy", "Zomato"],
    action: "TURNED_ON",
    reason: "Restocked",
    operator: "Sunil Verma (Cashier)",
  },
  {
    id: "itm-006",
    timestamp: "2026-10-08 16:20:10",
    itemName: "Virgin Mojito",
    category: "Beverages",
    channels: ["Zomato"],
    action: "TURNED_OFF",
    reason: "Out of Raw Material",
    operator: "Ayush Mishra (Store Manager)",
  },
];

export function OnlineItemLogsView() {
  const [logs] = useState<ItemLogEntry[]>(INITIAL_LOGS);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (categoryFilter !== "All" && log.category !== categoryFilter) return false;
      if (actionFilter !== "All" && log.action !== actionFilter) return false;
      return true;
    });
  }, [logs, categoryFilter, actionFilter]);

  const columns: PosDataGridColumn<ItemLogEntry>[] = [
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
      id: "itemName",
      header: "Menu Item",
      accessorKey: "itemName",
      sortable: true,
      defaultWidth: 220,
      render: (_, r) => (
        <div>
          <div className="font-bold text-[13px] text-slate-900">{r.itemName}</div>
          <div className="text-[11px] text-slate-500 font-semibold">{r.category}</div>
        </div>
      ),
    },
    {
      id: "action",
      header: "Toggle State",
      accessorKey: "action",
      sortable: true,
      defaultWidth: 150,
      render: (_, r) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold border ${
            r.action === "TURNED_ON"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {r.action === "TURNED_ON" ? (
            <ToggleRight className="h-3.5 w-3.5" />
          ) : (
            <ToggleLeft className="h-3.5 w-3.5" />
          )}
          {r.action === "TURNED_ON" ? "Turned ON (Available)" : "Turned OFF (OOS)"}
        </span>
      ),
    },
    {
      id: "channels",
      header: "Applicable Channels",
      accessorKey: "channels",
      defaultWidth: 190,
      render: (_, r) => (
        <div className="flex flex-wrap gap-1">
          {r.channels.map((ch) => (
            <span
              key={ch}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
            >
              {ch}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "reason",
      header: "Reason & Auto Reset",
      accessorKey: "reason",
      defaultWidth: 220,
      render: (_, r) => (
        <div>
          <span className="font-medium text-[12px] text-slate-800">{r.reason}</span>
          {r.autoTurnOnTime && (
            <div className="text-[11px] text-amber-700 flex items-center gap-1 font-medium mt-0.5">
              <Clock className="h-3 w-3" /> Auto On: {r.autoTurnOnTime}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "operator",
      header: "Toggled By",
      accessorKey: "operator",
      defaultWidth: 170,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-semibold">{r.operator}</div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-teal-600" />
          Online Item On/Off Logs
        </h2>
        <p className="text-[12.5px] text-slate-500">
          Audit history of menu items marked out of stock or reactivated across online ordering channels.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Currently Out of Stock</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-rose-600">3 Items</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Across delivery channels</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Toggles Today</span>
            <ToggleRight className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">2 Actions</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">1 OOS, 1 Restocked</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Auto-Reset Scheduled</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">1 Item</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Resets on next business day</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Top OOS Category</span>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900">Main Course</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Raw material stockout</div>
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
          <option value="Main Course">Main Course</option>
          <option value="Beverages">Beverages</option>
          <option value="Biryani & Rice">Biryani & Rice</option>
          <option value="Breads">Breads</option>
          <option value="Desserts">Desserts</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Actions</option>
          <option value="TURNED_OFF">Turned OFF (Out of Stock)</option>
          <option value="TURNED_ON">Turned ON (Available)</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search menu items, category, or reason..."
      />
    </div>
  );
}
