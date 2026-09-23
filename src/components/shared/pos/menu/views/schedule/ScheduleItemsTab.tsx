import { useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  Save,
  Plus,
  Copy,
  Edit2,
  FileText,
  CheckSquare,
  Square,
  Utensils,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import {
  useScheduleItems,
  useScheduleCategories,
  useToggleScheduleItem,
  useAddScheduleItem,
} from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function ScheduleItemsTab() {
  const { data: items } = useScheduleItems();
  const { data: categories } = useScheduleCategories();
  const toggleMutation = useToggleScheduleItem();
  const addMutation = useAddScheduleItem();

  const [selectedCategory, setSelectedCategory] = useState("Veg Soup");
  const [hideEmptyCategories, setHideEmptyCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"normal" | "rank">("normal");
  const [isAvailableGlobal, setIsAvailableGlobal] = useState(true);

  // New item state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("140");

  const categoryNames = categories?.map((c) => c.name) ?? [
    "Veg Soup",
    "Non-Veg Soup",
    "Veg Starters",
    "Non-Veg Starters",
    "Veg Main Course",
    "Non-Veg Main Course",
    "Bread",
  ];

  const filteredItems = (items ?? []).filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleDuplicate = (name: string, price: number, isVeg: boolean) => {
    addMutation.mutate(
      {
        name: `${name} (Copy)`,
        category: selectedCategory,
        shortCode: Math.floor(100 + Math.random() * 900),
        indicators: isVeg ? "v+ | O | D" : "nv | O | D",
        onlineDisplayName: `${name} (Copy)`,
        price,
        isVeg,
        available: true,
      },
      {
        onSuccess: () => {
          toast.success(`Duplicated "${name}"`);
        },
      },
    );
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    addMutation.mutate(
      {
        name: newItemName.trim(),
        category: selectedCategory,
        shortCode: Math.floor(100 + Math.random() * 900),
        indicators: selectedCategory.toLowerCase().includes("non-veg")
          ? "nv | O | D"
          : "v+ | O | D",
        onlineDisplayName: newItemName.trim(),
        price: parseFloat(newItemPrice) || 140,
        isVeg: !selectedCategory.toLowerCase().includes("non-veg"),
        available: true,
      },
      {
        onSuccess: () => {
          toast.success(`Added "${newItemName}" to ${selectedCategory}`);
          setNewItemName("");
          setIsAddingItem(false);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Yellow Guidance Banner from Screenshot 1 */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-2.5 text-[13px] text-amber-900 shadow-2xs flex items-center justify-between">
        <span>
          You can make updates to your restaurant's menu anytime and have them go live on the exact
          date and time you desire. ⓘ
        </span>
      </div>

      {/* 2. Main Two-Column Layout (Left Category Rail + Right Items Table) from Screenshot 1 */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Left Categories Rail */}
        <div className="w-full md:w-64 shrink-0 rounded-xl border border-slate-200 bg-white shadow-xs p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[13px] font-bold text-slate-800">Categories</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Hide empty</span>
              <button
                type="button"
                onClick={() => setHideEmptyCategories(!hideEmptyCategories)}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition ${
                  hideEmptyCategories ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                    hideEmptyCategories ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
          >
            {categoryNames.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Vertical Category Links from Screenshot 1 */}
          <div className="space-y-0.5 max-h-[500px] overflow-y-auto">
            {categoryNames.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition cursor-pointer text-left ${
                    isSelected
                      ? "text-teal-600 font-bold bg-teal-50/50"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {/* Left blue bar for active category */}
                  {isSelected && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-teal-600" />
                  )}
                  <span className="truncate pl-1">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content / Table Area */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Top Action Bar from Screenshot 1 */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Action <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              <button
                type="button"
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Quick Actions <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => toast.info("Publish Date scheduler opened")}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Publish Date
              </button>

              <button
                type="button"
                onClick={() => toast.success("Draft saved successfully")}
                className="flex items-center gap-1 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save Later
              </button>
            </div>
          </div>

          {/* Sub-row Controls: Normal / Rank wise, + Add Items, Available switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-[12.5px] text-slate-700 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  checked={viewMode === "normal"}
                  onChange={() => setViewMode("normal")}
                  className="h-3.5 w-3.5 text-teal-600"
                />
                Normal
              </label>
              <label className="flex items-center gap-1.5 text-[12.5px] text-slate-700 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  checked={viewMode === "rank"}
                  onChange={() => setViewMode("rank")}
                  className="h-3.5 w-3.5 text-teal-600"
                />
                Rank wise
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddingItem(!isAddingItem)}
                className="flex items-center gap-1 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Items
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-medium text-slate-700">Available</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAvailableGlobal(!isAvailableGlobal);
                    toast.info(
                      `Set all items available status to ${!isAvailableGlobal ? "Active" : "Paused"}`,
                    );
                  }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                    isAvailableGlobal ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isAvailableGlobal ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Add Form Drawer if triggered */}
          {isAddingItem && (
            <form
              onSubmit={handleAddItemSubmit}
              className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-blue-900">
                  Add Item to {selectedCategory}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="text-[12px] text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Item name..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:border-teal-500"
                  autoFocus
                />
                <input
                  type="number"
                  placeholder="Price (₹)..."
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-teal-700 cursor-pointer shadow-2xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          )}

          {/* Items Data Table from Screenshot 1 */}
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
                        {selectedIds.length > 0 && selectedIds.length === filteredItems.length ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">Name *</th>
                    <th className="px-4 py-3">Short Code *</th>
                    <th className="px-4 py-3">Online Display Name</th>
                    <th className="px-4 py-3">Price *</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => {
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

                        {/* Name with green vertical veg indicator from Screenshot 1 */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-4 w-1 rounded-full ${
                                item.isVeg ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            <span className="font-medium text-slate-900">{item.name}</span>
                          </div>
                        </td>

                        {/* Short code & v+ | O | D indicator */}
                        <td className="px-4 py-3 text-slate-600 font-mono text-[12px]">
                          <span className="text-slate-400 mr-2 text-[11px]">{item.indicators}</span>
                          <span className="font-bold text-slate-800">{item.shortCode}</span>
                        </td>

                        {/* Online display name */}
                        <td className="px-4 py-3 text-slate-600 text-[12.5px]">
                          {item.onlineDisplayName}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 font-semibold text-slate-800 font-mono">
                          ₹{item.price}
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3 text-slate-400 text-[12px]">
                          {item.description || "—"}
                        </td>

                        {/* Actions from Screenshot 1 (Copy, Edit, Recipe) */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleDuplicate(item.name, item.price, item.isVeg)}
                              className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                              title="Duplicate Item"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Quick edit opened for ${item.name}`)}
                              className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Recipe/modifier mapping for ${item.name}`)}
                              className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition cursor-pointer"
                              title="Modifier / Recipe Link"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Record count footer */}
            <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50 flex items-center justify-between text-[12px] text-slate-500">
              <span>
                Showing {filteredItems.length} items in {selectedCategory}
              </span>
              {selectedIds.length > 0 && (
                <span className="text-teal-600 font-medium">
                  {selectedIds.length} items selected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
