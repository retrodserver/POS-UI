import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  Calendar,
  Layers,
  PieChart,
  RefreshCw,
  Package,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useStockItems } from "@/hooks/queries/usePosInventory";

export function InventoryDashboardView() {
  const navigate = useNavigate();
  const { data: stockItems } = useStockItems();

  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isOldDashboard, setIsOldDashboard] = useState(false);

  // Month days: 1 to 30 for September
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentDay = 2; // September 2
  const missedDays = [1]; // Day 1 missed

  // Low stock demo items matching screenshot
  const lowStockItems = [
    { name: "Sprite", daysRemaining: 8, totalDays: 14, percent: 57, color: "bg-blue-300" },
    { name: "7 up", daysRemaining: 5, totalDays: 14, percent: 35, color: "bg-blue-400" },
    { name: "Cheese", daysRemaining: 2, totalDays: 10, percent: 20, color: "bg-amber-400" },
    { name: "Chicken Breast", daysRemaining: 1, totalDays: 7, percent: 14, color: "bg-rose-400" },
  ];

  // Category breakdown for insights chart
  const categoryBreakdown = [
    { label: "Groceries", percentage: 42, color: "#93c5fd", stroke: "text-blue-300" },
    { label: "Dairy", percentage: 24, color: "#fde047", stroke: "text-yellow-300" },
    { label: "Beverages", percentage: 18, color: "#6ee7b7", stroke: "text-emerald-300" },
    { label: "Appetizers", percentage: 11, color: "#fdba74", stroke: "text-orange-300" },
    { label: "Others", percentage: 5, color: "#c4b5fd", stroke: "text-purple-300" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Daily Stock Closing Tracker Card matching Screenshot */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              Daily Stock Closing Tracker
            </h2>
            <p className="mt-1 text-[13px] text-slate-500 max-w-2xl leading-relaxed">
              Track timely stock closing and monitor manual adjustments to ensure accurate inventory and avoid mismatches through regular updates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOldDashboard((prev) => !prev);
              toast.info(isOldDashboard ? "Switched to New Dashboard" : "Switched to Classic View");
            }}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            {isOldDashboard ? "New Dashboard" : "Old Dashboard"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Metrics & Accuracy */}
          <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-6 lg:border-r lg:border-slate-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-extrabold text-slate-900 tracking-tight">0%</span>
                <span className="text-[14px] font-bold text-slate-700">Update Accuracy.</span>
              </div>
              <p className="mt-1 text-[13px] font-semibold text-red-500">
                Stock records are not up to date.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-[13px] text-slate-600">
                Closing stock has been updated on <span className="font-bold text-slate-800">0 days</span> this month.
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-red-500 w-[3%]" />
              </div>

              <div className="pt-2">
                <div className="text-[13px] font-bold text-slate-800">1 days missed.</div>
                <div className="mt-1.5 h-1 w-2/3 rounded-full bg-red-600" />
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Days Tracker */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-bold text-slate-800">
                September's 2026 Progress.
              </h3>

              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1 text-[12px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-none cursor-pointer"
                >
                  <option value="September">September</option>
                  <option value="August">August</option>
                  <option value="July">July</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Day Pills Grid 1 to 30 */}
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-11 xl:grid-cols-12 gap-1.5 pt-1">
              {daysInMonth.map((day) => {
                const isMissed = missedDays.includes(day);
                const isToday = day === currentDay;

                let chipStyles = "border border-transparent bg-slate-100/80 text-slate-400";
                if (isMissed) {
                  chipStyles = "border border-red-400 bg-red-50/50 text-red-600 font-bold";
                } else if (isToday) {
                  chipStyles = "border-2 border-dashed border-slate-400 bg-white text-slate-800 font-bold shadow-2xs";
                }

                return (
                  <div
                    key={day}
                    title={
                      isMissed
                        ? `Day ${day}: Missed stock closing`
                        : isToday
                        ? `Day ${day}: Today's stock closing pending`
                        : `Day ${day}`
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11.5px] font-medium transition select-none ${chipStyles}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Action button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/pos/inventory/closing-stock" })}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[12.5px] font-bold text-slate-800 shadow-2xs hover:border-slate-400 hover:bg-slate-50 transition cursor-pointer"
              >
                Update Today's Closing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current Inventory Section matching Screenshot */}
      <div className="space-y-4">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Current Inventory</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Track your current inventory and identify items that need restocking.
          </p>
        </div>

        {/* 4 Cards Grid matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1: Worth of Stocks */}
          <Link
            to="/pos/inventory/available-stock"
            className="group block rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[26px] font-extrabold text-slate-800 tracking-tight">
                  ₹ 2,60,500
                </div>
                <div className="mt-1 text-[13px] font-medium text-slate-500">Worth of Stocks</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-teal-600 transition" />
            </div>
          </Link>

          {/* Card 2: Stock Wasted */}
          <Link
            to="/pos/inventory/wastage"
            className="group block rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-orange-400 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[26px] font-extrabold text-red-500 tracking-tight">
                  40%
                </div>
                <div className="mt-1 text-[13px] font-medium text-slate-500">
                  Stock is getting wasted if not used
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-red-500 transition" />
            </div>
          </Link>

          {/* Card 3: Low Stock Alert with days remaining */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-slate-900">Low Stock Alert</span>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none rounded-md border border-slate-200 bg-white pl-2.5 pr-7 py-1 text-[11px] font-semibold text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Groceries">Groceries</option>
                </select>
                <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {lowStockItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="text-[11.5px] font-medium text-slate-500">{item.daysRemaining} Days</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Get Your Current Stock Insights Donut Chart */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900">
                <TrendingUp className="h-4 w-4 text-slate-500" />
                <span>Stock Insights</span>
              </div>
              <div className="relative">
                <select className="appearance-none rounded-md border border-slate-200 bg-white pl-2.5 pr-7 py-1 text-[11px] font-semibold text-slate-600 focus:outline-none cursor-pointer">
                  <option>All Categories</option>
                  <option>Raw Material</option>
                </select>
                <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Donut / Pie chart visual */}
            <div className="my-2 flex items-center justify-center">
              <div className="relative flex h-28 w-28 items-center justify-center">
                {/* SVG circular donut slices */}
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="4"
                  />
                  {/* Slice 1: Groceries 42% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="4"
                    strokeDasharray="42 58"
                    strokeDashoffset="0"
                  />
                  {/* Slice 2: Dairy 24% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#fde047"
                    strokeWidth="4"
                    strokeDasharray="24 76"
                    strokeDashoffset="-42"
                  />
                  {/* Slice 3: Beverages 18% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="4"
                    strokeDasharray="18 82"
                    strokeDashoffset="-66"
                  />
                  {/* Slice 4: Appetizers 11% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#fdba74"
                    strokeWidth="4"
                    strokeDasharray="11 89"
                    strokeDashoffset="-84"
                  />
                  {/* Slice 5: Others 5% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#c4b5fd"
                    strokeWidth="4"
                    strokeDasharray="5 95"
                    strokeDashoffset="-95"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="text-[13px] font-black text-slate-800">100%</span>
                </div>
              </div>
            </div>

            {/* Category breakdown legend chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600">
              {categoryBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
