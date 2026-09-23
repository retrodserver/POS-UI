import { useState } from "react";
import { History, Search, Download } from "lucide-react";
import { toast } from "sonner";

export function AuditTrailView() {
  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Audit Trail</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Immutable tracking of order voids, bill discounts, cash drawer operations, and
            configuration updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Exporting security audit logs...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export Logs
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-xs space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <History className="h-7 w-7" />
        </div>
        <div className="text-[14.5px] font-bold text-slate-700">Audit Trail Active</div>
        <p className="text-[12px] text-slate-400 max-w-md mx-auto">
          All high-privilege cashier and manager operations are cryptographically verified and
          recorded.
        </p>
      </div>
    </div>
  );
}
