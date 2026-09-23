import { useState, useMemo } from "react";
import {
  ChefHat,
  Search,
  ChevronDown,
  FileSpreadsheet,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Filter,
  Check,
  Flame,
  Utensils,
  Receipt,
  Sparkles,
  MoreVertical,
  FileText,
} from "lucide-react";
import { useKotOrders, useMarkKotPreparedMutation } from "@/hooks/queries/usePosOrders";
import { PosDataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { toast } from "sonner";

export function PosKotManager() {
  const [stationFilter, setStationFilter] = useState<string>("All");

  // Filters State
  const [orderType, setOrderType] = useState("All");
  const [kotIdInput, setKotIdInput] = useState("");
  const [customerNameInput, setCustomerNameInput] = useState("");
  const [statusInput, setStatusInput] = useState("All");
  const [showSymbolGuide, setShowSymbolGuide] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    orderType: "All",
    kotId: "",
    customerName: "",
    status: "All",
  });

  const { data: kotData } = useKotOrders();
  const markPreparedMutation = useMarkKotPreparedMutation();

  const [viewingKot, setViewingKot] = useState<any | null>(null);
  const [selectedKots, setSelectedKots] = useState<any[]>([]);

  const kotRecords = useMemo(() => {
    return kotData?.records || [];
  }, [kotData]);

  const handleSearch = () => {
    setAppliedFilters({
      orderType,
      kotId: kotIdInput.trim(),
      customerName: customerNameInput.trim(),
      status: statusInput,
    });
  };

  const handleShowAll = () => {
    setOrderType("All");
    setKotIdInput("");
    setCustomerNameInput("");
    setStatusInput("All");
    setAppliedFilters({
      orderType: "All",
      kotId: "",
      customerName: "",
      status: "All",
    });
    setStationFilter("All");
  };

  const filteredRecords = useMemo(() => {
    return kotRecords.filter((k: any) => {
      if (stationFilter !== "All") {
        if (stationFilter === "Bar Station" && !k.orderType.toLowerCase().includes("bar"))
          return false;
      }

      if (appliedFilters.orderType !== "All") {
        if (appliedFilters.orderType === "Dine In" && !k.orderType.includes("Dine In"))
          return false;
        if (appliedFilters.orderType === "Takeaway" && !k.orderType.includes("Takeaway"))
          return false;
        if (appliedFilters.orderType === "Room Service" && !k.orderType.includes("Room"))
          return false;
      }

      if (appliedFilters.kotId && !k.kotId.toString().includes(appliedFilters.kotId)) return false;

      if (
        appliedFilters.customerName &&
        !k.customerName.toLowerCase().includes(appliedFilters.customerName.toLowerCase()) &&
        !k.orderType.toLowerCase().includes(appliedFilters.customerName.toLowerCase())
      ) {
        return false;
      }

      if (appliedFilters.status !== "All") {
        if (appliedFilters.status === "Prepared" && k.status !== "Prepared") return false;
        if (
          appliedFilters.status === "Pending" &&
          k.status !== "Pending" &&
          k.status !== "Not Prepared" &&
          k.status !== "Preparing"
        )
          return false;
      }

      return true;
    });
  }, [kotRecords, appliedFilters, stationFilter]);

  // Chef Single-Click Prepared Action
  const handleChefMarkPrepared = (kot: any) => {
    markPreparedMutation.mutate(kot.kotId, {
      onSuccess: () => {
        toast.success(`KOT #${kot.kotId} Prepared!`, {
          description: `Bill generated and automatically sent to Due Payment for ${kot.orderType}`,
        });
      },
      onError: () => {
        toast.error("Failed to update KOT status");
      },
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "KOT ID",
      "Order Type",
      "Customer Name",
      "Customer Phone",
      "Items",
      "Status",
      "Complete Duration",
      "Created At",
    ];
    const rows = filteredRecords.map((k: any) => [
      k.kotId,
      `"${k.orderType}"`,
      `"${k.customerName}"`,
      k.customerPhone,
      `"${k.itemsText}"`,
      k.status,
      `"${k.completeDuration}"`,
      `"${k.createdAt}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KOT_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Definition of DataGrid Columns matching Enterprise Grid
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
              <span className="font-mono text-[13.5px] font-black text-slate-900">
                #{kot.kotId}
              </span>
              {kot.isModified && (
                <span className="rounded px-1.5 py-0.2 text-[9.5px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                  Updated
                </span>
              )}
            </div>
            <div className="text-[10.5px] text-slate-400 mt-0.5">{kot.createdAt}</div>
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
            <div className="font-bold text-slate-900 text-[12.5px]">{kot.orderType}</div>
            <div className="text-[11px] text-slate-500">
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
            <div className="font-semibold text-slate-800 text-[12px]">
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
        header: "Items Ordered",
        sortable: true,
        filterable: true,
        getValue: (row) => row.itemsText,
        render: (_val, kot) => (
          <div>
            <div className="font-semibold text-slate-800 text-[12px] leading-relaxed max-w-md">
              {kot.itemsText}
            </div>
            <div className="mt-0.5 text-[10.5px] text-teal-700 font-medium">
              {kot.itemCount} items ordered
            </div>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "90px",
        align: "center",
        sortable: true,
        filterable: true,
        getValue: (row) => (row.status === "Prepared" || row.status === "Served" ? "Prepared" : "In Kitchen"),
        render: (_val, kot) => {
          const isPrepared = kot.status === "Prepared" || kot.status === "Served";
          return isPrepared ? (
            <span
              title="Prepared · Sent to Billing"
              className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 shadow-2xs"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          ) : (
            <span
              title="In Kitchen (Cooking)"
              className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs"
            >
              <Flame className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
            </span>
          );
        },
      },
      {
        key: "actions",
        header: "Actions",
        width: "110px",
        align: "right",
        sortable: false,
        filterable: false,
        headerRender: () => (
          <div className="flex items-center justify-end gap-1.5 w-full">
            <span>Actions</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSymbolGuide(true);
              }}
              className="flex h-5.5 w-5.5 items-center justify-center rounded-md border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 shadow-2xs transition cursor-pointer"
              title="Symbols Guide (Notepad)"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
        render: (_val, kot) => {
          const isPrepared = kot.status === "Prepared" || kot.status === "Served";
          return (
            <div className="flex items-center justify-end gap-1.5">
              {!isPrepared && (
                <button
                  type="button"
                  onClick={() => handleChefMarkPrepared(kot)}
                  title="1-Click Mark Prepared (Sends bill to frontdesk due payment)"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition cursor-pointer active:scale-95"
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewingKot(kot)}
                title="View Full Ticket Details"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const stations = ["All", "Kitchen Main", "Bar Station", "Tandoor / Main", "Pantry / Cafe"];

  return (
    <div className="space-y-2.5 pb-8">
      {/* 1. TOP HEADER & STATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-teal-50 border border-teal-300 text-teal-700">
            <ChefHat className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">
                Kitchen Orders (KOT)
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.2 text-[10.5px] font-bold text-teal-800 border border-teal-300">
                <Flame className="h-2.5 w-2.5 text-teal-600 animate-pulse" />
                Live Kitchen Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Chef ticket queue: 1-click &quot;Prepared&quot; sends bill directly to Frontdesk Due Payment
            </p>
          </div>
        </div>

        {/* Station Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-slate-400" /> Station:
          </span>
          {stations.map((stn) => (
            <button
              key={stn}
              type="button"
              onClick={() => setStationFilter(stn)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer border ${
                stationFilter === stn
                  ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {stn}
            </button>
          ))}

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex h-7.5 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer ml-1"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-teal-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. REUSABLE ENTERPRISE DATA GRID WITH BUILT-IN 3-LINE FILTERS & SORT */}
      <PosDataGrid<any>
        data={filteredRecords}
        columns={columns}
        keyField="id"
        selectable={true}
        selectedRows={selectedKots}
        onSelectionChange={setSelectedKots}
        pageSize={8}
        pageSizeOptions={[8, 15, 25, 50]}
        emptyMessage="No kitchen tickets found matching current filters."
      />

      {/* VIEW KOT MODAL */}
      {viewingKot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-extrabold text-slate-900">
                    KOT #{viewingKot.kotId}
                  </h3>
                  {viewingKot.isModified && (
                    <span className="rounded px-1.5 py-0.2 text-[10px] font-bold border border-amber-300 bg-amber-100 text-amber-900">
                      MODIFIED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{viewingKot.orderType}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingKot(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">
                  {viewingKot.customerName || "Walk-in Guest"}{" "}
                  {viewingKot.customerPhone !== "--" && `(${viewingKot.customerPhone})`}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Created:</span>
                <span className="font-bold text-slate-900">{viewingKot.createdAt}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-teal-800">{viewingKot.status}</span>
              </div>

              <div className="py-0.5">
                <span className="text-slate-500 block mb-1 font-semibold">Ordered Dishes:</span>
                <div className="rounded-lg bg-slate-50 p-2.5 text-slate-800 font-medium text-[11.5px] border border-slate-200 leading-relaxed">
                  {viewingKot.itemsText}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              {viewingKot.status !== "Prepared" && viewingKot.status !== "Served" ? (
                <button
                  type="button"
                  onClick={() => {
                    handleChefMarkPrepared(viewingKot);
                    setViewingKot(null);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-[12px] font-bold text-white hover:bg-teal-800 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark Prepared & Send to Billing</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-teal-800">Sent to Billing</span>
              )}

              <button
                type="button"
                onClick={() => setViewingKot(null)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYMBOLS NOTEPAD MODAL GUIDE */}
      {showSymbolGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdfa] p-5 shadow-2xl border border-amber-300/80 space-y-3.5 relative overflow-hidden ring-1 ring-amber-400/20">
            {/* Notepad Top Strip */}
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                  <FileText className="h-4.5 w-4.5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-[14.5px] font-black text-amber-950">
                    KOT Symbols Guide · Notepad
                  </h3>
                  <p className="text-[11px] text-amber-800/80">
                    Symbol meaning & 1-click action reference
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSymbolGuide(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-amber-100/80 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notepad Ruled List */}
            <div className="space-y-2.5 text-[12px] bg-white rounded-xl p-3.5 border border-amber-200/60 shadow-2xs divide-y divide-amber-100/60">
              <div className="flex items-start gap-3 py-1.5 first:pt-0">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white shadow-2xs">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">✓ Tick Button (Prepared):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Chef 1-click action to mark food prepared. Automatically routes the bill to Frontdesk Due Payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-2xs">
                  <Eye className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">👁️ Eye Icon (View):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Opens full KOT ticket dish itemization, customer name, phone, table location, and notes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  <Flame className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">🔥 Flame Symbol (In Kitchen):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Ticket is in the kitchen queue currently being cooked by the chef.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">✓ Green Tick (Prepared):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Cooking completed and dishes are ready for pickup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-teal-700">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">📄 Receipt Symbol (Sent to Billing):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Bill generated and waiting in Frontdesk Due Settlement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5 last:pb-0">
                <span className="rounded px-1.5 py-0.5 text-[9.5px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase shrink-0">
                  UPDATED
                </span>
                <div>
                  <span className="font-extrabold text-slate-900">Modified KOT Badge:</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Frontdesk modified the order (added/deleted items) after initial placement.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowSymbolGuide(false)}
                className="rounded-lg bg-amber-900 px-4 py-1.5 text-[11.5px] font-bold text-white hover:bg-amber-950 cursor-pointer shadow-2xs transition active:scale-98"
              >
                Close Notepad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosKotManager;

