import { useState } from "react";
import { Plus, ChevronDown, Edit2, Copy, CheckSquare, Square, RefreshCw } from "lucide-react";
import { useScheduleVariants, useAddScheduleVariant } from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function ScheduleVariantsTab() {
  const { data: variants } = useScheduleVariants();
  const addMutation = useAddScheduleVariant();

  const [variationNameFilter, setVariationNameFilter] = useState("");
  const [searchByFilter, setSearchByFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newVarName, setNewVarName] = useState("");
  const [newDept, setNewDept] = useState("Quantity");

  const filteredVariants = (variants ?? []).filter((v) => {
    if (variationNameFilter && !v.name.toLowerCase().includes(variationNameFilter.toLowerCase())) {
      return false;
    }
    if (searchByFilter !== "All" && v.departmentName !== searchByFilter) {
      return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVariants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVariants.map((v) => v.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarName.trim()) {
      toast.error("Please enter a variant name");
      return;
    }

    addMutation.mutate(
      { name: newVarName.trim(), departmentName: newDept },
      {
        onSuccess: () => {
          toast.success(`Variant "${newVarName}" created`);
          setNewVarName("");
          setIsAdding(false);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Header and Actions from Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Variation</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Variation
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => toast.info("Bulk update variations modal opened")}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Bulk Update
          </button>
        </div>
      </div>

      {/* Quick Add Drawer */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-teal-900">Add New Variation</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[12px] text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Variation name (e.g. 1 Litre, Half, Spicy)..."
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] focus:outline-hidden focus:border-teal-500"
              autoFocus
            />
            <select
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="Quantity">Quantity</option>
              <option value="HB">HB</option>
              <option value="Size">Size</option>
              <option value="Spice Level">Spice Level</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-teal-700 cursor-pointer shadow-xs"
            >
              Save Variation
            </button>
          </div>
        </form>
      )}

      {/* 2. Filter Bar from Screenshot 4 */}
      <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] max-w-xs">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Variation Name
            </label>
            <input
              type="text"
              placeholder="Search variation..."
              value={variationNameFilter}
              onChange={(e) => setVariationNameFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-1.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="w-48">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Search By
            </label>
            <select
              value={searchByFilter}
              onChange={(e) => setSearchByFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All</option>
              <option value="HB">HB</option>
              <option value="Quantity">Quantity</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => toast.info(`Found ${filteredVariants.length} variations`)}
            className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setVariationNameFilter("");
              setSearchByFilter("All");
              toast.info("Showing all variations");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Show All
          </button>

          <button
            type="button"
            onClick={() => toast.success("Variation ranking saved")}
            className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-1.5 text-[12.5px] font-semibold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
          >
            Update Variation
          </button>
        </div>

        <div className="text-[11.5px] text-slate-400 mt-2">
          Note : Drag row to change order/rank variations
        </div>
      </div>

      {/* 3. Variants Data Table from Screenshot 3 */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-12 px-4 py-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredVariants.length ? (
                      <CheckSquare className="h-4 w-4 text-teal-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Online Display Name</th>
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Modified</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVariants.map((v) => {
                const isSelected = selectedIds.includes(v.id);
                return (
                  <tr
                    key={v.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(v.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">{v.name}</td>
                    <td className="px-4 py-3 text-slate-600">{v.onlineDisplayName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{v.departmentName}</td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {v.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-[12px]">{v.createdAt}</td>
                    <td className="px-4 py-3 text-slate-500 text-[12px]">{v.modifiedAt}</td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing variation ${v.name}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Variation"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.success(`Duplicated ${v.name}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50 flex items-center justify-between text-[12px] text-slate-500">
          <span>Showing 1 to {filteredVariants.length} of {filteredVariants.length} records</span>
        </div>
      </div>
    </div>
  );
}
