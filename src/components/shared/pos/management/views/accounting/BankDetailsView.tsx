import { useState } from "react";
import { Building, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function BankDetailsView() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Bank Details</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Configure settlement bank account and IFSC code for direct gateway disbursements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Add Bank Account")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Account
        </button>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-slate-900">HDFC Bank — Current A/C</div>
              <div className="text-[12px] font-mono text-slate-500">
                A/C: ************4821 • IFSC: HDFC0001248
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Primary Settlement
          </span>
        </div>
      </div>
    </div>
  );
}
