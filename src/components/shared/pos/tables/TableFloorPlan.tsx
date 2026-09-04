import React from "react";
import { TableCardItem } from "./TableCardItem";
import type {
  RestaurantTable,
  ReservationItem,
  DiningArea,
  TableManagementStats,
} from "@/types/posTables";
import { Users, Sparkles, LayoutGrid, RotateCw } from "lucide-react";

interface TableFloorPlanProps {
  tables: RestaurantTable[];
  activeArea: DiningArea;
  onSelectArea: (area: DiningArea) => void;
  onSelectReserved: (table: RestaurantTable, reservation?: ReservationItem) => void;
  onSelectTable: (table: RestaurantTable) => void;
  stats?: TableManagementStats;
  onRefresh?: () => void;
}

const DINING_AREAS: DiningArea[] = ["Main Dining", "Terrace", "Outdoor"];

export function TableFloorPlan({
  tables,
  activeArea,
  onSelectArea,
  onSelectReserved,
  onSelectTable,
  stats,
  onRefresh,
}: TableFloorPlanProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-y-auto">
      {/* 1. Header Bar: Title + Area Switcher Tabs */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-200/80 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Manage Tables</span>
              {stats && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {stats.totalTables} Tables
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live restaurant seating layout, floor occupancy, and reservation schedule.
            </p>
          </div>

          {/* Area Switcher (Main Dining, Terrace, Outdoor) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl self-start sm:self-auto">
            {DINING_AREAS.map((area) => {
              const isActive = activeArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => onSelectArea(area)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sub-strip: Legend & Capacity Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Legends matching the design */}
          <div className="flex items-center gap-4 sm:gap-6 font-medium text-slate-600">
            {/* Available (Vacant) -> NO TAG */}
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 border border-slate-400" />
              <span className="text-slate-700 font-semibold">Available</span>
              <span className="text-[11px] text-slate-400">
                ({tables.filter((t) => t.status === "vacant").length})
              </span>
            </div>

            {/* Reserved -> Has "Reserved" tag */}
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600 border border-teal-700" />
              <span className="text-teal-800 font-semibold">Reserved</span>
              <span className="text-[11px] text-teal-600">
                ({tables.filter((t) => t.status === "reserved").length})
              </span>
            </div>

            {/* On Dine -> Has "On Dine" tag */}
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 border border-orange-600" />
              <span className="text-orange-800 font-semibold">On Dine</span>
              <span className="text-[11px] text-orange-600">
                ({tables.filter((t) => t.status === "occupied").length})
              </span>
            </div>
          </div>

          {/* Quick tip / seating capacity */}
          <div className="flex items-center gap-2 text-slate-500 text-[11.5px]">
            <span className="hidden md:inline text-slate-400">
              💡 Tip: Click any reserved table to view full reservation details.
            </span>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Refresh floor status"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. The Floor Plan Grid (Tables with Realistic Chairs) */}
      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center">
        {tables.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <LayoutGrid className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No tables configured in {activeArea}.</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center items-center py-4">
            {tables.map((table) => (
              <TableCardItem
                key={table.id}
                table={table}
                onSelectReserved={onSelectReserved}
                onSelectTable={onSelectTable}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
