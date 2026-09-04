import { useState } from "react";
import { Plus, Search, Calendar, Clock, CheckCircle2, Factory } from "lucide-react";
import { toast } from "sonner";

export function ProductionExecutionView() {
  const [search, setSearch] = useState("");

  const runs = [
    { id: "EXEC-881", date: "02 Sep 2026", item: "Makhani Gravy Base", batchQty: "25 L", rawMaterialsDeducted: "Tomatoes (15kg), Butter (3kg), Cream (2L)", status: "Completed", operator: "Chef Vikram" },
    { id: "EXEC-880", date: "02 Sep 2026", item: "Pizza Dough Balls", batchQty: "40 pcs", rawMaterialsDeducted: "Flour (10kg), Yeast (100g), Olive Oil", status: "In Progress", operator: "Sunita M." },
    { id: "EXEC-879", date: "01 Sep 2026", item: "Tandoori Chicken Marination", batchQty: "15 kg", rawMaterialsDeducted: "Chicken Breast (15kg), Spices", status: "Completed", operator: "Chef Vikram" },
  ];

  const filtered = runs.filter(
    (r) =>
      r.item.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Production Execution</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Log and track daily production batches. Converting raw materials automatically deducts component stocks and adds finished goods.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Opening New Batch Execution modal...")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Execute New Batch
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search execution ID or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <span className="text-[12px] text-slate-500">{filtered.length} runs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Execution ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Produced Item</th>
                <th className="px-4 py-3">Batch Output</th>
                <th className="px-4 py-3">Raw Materials Deducted</th>
                <th className="px-4 py-3">Operator</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 font-mono font-bold text-teal-600">{r.id}</td>
                  <td className="px-4 py-3 text-slate-600 text-[12.5px]">{r.date}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{r.item}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800">{r.batchQty}</td>
                  <td className="px-4 py-3 text-slate-600 text-[12px] max-w-xs truncate">{r.rawMaterialsDeducted}</td>
                  <td className="px-4 py-3 text-slate-500 text-[12px]">{r.operator}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        r.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.status === "Completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
