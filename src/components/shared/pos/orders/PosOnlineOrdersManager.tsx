import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Headphones,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  ShoppingBag,
  X,
  Bike,
  Calendar,
  ChefHat,
  Truck,
  ArrowRight,
  Filter,
  Check,
  Sparkles,
  XCircle,
  BellRing,
  FileText,
} from "lucide-react";
import {
  useOnlineOrders,
  useAcceptOnlineOrderMutation,
  useCancelOnlineOrderMutation,
} from "@/hooks/queries/usePosOrders";
import { dispatchNewOnlineOrder } from "@/services/posOrdersService";
import type { OnlineOrderItem } from "@/types/posOrders";
import { PosDataGrid } from "@/components/ui/data-grid";

export function PosOnlineOrdersManager() {
  const [platformTab, setPlatformTab] = useState<"all" | "zomato" | "swiggy" | "direct_web">("all");
  const [recordType, setRecordType] = useState("Last 24 Hrs");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchOrderNo, setSearchOrderNo] = useState("");
  const [selectedRange, setSelectedRange] = useState("Last 5 Days Orders");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showSymbolGuide, setShowSymbolGuide] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { data } = useOnlineOrders();
  const [orders, setOrders] = useState<OnlineOrderItem[]>(() => data?.records ?? []);
  const [viewingOrder, setViewingOrder] = useState<OnlineOrderItem | null>(null);

  const acceptMutation = useAcceptOnlineOrderMutation();
  const cancelMutation = useCancelOnlineOrderMutation();

  // Sync data whenever query updates
  useEffect(() => {
    if (data?.records) {
      setOrders(data.records);
    }
  }, [data?.records]);

  // Handle URL param `viewOrderId` to automatically open the target order
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get("viewOrderId");
      if (targetId && orders.length > 0) {
        const found = orders.find((o) => o.id === targetId);
        if (found) {
          setViewingOrder(found);
        }
      }
    }
  }, [orders]);

  // Filter logic
  const filteredRecords = useMemo(() => {
    return orders.filter((r) => {
      if (platformTab !== "all" && r.platform !== platformTab) return false;

      if (statusFilter !== "All Status") {
        if (statusFilter === "New (Placed)" && r.status !== "placed") return false;
        if (statusFilter === "In Kitchen" && r.status !== "in_kitchen") return false;
        if (statusFilter === "Food Ready" && r.status !== "food_ready") return false;
        if (statusFilter === "Out For Delivery" && r.status !== "out_for_delivery") return false;
        if (statusFilter === "Delivered" && r.status !== "delivered") return false;
        if (statusFilter === "Cancelled" && r.status !== "cancelled") return false;
      }

      if (searchOrderNo.trim()) {
        const q = searchOrderNo.toLowerCase();
        const matchesNo = r.orderNo.toLowerCase().includes(q);
        const matchesCustomer = r.customerName.toLowerCase().includes(q);
        const matchesOtp = r.otp.includes(q);
        if (!matchesNo && !matchesCustomer && !matchesOtp) return false;
      }

      return true;
    });
  }, [orders, platformTab, statusFilter, searchOrderNo]);

  // Pagination calculation
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  const handleAcceptToKitchen = (id: string) => {
    acceptMutation.mutate(id, {
      onSuccess: () => {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === id
              ? { ...ord, status: "in_kitchen", statusDisplay: "In Kitchen (Prep)" }
              : ord,
          ),
        );
        if (viewingOrder && viewingOrder.id === id) {
          setViewingOrder((prev) =>
            prev
              ? { ...prev, status: "in_kitchen", statusDisplay: "In Kitchen (Prep)" }
              : null,
          );
        }
      },
    });
  };

  const handleCancelOrder = (id: string) => {
    cancelMutation.mutate(id, {
      onSuccess: () => {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === id
              ? { ...ord, status: "cancelled", statusDisplay: "Cancelled / Rejected" }
              : ord,
          ),
        );
        if (viewingOrder && viewingOrder.id === id) {
          setViewingOrder((prev) =>
            prev
              ? { ...prev, status: "cancelled", statusDisplay: "Cancelled / Rejected" }
              : null,
          );
        }
      },
    });
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: OnlineOrderItem["status"],
    display: string,
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === id ? { ...ord, status: newStatus, statusDisplay: display } : ord,
      ),
    );
    if (viewingOrder && viewingOrder.id === id) {
      setViewingOrder((prev) =>
        prev ? { ...prev, status: newStatus, statusDisplay: display } : null,
      );
    }
  };

  const getNextStage = (status: OnlineOrderItem["status"]) => {
    switch (status) {
      case "placed":
        return {
          nextStatus: "in_kitchen" as const,
          nextLabel: "In Kitchen (Prep)",
          buttonText: "Pass to KOT",
        };
      case "in_kitchen":
        return {
          nextStatus: "food_ready" as const,
          nextLabel: "Ready for Delivery Partner",
          buttonText: "Ready to Deliver",
        };
      case "food_ready":
        return {
          nextStatus: "out_for_delivery" as const,
          nextLabel: "With Delivery Partner",
          buttonText: "Handover to Rider",
        };
      case "out_for_delivery":
        return {
          nextStatus: "delivered" as const,
          nextLabel: "Delivered by Partner",
          buttonText: "Partner Delivered",
        };
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Order No",
      "Platform",
      "Outlet",
      "Order Type",
      "Rider Details",
      "Customer",
      "Phone",
      "OTP",
      "Date Time",
      "Total",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.orderNo,
      r.platform,
      `"${r.outletName}"`,
      `"${r.orderType}"`,
      `"${r.riderDetails}"`,
      `"${r.customerName}"`,
      r.customerPhone,
      r.otp,
      `"${r.dateTime}"`,
      `"${r.totalAmountFormatted}"`,
      `"${r.statusDisplay}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Online_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dateRanges = ["Today", "Yesterday", "Last 5 Days Orders", "Last 7 Days", "Last 30 Days"];

  const platformStats = {
    all: orders.length,
    zomato: orders.filter((o) => o.platform === "zomato").length,
    swiggy: orders.filter((o) => o.platform === "swiggy").length,
    direct_web: orders.filter((o) => o.platform === "direct_web").length,
  };

  return (
    <div className="space-y-2.5 pb-8">
      {/* 1. TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-teal-50 border border-teal-300 text-teal-700 font-bold">
            <Bike className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">
                Online Aggregator Hub
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.2 text-[10.5px] font-bold text-teal-800 border border-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Zomato, Swiggy & Direct Web Orders</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>{selectedRange}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRangeDropdown && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-slate-300 bg-white p-1 shadow-lg z-30 animate-in fade-in">
                {dateRanges.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRange(r);
                      setShowRangeDropdown(false);
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-[12px] transition cursor-pointer ${
                      selectedRange === r
                        ? "bg-teal-50 text-teal-800 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              dispatchNewOnlineOrder();
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-50 px-3 text-[11.5px] font-bold text-amber-900 hover:bg-amber-100 shadow-2xs transition cursor-pointer"
            title="Simulate incoming online order from Zomato/Swiggy"
          >
            <BellRing className="h-3.5 w-3.5 text-amber-700 animate-bounce" />
            <span>Simulate Incoming Order</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-teal-700" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHelpCenter(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <Headphones className="h-3.5 w-3.5 text-slate-500" />
            <span>Help Center</span>
          </button>
        </div>
      </div>

      {/* 2. PLATFORM TABS & FILTER BAR */}
      <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs space-y-2.5">
        {/* Channel Segmented Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] font-bold text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-500" /> Platform:
            </span>
            {(
              [
                { key: "all", label: "All Platforms", count: platformStats.all },
                { key: "zomato", label: "Zomato", count: platformStats.zomato },
                { key: "swiggy", label: "Swiggy", count: platformStats.swiggy },
                { key: "direct_web", label: "Direct Web", count: platformStats.direct_web },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setPlatformTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-3 py-1 text-[11.5px] font-bold transition cursor-pointer border ${
                  platformTab === tab.key
                    ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="text-[12px] font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{totalRecords}</span> online orders
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order #, Customer, Phone, or OTP..."
              value={searchOrderNo}
              onChange={(e) => {
                setSearchOrderNo(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8.5 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-[12px] font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500/30 transition shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8.5 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-700 focus:border-teal-500 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option>All Status</option>
              <option>In Kitchen</option>
              <option>Food Ready</option>
              <option>Out For Delivery</option>
              <option>Delivered</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Time Range */}
          <div className="relative min-w-[130px]">
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="h-8.5 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-700 focus:border-teal-500 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option>Last 24 Hrs</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {(searchOrderNo || statusFilter !== "All Status" || platformTab !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchOrderNo("");
                setStatusFilter("All Status");
                setPlatformTab("all");
                setCurrentPage(1);
              }}
              className="h-8.5 rounded-lg border border-slate-300 bg-slate-50 px-3 text-[11.5px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition shadow-2xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. STRUCTURED TABLE FORM VIEW WITH POSDATAGRID */}
      <PosDataGrid<OnlineOrderItem>
        data={filteredRecords}
        enableSelection={true}
        enablePagination={true}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        emptyMessage="No online orders found matching current filters."
        columns={[
          {
            id: "orderNo",
            header: "Order & Platform",
            accessorKey: "orderNo",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => `${row.orderNo} ${row.platform} ${row.outletName}`,
            minWidth: 160,
            cell: ({ row }) => (
              <div className="py-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[13px] font-extrabold text-slate-900">
                    #{row.orderNo}
                  </span>
                  <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-300 bg-slate-100 text-slate-800">
                    {row.platform === "direct_web" ? "Direct Web" : row.platform}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500 font-medium">
                  {row.outletName}
                </div>
                <div className="text-[10.5px] text-slate-400">{row.dateTime}</div>
              </div>
            ),
          },
          {
            id: "customerName",
            header: "Customer & Rider",
            accessorKey: "customerName",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => `${row.customerName} ${row.customerPhone} ${row.riderDetails}`,
            minWidth: 180,
            cell: ({ row }) => (
              <div className="py-1">
                <div className="font-bold text-slate-900 text-[12.5px]">{row.customerName}</div>
                <div className="text-[11px] text-slate-600 font-mono">Ph: {row.customerPhone}</div>
                <div className="mt-1 flex items-center gap-2 text-[10.5px] text-slate-500">
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono font-bold text-slate-700 border border-slate-300">
                    OTP: {row.otp}
                  </span>
                  <span>·</span>
                  <span className="truncate max-w-[130px] text-slate-600 font-medium">
                    {row.riderDetails}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: "itemsText",
            header: "Items Summary",
            accessorKey: "itemsText",
            minWidth: 200,
            cell: ({ row }) => (
              <div className="py-1">
                <div className="font-semibold text-slate-800 max-w-xs text-[11.5px] leading-relaxed">
                  {row.itemsText}
                </div>
                <div className="mt-0.5 text-[10.5px] text-slate-500 font-medium">
                  {row.itemCount} items
                </div>
              </div>
            ),
          },
          {
            id: "totalAmountFormatted",
            header: "Amount",
            align: "right",
            enableSorting: true,
            accessorKey: "totalAmountFormatted",
            cell: ({ row }) => (
              <div className="py-1 text-right">
                <div className="font-black text-[13.5px] text-slate-900">
                  {row.totalAmountFormatted}
                </div>
                <div className="text-[10.5px] text-teal-700 font-semibold">Prepaid Online</div>
              </div>
            ),
          },
          {
            id: "statusDisplay",
            header: "Lifecycle Status",
            align: "center",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => row.statusDisplay,
            cell: ({ row }) => (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                  row.status === "delivered"
                    ? "bg-slate-100 text-slate-700 border-slate-300"
                    : "bg-teal-50 text-teal-800 border-teal-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    row.status === "delivered" ? "bg-slate-500" : "bg-teal-600 animate-pulse"
                  }`}
                />
                {row.statusDisplay}
              </span>
            ),
          },
          {
            id: "actions",
            header: "Actions",
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
                  title="Online Order Symbols Guide (Notepad)"
                >
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
            ),
            cell: ({ row: ord }) => (
              <div className="flex items-center justify-end gap-1.5 py-1">
                {ord.status === "placed" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAcceptToKitchen(ord.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition cursor-pointer active:scale-95"
                      title="Pass to Kitchen KOT"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(ord.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-2xs transition cursor-pointer active:scale-95"
                      title="Cancel & Reject Order"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : ord.status === "in_kitchen" ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateStatus(
                        ord.id,
                        "food_ready",
                        "Ready for Delivery Partner",
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition cursor-pointer active:scale-95"
                    title="Ready for Delivery Partner"
                  >
                    <ChefHat className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div
                    title="Partner Managed (In Transit)"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-600 shadow-2xs"
                  >
                    <Bike className="h-3.5 w-3.5" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setViewingOrder(ord)}
                  title="View Full Order Details"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* ONLINE ORDERS SYMBOLS NOTEPAD MODAL */}
      {showSymbolGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdfa] p-5 shadow-2xl border border-amber-300/80 space-y-3.5 relative overflow-hidden ring-1 ring-amber-400/20">
            {/* Top Strip */}
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                  <FileText className="h-4.5 w-4.5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-[14.5px] font-black text-amber-950">
                    Online Order Symbols · Notepad
                  </h3>
                  <p className="text-[11px] text-amber-800/80">
                    Symbol meaning & quick actions reference
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

            {/* Ruled List */}
            <div className="space-y-2.5 text-[12px] bg-white rounded-xl p-3.5 border border-amber-200/60 shadow-2xs divide-y divide-amber-100/60">
              <div className="flex items-start gap-3 py-1.5 first:pt-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white shadow-2xs">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">✓ Tick Button (Pass to KOT):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Accepts incoming online order and routes ticket directly to the kitchen KOT queue.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rose-300 bg-rose-50 text-rose-700 shadow-2xs">
                  <X className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">✕ Cross Button (Cancel):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Rejects and cancels the order with Zomato/Swiggy aggregator.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white shadow-2xs">
                  <ChefHat className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">👨‍🍳 Chef Hat (Ready to Deliver):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Marks food cooking complete and signals delivery partner rider that items are packed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
                  <Bike className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">🏍️ Bike Symbol (Partner Managed):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Order has been handed to delivery partner (Zomato/Swiggy) and is out for delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1.5 last:pb-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-2xs">
                  <Eye className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">👁️ Eye Icon (Details):</span>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Opens complete customer info, rider phone, OTP verification, and item breakdown.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSymbolGuide(false)}
              className="w-full rounded-xl bg-amber-900 hover:bg-amber-950 py-2 text-[12.5px] font-bold text-amber-50 transition cursor-pointer shadow-2xs"
            >
              Close Notepad
            </button>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAIL MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-extrabold text-slate-900">
                    Order #{viewingOrder.orderNo}
                  </h3>
                  <span className="rounded px-1.5 py-0.2 text-[10px] font-bold border border-slate-300 bg-slate-100 text-slate-800 uppercase">
                    {viewingOrder.platform}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {viewingOrder.outletName} · {viewingOrder.dateTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">
                  {viewingOrder.customerName} ({viewingOrder.customerPhone})
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Rider & OTP:</span>
                <span className="font-bold text-slate-900">
                  {viewingOrder.riderDetails} (OTP: {viewingOrder.otp})
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-teal-800">{viewingOrder.statusDisplay}</span>
              </div>

              {/* Delivery partner info box when ready or in transit */}
              {viewingOrder.status !== "placed" && viewingOrder.status !== "cancelled" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-[11.5px] space-y-1 text-amber-950">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-amber-900">
                      <Bike className="h-3.5 w-3.5 text-amber-700" />
                      <span>Delivery Partner: {viewingOrder.platform.toUpperCase()}</span>
                    </span>
                    <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[10.5px] font-black text-amber-900 border border-amber-300">
                      OTP: {viewingOrder.otp}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800">
                    {viewingOrder.status === "in_kitchen"
                      ? "Cooking in kitchen. Click 'Ready to Deliver' once packed."
                      : viewingOrder.status === "food_ready"
                      ? "Food is ready & packed. Waiting for delivery partner rider pickup."
                      : "Handed over to delivery partner rider for delivery."}
                  </div>
                </div>
              )}

              <div className="py-0.5">
                <span className="text-slate-500 block mb-1 font-semibold">Items Ordered:</span>
                <div className="rounded-lg bg-slate-50 p-2 text-slate-800 font-medium text-[11.5px] border border-slate-200 leading-relaxed max-h-36 overflow-y-auto space-y-1">
                  {viewingOrder.items && viewingOrder.items.length > 0 ? (
                    viewingOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-0">
                        <span>{it.name} <strong className="text-teal-800 font-bold">× {it.quantity}</strong></span>
                        <span className="font-semibold text-slate-600">{it.priceFormatted}</span>
                      </div>
                    ))
                  ) : (
                    <div>{viewingOrder.itemsText || "Dishes"}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-600 font-bold">Total Bill:</span>
                <span className="font-black text-[15px] text-slate-900">
                  {viewingOrder.totalAmountFormatted}
                </span>
              </div>
            </div>

            {/* 2 Restaurant Actions: Action 1 = Pass to KOT | Action 2 = Ready to Deliver | Next is Delivery Partner */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2.5 border-t border-slate-200">
              {viewingOrder.status === "placed" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleCancelOrder(viewingOrder.id)}
                    className="flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-[11.5px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer shadow-2xs"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancel / Reject</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptToKitchen(viewingOrder.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-1.5 text-[12px] font-black text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />
                    <span>Pass to KOT</span>
                  </button>
                </>
              ) : viewingOrder.status === "in_kitchen" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setViewingOrder(null)}
                    className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateStatus(
                        viewingOrder.id,
                        "food_ready",
                        "Ready for Delivery Partner",
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-1.5 text-[12px] font-black text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs"
                  >
                    <ChefHat className="h-3.5 w-3.5 text-amber-300" />
                    <span>Ready to Deliver</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HELP CENTER MODAL */}
      {showHelpCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-teal-700" />
                <h3 className="text-[14px] font-bold text-slate-900">
                  Aggregator Integration Support
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpCenter(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[12px] text-slate-600 leading-relaxed">
              Real-time webhook sync is active for <strong>Zomato Partner API</strong>,{" "}
              <strong>Swiggy UrbanPiper</strong>, and <strong>Direct Online Store</strong>. Orders
              automatically populate the kitchen queue upon placement.
            </p>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-[11.5px] space-y-1 text-slate-700">
              <div>
                <strong>Webhook Health:</strong>{" "}
                <span className="text-teal-700 font-bold">● Connected (99.98% uptime)</span>
              </div>
              <div>
                <strong>Avg Acceptance SLA:</strong> 42 seconds
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowHelpCenter(false)}
                className="rounded-lg bg-teal-700 px-4 py-1.5 text-[11.5px] font-bold text-white hover:bg-teal-800 cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosOnlineOrdersManager;
