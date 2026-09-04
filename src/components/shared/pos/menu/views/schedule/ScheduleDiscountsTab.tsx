import { useState } from "react";
import {
  Plus,
  ChevronDown,
  Search,
  Copy,
  Edit2,
  Trash2,
  X,
  Tag,
  Percent,
  IndianRupee,
} from "lucide-react";
import type { ScheduleDiscountItem } from "@/types/posMenu";
import { toast } from "sonner";

export function ScheduleDiscountsTab() {
  const [discounts, setDiscounts] = useState<ScheduleDiscountItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal form state
  const [newTitle, setNewTitle] = useState("");
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed Amount">("Percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minBill, setMinBill] = useState("500");

  const handleAddDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a discount campaign title");
      return;
    }

    const newDisc: ScheduleDiscountItem = {
      id: `disc-${Date.now()}`,
      title: newTitle.trim(),
      discountType,
      value: parseFloat(discountValue) || 10,
      minBillAmount: parseFloat(minBill) || 0,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };

    setDiscounts([newDisc, ...discounts]);
    toast.success(`Discount rule "${newTitle}" created successfully`);
    setNewTitle("");
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: string, current: string) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" } : d
      )
    );
    toast.info(`Toggled status to ${current === "Active" ? "Inactive" : "Active"}`);
  };

  const handleDelete = (id: string, title: string) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
    toast.success(`Removed discount "${title}"`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions matching Petpooja Discount Screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Discount Configuration</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("Copy discount to outlet wizard opened")}
            className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            Copy Discount To Outlet
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            Add Discount
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Content Area: Empty State or Discount Listing */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs min-h-[380px] flex flex-col justify-center">
        {discounts.length === 0 ? (
          /* Empty State exactly matching Screenshot */
          <div className="text-center py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600 mx-auto mb-3">
              <Search className="h-7 w-7 stroke-[1.5]" />
            </div>
            <h4 className="text-[15px] font-semibold text-slate-800">No Record Found</h4>
            <p className="text-[12.5px] text-slate-400 mt-1 max-w-sm mx-auto">
              We could not find what you searched for Try searching again
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add First Discount
            </button>
          </div>
        ) : (
          /* Active Discounts Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Discount Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Discount Value</th>
                  <th className="px-4 py-3">Min Bill Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discounts.map((disc) => (
                  <tr key={disc.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{disc.title}</td>
                    <td className="px-4 py-3 text-slate-600">{disc.discountType}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                      {disc.discountType === "Percentage" ? `${disc.value}%` : `₹${disc.value}`}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      ₹{disc.minBillAmount ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(disc.id, disc.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                          disc.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {disc.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[12px]">{disc.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing discount ${disc.title}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(disc.id, disc.title)}
                          className="p-1 hover:text-red-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Discount Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-[16px] font-bold text-slate-900">Add Discount Configuration</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDiscountSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Discount Campaign Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Happy Hours 20%, Weekend Bonanza"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-teal-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Discount Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType("Percentage")}
                    className={`rounded-lg border px-3 py-2 text-[12.5px] font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === "Percentage"
                        ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Percent className="h-4 w-4" /> Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("Fixed Amount")}
                    className={`rounded-lg border px-3 py-2 text-[12.5px] font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === "Fixed Amount"
                        ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <IndianRupee className="h-4 w-4" /> Fixed Amount (₹)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Discount Value {discountType === "Percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Min Bill Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minBill}
                    onChange={(e) => setMinBill(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-teal-700 shadow-sm cursor-pointer"
                >
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
