import { useState } from "react";
import { Zap, Plus } from "lucide-react";
import { toast } from "sonner";

export function UtilityBillsView() {
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Utility Bills</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Track and log outlet electricity, water, gas, and broadband invoices.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Add Utility Bill")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Bill
        </button>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs text-center py-16 space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Zap className="h-7 w-7" />
        </div>
        <div className="text-[14.5px] font-bold text-slate-700">No Utility Bills Logged</div>
        <p className="text-[12px] text-slate-400">
          All regular utility payments for this fiscal month are clear.
        </p>
      </div>
    </div>
  );
}
