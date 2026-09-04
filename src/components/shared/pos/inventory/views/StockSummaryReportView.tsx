import { useState } from "react";
import { Clock, Download, ChevronDown, Calendar, Search } from "lucide-react";
import { toast } from "sonner";

export function StockSummaryReportView() {
  const [rawMaterial, setRawMaterial] = useState("");
  const [category, setCategory] = useState("All");
  const [unitType, setUnitType] = useState("Purchase Unit");
  const [fromDate, setFromDate] = useState("2026-09-02");
  const [toDate, setToDate] = useState("2026-09-02");

  const rows = [
    {
      name: "Garlic Chann Dry [Dish]",
      opening: "0.000",
      purchase: "0.000",
      excess: "0.000",
      total1: "0.000",
      consumed: "0.000",
      wastage: "0.000",
      normalLoss: "0.000",
      transfer: "0.000",
      shortage: "0.000",
      production: "0.000",
      total2: "0.000",
      closingStock: "0.000",
      closingSummary: "0.000",
      difference: "0.000",
    },
    {
      name: "Veg Manchuria Gravy [Dish]",
      opening: "0.000",
      purchase: "0.000",
      excess: "0.000",
      total1: "0.000",
      consumed: "0.000",
      wastage: "0.000",
      normalLoss: "0.000",
      transfer: "0.000",
      shortage: "0.000",
      production: "0.000",
      total2: "0.000",
      closingStock: "0.000",
      closingSummary: "0.000",
      difference: "0.000",
    },
    {
      name: "Veg Manchuria Dry [Dish]",
      opening: "0.000",
      purchase: "0.000",
      excess: "0.000",
      total1: "0.000",
      consumed: "0.000",
      wastage: "0.000",
      normalLoss: "0.000",
      transfer: "0.000",
      shortage: "0.000",
      production: "0.000",
      total2: "0.000",
      closingStock: "0.000",
      closingSummary: "0.000",
      difference: "0.000",
    },
  ];

  const filtered = rows.filter((r) =>
    r.name.toLowerCase().includes(rawMaterial.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* 1. Top Header Bar matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
          Stock Summary Report
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("Automated daily report scheduling dialog opened")}
            className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-teal-600" />
            Schedule Report
          </button>

          <button
            type="button"
            onClick={() => toast.success("Exporting Stock Summary Report to Excel...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          {/* Raw Material */}
          <div className="space-y-1 min-w-[150px] flex-1 max-w-xs">
            <label className="text-[11.5px] font-semibold text-slate-600">Raw Material</label>
            <input
              type="text"
              placeholder=""
              value={rawMaterial}
              onChange={(e) => setRawMaterial(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Main Course">Main Course</option>
                <option value="Beverages">Beverages</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Unit Type */}
          <div className="space-y-1 min-w-[140px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Unit Type</label>
            <div className="relative">
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Purchase Unit">Purchase Unit</option>
                <option value="Consumption Unit">Consumption Unit</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* From Date */}
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">From Date</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-slate-600">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Loaded ${filtered.length} stock summary rows`)}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setRawMaterial("");
                setCategory("All");
                toast.info("Cleared filters");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 3. High-Density Multi-Column Ledger Table matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold text-slate-600">
                <th className="px-3 py-3 font-bold text-slate-800">Raw Material</th>
                <th className="px-2.5 py-3 text-center">Opening<br />(A)</th>
                <th className="px-2.5 py-3 text-center">Purchase<br />(B) ⓘ</th>
                <th className="px-2.5 py-3 text-center">Excess<br />(C)</th>
                <th className="px-3 py-3 text-center bg-cyan-50/80 font-bold text-cyan-900 border-x border-cyan-100">
                  Total<br />ⓘ
                </th>
                <th className="px-2.5 py-3 text-center">Consumed<br />(D)</th>
                <th className="px-2.5 py-3 text-center">Wastage<br />(E)</th>
                <th className="px-2.5 py-3 text-center">Normal Loss<br />(F)</th>
                <th className="px-2.5 py-3 text-center">Transfer<br />(G) ⓘ</th>
                <th className="px-2.5 py-3 text-center">Shortage<br />(H)</th>
                <th className="px-2.5 py-3 text-center">Production<br />(I)</th>
                <th className="px-3 py-3 text-center bg-cyan-50/80 font-bold text-cyan-900 border-x border-cyan-100">
                  Total<br />ⓘ
                </th>
                <th className="px-2.5 py-3 text-center">Closing Stock<br />ⓘ</th>
                <th className="px-2.5 py-3 text-center">Closing Summary<br />ⓘ</th>
                <th className="px-3 py-3 text-center font-bold text-slate-800">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[12px]">
              {filtered.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="px-3 py-3 font-sans font-semibold text-slate-900">{r.name}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.opening}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.purchase}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.excess}</td>
                  <td className="px-3 py-3 text-center bg-cyan-50/50 font-bold text-slate-800 border-x border-cyan-100">
                    {r.total1}
                  </td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.consumed}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.wastage}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.normalLoss}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.transfer}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.shortage}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.production}</td>
                  <td className="px-3 py-3 text-center bg-cyan-50/50 font-bold text-slate-800 border-x border-cyan-100">
                    {r.total2}
                  </td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.closingStock}</td>
                  <td className="px-2.5 py-3 text-center text-slate-600">{r.closingSummary}</td>
                  <td className="px-3 py-3 text-center font-bold text-slate-700">{r.difference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info matching Screenshot 3 */}
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 text-[12px] text-slate-500">
          Showing 1 to {filtered.length} of {filtered.length} records
        </div>
      </div>
    </div>
  );
}
