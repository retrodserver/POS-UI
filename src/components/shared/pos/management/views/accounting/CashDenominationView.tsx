import { useState } from "react";
import { Coins, Save } from "lucide-react";
import { toast } from "sonner";

export function CashDenominationView() {
  const [denominations, setDenominations] = useState([
    { note: 500, count: 12 },
    { note: 200, count: 25 },
    { note: 100, count: 40 },
    { note: 50, count: 30 },
    { note: 20, count: 50 },
    { note: 10, count: 80 },
  ]);

  const total = denominations.reduce((acc, d) => acc + d.note * d.count, 0);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Cash Denomination</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Shift drawer cash counter count and physical currency verification.
          </p>
        </div>
        <div className="text-[14px] font-bold text-slate-900">
          Total Drawer Cash: <span className="font-mono text-emerald-600">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="divide-y divide-slate-100">
          {denominations.map((d, index) => (
            <div key={d.note} className="py-3 flex items-center justify-between">
              <div className="font-bold text-[14px] text-slate-800">₹{d.note} Note</div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  value={d.count}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setDenominations((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, count: val } : item))
                    );
                  }}
                  className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-mono text-slate-800 text-center"
                />
                <div className="w-24 text-right font-mono font-bold text-slate-900">
                  ₹{(d.note * d.count).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
