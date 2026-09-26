import { useState, useMemo } from "react";
import { Upload, ChevronDown, FileSpreadsheet, Info, CheckCircle2, AlertTriangle, XCircle, Download, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import { DataTableHeader, DataTableFooter, type DataTableColumn } from "@/components/common";

interface ReconcileRecord {
  id: string;
  aggregatorOrderId: string;
  posBillNo: string;
  tabType: "missing" | "status_mismatch" | "variance" | "rejected" | "final";
  channel: "Zomato" | "Swiggy";
  aggregatorAmount: number;
  posAmount: number;
  varianceAmount: number;
  aggregatorStatus: string;
  posStatus: string;
  orderDate: string;
  settlementStatus: "Disputed" | "Resolved" | "Pending Review";
}

const SAMPLE_RECON_DATA: ReconcileRecord[] = [
  {
    id: "rec-1",
    aggregatorOrderId: "ZOM-7821940",
    posBillNo: "-- (Missing)",
    tabType: "missing",
    channel: "Zomato",
    aggregatorAmount: 680,
    posAmount: 0,
    varianceAmount: 680,
    aggregatorStatus: "DELIVERED",
    posStatus: "NOT_FOUND",
    orderDate: "2026-08-31 20:15",
    settlementStatus: "Disputed",
  },
  {
    id: "rec-2",
    aggregatorOrderId: "SWG-9018241",
    posBillNo: "RET-2026-0791",
    tabType: "status_mismatch",
    channel: "Swiggy",
    aggregatorAmount: 1240,
    posAmount: 1240,
    varianceAmount: 0,
    aggregatorStatus: "CANCELLED_AFTER_PREP",
    posStatus: "COMPLETED",
    orderDate: "2026-08-30 21:40",
    settlementStatus: "Pending Review",
  },
  {
    id: "rec-3",
    aggregatorOrderId: "ZOM-7821998",
    posBillNo: "RET-2026-0805",
    tabType: "variance",
    channel: "Zomato",
    aggregatorAmount: 1850,
    posAmount: 2100,
    varianceAmount: -250,
    aggregatorStatus: "DELIVERED",
    posStatus: "COMPLETED",
    orderDate: "2026-08-29 19:25",
    settlementStatus: "Disputed",
  },
  {
    id: "rec-4",
    aggregatorOrderId: "SWG-9018310",
    posBillNo: "RET-2026-0810",
    tabType: "rejected",
    channel: "Swiggy",
    aggregatorAmount: 490,
    posAmount: 0,
    varianceAmount: 490,
    aggregatorStatus: "MERCHANT_REJECTED",
    posStatus: "CANCELLED",
    orderDate: "2026-08-28 14:10",
    settlementStatus: "Resolved",
  },
  {
    id: "rec-5",
    aggregatorOrderId: "ZOM-7822055",
    posBillNo: "RET-2026-0820",
    tabType: "final",
    channel: "Zomato",
    aggregatorAmount: 34500,
    posAmount: 34500,
    varianceAmount: 0,
    aggregatorStatus: "SETTLED_TO_BANK",
    posStatus: "RECONCILED",
    orderDate: "2026-08-27 to 2026-09-01",
    settlementStatus: "Resolved",
  },
];

export function OnlineOrderReconciliationView() {
  const [activeTab, setActiveTab] = useState<
    "missing" | "status_mismatch" | "variance" | "rejected" | "final"
  >("missing");

  const [dateRange, setDateRange] = useState("27th Aug to 1st Sep");
  const [records, setRecords] = useState<ReconcileRecord[]>(SAMPLE_RECON_DATA);

  // Pagination & selection
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tabs = [
    {
      id: "missing",
      label: "Missing Orders",
      desc: "Orders in aggregator payout but not found on POS",
    },
    {
      id: "status_mismatch",
      label: "Status Mismatch Orders",
      desc: "Discrepancy in delivered vs cancelled order status",
    },
    {
      id: "variance",
      label: "Variance Orders",
      desc: "Settlement amount difference between aggregator and POS total",
    },
    {
      id: "rejected",
      label: "Rejected/Cancelled Orders",
      desc: "Commission & penalty charges on disputed cancellations",
    },
    {
      id: "final",
      label: "Final Reconciliation",
      desc: "Consolidated net payout summary vs settled bank transfers",
    },
  ] as const;

  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  // Filtered by active tab
  const filteredRecords = useMemo(() => {
    return records.filter((r) => r.tabType === activeTab);
  }, [records, activeTab]);

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return filteredRecords;
    return [...filteredRecords].sort((a, b) => {
      const field = sortConfig.colId as keyof ReconcileRecord;
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

  const columns: DataTableColumn<ReconcileRecord>[] = [
    {
      id: "aggregatorOrderId",
      label: "Aggregator Order ID",
      sortable: true,
      defaultWidth: 170,
      getValue: (r) => `${r.aggregatorOrderId} ${r.orderDate}`,
    },
    {
      id: "channel",
      label: "Channel",
      sortable: true,
      filterable: true,
      defaultWidth: 120,
      getValue: (r) => r.channel,
    },
    {
      id: "posBillNo",
      label: "POS Bill Ref",
      sortable: true,
      defaultWidth: 140,
      getValue: (r) => r.posBillNo,
    },
    {
      id: "aggregatorAmount",
      label: "Payout Claimed (₹)",
      align: "right",
      sortable: true,
      defaultWidth: 150,
      getValue: (r) => `₹${r.aggregatorAmount}`,
    },
    {
      id: "posAmount",
      label: "POS Billed (₹)",
      align: "right",
      sortable: true,
      defaultWidth: 140,
      getValue: (r) => `₹${r.posAmount}`,
    },
    {
      id: "varianceAmount",
      label: "Variance Diff (₹)",
      align: "right",
      sortable: true,
      defaultWidth: 150,
      getValue: (r) => (r.varianceAmount > 0 ? `+₹${r.varianceAmount}` : `₹${r.varianceAmount}`),
    },
    {
      id: "settlementStatus",
      label: "Reconciliation Status",
      sortable: true,
      filterable: true,
      align: "center",
      defaultWidth: 170,
      getValue: (r) => r.settlementStatus,
    },
    {
      id: "actions",
      label: "Action",
      sortable: false,
      filterable: false,
      align: "center",
      defaultWidth: 80,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Third Party Online Orders Reconciliation
          </h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Note: You can view and reconcile third-party platform settlement sheets till the previous day.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Exporting reconciliation settlement report...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export Settlement
        </button>
      </div>

      {/* 2. Top Integrations Filter Bar matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-[12.5px] font-semibold text-slate-800">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-600 text-[10px] font-bold text-white">
            Z
          </div>
          <span>l2c4wtru (Zomato & Swiggy Feed)</span>
        </div>

        <div className="flex flex-wrap items-center gap-8 pt-2">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">Date</label>
            <div className="relative min-w-[200px]">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="27th Aug to 1st Sep">27th Aug to 1st Sep</option>
                <option value="20th Aug to 26th Aug">20th Aug to 26th Aug</option>
                <option value="13th Aug to 19th Aug">13th Aug to 19th Aug</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">
              Please upload payout sheet
            </label>
            <div>
              <button
                type="button"
                onClick={() => toast.info("Select aggregator CSV/Excel payout sheet")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                Upload File
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11.5px] font-semibold text-slate-600">Integration Status:</div>
            <div className="text-[13px] font-bold text-emerald-700 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Sync
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tab Bar matching Screenshot 3 */}
      <div className="rounded-xl border border-slate-300 bg-white shadow-2xs overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-5 py-3 text-[13px] font-medium transition cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? "border-teal-600 bg-white text-teal-600 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span title={tab.desc}>
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </span>
            </button>
          ))}
        </div>

        {/* Table / Empty State */}
        {filteredRecords.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="mx-auto relative flex h-20 w-20 items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full bg-rose-50 -left-2 -top-1" />
              <div className="absolute h-8 w-8 rounded-full bg-rose-100 right-0 bottom-0" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-400">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
            </div>
            <div className="text-[15px] font-bold text-slate-700">Records Not Found.</div>
            <p className="text-[12px] text-slate-400 max-w-sm mx-auto">
              Upload aggregator payout reports to automatically detect missing orders, discount variances, and commissions.
            </p>
          </div>
        ) : (
          <div>
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
                        <div className="font-mono text-[12.5px] font-bold text-slate-900">{r.aggregatorOrderId}</div>
                        <div className="text-[11px] text-slate-500">{r.orderDate}</div>
                      </td>
                      <td className="px-3.5 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                            r.channel === "Zomato"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {r.channel}
                        </span>
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="font-mono text-[12px] text-slate-700 font-medium">{r.posBillNo}</span>
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <div className="font-mono font-bold text-slate-900">₹{r.aggregatorAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <div className="font-mono text-slate-600">₹{r.posAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <div
                          className={`font-mono font-bold ${
                            r.varianceAmount === 0
                              ? "text-slate-400"
                              : r.varianceAmount > 0
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {r.varianceAmount > 0 ? `+₹${r.varianceAmount}` : r.varianceAmount < 0 ? `-₹${Math.abs(r.varianceAmount)}` : "₹0"}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            r.settlementStatus === "Resolved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : r.settlementStatus === "Pending Review"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {r.settlementStatus === "Resolved" && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                          {r.settlementStatus === "Pending Review" && <AlertTriangle className="h-3 w-3 text-amber-600" />}
                          {r.settlementStatus === "Disputed" && <XCircle className="h-3 w-3 text-rose-600" />}
                          {r.settlementStatus}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toast.info(`Investigating payout for ${r.aggregatorOrderId}`)}
                          title="Review Dispute"
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer inline-flex items-center justify-center"
                        >
                          <Eye className="h-3.5 w-3.5" />
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
              itemName="reconciliation orders"
              onExport={(fmt) => toast.success(`Exporting reconciliation data as ${fmt.toUpperCase()}...`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

