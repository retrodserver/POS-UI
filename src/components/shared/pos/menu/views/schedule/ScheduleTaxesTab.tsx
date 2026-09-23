import { useState } from "react";
import {
  Plus,
  ChevronDown,
  Edit2,
  Copy,
  Download,
  Trash2,
  CheckSquare,
  Square,
  X,
  Percent,
} from "lucide-react";
import type { ScheduleTaxItem } from "@/types/posMenu";
import { toast } from "sonner";

export function ScheduleTaxesTab() {
  const [taxes, setTaxes] = useState<ScheduleTaxItem[]>([
    {
      id: "tax-1",
      title: "CGST",
      onlineDisplayName: "CGST",
      taxType: "Forward Tax",
      type: "Percentage",
      amount: 2.5,
      status: "Active",
      createdAt: "6 Jun 2024",
    },
    {
      id: "tax-2",
      title: "SGST",
      onlineDisplayName: "SGST",
      taxType: "Forward Tax",
      type: "Percentage",
      amount: 2.5,
      status: "Active",
      createdAt: "6 Jun 2024",
    },
    {
      id: "tax-3",
      title: "GST 18%",
      onlineDisplayName: "—",
      taxType: "Forward Tax",
      type: "Percentage",
      amount: 18,
      status: "Active",
      createdAt: "13 Sep 2024",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTaxType, setNewTaxType] = useState<"Forward Tax" | "Backward Tax">("Forward Tax");
  const [newRateType, setNewRateType] = useState<"Percentage" | "Fixed Amount">("Percentage");
  const [newAmount, setNewAmount] = useState("5");

  const toggleSelectAll = () => {
    if (selectedIds.length === taxes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(taxes.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAddTaxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a tax title");
      return;
    }

    const newTax: ScheduleTaxItem = {
      id: `tax-${Date.now()}`,
      title: newTitle.trim(),
      onlineDisplayName: newTitle.trim(),
      taxType: newTaxType,
      type: newRateType,
      amount: parseFloat(newAmount) || 5,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setTaxes([...taxes, newTax]);
    toast.success(`Tax slab "${newTitle}" created successfully`);
    setNewTitle("");
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    setTaxes(taxes.filter((t) => t.id !== id));
    toast.success(`Removed tax "${title}"`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Action Buttons matching Petpooja Taxes Screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Tax Configuration</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("Area to area copy tax opened")}
            className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            Area To Area Copy Tax
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            Add Tax
          </button>
          <button
            type="button"
            onClick={() => toast.info("Backward tax printing settings opened")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Backward Tax Printing Settings
          </button>
          <button
            type="button"
            onClick={() => toast.info("Bill number reset counter configured")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Reset Bill No.
          </button>
          <button
            type="button"
            onClick={() => toast.success("Consolidated tax exported as Excel")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Export Consolidated Tax
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Tax Type : Item Wise
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Taxes Data Table from Screenshot */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-12 px-4 py-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {selectedIds.length > 0 && selectedIds.length === taxes.length ? (
                      <CheckSquare className="h-4 w-4 text-teal-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Online Display Name</th>
                <th className="px-4 py-3">Tax Type</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {taxes.map((tax) => {
                const isSelected = selectedIds.includes(tax.id);
                return (
                  <tr
                    key={tax.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(tax.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-900">{tax.title}</td>
                    <td className="px-4 py-3 text-slate-600">{tax.onlineDisplayName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{tax.taxType}</td>
                    <td className="px-4 py-3 text-slate-700">{tax.type}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                      {tax.amount}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {tax.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-[12px]">{tax.createdAt}</td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing tax slab ${tax.title}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Tax"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Assign items to ${tax.title}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Assign Items"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tax.id, tax.title)}
                          className="p-1 hover:text-red-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Delete Tax"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50 flex items-center justify-between text-[11.5px] text-slate-500">
          <span>Note : Drag row to change order/rank.</span>
          <span>Showing {taxes.length} tax slabs</span>
        </div>
      </div>

      {/* Add Tax Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-[16px] font-bold text-slate-900">Add Tax Configuration</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTaxSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tax Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. VAT 10%, Service Charge 5%"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-teal-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tax Application Type
                </label>
                <select
                  value={newTaxType}
                  onChange={(e) => setNewTaxType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Forward Tax">Forward Tax (Exclusive on bill)</option>
                  <option value="Backward Tax">Backward Tax (Inclusive in item price)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Rate Type
                  </label>
                  <select
                    value={newRateType}
                    onChange={(e) => setNewRateType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Amount / Rate
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
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
                  className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-teal-700 shadow-xs cursor-pointer"
                >
                  Save Tax
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
