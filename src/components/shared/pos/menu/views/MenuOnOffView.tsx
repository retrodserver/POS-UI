import { useState } from "react";
import {
  FileText,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { useMenuStockItems, useToggleMenuStock } from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function MenuOnOffView({ onBack }: { onBack?: () => void }) {
  const { data: stockItems, refetch, isFetching } = useMenuStockItems();
  const toggleMutation = useToggleMenuStock();

  // Channel tab
  const [channel, setChannel] = useState<"Online" | "Offline" | "DineIn QR">("Online");
  // Subtab
  const [subTab, setSubTab] = useState<"Recent" | "All" | "Zomato" | "Swiggy">("Recent");

  // Filter fields from Screenshot 3
  const [nameFilter, setNameFilter] = useState("");
  const [displayNameFilter, setDisplayNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(stockItems?.map((i) => i.category) ?? []))];

  // Filtering
  const filteredItems = (stockItems ?? []).filter((item) => {
    if (channel !== item.channel && item.channel !== "Online") return false;
    if (subTab === "Zomato" && item.platform !== "Zomato" && item.platform !== "All") return false;
    if (subTab === "Swiggy" && item.platform !== "Swiggy" && item.platform !== "All") return false;
    if (subTab === "Recent" && !item.updatedAt.includes("ago") && !item.updatedAt.includes("now")) return false;

    if (nameFilter && !item.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (displayNameFilter && !item.onlineDisplayName.toLowerCase().includes(displayNameFilter.toLowerCase())) return false;
    if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
    if (statusFilter !== "All" && item.status !== statusFilter) return false;

    return true;
  });

  const handleToggle = (id: string, currentStatus: string, itemName: string) => {
    toggleMutation.mutate(id, {
      onSuccess: () => {
        const next = currentStatus === "In Stock" ? "Out of Stock (Turned Off)" : "In Stock (Turned On)";
        toast.success(`"${itemName}" is now ${next}`);
      },
    });
  };

  const handleClear = () => {
    setNameFilter("");
    setDisplayNameFilter("");
    setCategoryFilter("All");
    setStatusFilter("All");
    toast.info("Filters cleared");
  };

  return (
    <div className="space-y-4">
      {/* 1. Action Toolbar matching Petpooja Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Online Menu on/off</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("Petpooja AI Assistant Active")}
            className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-[12px] font-bold text-white shadow-2xs hover:bg-teal-700 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5" />
            Pi
          </button>
          <button
            type="button"
            onClick={() => toast.info("Quick Section Controller opened")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Quick Section Controller
          </button>
          <button
            type="button"
            onClick={() => toast.info("Addon stock controller opened")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Addon On/Off
          </button>
          <button
            type="button"
            onClick={() => toast.info("Online store pause/resume toggled")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Store On/Off
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Channel Tabs from Screenshot 3 (Online, Offline, DineIn QR) */}
      <div className="flex border-b border-slate-200">
        {(["Online", "Offline", "DineIn QR"] as const).map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => setChannel(ch)}
            className={`border-b-2 px-6 py-2.5 text-[13px] font-bold transition cursor-pointer ${
              channel === ch
                ? "border-teal-600 text-teal-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* 3. Subtabs from Screenshot 3 (Recent, All, Zomato, Swiggy) */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setSubTab("Recent")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition cursor-pointer ${
            subTab === "Recent"
              ? "bg-slate-100 text-slate-900 border border-slate-300"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Clock className="h-4 w-4" />
          Recent
        </button>

        <button
          type="button"
          onClick={() => setSubTab("All")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition cursor-pointer ${
            subTab === "All"
              ? "bg-slate-100 text-slate-900 border border-slate-300"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          All
        </button>

        <button
          type="button"
          onClick={() => setSubTab("Zomato")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition cursor-pointer ${
            subTab === "Zomato"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span className="rounded bg-red-600 text-[10px] font-extrabold text-white px-1.5 py-0.5">
            zomato
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          Zomato
        </button>

        <button
          type="button"
          onClick={() => setSubTab("Swiggy")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition cursor-pointer ${
            subTab === "Swiggy"
              ? "bg-orange-50 text-orange-800 border border-orange-200"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span className="rounded bg-orange-500 text-[10px] font-extrabold text-white px-1.5 py-0.5">
            swiggy
          </span>
          Swiggy
        </button>
      </div>

      {/* 4. Filter Bar from Screenshot 3 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Item name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">Online Display Name</label>
            <input
              type="text"
              placeholder="Online name..."
              value={displayNameFilter}
              onChange={(e) => setDisplayNameFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="In Stock">In Stock (Turned On)</option>
              <option value="Out of Stock">Out of Stock (Turned Off)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
            <button
              type="button"
              onClick={() => toast.info(`Applied filters. Found ${filteredItems.length} items.`)}
              className="flex-1 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
            >
              Show
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                refetch();
                toast.success("Refreshed menu stock status");
              }}
              className="flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-teal-600" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Content / List / Empty State from Screenshot 3 */}
      <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-xs">
        <div className="text-[12.5px] text-slate-500 mb-4">
          Showing item(s) that are recently stock updated.
        </div>

        {filteredItems.length === 0 ? (
          /* Empty State matching Screenshot 3 */
          <div className="py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
              <FileText className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h4 className="text-[14px] font-medium text-slate-600">
              No Item(S) Were Found With Recent Stock Update Activity.
            </h4>
            <p className="text-[12px] text-slate-400 mt-1">
              Switch to "All" tab or modify filters to view and toggle entire outlet catalog.
            </p>
            <button
              type="button"
              onClick={() => setSubTab("All")}
              className="mt-4 rounded-lg bg-teal-50 px-4 py-1.5 text-[12.5px] font-semibold text-teal-700 hover:bg-teal-100 border border-teal-200 transition cursor-pointer"
            >
              View All Items
            </button>
          </div>
        ) : (
          /* Interactive Table with On/Off toggles */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5">Turn On / Off</th>
                  <th className="px-4 py-2.5">Item Name</th>
                  <th className="px-4 py-2.5">Online Display Name</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Price</th>
                  <th className="px-4 py-2.5">Channel/Platform</th>
                  <th className="px-4 py-2.5">Stock Status</th>
                  <th className="px-4 py-2.5">Next Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.status === "In Stock"}
                          onChange={() => handleToggle(item.id, item.status, item.name)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.onlineDisplayName}</td>
                    <td className="px-4 py-3 text-slate-500">{item.category}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {item.channel} · {item.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          item.status === "In Stock"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === "In Stock" ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-500">
                      {item.nextAvailableTime ?? "Always Available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
