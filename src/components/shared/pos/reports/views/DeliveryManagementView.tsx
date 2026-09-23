import { useState } from "react";
import { Download, ChevronDown, Search, Truck, MapPin, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

export function DeliveryManagementView() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [provider, setProvider] = useState("All");

  const [orders, setOrders] = useState<any[]>([]);

  const days = ["27th Aug", "28th Aug", "29th Aug", "30th Aug", "31st Aug", "1st Sep", "2nd Sep"];

  return (
    <div className="space-y-4">
      {/* 1. Top Header Bar matching Screenshot 4 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Delivery Management</h2>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700 border border-slate-200">
            • Credit Remaining: <span className="font-mono font-bold text-slate-900">₹ 0</span>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700 border border-slate-200">
            • Credit Purchase Till Now:{" "}
            <span className="font-mono font-bold text-slate-900">₹ 0</span>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Exporting Delivery orders to Excel...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Excel <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 4 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1 min-w-[150px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Provider</label>
            <div className="relative">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Zomato">Zomato</option>
                <option value="Direct Fleet">Direct Fleet</option>
                <option value="Shadowfax">Shadowfax</option>
                <option value="Dunzo">Dunzo</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Searching delivery records...")}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setProvider("All");
                toast.info("Showing all delivery orders");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Charts Row matching Screenshot 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut Chart: Last 7 Days Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h4 className="text-[14px] font-bold text-slate-900">Last 7 Days Orders</h4>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute font-bold text-slate-800 text-[22px]">0</div>
            </div>

            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                <span className="text-slate-600">No.of Orders</span>
                <span className="font-mono font-bold text-slate-800 ml-auto">0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-600">No. of Third Party Orders</span>
                <span className="font-mono font-bold text-slate-800 ml-auto">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Chart: Last 7 Days - Delivered Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <h4 className="text-[14px] font-bold text-slate-900">Last 7 Days - Delivered Orders</h4>
          <div className="h-28 flex items-end justify-between border-b border-slate-200 px-2 pb-2">
            {days.map((day) => (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-1 w-full bg-slate-100 rounded-full" />
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Empty State / Records matching Screenshot 4 */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <Search className="h-8 w-8" />
          </div>
          <div className="text-[14.5px] font-bold text-slate-700">
            No Records OR Use Petpooja Enabled Delivery System To Track Delivery
          </div>
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
