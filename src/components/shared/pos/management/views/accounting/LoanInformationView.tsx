import { useState } from "react";
import { Landmark } from "lucide-react";

export function LoanInformationView() {
  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Loan Information</h2>
        <p className="text-[12.5px] text-slate-500 mt-0.5">
          Track business loans and automated daily swipe deductions.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center py-16 space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Landmark className="h-7 w-7" />
        </div>
        <div className="text-[14.5px] font-bold text-slate-700">No Active Loans</div>
        <p className="text-[12px] text-slate-400">There are no outstanding capital finance deductions registered.</p>
      </div>
    </div>
  );
}
