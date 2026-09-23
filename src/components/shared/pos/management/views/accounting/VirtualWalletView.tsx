import { useState } from "react";
import { Download, ChevronDown, Search, FileText } from "lucide-react";
import { toast } from "sonner";

interface WalletRecord {
  id: string;
  mobile: string;
  amount: number;
  created: string;
}

export function VirtualWalletView() {
  const [mobileFilter, setMobileFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const records: WalletRecord[] = [
    { id: "1", mobile: "+91 98765 43210", amount: 17100.0, created: "9 Sep 2023 23:05:22" },
    { id: "2", mobile: "+91 98234 56789", amount: 17000.0, created: "9 Sep 2023 22:25:23" },
    { id: "3", mobile: "+91 97123 45678", amount: 5000.0, created: "1 Jan 2023 01:56:13" },
  ];

  const totalBalance = records.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Virtual Wallet</h2>

        <button
          type="button"
          onClick={() => toast.success("Exporting wallet ledger to Excel...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* 2. Filter Bar matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3 max-w-3xl">
          <div className="space-y-1 min-w-[180px]">
            <label className="text-[11.5px] font-semibold text-slate-600">
              Customer Mobile No.
            </label>
            <input
              type="text"
              placeholder="Search Mobile No"
              value={mobileFilter}
              onChange={(e) => setMobileFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Filtered wallet accounts")}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileFilter("");
                setStartDate("");
                setEndDate("");
                toast.info("Showing all wallet balances");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Table matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                <th className="px-5 py-3.5">Mobile No.</th>
                <th className="px-5 py-3.5">
                  Remaining Amount (₹){" "}
                  <span className="font-bold text-slate-800">
                    ({totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })})
                  </span>
                </th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{r.mobile}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    {r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[12px]">{r.created}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => toast.info(`Viewing statement for ${r.mobile}`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                      title="View Passbook Statement"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 text-[12px] text-slate-500">
          Showing 1 to {records.length} of {records.length} records
        </div>
      </div>
    </div>
  );
}
