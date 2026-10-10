import { useState, useMemo } from "react";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Moon,
  Sun,
  Filter,
} from "lucide-react";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface ClosingHourLogEntry {
  id: string;
  logId: string;
  timestamp: string;
  section: "Dine-In" | "Delivery & Takeaway" | "Bar / Lounge" | "Entire Outlet";
  eventType: "Extended Night Hours" | "Early Closure" | "Holiday Schedule" | "Emergency Shutdown" | "Regular Timing Shift";
  effectiveFrom: string;
  effectiveTo: string;
  reason: string;
  authorizedBy: string;
  customerNoticeSent: boolean;
}

const INITIAL_LOGS: ClosingHourLogEntry[] = [
  {
    id: "chl-001",
    logId: "TIM-2026-401",
    timestamp: "2026-10-08 22:00:00",
    section: "Dine-In",
    eventType: "Extended Night Hours",
    effectiveFrom: "2026-10-08 23:00",
    effectiveTo: "2026-10-09 01:00",
    reason: "Private corporate dining party extended booking (Table T-01 to T-05).",
    authorizedBy: "Ayush Mishra (Store Manager)",
    customerNoticeSent: true,
  },
  {
    id: "chl-002",
    logId: "TIM-2026-400",
    timestamp: "2026-10-05 14:00:00",
    section: "Entire Outlet",
    eventType: "Early Closure",
    effectiveFrom: "2026-10-05 21:00",
    effectiveTo: "2026-10-05 23:30",
    reason: "Scheduled monthly kitchen deep-cleaning & fumigation.",
    authorizedBy: "Ayush Mishra (Store Manager)",
    customerNoticeSent: true,
  },
  {
    id: "chl-003",
    logId: "TIM-2026-399",
    timestamp: "2026-10-01 10:00:00",
    section: "Delivery & Takeaway",
    eventType: "Holiday Schedule",
    effectiveFrom: "2026-10-02 08:00",
    effectiveTo: "2026-10-02 23:59",
    reason: "National Holiday (Gandhi Jayanti) special day-long service schedule.",
    authorizedBy: "System Admin",
    customerNoticeSent: false,
  },
  {
    id: "chl-004",
    logId: "TIM-2026-398",
    timestamp: "2026-09-24 16:30:10",
    section: "Bar / Lounge",
    eventType: "Emergency Shutdown",
    effectiveFrom: "2026-09-24 16:30",
    effectiveTo: "2026-09-24 18:00",
    reason: "City power grid maintenance; switched temporarily to essential generator load.",
    authorizedBy: "Priya Sharma (Captain)",
    customerNoticeSent: false,
  },
  {
    id: "chl-005",
    logId: "TIM-2026-397",
    timestamp: "2026-09-15 11:00:00",
    section: "Entire Outlet",
    eventType: "Regular Timing Shift",
    effectiveFrom: "2026-09-15 00:00",
    effectiveTo: "Permanent",
    reason: "Updated weekday lunch hours to start from 11:30 AM instead of 12:00 PM.",
    authorizedBy: "Ayush Mishra (Store Manager)",
    customerNoticeSent: true,
  },
];

export function ClosingHourLogsView() {
  const [logs] = useState<ClosingHourLogEntry[]>(INITIAL_LOGS);
  const [eventFilter, setEventFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (eventFilter !== "All" && log.eventType !== eventFilter) return false;
      return true;
    });
  }, [logs, eventFilter]);

  const columns: PosDataGridColumn<ClosingHourLogEntry>[] = [
    {
      id: "logId",
      header: "Log Ref",
      accessorKey: "logId",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-slate-800">{r.logId}</span>
      ),
    },
    {
      id: "timestamp",
      header: "Recorded At",
      accessorKey: "timestamp",
      sortable: true,
      defaultWidth: 155,
      render: (_, r) => (
        <span className="font-mono text-[12px] text-slate-600 font-medium">{r.timestamp}</span>
      ),
    },
    {
      id: "section",
      header: "Outlet Section",
      accessorKey: "section",
      sortable: true,
      defaultWidth: 160,
      render: (_, r) => (
        <span className="font-bold text-[12.5px] text-slate-900">{r.section}</span>
      ),
    },
    {
      id: "eventType",
      header: "Timing Adjustment",
      accessorKey: "eventType",
      sortable: true,
      defaultWidth: 180,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700 border-slate-200";
        if (r.eventType === "Extended Night Hours")
          style = "bg-indigo-50 text-indigo-800 border-indigo-200 font-bold";
        if (r.eventType === "Early Closure")
          style = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
        if (r.eventType === "Emergency Shutdown")
          style = "bg-rose-50 text-rose-800 border-rose-200 font-black";
        if (r.eventType === "Holiday Schedule")
          style = "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] border ${style}`}>
            {r.eventType === "Extended Night Hours" ? (
              <Moon className="h-3 w-3" />
            ) : r.eventType === "Early Closure" ? (
              <Clock className="h-3 w-3" />
            ) : (
              <Sun className="h-3 w-3" />
            )}
            {r.eventType}
          </span>
        );
      },
    },
    {
      id: "effectiveWindow",
      header: "Effective Duration",
      defaultWidth: 200,
      render: (_, r) => (
        <div className="text-[12px] text-slate-700">
          <div className="font-mono text-[11.5px] font-medium text-slate-900">
            {r.effectiveFrom}
          </div>
          <div className="font-mono text-[11px] text-slate-500">to {r.effectiveTo}</div>
        </div>
      ),
    },
    {
      id: "reason",
      header: "Operational Reason",
      accessorKey: "reason",
      defaultWidth: 260,
      render: (_, r) => (
        <div className="text-[12px] text-slate-700 font-medium truncate max-w-sm" title={r.reason}>
          {r.reason}
        </div>
      ),
    },
    {
      id: "authorizedBy",
      header: "Manager Auth",
      accessorKey: "authorizedBy",
      defaultWidth: 180,
      render: (_, r) => (
        <div className="text-[12px] text-slate-600 font-semibold">{r.authorizedBy}</div>
      ),
    },
    {
      id: "customerNoticeSent",
      header: "Customer Alert",
      accessorKey: "customerNoticeSent",
      defaultWidth: 120,
      render: (_, r) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
            r.customerNoticeSent
              ? "bg-teal-50 text-teal-800"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {r.customerNoticeSent ? "Notified" : "Internal Only"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-600" />
          Closing Hour & Shift Timing Logs
        </h2>
        <p className="text-[12.5px] text-slate-500">
          Audit log of changes to operational store hours, early closures, extended party hours, and emergency shutdowns.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Operating Status</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">Open Normal</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Until 11:30 PM tonight</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Extended Shifts</span>
            <Moon className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">1 This Week</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Corporate dinner (+2 hrs)</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Early Closures</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">1 This Month</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Scheduled deep cleaning</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Upcoming Holiday</span>
            <Calendar className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[18px] font-black text-slate-900 truncate">Diwali Festival</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Schedule configured</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filter Event:
        </div>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Events</option>
          <option value="Extended Night Hours">Extended Night Hours</option>
          <option value="Early Closure">Early Closure</option>
          <option value="Holiday Schedule">Holiday Schedule</option>
          <option value="Emergency Shutdown">Emergency Shutdown</option>
          <option value="Regular Timing Shift">Regular Timing Shift</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search timing logs, sections, or reasons..."
      />
    </div>
  );
}
