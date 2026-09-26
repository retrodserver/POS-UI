import { useState, useMemo } from "react";
import { Plus, Search, MapPin, Navigation, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DataTableHeader,
  DataTableFooter,
  type DataTableColumn,
} from "@/components/common";

interface DistanceTier {
  id: string;
  fromKm: number;
  toKm: number;
  charge: number;
  minOrder: number;
  status: "Active" | "Inactive";
}

export function DeliveryDistanceView() {
  const [distanceTiers, setDistanceTiers] = useState<DistanceTier[]>([
    { id: "1", fromKm: 0, toKm: 3, charge: 0, minOrder: 150, status: "Active" },
    { id: "2", fromKm: 3, toKm: 7, charge: 35, minOrder: 250, status: "Active" },
    { id: "3", fromKm: 7, toKm: 12, charge: 60, minOrder: 400, status: "Active" },
    { id: "4", fromKm: 12, toKm: 18, charge: 95, minOrder: 600, status: "Active" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  const columns: DataTableColumn<DistanceTier>[] = useMemo(
    () => [
      {
        id: "range",
        label: "Distance Range",
        sortable: true,
        filterable: true,
        defaultWidth: 180,
        getValue: (r) => `${r.fromKm} km - ${r.toKm} km`,
      },
      {
        id: "charge",
        label: "Delivery Charge (₹)",
        sortable: true,
        filterable: true,
        align: "right",
        defaultWidth: 170,
        getValue: (r) => `₹${r.charge}`,
      },
      {
        id: "minOrder",
        label: "Min Order Amount (₹)",
        sortable: true,
        filterable: true,
        align: "right",
        defaultWidth: 180,
        getValue: (r) => `₹${r.minOrder}`,
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

  const sortedTiers = useMemo(() => {
    if (!sortConfig) return distanceTiers;
    return [...distanceTiers].sort((a, b) => {
      const field = sortConfig.colId as keyof DistanceTier;
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [distanceTiers, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedTiers.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedTiers = sortedTiers.slice((validPage - 1) * pageSize, validPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedTiers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedTiers.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Delivery Distance</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Configure delivery radius tiers and progressive delivery fee calculations based on store
            GPS coordinates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Add distance tier modal")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Distance Tier
        </button>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <DataTableHeader
              columns={columns}
              data={sortedTiers}
              selectable
              isAllSelected={selectedIds.length === sortedTiers.length && sortedTiers.length > 0}
              isSomeSelected={selectedIds.length > 0 && selectedIds.length < sortedTiers.length}
              onToggleSelectAll={toggleSelectAll}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
              themeVariant="primary"
            />
            <tbody className="divide-y divide-slate-100">
              {paginatedTiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-slate-50/50 transition">
                  <td className="w-12 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(tier.id)}
                      onChange={() => toggleSelect(tier.id)}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {tier.fromKm} km - {tier.toKm} km
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 text-right">₹{tier.charge}</td>
                  <td className="px-4 py-3 font-mono text-slate-600 text-right">₹{tier.minOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {tier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => toast.info(`Editing tier ${tier.fromKm}-${tier.toKm} km`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDistanceTiers((prev) => prev.filter((i) => i.id !== tier.id));
                          toast.success(`Removed tier`);
                        }}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-red-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataTableFooter
          currentPage={validPage}
          totalCount={sortedTiers.length}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          itemName="distance tiers"
        />
      </div>
    </div>
  );
}
