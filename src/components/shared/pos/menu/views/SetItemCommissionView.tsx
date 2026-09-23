import { useState } from "react";
import { Plus, Upload, Edit2, CheckSquare, Square } from "lucide-react";
import { useItemCommissions } from "@/hooks/queries/usePosMenu";
import { SetCommissionModal } from "../modals/SetCommissionModal";
import type { MenuItemCommission } from "@/types/posMenu";
import { DataTableFooter } from "@/components/common";
import { toast } from "sonner";

export function SetItemCommissionView({ onBack }: { onBack?: () => void }) {
  const { data: commissions, isFetching } = useItemCommissions();

  const [activeTab, setActiveTab] = useState<"item" | "addon">("item");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [itemQuery, setItemQuery] = useState("");
  const [commissionTypeFilter, setCommissionTypeFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<MenuItemCommission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["All", ...Array.from(new Set(commissions?.map((c) => c.category) ?? []))];

  // Filtering
  const filteredCommissions = (commissions ?? []).filter((item) => {
    if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
    if (itemQuery && !item.name.toLowerCase().includes(itemQuery.toLowerCase())) return false;
    if (commissionTypeFilter !== "All" && item.commissionType !== commissionTypeFilter)
      return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCommissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCommissions.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const openEditModal = (item: MenuItemCommission) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleBulkAdd = () => {
    if (selectedIds.length === 0) {
      // Pick first item as template
      if (filteredCommissions.length > 0) {
        openEditModal(filteredCommissions[0]);
      } else {
        toast.error("No items available to configure");
      }
    } else {
      const first = filteredCommissions.find((i) => i.id === selectedIds[0]);
      if (first) openEditModal(first);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Header & Action Buttons from Petpooja Screenshot 5 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Set Menu Commission</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleBulkAdd}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Menu Commission
          </button>
          <button
            type="button"
            onClick={() => toast.info("Import commission rules dialog opened")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            Import
          </button>
        </div>
      </div>

      {/* 2. Sub Tabs: Item Commission & Addon Item Commission from Screenshot 5 */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("item")}
          className={`border-b-2 px-6 py-2.5 text-[13px] font-bold transition cursor-pointer ${
            activeTab === "item"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Item Commission
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("addon")}
          className={`border-b-2 px-6 py-2.5 text-[13px] font-bold transition cursor-pointer ${
            activeTab === "addon"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Addon Item Commission
        </button>
      </div>

      {/* 3. Filter Bar from Screenshot 5 */}
      <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">Item</label>
            <input
              type="text"
              placeholder="Search by item..."
              value={itemQuery}
              onChange={(e) => setItemQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Commission Type
            </label>
            <select
              value={commissionTypeFilter}
              onChange={(e) => setCommissionTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Not Configured">Not Configured</option>
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed Amount">Fixed Amount (₹)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Filtered: ${filteredCommissions.length} items found`)}
              className="flex-1 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter("All");
                setItemQuery("");
                setCommissionTypeFilter("All");
                toast.info("Showing all commissions");
              }}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 4. Table from Screenshot 5 */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-12 px-4 py-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredCommissions.length ? (
                      <CheckSquare className="h-4 w-4 text-teal-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Item Price</th>
                <th className="px-4 py-3">Commission Type</th>
                <th className="px-4 py-3">Commission Value</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCommissions.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(item.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500">{item.category}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          item.commissionType === "Not Configured"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-teal-50 text-teal-700 font-semibold"
                        }`}
                      >
                        {item.commissionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-800">
                      {item.commissionValue != null
                        ? item.commissionType === "Percentage"
                          ? `${item.commissionValue}%`
                          : `₹${item.commissionValue}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Edit Commission"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Unified DataTableFooter */}
        <DataTableFooter
          currentPage={currentPage}
          totalCount={filteredCommissions.length}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          itemName="items"
        />
      </div>

      {/* Commission Edit Modal */}
      <SetCommissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
      />
    </div>
  );
}
