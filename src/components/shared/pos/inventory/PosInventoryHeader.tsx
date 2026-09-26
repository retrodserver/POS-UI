import { Bot, Sliders, Bell, Link2, Settings, User } from "lucide-react";
import { toast } from "sonner";

export function PosInventoryHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <span className="text-[14.5px] font-bold text-slate-800 tracking-tight">
          HIGHWAY INN BAR & RESTAURANT
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
          Store #330067
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => toast.info("Retrod Inventory AI Agent assistant activated")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <Bot className="h-3.5 w-3.5 text-teal-600" />
          <span>AI Agent</span>
        </button>

        <button
          type="button"
          onClick={() => toast.info("Inventory preferences dialog")}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
        >
          <Sliders className="h-3.5 w-3.5 text-emerald-600" />
          <span>Set Preferences</span>
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <button
          type="button"
          onClick={() => toast.info("Inventory alerts: 2 low stock warnings")}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          onClick={() => toast.info("Quick links menu")}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Links"
        >
          <Link2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => toast.info("Inventory settings")}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold">
          HI
        </div>
      </div>
    </div>
  );
}
