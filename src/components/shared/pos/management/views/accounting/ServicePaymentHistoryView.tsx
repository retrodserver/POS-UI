import { useState } from "react";
import { Receipt, Download } from "lucide-react";
import { toast } from "sonner";

export function ServicePaymentHistoryView() {
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Service Payment History</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Software subscription, SMS packs, and add-on module invoices.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center py-16 space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Receipt className="h-7 w-7" />
        </div>
        <div className="text-[14.5px] font-bold text-slate-700">All Service Accounts Active</div>
        <p className="text-[12px] text-slate-400">Next POS billing cycle renews on 1 Oct 2026.</p>
      </div>
    </div>
  );
}
