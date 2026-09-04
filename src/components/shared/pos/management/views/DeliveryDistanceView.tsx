import { useState } from "react";
import { Plus, Search, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

export function DeliveryDistanceView() {
  const [distanceTiers, setDistanceTiers] = useState([
    { id: "1", fromKm: 0, toKm: 3, charge: 0, minOrder: 150 },
    { id: "2", fromKm: 3, toKm: 7, charge: 35, minOrder: 250 },
    { id: "3", fromKm: 7, toKm: 12, charge: 60, minOrder: 400 },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Delivery Distance
          </h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Configure delivery radius tiers and progressive delivery fee calculations based on store GPS coordinates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Add distance tier modal")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Distance Tier
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
              <th className="px-4 py-3">Distance Range</th>
              <th className="px-4 py-3">Delivery Charge (₹)</th>
              <th className="px-4 py-3">Min Order Amount (₹)</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {distanceTiers.map((tier) => (
              <tr key={tier.id} className="hover:bg-slate-50/50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {tier.fromKm} km - {tier.toKm} km
                </td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">
                  ₹{tier.charge}
                </td>
                <td className="px-4 py-3 font-mono text-slate-600">
                  ₹{tier.minOrder}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
