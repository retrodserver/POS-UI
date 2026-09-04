import { useState } from "react";
import {
  Star,
  Search,
  Filter,
  Utensils,
  Calendar,
  Package,
  Tags,
  Users,
  Percent,
  FileText,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface ReportCard {
  id: string;
  category: string;
  title: string;
  description: string;
  isFavorite: boolean;
}

export function MainOtherReportsView() {
  const [activeCategory, setActiveCategory] = useState<
    | "favourite"
    | "all_restaurant"
    | "order_related"
    | "item_related"
    | "category_related"
    | "customer_related"
    | "discount_related"
    | "others"
  >("favourite");

  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "favourite", label: "Favourite", icon: Star, desc: "All reports which are marked as favorites to refer frequently" },
    { id: "all_restaurant", label: "All Restaurant Report", icon: Utensils, desc: "Get insights to all your restaurant & sales related activities" },
    { id: "order_related", label: "Order Related Reports", icon: Calendar, desc: "Detailed breakdown of orders, dining types, and time slots" },
    { id: "item_related", label: "Item Related Reports", icon: Package, desc: "Menu item sales volume, popularity, and modifiers" },
    { id: "category_related", label: "Category Related Reports", icon: Tags, desc: "Revenue generation by food and beverage categories" },
    { id: "customer_related", label: "Customer Related Reports", icon: Users, desc: "Customer retention, average ticket spend, and visit frequencies" },
    { id: "discount_related", label: "Discount Related Reports", icon: Percent, desc: "Manager comps, coupons, aggregator offers, and discount audits" },
    { id: "others", label: "Others Reports", icon: FileText, desc: "Taxes, biller metrics, cancelled orders, and shift audit logs" },
  ] as const;

  const [reports, setReports] = useState<ReportCard[]>([
    {
      id: "REP-01",
      category: "all_restaurant",
      title: "All Restaurant Sales Report",
      description: "Total sales of all your restaurant",
      isFavorite: true,
    },
    {
      id: "REP-02",
      category: "item_related",
      title: "Outlet-Item Wise Report (Row)",
      description: "Consolidated Summary of Item sales with outlets in row format",
      isFavorite: true,
    },
    {
      id: "REP-03",
      category: "all_restaurant",
      title: "Invoice Report: All Restaurants",
      description: "Total invoice of all your restaurants",
      isFavorite: true,
    },
    {
      id: "REP-04",
      category: "order_related",
      title: "Pax Sales Report: Biller Wise",
      description: "Sales per pax made by each biller",
      isFavorite: false,
    },
    {
      id: "REP-05",
      category: "order_related",
      title: "Order Report: Sub-Order Wise",
      description: "Proper bifurcation of orders based on its sub-order type",
      isFavorite: false,
    },
    {
      id: "REP-06",
      category: "all_restaurant",
      title: "All Restaurant Report: Day Wise",
      description: "Total sales of all your restaurant per day",
      isFavorite: true,
    },
    {
      id: "REP-07",
      category: "discount_related",
      title: "Discount & Comp Audit Report",
      description: "Summary of discounts provided across dine-in, takeaway, and aggregators",
      isFavorite: false,
    },
    {
      id: "REP-08",
      category: "category_related",
      title: "Category Contribution Analysis",
      description: "Percentage contribution of appetizers, main course, beverages, and desserts",
      isFavorite: false,
    },
    {
      id: "REP-09",
      category: "customer_related",
      title: "Customer Repeat Order Matrix",
      description: "Identification of VIP repeat guests and loyalty reward redemptions",
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
    toast.success("Favorite preference updated");
  };

  const filteredReports = reports.filter((r) => {
    if (activeCategory === "favourite" && !r.isFavorite) return false;
    if (activeCategory !== "favourite" && r.category !== activeCategory) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const currentCategoryMeta = categories.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Reports</h2>

      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left Category Panel matching Screenshots 2 & 3 */}
        <div className="w-full lg:w-[260px] shrink-0 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 text-[13px]">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 font-medium transition cursor-pointer flex items-center gap-3 ${
                    isActive
                      ? "border-l-4 border-teal-600 bg-teal-50/40 text-slate-900 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? cat.id === "favourite"
                          ? "text-amber-500 fill-amber-500"
                          : "text-teal-600"
                        : "text-slate-400"
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Reports Grid matching Screenshots 2 & 3 */}
        <div className="flex-1 w-full space-y-4">
          {/* Top Search Filter matching Screenshot */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for reports here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none shadow-2xs"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 p-1 rounded-md text-teal-600 hover:bg-teal-50"
              title="Filter"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Subheader info matching Screenshot */}
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">{currentCategoryMeta?.label}</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">{currentCategoryMeta?.desc}</p>
          </div>

          {/* Reports Grid matching Screenshot */}
          {filteredReports.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
              No reports found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-300 hover:shadow-sm transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[14px] font-bold text-slate-900">{r.title}</h4>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(r.id)}
                        className="text-slate-300 hover:text-amber-500 transition cursor-pointer"
                        title={r.isFavorite ? "Unfavorite" : "Favorite"}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            r.isFavorite
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 hover:text-slate-400"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{r.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toast.info(`Opening ${r.title} viewer...`)}
                      className="text-[12.5px] font-semibold text-teal-600 hover:text-teal-700 cursor-pointer inline-flex items-center gap-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
