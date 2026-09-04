import { useState } from "react";
import {
  Plus,
  ChevronDown,
  Upload,
  Search,
  Edit2,
  Copy,
  Image as ImageIcon,
  CheckSquare,
  Square,
} from "lucide-react";
import { useScheduleCategories, useAddScheduleCategory } from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function ScheduleCategoriesTab() {
  const { data: categories } = useScheduleCategories();
  const addMutation = useAddScheduleCategory();

  const [activeSubTab, setActiveSubTab] = useState<
    "Parent Category" | "Category" | "Grouping" | "Menu Configuration" | "Tags"
  >("Category");

  const [categoryNameFilter, setCategoryNameFilter] = useState("");
  const [groupCategoryFilter, setGroupCategoryFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newParentCat, setNewParentCat] = useState("Soup & Starters");

  const filteredCategories = (categories ?? []).filter((cat) => {
    if (categoryNameFilter && !cat.name.toLowerCase().includes(categoryNameFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    addMutation.mutate(
      { name: newCatName.trim(), parentCategory: newParentCat },
      {
        onSuccess: () => {
          toast.success(`Category "${newCatName}" created`);
          setNewCatName("");
          setIsAdding(false);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Header and Actions from Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Category Management</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Export/Import <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Sub-tabs under Categories from Screenshot 2 */}
      <div className="flex border-b border-slate-200">
        {(["Parent Category", "Category", "Grouping", "Menu Configuration", "Tags"] as const).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`border-b-2 px-5 py-2 text-[13px] font-semibold transition cursor-pointer ${
                activeSubTab === tab
                  ? "border-teal-600 text-teal-600 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Quick Add Form Drawer */}
      {isAdding && (
        <form onSubmit={handleAddCategorySubmit} className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-blue-900">Add New Category</span>
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
              placeholder="Category name (e.g. Desserts)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:border-teal-500"
              autoFocus
            />
            <input
              type="text"
              placeholder="Parent Category (e.g. Starters)..."
              value={newParentCat}
              onChange={(e) => setNewParentCat(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-teal-700 cursor-pointer shadow-2xs"
            >
              Create Category
            </button>
          </div>
        </form>
      )}

      {/* 3. Filter Bar from Screenshot 2 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] max-w-xs">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Category name
            </label>
            <input
              type="text"
              placeholder="Filter category..."
              value={categoryNameFilter}
              onChange={(e) => setCategoryNameFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-1.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="min-w-[160px]">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Group Category
            </label>
            <select
              value={groupCategoryFilter}
              onChange={(e) => setGroupCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Food">Food</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => toast.info(`Found ${filteredCategories.length} categories`)}
            className="rounded-lg border border-teal-600 bg-white px-4 py-1.5 text-[12.5px] font-medium text-teal-600 hover:bg-teal-50 transition cursor-pointer"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setCategoryNameFilter("");
              setGroupCategoryFilter("All");
              toast.info("Showing all categories");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Show All
          </button>

          <button
            type="button"
            onClick={() => toast.info("Category rank order updated")}
            className="rounded-lg border border-teal-600 bg-teal-50/60 px-4 py-1.5 text-[12.5px] font-semibold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
          >
            Update Rank
          </button>
        </div>

        <div className="text-[11.5px] text-slate-400 mt-2">
          Note: Please arrange category sequence/rank from the category section using import/export sheet.
        </div>
      </div>

      {/* 4. Categories Data Table from Screenshot 2 */}
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
                    {selectedIds.length > 0 && selectedIds.length === filteredCategories.length ? (
                      <CheckSquare className="h-4 w-4 text-teal-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Online Display Name</th>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Modified</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat) => {
                const isSelected = selectedIds.includes(cat.id);
                return (
                  <tr
                    key={cat.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(cat.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{cat.name}</div>
                      {cat.parentCategory && (
                        <div className="text-[11px] text-slate-400">
                          [Parent Category : {cat.parentCategory}]
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600">{cat.onlineDisplayName ?? "—"}</td>

                    <td className="px-4 py-3 font-semibold text-slate-700">{cat.rank}</td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {cat.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-[12px]">{cat.createdAt}</td>
                    <td className="px-4 py-3 text-slate-500 text-[12px]">{cat.modifiedAt}</td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toast.info(`Image uploader opened for ${cat.name}`)}
                        className="p-1 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        title="Upload Category Image"
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </button>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing category ${cat.name}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.success(`Duplicated category ${cat.name}`)}
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

        {/* Pagination from Screenshot 2 */}
        <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50 flex items-center justify-between text-[12px] text-slate-500">
          <span>Showing 1 to {filteredCategories.length} of 27 records</span>
        </div>
      </div>
    </div>
  );
}
