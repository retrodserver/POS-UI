import { useState, useMemo } from "react";
import {
  Sparkles,
  Clock,
  Plus,
  Minus,
  SlidersHorizontal,
  Flame,
  Coffee,
  Check,
} from "lucide-react";
import type {
  BillingMenuItem,
  BillingCategory,
  BillingDietType,
  BillingCartItem,
} from "@/types/posBilling";
import { BILLING_CATEGORIES } from "./mockBillingData";

type BillingMenuCatalogProps = {
  items: BillingMenuItem[];
  cartItems: BillingCartItem[];
  onAddItem: (item: BillingMenuItem) => void;
  onOpenModifierModal: (item: BillingMenuItem) => void;
  onUpdateCartQty: (cartId: string, newQty: number) => void;
  searchQuery: string;
};

export function BillingMenuCatalog({
  items,
  cartItems,
  onAddItem,
  onOpenModifierModal,
  onUpdateCartQty,
  searchQuery,
}: BillingMenuCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<BillingCategory>("All Items");
  const [selectedDiet, setSelectedDiet] = useState<BillingDietType>("all");

  const dietFilters: {
    id: BillingDietType;
    label: string;
    icon?: React.ElementType;
    color: string;
  }[] = [
    { id: "all", label: "All Items", color: "border-slate-300 text-slate-700 bg-white" },
    { id: "veg", label: "Veg", color: "border-emerald-500 text-emerald-800 bg-emerald-50/70" },
    { id: "non_veg", label: "Non-Veg", color: "border-rose-500 text-rose-800 bg-rose-50/70" },
    { id: "egg", label: "Egg", color: "border-amber-500 text-amber-800 bg-amber-50/70" },
    {
      id: "drinks",
      label: "Drinks",
      icon: Coffee,
      color: "border-blue-500 text-blue-800 bg-blue-50/70",
    },
  ];

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== "All Items" && item.category !== selectedCategory) {
        return false;
      }

      // Diet filter
      if (selectedDiet !== "all" && item.diet !== selectedDiet) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        return matchesName || matchesCode || matchesCategory;
      }

      return true;
    });
  }, [items, selectedCategory, selectedDiet, searchQuery]);

  // Helper to check if item is in cart
  const getItemCartState = (item: BillingMenuItem) => {
    const matchingCartItems = cartItems.filter((ci) => ci.item.id === item.id);
    const totalQty = matchingCartItems.reduce((sum, ci) => sum + ci.quantity, 0);
    const primaryCartItem = matchingCartItems[0];
    return {
      inCart: totalQty > 0,
      totalQty,
      primaryCartId: primaryCartItem?.cartId,
      hasMultipleVariations: matchingCartItems.length > 1,
    };
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* 1. Dietary & Quick Tag Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {dietFilters.map((df) => {
            const isSelected = selectedDiet === df.id;
            return (
              <button
                key={df.id}
                type="button"
                onClick={() => setSelectedDiet(df.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : `${df.color} hover:bg-slate-100`
                }`}
              >
                {df.id === "veg" && (
                  <span className="flex h-3 w-3 items-center justify-center border border-emerald-600 p-0.5 rounded-[2px] bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  </span>
                )}
                {df.id === "non_veg" && (
                  <span className="flex h-3 w-3 items-center justify-center border border-rose-600 p-0.5 rounded-[2px] bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                  </span>
                )}
                {df.id === "egg" && (
                  <span className="flex h-3 w-3 items-center justify-center border border-amber-600 p-0.5 rounded-[2px] bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                  </span>
                )}
                <span>{df.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11.5px] font-medium text-slate-500 px-2">
          Showing <span className="font-bold text-slate-800">{filteredItems.length}</span> items
        </div>
      </div>

      {/* 2. Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {BILLING_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                isActive
                  ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Items Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 p-6">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No items found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Try adjusting your search or category filters to find dishes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {filteredItems.map((item) => {
              const { inCart, totalQty, primaryCartId, hasMultipleVariations } =
                getItemCartState(item);
              const hasCustomizations =
                (item.variants && item.variants.length > 0) ||
                (item.modifierGroups && item.modifierGroups.length > 0);

              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col justify-between bg-white rounded-xl border transition-all duration-150 p-3.5 shadow-2xs hover:shadow-xs hover:border-teal-400/80 ${
                    inCart
                      ? "border-teal-400 bg-teal-50/15 ring-1 ring-teal-400/40"
                      : "border-slate-200"
                  }`}
                >
                  {/* Top Bar inside Card */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {/* Diet Icon Indicator */}
                        {item.diet === "veg" && (
                          <span className="flex h-3.5 w-3.5 items-center justify-center border border-emerald-600 p-0.5 rounded-[2px] bg-white">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                          </span>
                        )}
                        {item.diet === "non_veg" && (
                          <span className="flex h-3.5 w-3.5 items-center justify-center border border-rose-600 p-0.5 rounded-[2px] bg-white">
                            <span className="h-2 w-2 rounded-full bg-rose-600" />
                          </span>
                        )}
                        {item.diet === "egg" && (
                          <span className="flex h-3.5 w-3.5 items-center justify-center border border-amber-600 p-0.5 rounded-[2px] bg-white">
                            <span className="h-2 w-2 rounded-full bg-amber-600" />
                          </span>
                        )}
                        {item.diet === "drinks" && (
                          <span className="flex h-3.5 w-3.5 items-center justify-center border border-blue-600 p-0.5 rounded-[2px] bg-white">
                            <Coffee className="h-2 w-2 text-blue-600" />
                          </span>
                        )}

                        <span className="font-mono text-[11px] font-semibold text-slate-400">
                          {item.code}
                        </span>
                      </div>

                      {/* Badges: Chef special, Popular */}
                      <div className="flex items-center gap-1">
                        {item.isChefSpecial && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <Flame className="h-2.5 w-2.5 text-amber-600" />
                            Special
                          </span>
                        )}
                        {item.isPopular && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                            ★ Bestseller
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Name */}
                    <h4 className="font-bold text-slate-900 text-[13.5px] leading-snug line-clamp-2">
                      {item.name}
                    </h4>

                    {/* Description or category snippet */}
                    {item.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Bar: Price, Prep Time, & Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.variants && item.variants.length > 0 && (
                          <span className="text-[10px] font-semibold text-slate-400">onwards</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-400">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{item.prepTimeMinutes}m</span>
                      </div>
                    </div>

                    {/* Action Button: Add or Stepper */}
                    <div>
                      {inCart && !hasCustomizations ? (
                        <div className="flex items-center gap-1 bg-teal-50 border border-teal-300 rounded-lg p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() =>
                              primaryCartId && onUpdateCartQty(primaryCartId, totalQty - 1)
                            }
                            className="h-6 w-6 rounded bg-white hover:bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs text-teal-950">
                            {totalQty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              primaryCartId && onUpdateCartQty(primaryCartId, totalQty + 1)
                            }
                            className="h-6 w-6 rounded bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : hasCustomizations ? (
                        <button
                          type="button"
                          onClick={() => onOpenModifierModal(item)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer shadow-2xs ${
                            inCart
                              ? "bg-teal-700 text-white border-teal-700 hover:bg-teal-800"
                              : "bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100"
                          }`}
                        >
                          <SlidersHorizontal className="h-3 w-3" />
                          <span>{inCart ? `Added (${totalQty})` : "Customize"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddItem(item)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
