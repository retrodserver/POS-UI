import { useState } from "react";
import { Plus, Search, Scale, CheckCircle2, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export function UnitsMasterView() {
  const [units, setUnits] = useState([
    {
      id: "U-1",
      name: "Kilogram",
      symbol: "kg",
      baseUnit: "Gram (g)",
      ratio: "1 kg = 1000 g",
      type: "Weight",
    },
    {
      id: "U-2",
      name: "Gram",
      symbol: "g",
      baseUnit: "Gram (g)",
      ratio: "1 g = 1 g",
      type: "Weight",
    },
    {
      id: "U-3",
      name: "Liter",
      symbol: "L",
      baseUnit: "Milliliter (ml)",
      ratio: "1 L = 1000 ml",
      type: "Volume",
    },
    {
      id: "U-4",
      name: "Milliliter",
      symbol: "ml",
      baseUnit: "Milliliter (ml)",
      ratio: "1 ml = 1 ml",
      type: "Volume",
    },
    {
      id: "U-5",
      name: "Pieces",
      symbol: "pcs",
      baseUnit: "Pieces (pcs)",
      ratio: "1 pcs = 1 pcs",
      type: "Quantity",
    },
    {
      id: "U-6",
      name: "Portion",
      symbol: "portion",
      baseUnit: "Portion",
      ratio: "1 portion = 1 portion",
      type: "Serving",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    name: "",
    symbol: "",
    baseUnit: "",
    ratio: "",
    type: "Weight",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit.name || !newUnit.symbol) return;
    const created = {
      id: `U-${units.length + 1}`,
      name: newUnit.name,
      symbol: newUnit.symbol,
      baseUnit: newUnit.baseUnit || newUnit.name,
      ratio: newUnit.ratio || `1 ${newUnit.symbol} = 1 ${newUnit.symbol}`,
      type: newUnit.type,
    };
    setUnits([...units, created]);
    setIsCreateOpen(false);
    setNewUnit({ name: "", symbol: "", baseUnit: "", ratio: "", type: "Weight" });
    toast.success(`Unit ${created.name} (${created.symbol}) added.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Units of Measurement
          </h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Standardize inventory purchase and consumption conversion ratios across raw materials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Unit
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Unit Name</th>
                <th className="px-4 py-3">Symbol / Short Form</th>
                <th className="px-4 py-3">Category / Type</th>
                <th className="px-4 py-3">Conversion Factor</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 font-mono font-bold text-teal-600">{u.symbol}</td>
                  <td className="px-4 py-3 text-slate-600">{u.type}</td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[12.5px]">{u.ratio}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => toast.info(`Editing ${u.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUnits(units.filter((x) => x.id !== u.id));
                          toast.success(`Deleted unit ${u.name}`);
                        }}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">Add Unit of Measurement</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Unit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ounce"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Symbol *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. oz"
                  value={newUnit.symbol}
                  onChange={(e) => setNewUnit({ ...newUnit, symbol: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Conversion Ratio</label>
                <input
                  type="text"
                  placeholder="e.g. 1 oz = 28.35 g"
                  value={newUnit.ratio}
                  onChange={(e) => setNewUnit({ ...newUnit, ratio: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
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
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
