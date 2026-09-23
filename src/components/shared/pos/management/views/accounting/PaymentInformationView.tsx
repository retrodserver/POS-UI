import { useState } from "react";
import { Download, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";

export function PaymentInformationView() {
  const [fromDate, setFromDate] = useState("2026-09-02T01:30");
  const [toDate, setToDate] = useState("2026-09-03T01:30");
  const [status, setStatus] = useState("All");
  const [provider, setProvider] = useState("All");
  const [orderId, setOrderId] = useState("");
  const [records, setRecords] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Payment Information</h2>

        <button
          type="button"
          onClick={() => toast.success("Exporting payment transactions to Excel...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export Excel <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* 2. Filter Bar matching Screenshot 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">From Date</label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">To Date</label>
            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Provider</label>
            <div className="relative">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Pine Labs">Pine Labs</option>
                <option value="Paytm">Paytm</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">Order ID</label>
            <input
              type="text"
              placeholder="Search Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Searching payment settlement transactions...")}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("All");
                setProvider("All");
                setOrderId("");
                toast.info("Showing all payment records");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Empty State matching Screenshot 1 */}
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
