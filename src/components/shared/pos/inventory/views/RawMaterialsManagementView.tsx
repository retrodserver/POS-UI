import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  FileText,
  Copy,
  Edit2,
  List,
  Check,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface RawMaterialRow {
  id: string;
  name: string;
  category: string;
  isFavorite: boolean;
  isActive: boolean;
}

export function RawMaterialsManagementView() {
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Rows matching Screenshot 1
  const [items, setItems] = useState<RawMaterialRow[]>([
    {
      id: "RM-01",
      name: "Veg Manchuria Dry",
      category: "Select Category",
      isFavorite: false,
      isActive: true,
    },
    {
      id: "RM-02",
      name: "Veg Manchuria Gravy",
      category: "Select Category",
      isFavorite: false,
      isActive: true,
    },
    {
      id: "RM-03",
      name: "Garlic Chann Dry",
      category: "Select Category",
      isFavorite: false,
      isActive: true,
    },
  ]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Appetizers");

  const categories = ["Select Category", "Appetizers", "Main Course", "Beverages", "Dairy", "Groceries"];

  const handleNameChange = (id: string, newName: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, name: newName } : it)));
  };

  const handleCategoryChange = (id: string, newCat: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, category: newCat } : it)));
  };

  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isFavorite: !it.isFavorite } : it))
    );
  };

  const toggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it))
    );
  };

  const filtered = items.filter((it) => {
    if (selectedCategory !== "All" && it.category !== selectedCategory) return false;
    if (searchName && !it.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const created: RawMaterialRow = {
      id: `RM-0${items.length + 4}`,
      name: newItemName.trim(),
      category: newItemCategory,
      isFavorite: false,
      isActive: true,
    };

    setItems([...items, created]);
    setNewItemName("");
    setIsCreateOpen(false);
    toast.success(`Raw material '${created.name}' created.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Bar matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
          Raw Materials Management
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-teal-600 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-teal-600 hover:bg-teal-50 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </button>

          <button
            type="button"
            onClick={() => toast.info("Bulk actions menu")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.success("Exporting raw materials list...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            Files <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.info("Moving to recipe definition step")}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Next step <ArrowRight className="h-3.5 w-3.5 text-teal-600" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 flex-1 min-w-[150px] max-w-xs">
            <label className="text-[11.5px] font-semibold text-slate-600">Name</label>
            <input
              type="text"
              placeholder=""
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 min-w-[150px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                {categories.filter((c) => c !== "Select Category").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Found ${filtered.length} raw materials`)}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchName("");
                setSelectedCategory("All");
                toast.info("Cleared filters");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => toast.success("Changes applied to raw materials catalog")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>

      {/* 3. Inline Editable Table matching Screenshot 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                <th className="w-10 px-4 py-3 text-center">
                  <input type="checkbox" className="rounded border-slate-300 cursor-pointer" />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Category</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Set As Favourite</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Active</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" className="rounded border-slate-300 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                      className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative max-w-xs">
                      <select
                        value={item.category}
                        onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.isFavorite}
                      onChange={() => toggleFavorite(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={() => toggleActive(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => toast.info(`Viewing linked recipes for ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Linked Recipes"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Editing details for ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Viewing stock movement card for ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Card / Ledger"
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info matching Screenshot 1 */}
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 text-[12px] text-slate-500">
          Showing 1 to {filtered.length} of {filtered.length} records
        </div>
      </div>

      {/* Quick Add / Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">Add Raw Material</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Raw Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer Cubes / Chicken Boneless"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
