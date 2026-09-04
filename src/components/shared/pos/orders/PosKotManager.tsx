import { useState, useMemo } from "react";
import {
  ChefHat,
  Search,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Filter,
  Check,
  ArrowRight,
  Flame,
} from "lucide-react";

interface KotItem {
  id: string;
  kotId: number;
  orderType: string;
  tableNo: string;
  customerName: string;
  customerPhone: string;
  itemCount: number;
  itemsText: string;
  status: "Pending" | "Preparing" | "Prepared" | "Served";
  billPrintDate: string;
  completeDuration: string;
  createdAt: string;
  filterTag: string;
  station: "Kitchen Main" | "Bar Station" | "Tandoor / Main" | "Pantry / Cafe";
}

const MOCK_KOT_RECORDS: KotItem[] = [
  {
    id: "kot-11",
    kotId: 11,
    orderType: "Dine In(G41)",
    tableNo: "G41",
    customerName: "Rahul Mehta",
    customerPhone: "9988776655",
    itemCount: 3,
    itemsText: "Chicken Biryani, Green Salad, Raita",
    status: "Prepared",
    billPrintDate: "--",
    completeDuration: "0 hr : 18 min",
    createdAt: "1 Sep 2026 13:05:10",
    filterTag: "All",
    station: "Kitchen Main",
  },
  {
    id: "kot-12",
    kotId: 12,
    orderType: "Room 204",
    tableNo: "204",
    customerName: "Aman Singhal",
    customerPhone: "9712345678",
    itemCount: 2,
    itemsText: "Club Sandwich, Cold Coffee",
    status: "Preparing",
    billPrintDate: "--",
    completeDuration: "0 hr : 08 min",
    createdAt: "1 Sep 2026 13:12:44",
    filterTag: "All",
    station: "Pantry / Cafe",
  },
  {
    id: "kot-13",
    kotId: 13,
    orderType: "Dine In(T-07)",
    tableNo: "T-07",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    itemCount: 4,
    itemsText: "Butter Chicken (1), Garlic Naan (3), Dal Makhani",
    status: "Pending",
    billPrintDate: "--",
    completeDuration: "0 hr : 04 min",
    createdAt: "1 Sep 2026 13:18:20",
    filterTag: "All",
    station: "Kitchen Main",
  },
  {
    id: "kot-14",
    kotId: 14,
    orderType: "Takeaway",
    tableNo: "Counter",
    customerName: "Karan Patel",
    customerPhone: "9123456780",
    itemCount: 2,
    itemsText: "Paneer Tikka, Mint Mojito",
    status: "Preparing",
    billPrintDate: "--",
    completeDuration: "0 hr : 12 min",
    createdAt: "1 Sep 2026 13:10:05",
    filterTag: "All",
    station: "Tandoor / Main",
  },
  {
    id: "kot-15",
    kotId: 15,
    orderType: "Dine In(T-12)",
    tableNo: "T-12",
    customerName: "Ananya Roy",
    customerPhone: "9811223344",
    itemCount: 3,
    itemsText: "Carlsberg Elephant (2), Crispy Corn",
    status: "Served",
    billPrintDate: "1 Sep 2026 13:22:00",
    completeDuration: "0 hr : 22 min",
    createdAt: "1 Sep 2026 12:55:18",
    filterTag: "All",
    station: "Bar Station",
  },
];

export function PosKotManager() {
  const [stationFilter, setStationFilter] = useState<string>("All");

  // Filters State
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-02");
  const [orderType, setOrderType] = useState("All");
  const [kotIdInput, setKotIdInput] = useState("");
  const [customerNameInput, setCustomerNameInput] = useState("");
  const [customerPhoneInput, setCustomerPhoneInput] = useState("");
  const [tableNoInput, setTableNoInput] = useState("");
  const [statusInput, setStatusInput] = useState("All");
  const [filterTagInput, setFilterTagInput] = useState("All");

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
    orderType: "All",
    kotId: "",
    customerName: "",
    customerPhone: "",
    tableNo: "",
    status: "All",
    filterTag: "All",
  });

  const [kotRecords, setKotRecords] = useState<KotItem[]>(MOCK_KOT_RECORDS);
  const [viewingKot, setViewingKot] = useState<KotItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleSearch = () => {
    setAppliedFilters({
      startDate,
      endDate,
      orderType,
      kotId: kotIdInput.trim(),
      customerName: customerNameInput.trim(),
      customerPhone: customerPhoneInput.trim(),
      tableNo: tableNoInput.trim(),
      status: statusInput,
      filterTag: filterTagInput,
    });
    setCurrentPage(1);
  };

  const handleShowAll = () => {
    setStartDate("2026-09-01");
    setEndDate("2026-09-02");
    setOrderType("All");
    setKotIdInput("");
    setCustomerNameInput("");
    setCustomerPhoneInput("");
    setTableNoInput("");
    setStatusInput("All");
    setFilterTagInput("All");
    setAppliedFilters({
      startDate: "",
      endDate: "",
      orderType: "All",
      kotId: "",
      customerName: "",
      customerPhone: "",
      tableNo: "",
      status: "All",
      filterTag: "All",
    });
    setStationFilter("All");
    setCurrentPage(1);
  };

  const filteredRecords = useMemo(() => {
    return kotRecords.filter((k) => {
      if (stationFilter !== "All" && k.station !== stationFilter) return false;

      if (appliedFilters.orderType !== "All") {
        if (appliedFilters.orderType === "Dine In" && !k.orderType.includes("Dine In")) return false;
        if (appliedFilters.orderType === "Takeaway" && !k.orderType.includes("Takeaway")) return false;
        if (appliedFilters.orderType === "Room Service" && !k.orderType.includes("Room")) return false;
      }

      if (appliedFilters.kotId && !k.kotId.toString().includes(appliedFilters.kotId)) return false;

      if (
        appliedFilters.customerName &&
        !k.customerName.toLowerCase().includes(appliedFilters.customerName.toLowerCase())
      ) {
        return false;
      }

      if (appliedFilters.customerPhone && !k.customerPhone.includes(appliedFilters.customerPhone)) {
        return false;
      }

      if (
        appliedFilters.tableNo &&
        !k.tableNo.toLowerCase().includes(appliedFilters.tableNo.toLowerCase())
      ) {
        return false;
      }

      if (appliedFilters.status !== "All" && k.status !== appliedFilters.status) return false;

      return true;
    });
  }, [kotRecords, appliedFilters, stationFilter]);

  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  const handleUpdateStatus = (id: string, newStatus: KotItem["status"]) => {
    setKotRecords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: newStatus } : k))
    );
    if (viewingKot && viewingKot.id === id) {
      setViewingKot((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const getNextStatus = (status: KotItem["status"]) => {
    switch (status) {
      case "Pending":
        return { next: "Preparing" as const, label: "Start Cooking" };
      case "Preparing":
        return { next: "Prepared" as const, label: "Mark Prepared" };
      case "Prepared":
        return { next: "Served" as const, label: "Mark Served" };
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "KOT ID",
      "Station",
      "Order Type",
      "Table No",
      "Customer Name",
      "Customer Phone",
      "Items",
      "Status",
      "Complete Duration",
      "Created At",
    ];
    const rows = filteredRecords.map((k) => [
      k.kotId,
      `"${k.station}"`,
      `"${k.orderType}"`,
      `"${k.tableNo}"`,
      `"${k.customerName}"`,
      k.customerPhone,
      `"${k.itemsText}"`,
      k.status,
      `"${k.completeDuration}"`,
      `"${k.createdAt}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KOT_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stations = ["All", "Kitchen Main", "Bar Station", "Tandoor / Main", "Pantry / Cafe"];

  return (
    <div className="space-y-2.5 pb-8">
      {/* 1. TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-teal-50 border border-teal-300 text-teal-700">
            <ChefHat className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">Kitchen Order Tickets (KOT)</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.2 text-[10.5px] font-bold text-teal-800 border border-teal-300">
                <Flame className="h-2.5 w-2.5 text-teal-600 animate-pulse" />
                Live Kitchen Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Real-time station ticket queue & preparation logs</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-teal-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. STATION FILTER PILLS & SEARCH FILTER CARD */}
      <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs space-y-2.5">
        {/* Station Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] font-bold text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-500" /> Station:
            </span>
            {stations.map((stn) => (
              <button
                key={stn}
                type="button"
                onClick={() => {
                  setStationFilter(stn);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-3 py-1 text-[11.5px] font-bold transition cursor-pointer border ${
                  stationFilter === stn
                    ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                {stn}
              </button>
            ))}
          </div>

          <div className="text-[12px] font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{totalRecords}</span> tickets
          </div>
        </div>

        {/* Compact Search Filter Bar */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 items-end">
          {/* Order Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Order Type</label>
            <div className="relative">
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="h-8.5 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-2.5 pr-7 text-[11.5px] font-medium text-slate-700 focus:border-teal-500 focus:outline-hidden cursor-pointer shadow-2xs"
              >
                <option>All</option>
                <option>Dine In</option>
                <option>Takeaway</option>
                <option>Room Service</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Status</label>
            <div className="relative">
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="h-8.5 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-2.5 pr-7 text-[11.5px] font-medium text-slate-700 focus:border-teal-500 focus:outline-hidden cursor-pointer shadow-2xs"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Preparing</option>
                <option>Prepared</option>
                <option>Served</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* KOT ID */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">KOT ID</label>
            <input
              type="text"
              placeholder="e.g. 11"
              value={kotIdInput}
              onChange={(e) => setKotIdInput(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-[11.5px] font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Customer / Table */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Customer / Table</label>
            <input
              type="text"
              placeholder="e.g. Rahul / G41"
              value={customerNameInput}
              onChange={(e) => setCustomerNameInput(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-[11.5px] font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Filter Action Buttons */}
          <div className="col-span-2 flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSearch}
              className="flex-1 flex h-8.5 items-center justify-center gap-1 rounded-lg bg-teal-700 text-[11.5px] font-bold text-white hover:bg-teal-800 cursor-pointer shadow-2xs transition"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={handleShowAll}
              className="flex-1 flex h-8.5 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-[11.5px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs transition"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* 3. STRUCTURED KOT LEDGER TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100/90 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <th className="py-2.5 px-3">KOT & Station</th>
                <th className="py-2.5 px-3">Order & Location</th>
                <th className="py-2.5 px-3">Customer Details</th>
                <th className="py-2.5 px-3">Items Ordered</th>
                <th className="py-2.5 px-3">Prep Duration</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No kitchen tickets found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((kot) => {
                  const next = getNextStatus(kot.status);

                  return (
                    <tr key={kot.id} className="hover:bg-slate-50/70 transition">
                      {/* KOT & Station */}
                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] font-black text-slate-900">
                            #{kot.kotId}
                          </span>
                          <span className="rounded px-2 py-0.5 text-[10px] font-bold border border-slate-300 bg-slate-100 text-slate-800">
                            {kot.station}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5">
                          {kot.createdAt}
                        </div>
                      </td>

                      {/* Order & Location */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-bold text-slate-900 text-[12.5px]">
                          {kot.orderType}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Table: <span className="font-semibold text-slate-700">{kot.tableNo}</span>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-semibold text-slate-800 text-[12px]">
                          {kot.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {kot.customerPhone}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-semibold text-slate-800 max-w-xs text-[11.5px] leading-relaxed">
                          {kot.itemsText}
                        </div>
                        <div className="mt-0.5 text-[10.5px] text-slate-500 font-medium">
                          {kot.itemCount} items
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-1 text-[11.5px] font-semibold text-slate-700">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{kot.completeDuration}</span>
                        </div>
                        {kot.billPrintDate !== "--" && (
                          <div className="text-[10px] text-teal-700 font-medium mt-0.5">
                            Billed: {kot.billPrintDate}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 align-top text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                            kot.status === "Served"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : kot.status === "Prepared"
                              ? "bg-teal-50 text-teal-800 border-teal-300"
                              : "bg-slate-50 text-slate-800 border-slate-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              kot.status === "Served"
                                ? "bg-slate-500"
                                : kot.status === "Prepared"
                                ? "bg-teal-600"
                                : "bg-teal-500 animate-pulse"
                            }`}
                          />
                          {kot.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {next && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(kot.id, next.next)}
                              className="flex h-7.5 items-center gap-1 rounded-lg bg-teal-700 px-2.5 text-[11px] font-bold text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs"
                            >
                              <span>{next.label}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setViewingKot(kot)}
                            className="flex h-7.5 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                          >
                            <Eye className="h-3 w-3 text-slate-500" />
                            <span>View</span>
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

      {/* VIEW KOT MODAL */}
      {viewingKot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-extrabold text-slate-900">KOT #{viewingKot.kotId}</h3>
                  <span className="rounded px-1.5 py-0.2 text-[10px] font-bold border border-slate-300 bg-slate-100 text-slate-800">
                    {viewingKot.station}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{viewingKot.orderType} · Table {viewingKot.tableNo}</p>
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
                <span className="font-bold text-slate-900">{viewingKot.customerName} ({viewingKot.customerPhone})</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-slate-900">{viewingKot.completeDuration} (Created: {viewingKot.createdAt})</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-teal-800">{viewingKot.status}</span>
              </div>

              <div className="py-0.5">
                <span className="text-slate-500 block mb-1 font-semibold">Ordered Items:</span>
                <div className="rounded-lg bg-slate-50 p-2.5 text-slate-800 font-medium text-[11.5px] border border-slate-200 leading-relaxed">
                  {viewingKot.itemsText}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
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
    </div>
  );
}

export default PosKotManager;
