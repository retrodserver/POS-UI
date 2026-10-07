import React, { useState, useMemo, useEffect } from "react";
import {
  ChefHat,
  Search,
  FileSpreadsheet,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Filter,
  Flame,
  Utensils,
  Receipt,
  Printer,
  FileText,
  AlertTriangle,
  Play,
  LayoutGrid,
  List,
  User,
  Building,
} from "lucide-react";
import { useKotOrders, useMarkKotPreparedMutation } from "@/hooks/queries/usePosOrders";
import { PosDataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { KpiCard, StatusBadge, Button } from "@/components/ui/Primitives";
import { exportToExcel } from "@/utils/exportUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PosKotManager() {
  const [stationFilter, setStationFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"kanban" | "grid">("kanban");

  // Timer Tick State (ticks every 1s for live Kanban timer badges)
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filters State
  const [orderType, setOrderType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSymbolGuide, setShowSymbolGuide] = useState(false);

  const { data: kotData } = useKotOrders();
  const markPreparedMutation = useMarkKotPreparedMutation();

  const [viewingKot, setViewingKot] = useState<any | null>(null);
  const [selectedKots, setSelectedKots] = useState<any[]>([]);

  // Local ticket state overrides to support interactive Kanban workflow (Start Cooking -> Ready)
  const [localStatuses, setLocalStatuses] = useState<Record<string, "Queued" | "Preparing" | "Ready" | "Served">>({});

  const kotRecords = useMemo(() => {
    return (kotData?.records || []).map((k: any) => {
      const currentStatus = localStatuses[k.kotId] || (k.status === "Prepared" || k.status === "Served" ? "Ready" : "Preparing");
      // Simulated initial timestamp based on index
      const createdTimestamp = k.createdTimestamp || Date.now() - (k.kotId % 15 + 2) * 60000;
      return {
        ...k,
        currentStatus,
        createdTimestamp,
      };
    });
  }, [kotData, localStatuses]);

  const filteredRecords = useMemo(() => {
    return kotRecords.filter((k: any) => {
      if (stationFilter !== "All") {
        if (stationFilter === "Bar Station" && !k.orderType.toLowerCase().includes("bar"))
          return false;
        if (stationFilter === "Kitchen Main" && k.orderType.toLowerCase().includes("bar"))
          return false;
      }

      if (orderType !== "All") {
        if (orderType === "Dine In" && !k.orderType.includes("Dine In")) return false;
        if (orderType === "Takeaway" && !k.orderType.includes("Takeaway")) return false;
        if (orderType === "Room Service" && !k.orderType.includes("Room")) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = k.kotId.toString().includes(q);
        const matchName = k.customerName?.toLowerCase().includes(q);
        const matchItems = k.itemsText?.toLowerCase().includes(q);
        const matchTable = k.tableNo?.toString().toLowerCase().includes(q);
        if (!matchId && !matchName && !matchItems && !matchTable) return false;
      }

      return true;
    });
  }, [kotRecords, searchQuery, orderType, stationFilter]);

  // Kanban Column Buckets
  const queuedTickets = useMemo(
    () => filteredRecords.filter((k: any) => k.currentStatus === "Queued"),
    [filteredRecords],
  );
  const preparingTickets = useMemo(
    () => filteredRecords.filter((k: any) => k.currentStatus === "Preparing"),
    [filteredRecords],
  );
  const readyTickets = useMemo(
    () => filteredRecords.filter((k: any) => k.currentStatus === "Ready" || k.currentStatus === "Served"),
    [filteredRecords],
  );

  // KDS Top Metrics Calculations
  const activeCount = queuedTickets.length + preparingTickets.length;
  const overdueCount = filteredRecords.filter((k: any) => {
    const elapsedMinutes = (now - k.createdTimestamp) / 60000;
    return elapsedMinutes > 15 && k.currentStatus !== "Ready";
  }).length;

  // Actions
  const handleStartCooking = (kotId: string) => {
    setLocalStatuses((prev) => ({ ...prev, [kotId]: "Preparing" }));
    toast.info(`KOT #${kotId} started cooking!`, {
      description: "Chefs are now preparing this order.",
    });
  };

  const handleMarkReady = (kot: any) => {
    setLocalStatuses((prev) => ({ ...prev, [kot.kotId]: "Ready" }));
    markPreparedMutation.mutate(kot.kotId, {
      onSuccess: () => {
        toast.success(`KOT #${kot.kotId} Marked Ready!`, {
          description: `Notified food runners for ${kot.orderType}`,
        });
      },
      onError: () => {
        toast.error("Failed to update KOT status");
      },
    });
  };

  const handlePrintDuplicate = (kot: any) => {
    toast.success(`Duplicate KOT #${kot.kotId} printed!`, {
      description: `Sent to ${stationFilter === "All" ? "Main Kitchen" : stationFilter} printer`,
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "KOT ID",
      "Order Type",
      "Table / Room",
      "Customer Name",
      "Items Ordered",
      "Status",
      "Created At",
    ];
    const rows = filteredRecords.map((k: any) => [
      k.kotId,
      k.orderType,
      k.tableNo || "N/A",
      k.customerName,
      k.itemsText,
      k.currentStatus,
      k.createdAt,
    ]);

    exportToExcel({
      filename: `KOT_Kitchen_Ledger_${new Date().toISOString().slice(0, 10)}`,
      title: "Kitchen Order Tickets (KOT) & KDS Report",
      subtitle: `Station: ${stationFilter} | Status: ${statusFilter.toUpperCase()}`,
      columns: headers,
      rows,
    });
    toast.success(`Exported ${rows.length} KOT records to Excel`);
  };

  // DataGrid Columns for Table View
  const columns: DataGridColumn<any>[] = useMemo(
    () => [
      {
        key: "kotId",
        header: "KOT Ticket",
        width: "140px",
        sortable: true,
        filterable: true,
        getValue: (row) => `#${row.kotId}`,
        render: (_val, kot) => (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[13.5px] font-bold text-text-primary">
                #{kot.kotId}
              </span>
              {kot.isModified && (
                <span className="rounded px-1.5 py-0.2 text-[9.5px] font-bold bg-warning-tint text-warning border border-warning/30 uppercase">
                  Updated
                </span>
              )}
            </div>
            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">{kot.createdAt}</div>
          </div>
        ),
      },
      {
        key: "orderType",
        header: "Order & Location",
        width: "180px",
        sortable: true,
        filterable: true,
        getValue: (row) => row.orderType,
        render: (_val, kot) => (
          <div>
            <div className="font-bold text-text-primary text-[12.5px]">{kot.orderType}</div>
            <div className="text-[11px] font-mono text-slate-500">
              {kot.tableNo ? `Table: ${kot.tableNo}` : "Dining Floor"}
            </div>
          </div>
        ),
      },
      {
        key: "customerName",
        header: "Guest / Waiter",
        width: "160px",
        sortable: true,
        filterable: true,
        getValue: (row) => row.customerName || "Walk-in Guest",
        render: (_val, kot) => (
          <div>
            <div className="font-semibold text-text-primary text-[12px]">
              {kot.customerName && kot.customerName !== "--" ? kot.customerName : "Walk-in Guest"}
            </div>
            {kot.customerPhone && kot.customerPhone !== "--" && (
              <div className="text-[11px] text-slate-500 font-mono">{kot.customerPhone}</div>
            )}
          </div>
        ),
      },
      {
        key: "itemsText",
        header: "Items Ordered & Notes",
        sortable: true,
        filterable: true,
        getValue: (row) => row.itemsText,
        render: (_val, kot) => (
          <div>
            <div className="font-semibold text-text-primary text-[12px] leading-relaxed max-w-md">
              {kot.itemsText}
            </div>
            {/* Special Instructions Note Tag */}
            {kot.specialNotes && (
              <div className="mt-1 inline-flex items-center gap-1 rounded bg-warning-tint px-2 py-0.5 text-[10px] font-bold text-warning border border-warning/30">
                Note: {kot.specialNotes}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "110px",
        align: "center",
        sortable: true,
        filterable: true,
        getValue: (row) => row.currentStatus,
        render: (_val, kot) => {
          const isReady = kot.currentStatus === "Ready";
          const isPrep = kot.currentStatus === "Preparing";
          return (
            <StatusBadge tone={isReady ? "success" : isPrep ? "info" : "warning"}>
              {kot.currentStatus}
            </StatusBadge>
          );
        },
      },
      {
        key: "actions",
        header: "Actions",
        width: "130px",
        align: "right",
        sortable: false,
        filterable: false,
        render: (_val, kot) => (
          <div className="flex items-center justify-end gap-1.5">
            {kot.currentStatus !== "Ready" ? (
              <button
                type="button"
                onClick={() => handleMarkReady(kot)}
                title="Mark Ready"
                className="flex h-7 px-2 items-center gap-1 rounded-lg bg-primary hover:bg-primary-pressed text-primary-foreground text-[11px] font-bold shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Ready</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePrintDuplicate(kot)}
                title="Print Duplicate"
                className="flex h-7 px-2 items-center gap-1 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text-primary text-[11px] font-semibold transition cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewingKot(kot)}
              title="View Ticket"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface hover:bg-surface-2 text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const stations = ["All", "Kitchen Main", "Bar Station", "Tandoor / Main", "Pantry / Cafe"];

  return (
    <div className="space-y-4 pb-8">
      {/* 1. KDS TOP METRICS STRIP (KpiCard Primitives) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Active Kitchen Orders"
          value={activeCount.toString()}
          accent="brand"
          suffix="tickets"
        />
        <KpiCard
          label="Queued / Pending"
          value={queuedTickets.length.toString()}
          accent="warning"
          suffix="tickets"
        />
        <KpiCard
          label="Preparing on Stove"
          value={preparingTickets.length.toString()}
          accent="info"
          suffix="tickets"
        />
        <KpiCard
          label="Overdue (>15 mins)"
          value={overdueCount.toString()}
          accent={overdueCount > 0 ? "error" : "success"}
          deltaTone={overdueCount > 0 ? "error" : "success"}
          delta={overdueCount > 0 ? "Needs kitchen push" : "On schedule"}
        />
      </div>

      {/* 2. TOP TOOLBAR & VIEW SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-e1">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-tint border border-primary/20 text-primary">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[16px] font-bold text-text-primary leading-tight">
                Kitchen Display System (KDS)
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2.5 py-0.5 text-[10.5px] font-bold text-primary border border-primary/20">
                <Flame className="h-3 w-3 text-primary animate-pulse" />
                Live KDS Feed
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Real-time bump bar & kitchen ticket workflow
            </p>
          </div>
        </div>

        {/* Controls Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Selector */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {stations.map((stn) => (
              <button
                key={stn}
                type="button"
                onClick={() => setStationFilter(stn)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer border",
                  stationFilter === stn
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-surface border-border text-slate-700 hover:bg-surface-2",
                )}
              >
                {stn}
              </button>
            ))}
          </div>

          {/* Kanban vs Grid Switcher */}
          <div className="flex items-center bg-surface-2 p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-1.5 rounded-md transition cursor-pointer",
                viewMode === "kanban" ? "bg-surface text-primary shadow-xs font-bold" : "text-slate-500 hover:text-black",
              )}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition cursor-pointer",
                viewMode === "grid" ? "bg-surface text-primary shadow-xs font-bold" : "text-slate-500 hover:text-black",
              )}
              title="Data Grid Ledger View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[11.5px] font-bold text-slate-700 hover:bg-surface-2 shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 3. KANBAN DISPLAY VIEW */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* QUEUED COLUMN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                  1. Queued ({queuedTickets.length})
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-amber-800">Ready to Cook</span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {queuedTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-surface rounded-2xl border border-dashed border-border">
                  No queued orders.
                </div>
              ) : (
                queuedTickets.map((kot: any) => (
                  <KdsTicketCard
                    key={kot.kotId}
                    kot={kot}
                    now={now}
                    onStart={() => handleStartCooking(kot.kotId)}
                    onReady={() => handleMarkReady(kot)}
                    onPrint={() => handlePrintDuplicate(kot)}
                    onView={() => setViewingKot(kot)}
                  />
                ))
              )}
            </div>
          </div>

          {/* PREPARING COLUMN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-indigo-600 animate-bounce" />
                <span className="font-bold text-xs text-indigo-900 uppercase tracking-wider">
                  2. Preparing ({preparingTickets.length})
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-indigo-800">On Fire</span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {preparingTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-surface rounded-2xl border border-dashed border-border">
                  No dishes currently on stove.
                </div>
              ) : (
                preparingTickets.map((kot: any) => (
                  <KdsTicketCard
                    key={kot.kotId}
                    kot={kot}
                    now={now}
                    onStart={() => handleStartCooking(kot.kotId)}
                    onReady={() => handleMarkReady(kot)}
                    onPrint={() => handlePrintDuplicate(kot)}
                    onView={() => setViewingKot(kot)}
                  />
                ))
              )}
            </div>
          </div>

          {/* READY COLUMN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
                  3. Ready to Serve ({readyTickets.length})
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-emerald-800">Runner Pickup</span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {readyTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-surface rounded-2xl border border-dashed border-border">
                  No orders waiting for pickup.
                </div>
              ) : (
                readyTickets.map((kot: any) => (
                  <KdsTicketCard
                    key={kot.kotId}
                    kot={kot}
                    now={now}
                    onStart={() => handleStartCooking(kot.kotId)}
                    onReady={() => handleMarkReady(kot)}
                    onPrint={() => handlePrintDuplicate(kot)}
                    onView={() => setViewingKot(kot)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 4. DATA GRID LEDGER VIEW */
        <PosDataGrid<any>
          data={filteredRecords}
          columns={columns}
          keyField="kotId"
          selectable={true}
          selectedRows={selectedKots}
          onSelectionChange={setSelectedKots}
          pageSize={8}
          pageSizeOptions={[8, 15, 25, 50]}
          emptyMessage="No kitchen tickets found matching current filters."
        />
      )}

      {/* VIEW KOT MODAL */}
      {viewingKot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-e3 space-y-3.5 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-[17px] font-bold text-text-primary">
                    KOT #{viewingKot.kotId}
                  </h3>
                  {viewingKot.isModified && (
                    <span className="rounded px-1.5 py-0.2 text-[10px] font-bold border border-warning/30 bg-warning-tint text-warning uppercase">
                      MODIFIED
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-text-secondary">{viewingKot.orderType}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingKot(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-surface-2 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-secondary">Location:</span>
                <span className="font-mono font-bold text-text-primary">
                  {viewingKot.tableNo ? `Table ${viewingKot.tableNo}` : "Dining Area"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-secondary">Guest / Captain:</span>
                <span className="font-bold text-text-primary">
                  {viewingKot.customerName || "Walk-in Guest"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-secondary">Created Time:</span>
                <span className="font-mono font-bold text-text-primary">{viewingKot.createdAt}</span>
              </div>

              <div className="py-1">
                <span className="text-text-secondary block mb-1 font-bold uppercase text-[10.5px]">
                  Ordered Dishes:
                </span>
                <div className="rounded-xl bg-surface-2/60 p-3 text-text-primary font-medium text-[12px] border border-border leading-relaxed space-y-1">
                  <div>{viewingKot.itemsText}</div>
                  {viewingKot.specialNotes && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded bg-warning-tint px-2 py-0.5 text-[10.5px] font-bold text-warning border border-warning/30">
                      Note: {viewingKot.specialNotes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              {viewingKot.currentStatus !== "Ready" ? (
                <button
                  type="button"
                  onClick={() => {
                    handleMarkReady(viewingKot);
                    setViewingKot(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground hover:bg-primary-pressed cursor-pointer shadow-e1 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark Ready for Pickup</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handlePrintDuplicate(viewingKot);
                    setViewingKot(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-[12px] font-bold text-text-primary hover:bg-surface-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-primary" />
                  <span>Print Duplicate KOT</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewingKot(null)}
                className="px-4 py-2 text-[12px] font-bold text-slate-600 hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUB-COMPONENT: KDS KANBAN TICKET CARD
// ----------------------------------------------------
function KdsTicketCard({
  kot,
  now,
  onStart,
  onReady,
  onPrint,
  onView,
}: {
  kot: any;
  now: number;
  onStart: () => void;
  onReady: () => void;
  onPrint: () => void;
  onView: () => void;
}) {
  const elapsedSeconds = Math.max(0, Math.floor((now - kot.createdTimestamp) / 1000));
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const remainingSecs = elapsedSeconds % 60;
  const isOverdue = elapsedMinutes >= 15 && kot.currentStatus !== "Ready";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-surface p-4 shadow-e1 transition-all space-y-3 relative overflow-hidden",
        isOverdue ? "border-error/50 ring-1 ring-error/30" : "border-border hover:shadow-e2",
      )}
    >
      {/* Overdue Top Warning Bar */}
      {isOverdue && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-error animate-pulse" />
      )}

      {/* Ticket Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-text-primary">
              #{kot.kotId}
            </span>
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-surface-2 text-text-primary border border-border">
              {kot.tableNo ? `Table ${kot.tableNo}` : kot.orderType}
            </span>
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>{kot.customerName || "Captain"}</span>
          </div>
        </div>

        {/* Live Elapsed Timer Badge */}
        <div
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold shrink-0",
            isOverdue
              ? "bg-error-tint text-error animate-pulse"
              : kot.currentStatus === "Ready"
                ? "bg-success-tint text-success"
                : "bg-surface-2 text-text-primary",
          )}
        >
          <Clock className="w-3 h-3" />
          <span>
            {elapsedMinutes}m {remainingSecs}s
          </span>
        </div>
      </div>

      {/* Item List with Highlighted Notes */}
      <div className="rounded-xl bg-surface-2/40 p-2.5 border border-border/80 space-y-1 text-[12px]">
        <div className="font-semibold text-text-primary leading-relaxed">
          {kot.itemsText}
        </div>
        {kot.specialNotes && (
          <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-warning-tint px-2 py-0.5 text-[10px] font-bold text-warning border border-warning/40">
            Note: {kot.specialNotes}
          </div>
        )}
      </div>

      {/* One-Tap Action Buttons */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <button
          type="button"
          onClick={onPrint}
          className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-2 text-slate-600 transition cursor-pointer"
          title="Print Duplicate KOT"
        >
          <Printer className="w-4 h-4" />
        </button>

        {kot.currentStatus === "Queued" && (
          <button
            type="button"
            onClick={onStart}
            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Cooking</span>
          </button>
        )}

        {kot.currentStatus === "Preparing" && (
          <button
            type="button"
            onClick={onReady}
            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-pressed font-bold text-xs shadow-e1 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Ready</span>
          </button>
        )}

        {kot.currentStatus === "Ready" && (
          <button
            type="button"
            onClick={onView}
            className="flex-1 py-2 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text-primary font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-primary" />
            <span>View Ticket</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default PosKotManager;
