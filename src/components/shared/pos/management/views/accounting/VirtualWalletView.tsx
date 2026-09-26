import { useState, useMemo } from "react";
import { Download, ChevronDown, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  DataTableHeader,
  DataTableFooter,
  type DataTableColumn,
} from "@/components/common";

interface WalletRecord {
  id: string;
  mobile: string;
  amount: number;
  created: string;
}

export function VirtualWalletView() {
  const [mobileFilter, setMobileFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  const [records] = useState<WalletRecord[]>([
    { id: "1", mobile: "+91 98765 43210", amount: 17100.0, created: "9 Sep 2023 23:05:22" },
    { id: "2", mobile: "+91 98234 56789", amount: 17000.0, created: "9 Sep 2023 22:25:23" },
    { id: "3", mobile: "+91 97123 45678", amount: 5000.0, created: "1 Jan 2023 01:56:13" },
    { id: "4", mobile: "+91 94371 88410", amount: 8400.0, created: "14 Feb 2024 18:30:10" },
    { id: "5", mobile: "+91 99370 12845", amount: 12200.0, created: "22 Mar 2024 14:15:00" },
  ]);

  const totalBalance = records.reduce((acc, r) => acc + r.amount, 0);

  const columns: DataTableColumn<WalletRecord>[] = useMemo(
    () => [
      {
        id: "mobile",
        label: "Mobile No.",
        sortable: true,
        filterable: true,
        defaultWidth: 180,
        getValue: (r) => r.mobile,
      },
      {
        id: "amount",
        label: `Remaining Amount (₹) — (₹${totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })})`,
        sortable: true,
        filterable: true,
        align: "right",
        defaultWidth: 260,
        getValue: (r) => `₹${r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      },
      {
        id: "created",
        label: "Created Date",
        sortable: true,
        defaultWidth: 200,
        getValue: (r) => r.created,
      },
      {
        id: "actions",
        label: "Action",
        sortable: false,
        filterable: false,
        align: "right",
        defaultWidth: 100,
      },
    ],
    [totalBalance],
  );

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (mobileFilter.trim()) {
        const q = mobileFilter.toLowerCase();
        if (!r.mobile.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [records, mobileFilter]);

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return filteredRecords;
    return [...filteredRecords].sort((a, b) => {
      const field = sortConfig.colId as keyof WalletRecord;
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredRecords, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedRecords = sortedRecords.slice((validPage - 1) * pageSize, validPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedRecords.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Virtual Wallet</h2>

        <button
          type="button"
          onClick={() => toast.success("Exporting wallet ledger to Excel...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* 2. Filter Bar matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3 max-w-3xl">
          <div className="space-y-1 min-w-[180px]">
            <label className="text-[11.5px] font-semibold text-slate-600">
              Customer Mobile No.
            </label>
            <input
              type="text"
              placeholder="Search Mobile No"
              value={mobileFilter}
              onChange={(e) => {
                setMobileFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Found ${filteredRecords.length} wallet accounts`)}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileFilter("");
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
                toast.info("Showing all wallet balances");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Table with DataTableHeader & DataTableFooter */}
      <div className="rounded-2xl border border-slate-300 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
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
                <tr key={r.id} className="hover:bg-slate-50/50 transition">
                  <td className="w-12 px-3 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{r.mobile}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900 text-right">
                    ₹{r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[12px]">{r.created}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => toast.info(`Viewing statement for ${r.mobile}`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                      title="View Passbook Statement"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataTableFooter
          currentPage={validPage}
          totalCount={sortedRecords.length}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          itemName="wallet accounts"
        />
      </div>
    </div>
  );
}
