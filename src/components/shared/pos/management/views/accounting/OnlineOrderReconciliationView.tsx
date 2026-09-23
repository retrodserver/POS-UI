import { useState } from "react";
import { Upload, ChevronDown, FileSpreadsheet, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function OnlineOrderReconciliationView() {
  const [activeTab, setActiveTab] = useState<
    "missing" | "status_mismatch" | "variance" | "rejected" | "final"
  >("missing");

  const [dateRange, setDateRange] = useState("27th Aug to 1st Sep");

  const tabs = [
    {
      id: "missing",
      label: "Missing Orders",
      desc: "Orders in aggregator payout but not found on POS",
    },
    {
      id: "status_mismatch",
      label: "Status Mismatch Orders",
      desc: "Discrepancy in delivered vs cancelled order status",
    },
    {
      id: "variance",
      label: "Variance Orders",
      desc: "Settlement amount difference between aggregator and POS total",
    },
    {
      id: "rejected",
      label: "Rejected/Cancelled Orders",
      desc: "Commission & penalty charges on disputed cancellations",
    },
    {
      id: "final",
      label: "Final Reconciliation",
      desc: "Consolidated net payout summary vs settled bank transfers",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 3 */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
          Manage Your All Third Party Online Orders Reconciliation
        </h2>
        <p className="text-[12px] text-slate-500 mt-0.5">
          Note: You would be able to view and reconcile the data till the previous day
        </p>
      </div>

      {/* 2. Top Integrations Filter Bar matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-[12.5px] font-semibold text-slate-800">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-600 text-[10px] font-bold text-white">
            Z
          </div>
          <span>l2c4wtru (Zomato & Swiggy Feed)</span>
        </div>

        <div className="flex flex-wrap items-center gap-8 pt-2">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">Date</label>
            <div className="relative min-w-[200px]">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="27th Aug to 1st Sep">27th Aug to 1st Sep</option>
                <option value="20th Aug to 26th Aug">20th Aug to 26th Aug</option>
                <option value="13th Aug to 19th Aug">13th Aug to 19th Aug</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">
              Please upload a file
            </label>
            <div>
              <button
                type="button"
                onClick={() => toast.info("Select aggregator CSV/Excel payout sheet")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                Upload
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11.5px] font-semibold text-slate-600">Integration Live On:</div>
            <div className="text-[13px] font-bold text-slate-800">-</div>
          </div>
        </div>
      </div>

      {/* 3. Tab Bar matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-[13px] font-medium transition cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? "border-teal-600 bg-white text-teal-600 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <Info className="h-3.5 w-3.5 text-slate-400" title={tab.desc} />
            </button>
          ))}
        </div>

        {/* Empty State matching Screenshot 3 */}
        <div className="p-20 text-center space-y-4">
          <div className="mx-auto relative flex h-20 w-20 items-center justify-center">
            <div className="absolute h-16 w-16 rounded-full bg-rose-50 -left-2 -top-1" />
            <div className="absolute h-8 w-8 rounded-full bg-rose-100 right-0 bottom-0" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-400">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
          </div>
          <div className="text-[15px] font-bold text-slate-700">Records Not Found.</div>
          <p className="text-[12px] text-slate-400 max-w-sm mx-auto">
            Upload aggregator payout reports to automatically detect missing orders, discount
            variances, and commissions.
          </p>
        </div>
      </div>
    </div>
  );
}
