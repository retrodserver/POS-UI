import { useState, useMemo } from "react";
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
} from "lucide-react";
import { useOnlineOrders } from "@/hooks/queries/usePosOrders";
import type { OnlineOrderItem } from "@/types/posOrders";

export function PosOnlineOrdersManager() {
  const [platformTab, setPlatformTab] = useState<"all" | "zomato" | "swiggy" | "direct_web">("all");
  const [recordType, setRecordType] = useState("Last 24 Hrs");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchOrderNo, setSearchOrderNo] = useState("");
  const [selectedRange, setSelectedRange] = useState("Last 5 Days Orders");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { data } = useOnlineOrders();
  const [orders, setOrders] = useState<OnlineOrderItem[]>(() => data?.records ?? []);
  const [viewingOrder, setViewingOrder] = useState<OnlineOrderItem | null>(null);

  // Filter logic
  const filteredRecords = useMemo(() => {
    return orders.filter((r) => {
      if (platformTab !== "all" && r.platform !== platformTab) return false;

      if (statusFilter !== "All Status") {
        if (statusFilter === "In Kitchen" && r.status !== "in_kitchen") return false;
        if (statusFilter === "Food Ready" && r.status !== "food_ready") return false;
        if (statusFilter === "Out For Delivery" && r.status !== "out_for_delivery") return false;
        if (statusFilter === "Delivered" && r.status !== "delivered") return false;
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

  const handleUpdateStatus = (id: string, newStatus: OnlineOrderItem["status"], display: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === id ? { ...ord, status: newStatus, statusDisplay: display } : ord
      )
    );
    if (viewingOrder && viewingOrder.id === id) {
      setViewingOrder((prev) =>
        prev ? { ...prev, status: newStatus, statusDisplay: display } : null
      );
    }
  };

  const getNextStage = (status: OnlineOrderItem["status"]) => {
    switch (status) {
      case "in_kitchen":
        return { nextStatus: "food_ready" as const, nextLabel: "Food Ready", buttonText: "Mark Ready" };
      case "food_ready":
        return { nextStatus: "out_for_delivery" as const, nextLabel: "Out For Delivery", buttonText: "Dispatch" };
      case "out_for_delivery":
        return { nextStatus: "delivered" as const, nextLabel: "Delivered", buttonText: "Mark Delivered" };
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order No", "Platform", "Outlet", "Order Type", "Rider Details", "Customer", "Phone", "OTP", "Date Time", "Total", "Status"];
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
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Online_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`);
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
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">Online Aggregator Hub</h1>
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
                      selectedRange === r ? "bg-teal-50 text-teal-800 font-bold" : "text-slate-600 hover:bg-slate-50"
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

      {/* 3. STRUCTURED TABLE FORM VIEW */}
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100/90 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <th className="py-2.5 px-3">Order & Platform</th>
                <th className="py-2.5 px-3">Customer & Rider</th>
                <th className="py-2.5 px-3">Items Summary</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Lifecycle Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No online orders found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((ord) => {
                  const next = getNextStage(ord.status);

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                      {/* Order & Platform */}
                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] font-extrabold text-slate-900">
                            #{ord.orderNo}
                          </span>
                          <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-300 bg-slate-100 text-slate-800">
                            {ord.platform === "direct_web" ? "Direct Web" : ord.platform}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500 font-medium">
                          {ord.outletName}
                        </div>
                        <div className="text-[10.5px] text-slate-400">
                          {ord.dateTime}
                        </div>
                      </td>

                      {/* Customer & Rider */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-bold text-slate-900 text-[12.5px]">
                          {ord.customerName}
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono">
                          Ph: {ord.customerPhone}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10.5px] text-slate-500">
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono font-bold text-slate-700 border border-slate-300">
                            OTP: {ord.otp}
                          </span>
                          <span>·</span>
                          <span className="truncate max-w-[140px] text-slate-600 font-medium">
                            {ord.riderDetails}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-semibold text-slate-800 max-w-xs text-[11.5px] leading-relaxed">
                          {ord.itemsText}
                        </div>
                        <div className="mt-0.5 text-[10.5px] text-slate-500 font-medium">
                          {ord.itemCount} items
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 align-top text-right">
                        <div className="font-black text-[13.5px] text-slate-900">
                          {ord.totalAmountFormatted}
                        </div>
                        <div className="text-[10.5px] text-teal-700 font-semibold">
                          Prepaid Online
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 align-top text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                            ord.status === "delivered"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : "bg-teal-50 text-teal-800 border-teal-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              ord.status === "delivered" ? "bg-slate-500" : "bg-teal-600 animate-pulse"
                            }`}
                          />
                          {ord.statusDisplay}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {next && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(ord.id, next.nextStatus, next.nextLabel)}
                              className="flex h-7.5 items-center gap-1 rounded-lg bg-teal-700 px-2.5 text-[11px] font-bold text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs"
                            >
                              <span>{next.buttonText}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setViewingOrder(ord)}
                            className="flex h-7.5 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                          >
                            <Eye className="h-3 w-3 text-slate-500" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Snug Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 text-[11.5px] text-slate-600">
          <div>
            Showing <strong className="text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</strong> to{" "}
            <strong className="text-slate-800">{Math.min(startIndex + pageSize, totalRecords)}</strong> of{" "}
            <strong className="text-slate-800">{totalRecords}</strong> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              First
            </button>
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Prev
            </button>
            <span className="px-2 font-bold text-teal-800">
              Page {validPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Next
            </button>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* VIEW ORDER DETAIL MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-extrabold text-slate-900">Order #{viewingOrder.orderNo}</h3>
                  <span className="rounded px-1.5 py-0.2 text-[10px] font-bold border border-slate-300 bg-slate-100 text-slate-800 uppercase">
                    {viewingOrder.platform}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{viewingOrder.outletName} · {viewingOrder.dateTime}</p>
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
                <span className="font-bold text-slate-900">{viewingOrder.customerName} ({viewingOrder.customerPhone})</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Rider & OTP:</span>
                <span className="font-bold text-slate-900">{viewingOrder.riderDetails} (OTP: {viewingOrder.otp})</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-teal-800">{viewingOrder.statusDisplay}</span>
              </div>

              <div className="py-0.5">
                <span className="text-slate-500 block mb-1 font-semibold">Items Ordered:</span>
                <div className="rounded-lg bg-slate-50 p-2 text-slate-800 font-medium text-[11.5px] border border-slate-200 leading-relaxed">
                  {viewingOrder.itemsText}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-600 font-bold">Total Bill:</span>
                <span className="font-black text-[15px] text-slate-900">{viewingOrder.totalAmountFormatted}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                Close
              </button>
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
                <h3 className="text-[14px] font-bold text-slate-900">Aggregator Integration Support</h3>
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
              Real-time webhook sync is active for <strong>Zomato Partner API</strong>, <strong>Swiggy UrbanPiper</strong>, and <strong>Direct Online Store</strong>. Orders automatically populate the kitchen queue upon placement.
            </p>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-[11.5px] space-y-1 text-slate-700">
              <div><strong>Webhook Health:</strong> <span className="text-teal-700 font-bold">● Connected (99.98% uptime)</span></div>
              <div><strong>Avg Acceptance SLA:</strong> 42 seconds</div>
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
