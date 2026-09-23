import { useState, useEffect } from "react";
import { X, Percent, IndianRupee } from "lucide-react";
import { useUpdateItemCommission } from "@/hooks/queries/usePosMenu";
import type { MenuItemCommission } from "@/types/posMenu";
import { toast } from "sonner";

export function SetCommissionModal({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemCommission | null;
}) {
  const [commissionType, setCommissionType] = useState<
    "Not Configured" | "Percentage" | "Fixed Amount"
  >("Percentage");
  const [value, setValue] = useState<string>("5");
  const updateMutation = useUpdateItemCommission();

  useEffect(() => {
    if (item) {
      setCommissionType(
        item.commissionType === "Not Configured" ? "Percentage" : item.commissionType,
      );
      setValue(item.commissionValue != null ? String(item.commissionValue) : "5");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numVal = commissionType === "Not Configured" ? null : parseFloat(value) || 0;

    updateMutation.mutate(
      {
        id: item.id,
        commissionType,
        commissionValue: numVal,
      },
      {
        onSuccess: () => {
          toast.success(`Commission updated for "${item.name}"`);
          onClose();
        },
        onError: () => {
          toast.error("Failed to update commission");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-800">Set Menu Commission</h2>
            <p className="text-[12px] text-slate-500 truncate max-w-xs">{item.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex justify-between items-center text-[12.5px]">
            <div>
              <span className="text-slate-500">Category:</span>{" "}
              <span className="font-medium text-slate-700">{item.category}</span>
            </div>
            <div>
              <span className="text-slate-500">Base Price:</span>{" "}
              <span className="font-mono font-semibold text-slate-800">₹{item.price}</span>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Commission Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Not Configured", "Percentage", "Fixed Amount"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCommissionType(type)}
                  className={`rounded-lg border px-3 py-2 text-[12px] font-medium transition cursor-pointer text-center ${
                    commissionType === type
                      ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {type === "Not Configured"
                    ? "None"
                    : type === "Percentage"
                      ? "% Percent"
                      : "₹ Fixed"}
                </button>
              ))}
            </div>
          </div>

          {commissionType !== "Not Configured" && (
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Commission Value {commissionType === "Percentage" ? "(%)" : "(₹)"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  {commissionType === "Percentage" ? (
                    <Percent className="h-4 w-4" />
                  ) : (
                    <IndianRupee className="h-4 w-4" />
                  )}
                </div>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2 text-[13.5px] text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-teal-700 transition cursor-pointer disabled:opacity-50"
            >
              {updateMutation.isPending ? "Saving..." : "Save Commission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
