import { useState } from "react";
import { Plus, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";

export function AreaDeliveryChargesListView() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [records, setRecords] = useState<any[]>([]);

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
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Filtered delivery charges")}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("All");
                toast.info("Showing all delivery charges");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Empty State matching Screenshot 3 */}
      {records.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <Search className="h-8 w-8" />
          </div>
          <div className="text-[14.5px] font-bold text-slate-700">No Results Found.</div>
          <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto">
            We couldn't find a match for your search.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {/* Table */}
        </div>
      )}
    </div>
  );
}
