import { useState } from "react";
import { Search, ChevronDown, Download, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useStockItems } from "@/hooks/queries/usePosInventory";

export function CurrentStockReportView() {
  const { data: stockItems } = useStockItems();

  const [rawMaterialQuery, setRawMaterialQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [stockLevel, setStockLevel] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Up to date");

  const categories = ["Select Category", "Groceries", "Dairy", "Appetizers", "Beverages", "Non-Veg Appetizers"];

  const filtered = (stockItems ?? []).filter((item) => {
    if (selectedCategory !== "Select Category" && item.category !== selectedCategory) return false;
    if (rawMaterialQuery && !item.rawMaterial.toLowerCase().includes(rawMaterialQuery.toLowerCase())) return false;
    if (stockLevel === "Low Stock" && item.availableStock > 5) return false;
    if (stockLevel === "Zero Stock" && item.availableStock > 0) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header Bar matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Current Stock Report</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.success("Exporting Current Stock Report to Excel...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          {/* Raw Material Input */}
          <div className="space-y-1 flex-1 min-w-[150px] max-w-xs">
            <label className="text-[11.5px] font-semibold text-slate-600">Raw Material</label>
            <input
              type="text"
              placeholder=""
              value={rawMaterialQuery}
              onChange={(e) => setRawMaterialQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1 min-w-[150px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Stock Level */}
          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Stock Level</label>
            <div className="relative">
              <select
                value={stockLevel}
                onChange={(e) => setStockLevel(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Zero Stock">Zero Stock</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1 min-w-[130px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Up to date">Up to date</option>
                <option value="Pending Closing">Pending Closing</option>
                <option value="All">All</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info(`Filtered: ${filtered.length} raw material records`)}
            className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* 3. Empty State matching Screenshot 2 or Data Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <FileText className="h-10 w-10" />
          </div>
          <div className="text-[15px] font-bold text-slate-700">No Current Stock Report Found</div>
          <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto">
            Try adjusting your raw material search filter or category selection.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-slate-800">Current Stock On Hand</h3>
            <span className="text-[12px] text-slate-500">{filtered.length} raw materials tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Raw Material</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Available Stock</th>
                  <th className="px-4 py-3">Last Closing Stock</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{item.rawMaterial}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {item.availableStock}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {item.closingStock}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[12px]">{item.unit}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          item.availableStock > 5
                            ? "bg-emerald-50 text-emerald-700"
                            : item.availableStock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.availableStock > 5 ? "Normal" : item.availableStock > 0 ? "Low Stock" : "Zero Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
