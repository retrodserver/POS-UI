import { Link } from "@tanstack/react-router";
import { Utensils } from "lucide-react";
import type { TopDishItem } from "@/types/posDashboard";

interface TopSellingItemsCardProps {
  items: TopDishItem[];
}

export function TopSellingItemsCard({ items }: TopSellingItemsCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-300 bg-white p-3.5 sm:p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-slate-900">Top selling items</h2>
        <Link
          to="/pos/menu"
          className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100 flex-1">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              {/* Dish Icon / Thumbnail */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white font-bold text-[12px] shadow-2xs ${
                  idx === 0 ? "bg-teal-700" : idx === 1 ? "bg-teal-600" : "bg-slate-700"
                }`}
              >
                <Utensils className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-slate-900">{item.name}</div>
                <div className="text-[11.5px] text-slate-400">{item.platesText}</div>
              </div>
            </div>

            <div className="text-[14px] font-bold text-slate-900">{item.revenueFormatted}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
