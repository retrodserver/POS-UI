import React from "react";
import {
  BellRing,
  Clock,
  DollarSign,
  Utensils,
  Truck,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { RoomServiceKpis } from "@/types/posRoomService";

interface RoomServiceKpiStripProps {
  kpis?: RoomServiceKpis;
}

export function RoomServiceKpiStrip({ kpis }: RoomServiceKpiStripProps) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 sm:p-6 pb-2 bg-white border-b border-slate-200/80">
      {/* 1. Active Orders */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <Utensils className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Orders
          </span>
          <span className="text-lg font-bold text-slate-900 leading-tight">
            {kpis.activeOrdersCount}
          </span>
        </div>
      </div>

      {/* 2. Kitchen Queue */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Kitchen Prep
          </span>
          <span className="text-lg font-bold text-slate-900 leading-tight">
            {kpis.kitchenQueueCount}
          </span>
        </div>
      </div>

      {/* 3. Dispatched / En Route */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <Truck className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            On the way
          </span>
          <span className="text-lg font-bold text-slate-900 leading-tight">
            {kpis.dispatchedCount}
          </span>
        </div>
      </div>

      {/* 4. Tray Clearance Alerts */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <BellRing className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tray Clearance
          </span>
          <span className="text-lg font-bold text-slate-900 leading-tight">
            {kpis.pendingClearancesCount} Rooms
          </span>
        </div>
      </div>

      {/* 5. Avg Delivery Speed */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Avg Speed
          </span>
          <span className="text-lg font-bold text-slate-900 leading-tight">
            {kpis.avgDeliveryMinutes}m{" "}
            <span className="text-xs font-normal text-slate-400">(&lt;30m)</span>
          </span>
        </div>
      </div>

      {/* 6. Today's Revenue */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
        <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <DollarSign className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
            Today Revenue
          </span>
          <span className="text-lg font-bold text-emerald-950 leading-tight">
            ${kpis.todayRevenue.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
