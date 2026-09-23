import { useState } from "react";
import { Monitor, Smartphone, Tablet, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function DeviceMappingView() {
  const devices = [
    {
      id: "dev-1",
      name: "Billing Terminal 1 (Windows POS)",
      type: "Desktop",
      ip: "192.168.1.101",
      status: "Online",
    },
    {
      id: "dev-2",
      name: "Captain Tablet 1 (Samsung Tab A9)",
      type: "Tablet",
      ip: "192.168.1.115",
      status: "Online",
    },
    {
      id: "dev-3",
      name: "Captain Tablet 2 (iPad 9th Gen)",
      type: "Tablet",
      ip: "192.168.1.118",
      status: "Online",
    },
    {
      id: "dev-4",
      name: "Kitchen Display System (KDS Screen)",
      type: "Display",
      ip: "192.168.1.130",
      status: "Online",
    },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Device Mapping</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Authorized POS hardware, Captain Android/iOS tablets, and kitchen display screen
            bindings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Pair New Device via OTP")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Pair Device
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  {dev.type === "Desktop" ? (
                    <Monitor className="h-5 w-5" />
                  ) : (
                    <Tablet className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-[13.5px] text-slate-900">{dev.name}</div>
                  <div className="text-[12px] font-mono text-slate-500">
                    IP: {dev.ip} • Type: {dev.type}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {dev.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
