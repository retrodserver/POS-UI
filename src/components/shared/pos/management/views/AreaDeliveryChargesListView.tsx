import { useState, useMemo } from "react";
import { Plus, ChevronDown, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DataTableHeader,
  DataTableFooter,
  type DataTableColumn,
} from "@/components/common";

interface AreaDeliveryCharge {
  id: string;
  areaName: string;
  city: string;
  pincode: string;
  deliveryCharge: number;
  minOrder: number;
  estimatedTime: string;
  status: "Active" | "Inactive";
}

export function AreaDeliveryChargesListView() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchArea, setSearchArea] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  const [records, setRecords] = useState<AreaDeliveryCharge[]>([
    {
      id: "1",
      areaName: "Karadagadia Main Chowk",
      city: "Angul",
      pincode: "759132",
      deliveryCharge: 25,
      minOrder: 150,
      estimatedTime: "20-30 mins",
      status: "Active",
    },
    {
      id: "2",
      areaName: "Nalco Township Sector 1-4",
      city: "Angul",
      pincode: "759145",
      deliveryCharge: 40,
      minOrder: 250,
      estimatedTime: "30-40 mins",
      status: "Active",
    },
    {
      id: "3",
      areaName: "Jagannath Vihar Colony",
      city: "Angul",
      pincode: "759122",
      deliveryCharge: 30,
      minOrder: 200,
      estimatedTime: "25-35 mins",
      status: "Active",
    },
    {
      id: "4",
      areaName: "Gandhi Marg Commercial Hub",
      city: "Angul",
      pincode: "759122",
      deliveryCharge: 20,
      minOrder: 150,
      estimatedTime: "15-25 mins",
      status: "Active",
    },
    {
      id: "5",
      areaName: "Bantala Industrial Extension",
      city: "Angul",
      pincode: "759128",
      deliveryCharge: 60,
      minOrder: 400,
      estimatedTime: "40-50 mins",
      status: "Inactive",
    },
  ]);

  const columns: DataTableColumn<AreaDeliveryCharge>[] = useMemo(
    () => [
      {
        id: "areaName",
        label: "Area / Locality Name",
        sortable: true,
        filterable: true,
        defaultWidth: 220,
        getValue: (r) => `${r.areaName} ${r.city} ${r.pincode}`,
      },
      {
        id: "pincode",
        label: "Pincode",
        sortable: true,
        filterable: true,
        defaultWidth: 120,
        getValue: (r) => r.pincode,
      },
      {
        id: "deliveryCharge",
        label: "Delivery Fee (₹)",
        sortable: true,
        filterable: true,
        align: "right",
        defaultWidth: 140,
        getValue: (r) => `₹${r.deliveryCharge}`,
      },
      {
        id: "minOrder",
        label: "Min Order (₹)",
        sortable: true,
        filterable: true,
        align: "right",
        defaultWidth: 140,
        getValue: (r) => `₹${r.minOrder}`,
      },
      {
        id: "estimatedTime",
        label: "Est. Time",
        sortable: true,
        defaultWidth: 140,
        getValue: (r) => r.estimatedTime,
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
        id: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        align: "right",
        defaultWidth: 110,
      },
    ],
    [],
  );

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (searchArea.trim()) {
        const q = searchArea.toLowerCase();
        const matchName = r.areaName.toLowerCase().includes(q);
        const matchPin = r.pincode.includes(q);
        if (!matchName && !matchPin) return false;
      }
      return true;
    });
  }, [records, statusFilter, searchArea]);

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return filteredRecords;
    return [...filteredRecords].sort((a, b) => {
      const field = sortConfig.colId as keyof AreaDeliveryCharge;
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
      {/* 1. Header Bar matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
          Area/Locality Wise Delivery Charges
        </h2>

        <button
          type="button"
          onClick={() => toast.info("Configure Area/Locality Delivery Fee")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Area/Locality Wise Delivery Charges
        </button>
      </div>

      {/* 2. Filter Bar matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 min-w-[180px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[200px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Search Locality / Pincode</label>
            <input
              type="text"
              placeholder="Search area name or pin..."
              value={searchArea}
              onChange={(e) => {
                setSearchArea(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Filtered ${filteredRecords.length} delivery charge areas`)}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("All");
                setSearchArea("");
                setCurrentPage(1);
                toast.info("Showing all delivery charges");
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
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                    No matching area delivery charges found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    <td className="w-12 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{r.areaName}</div>
                      <div className="text-[11.5px] text-slate-500">{r.city}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700 font-medium">{r.pincode}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 text-right">
                      ₹{r.deliveryCharge}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-right">₹{r.minOrder}</td>
                    <td className="px-4 py-3 text-slate-600">{r.estimatedTime}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          r.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing ${r.areaName}`)}
                          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRecords((prev) => prev.filter((item) => item.id !== r.id));
                            toast.success(`Removed ${r.areaName}`);
                          }}
                          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-red-600 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
          itemName="localities"
        />
      </div>
    </div>
  );
}
