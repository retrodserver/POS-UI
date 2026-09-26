import { useState, useMemo } from "react";
import { Download, ChevronDown, Search, ArrowUpDown, CheckCircle2, Clock, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { DataTableHeader, DataTableFooter, type DataTableColumn } from "@/components/common";

interface PaymentTransaction {
  id: string;
  orderId: string;
  billNo: string;
  customerName: string;
  provider: "Razorpay" | "Pine Labs" | "Paytm" | "UPI" | "Cash";
  txnRef: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: "Success" | "Pending" | "Failed";
  timestamp: string;
}

const INITIAL_RECORDS: PaymentTransaction[] = [
  {
    id: "tx-101",
    orderId: "ORD-9842",
    billNo: "RET-2026-0812",
    customerName: "Rahul Sharma",
    provider: "UPI",
    txnRef: "UPI/2609028912/gpay",
    amount: 1450,
    fee: 0,
    netAmount: 1450,
    status: "Success",
    timestamp: "2026-09-02 12:45:10",
  },
  {
    id: "tx-102",
    orderId: "ORD-9843",
    billNo: "RET-2026-0813",
    customerName: "Pooja Verma",
    provider: "Pine Labs",
    txnRef: "PL-POS-78219401",
    amount: 2890,
    fee: 34.68,
    netAmount: 2855.32,
    status: "Success",
    timestamp: "2026-09-02 13:10:44",
  },
  {
    id: "tx-103",
    orderId: "ORD-9844",
    billNo: "RET-2026-0814",
    customerName: "Anand Gupta",
    provider: "Razorpay",
    txnRef: "pay_Nk829xLq81",
    amount: 620,
    fee: 11.16,
    netAmount: 608.84,
    status: "Success",
    timestamp: "2026-09-02 13:42:05",
  },
  {
    id: "tx-104",
    orderId: "ORD-9845",
    billNo: "RET-2026-0815",
    customerName: "Vikas Malhotra",
    provider: "Paytm",
    txnRef: "PTM2983109381",
    amount: 850,
    fee: 10.2,
    netAmount: 839.8,
    status: "Pending",
    timestamp: "2026-09-02 14:02:18",
  },
  {
    id: "tx-105",
    orderId: "ORD-9846",
    billNo: "RET-2026-0816",
    customerName: "Deepak Mehta",
    provider: "Razorpay",
    txnRef: "pay_Nk930kLm04",
    amount: 1980,
    fee: 0,
    netAmount: 0,
    status: "Failed",
    timestamp: "2026-09-02 14:15:22",
  },
  {
    id: "tx-106",
    orderId: "ORD-9847",
    billNo: "RET-2026-0817",
    customerName: "Siddharth Rao",
    provider: "Cash",
    txnRef: "CASH-DESK-01",
    amount: 3400,
    fee: 0,
    netAmount: 3400,
    status: "Success",
    timestamp: "2026-09-02 15:00:30",
  },
];

export function PaymentInformationView() {
  const [fromDate, setFromDate] = useState("2026-09-02T01:30");
  const [toDate, setToDate] = useState("2026-09-03T01:30");
  const [status, setStatus] = useState("All");
  const [provider, setProvider] = useState("All");
  const [orderId, setOrderId] = useState("");
  const [records, setRecords] = useState<PaymentTransaction[]>(INITIAL_RECORDS);

  // Pagination & selection
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (status !== "All" && r.status !== status) return false;
      if (provider !== "All" && r.provider !== provider) return false;
      if (orderId.trim()) {
        const q = orderId.toLowerCase();
        const match =
          r.orderId.toLowerCase().includes(q) ||
          r.billNo.toLowerCase().includes(q) ||
          r.txnRef.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [records, status, provider, orderId]);

  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return filteredRecords;
    return [...filteredRecords].sort((a, b) => {
      const field = sortConfig.colId as keyof PaymentTransaction;
      const aVal = a[field] ?? "";
      const bVal = b[field] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredRecords, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const validPage = Math.min(page, totalPages);
  const paginatedRecords = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, validPage, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedRecords.length && sortedRecords.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedRecords.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns: DataTableColumn<PaymentTransaction>[] = [
    {
      id: "orderId",
      label: "Order / Bill No",
      sortable: true,
      defaultWidth: 160,
      getValue: (r) => `${r.orderId} ${r.billNo}`,
    },
    {
      id: "customerName",
      label: "Customer",
      sortable: true,
      defaultWidth: 160,
      getValue: (r) => r.customerName,
    },
    {
      id: "provider",
      label: "Payment Gateway",
      sortable: true,
      filterable: true,
      defaultWidth: 140,
      getValue: (r) => r.provider,
    },
    {
      id: "txnRef",
      label: "Reference / UTR",
      sortable: true,
      defaultWidth: 180,
      getValue: (r) => r.txnRef,
    },
    {
      id: "amount",
      label: "Gross Amount (₹)",
      align: "right",
      sortable: true,
      defaultWidth: 140,
      getValue: (r) => `₹${r.amount}`,
    },
    {
      id: "fee",
      label: "MDR Fee (₹)",
      align: "right",
      sortable: true,
      defaultWidth: 120,
      getValue: (r) => `₹${r.fee}`,
    },
    {
      id: "netAmount",
      label: "Net Settled (₹)",
      align: "right",
      sortable: true,
      defaultWidth: 140,
      getValue: (r) => `₹${r.netAmount}`,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      align: "center",
      defaultWidth: 120,
      getValue: (r) => r.status,
    },
    {
      id: "timestamp",
      label: "Timestamp",
      sortable: true,
      defaultWidth: 150,
      getValue: (r) => r.timestamp,
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      filterable: false,
      align: "center",
      defaultWidth: 80,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Payment Information</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Real-time digital payment settlements, MDR charges, and provider reconciliation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Exporting payment transactions to Excel...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export Excel <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* 2. Filter Bar matching Screenshot 1 */}
      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">From Date</label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">To Date</label>
            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Provider</label>
            <div className="relative">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Pine Labs">Pine Labs</option>
                <option value="Paytm">Paytm</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">Order ID</label>
            <input
              type="text"
              placeholder="Search Order ID / UTR"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Filter applied")}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("All");
                setProvider("All");
                setOrderId("");
                toast.info("Showing all payment records");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Reusable Table with DataTableHeader and DataTableFooter */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <Search className="h-8 w-8" />
          </div>
          <div className="text-[14.5px] font-bold text-slate-700">No Results Found.</div>
          <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto">
            We couldn't find any payment transaction records matching your search.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-300 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <DataTableHeader
                columns={columns}
                data={sortedRecords}
                selectable
                isAllSelected={selectedIds.length === sortedRecords.length && sortedRecords.length > 0}
                isSomeSelected={selectedIds.length > 0 && selectedIds.length < sortedRecords.length}
                onToggleSelectAll={toggleSelectAll}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                themeVariant="primary"
              />
              <tbody className="divide-y divide-slate-100">
                {paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="w-12 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="rounded border-slate-300 cursor-pointer text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="font-mono text-[12.5px] font-bold text-slate-900">{r.orderId}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.billNo}</div>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="font-medium text-slate-800">{r.customerName}</div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[11.5px] font-bold text-slate-700">
                        {r.provider}
                      </span>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="font-mono text-[11.5px] text-slate-600 select-all bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {r.txnRef}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="font-bold text-slate-900 font-mono">₹{r.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="text-slate-500 font-mono">₹{r.fee.toFixed(2)}</div>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="font-bold text-teal-700 font-mono">₹{r.netAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          r.status === "Success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : r.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {r.status === "Success" && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                        {r.status === "Pending" && <Clock className="h-3 w-3 text-amber-600" />}
                        {r.status === "Failed" && <XCircle className="h-3 w-3 text-rose-600" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="text-[11.5px] text-slate-500 font-mono">{r.timestamp}</div>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toast.info(`Re-verifying gateway settlement for ${r.txnRef}`)}
                        title="Re-verify Status"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer inline-flex items-center justify-center"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DataTableFooter
            totalCount={sortedRecords.length}
            currentPage={validPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(1);
            }}
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            itemName="transactions"
            onExport={(fmt) => toast.success(`Exporting payment records as ${fmt.toUpperCase()}...`)}
          />
        </div>
      )}
    </div>
  );
}

