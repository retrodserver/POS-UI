import { useState } from "react";
import { ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";

export function KycDetailsView() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">KYC Details</h2>
        <p className="text-[12.5px] text-slate-500 mt-0.5">
          Merchant verification status and identity documentation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-slate-900">KYC Verified</div>
            <div className="text-[12px] text-slate-500">
              Business PAN and FSSAI License #12023999000142 verified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
