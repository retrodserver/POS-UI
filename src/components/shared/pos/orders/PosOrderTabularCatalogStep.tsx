import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  Utensils,
  ChefHat,
  PauseCircle,
  ArrowLeft,
} from "lucide-react";
import type { BillingMenuItem, BillingCategory } from "@/types/posBilling";
import { MOCK_MENU_ITEMS, BILLING_CATEGORIES } from "../billing/mockBillingData";

export interface PosOrderCartItem {
  item: BillingMenuItem;
  quantity: number;
  selectedVariantName?: string;
  unitPrice: number;
  notes?: string;
}

interface PosOrderTabularCatalogStepProps {
  // Title & Metadata shown on top of the bill
  billTitle: string;
  billSubtitle?: React.ReactNode;
  badgeText?: string;

  // Cart State & Mutators
  cart: Record<string, PosOrderCartItem>;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onAddItem: (item: BillingMenuItem, selectedVariant?: { id: string; name: string; price: number }) => void;

  // Financial rates
  taxRate?: number; // e.g. 0.05 for 5% GST (default)
  serviceChargeRate?: number; // e.g. 0.05 for 5% Room Service Fee (default 0)

  // Navigation & Actions
  onBack?: () => void;
  onCancel: () => void;
  onHoldOrder: () => void;
  onSendToKOT: () => void;

  holdButtonText?: string;
  confirmButtonText?: string;
}

export function PosOrderTabularCatalogStep({
  billTitle,
  billSubtitle,
  badgeText,
  cart,
  onUpdateQty,
  onRemoveItem,
  onAddItem,
  taxRate = 0.05,
  serviceChargeRate = 0,
  onBack,
  onCancel,
  onHoldOrder,
  onSendToKOT,
  holdButtonText = "Hold Order",
  confirmButtonText = "Send to KOT",
}: PosOrderTabularCatalogStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<BillingCategory>("All Items");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non_veg">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Track portion variant chosen per dish in the table view (e.g. { "itm-101": "v1-half" })
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return MOCK_MENU_ITEMS.filter((item) => {
      if (selectedCategory !== "All Items" && item.category !== selectedCategory) {
        return false;
      }
      if (dietFilter !== "all" && item.diet !== dietFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchCode) return false;
      }
      return true;
    });
  }, [selectedCategory, dietFilter, searchQuery]);

  // Cart financial calculations
  const cartList = Object.values(cart);
  const totalItemCount = cartList.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartList.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const serviceCharge = serviceChargeRate > 0 ? +(subtotal * serviceChargeRate).toFixed(2) : 0;
  const tax = +(subtotal * taxRate).toFixed(2);
  const grandTotal = +(subtotal + serviceCharge + tax).toFixed(2);

  const handleDishAddClick = (item: BillingMenuItem) => {
    const hasVariants = item.variants && item.variants.length > 0;
    const chosenVarId = selectedVariants[item.id] || (hasVariants ? item.variants![0].id : "");
    const chosenVariant = hasVariants
      ? item.variants!.find((v) => v.id === chosenVarId) || item.variants![0]
      : undefined;

    onAddItem(item, chosenVariant);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Top Toolbar */}
      <div className="p-3 border-b border-slate-200 bg-white space-y-2 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Diet filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDietFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                dietFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setDietFilter("veg")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                dietFilter === "veg"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Veg
            </button>
            <button
              type="button"
              onClick={() => setDietFilter("non_veg")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                dietFilter === "non_veg"
                  ? "bg-rose-700 text-white shadow-2xs"
                  : "text-rose-700 hover:bg-rose-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Non-Veg
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {BILLING_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-teal-700 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Split Screen: Tabular Menu (Left 7 cols) + Live Bill Format (Right 5 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50">
        {/* Left Column: Tabular Menu */}
        <div className="lg:col-span-7 xl:col-span-7 overflow-y-auto p-3 border-r border-slate-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10.5px]">
                <th className="py-2.5 px-3">Dish Name</th>
                <th className="py-2.5 px-2 text-center">Portion / Size</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMenuItems.map((item) => {
                const hasVariants = item.variants && item.variants.length > 0;
                const chosenVarId =
                  selectedVariants[item.id] || (hasVariants ? item.variants![0].id : "");
                const chosenVariant = hasVariants
                  ? item.variants!.find((v) => v.id === chosenVarId) || item.variants![0]
                  : null;
                const displayPrice = chosenVariant ? chosenVariant.price : item.price;

                // Check if in cart
                const cartKey = chosenVariant ? `${item.id}-${chosenVariant.id}` : item.id;
                const inCart = cart[cartKey];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Dish Name */}
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.diet === "veg" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span className="truncate max-w-[180px] sm:max-w-[220px]">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Portion / Size (Half / Full or Standard) */}
                    <td className="py-2.5 px-2 text-center">
                      {hasVariants ? (
                        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                          {item.variants!.map((v) => {
                            const isSelected = v.id === chosenVarId;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() =>
                                  setSelectedVariants((prev) => ({
                                    ...prev,
                                    [item.id]: v.id,
                                  }))
                                }
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-teal-700 text-white shadow-2xs"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                {v.name.split(" ")[0]}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Standard</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{displayPrice.toFixed(2)}
                    </td>

                    {/* Action Button */}
                    <td className="py-2.5 px-3 text-right">
                      {inCart ? (
                        <div className="inline-flex items-center border border-teal-600 rounded-lg overflow-hidden bg-teal-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(cartKey, -1)}
                            className="px-1.5 py-0.5 text-teal-800 hover:bg-teal-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 text-xs font-bold text-teal-900">
                            {inCart.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(cartKey, 1)}
                            className="px-1.5 py-0.5 text-teal-800 hover:bg-teal-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDishAddClick(item)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-all cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column: Live Bill Format */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-3.5 bg-slate-50 overflow-y-auto">
          <div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs mb-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-slate-900">{billTitle}</span>
                {badgeText && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {badgeText}
                  </span>
                )}
              </div>
              {billSubtitle && <div className="text-[11px] text-slate-500 mt-1">{billSubtitle}</div>}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 font-bold text-[11px] text-slate-700 flex items-center justify-between">
                <span>Ordered Dishes ({totalItemCount})</span>
                <span>Amount</span>
              </div>

              {cartList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Utensils className="w-6 h-6 mx-auto mb-1.5 opacity-30" />
                  <span>No dishes added yet.</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Click "+ Add" from the left menu to add dishes.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {Object.entries(cart).map(([key, c]) => (
                    <div
                      key={key}
                      className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50"
                    >
                      <div className="flex-1 mr-2 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{c.item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {c.selectedVariantName || "Standard"} • ₹{c.unitPrice} each
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(key, -1)}
                            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 text-xs font-bold">{c.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(key, 1)}
                            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="w-14 text-right font-mono font-bold text-slate-900">
                          ₹{(c.unitPrice * c.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(key)}
                          className="text-slate-300 hover:text-rose-500 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            {serviceChargeRate > 0 && (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Room Service Fee ({Math.round(serviceChargeRate * 100)}%):</span>
                <span className="font-mono">₹{serviceCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>GST ({Math.round(taxRate * 100)}%):</span>
              <span className="font-mono">₹{tax.toFixed(2)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-teal-800 text-base">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          >
            Cancel Order
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onHoldOrder}
            disabled={cartList.length === 0}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <PauseCircle className="w-4 h-4 text-amber-600" />
            <span>{holdButtonText}</span>
          </button>
          <button
            type="button"
            onClick={onSendToKOT}
            disabled={cartList.length === 0}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <ChefHat className="w-4 h-4" />
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
