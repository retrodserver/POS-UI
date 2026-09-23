import { X, Play, Trash2, Clock, User, UtensilsCrossed, AlertCircle } from "lucide-react";
import type { HeldBill } from "@/types/posBilling";

type BillingHeldDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  heldBills: HeldBill[];
  onResumeHeldBill: (bill: HeldBill) => void;
  onDeleteHeldBill: (id: string) => void;
};

export function BillingHeldDrawer({
  isOpen,
  onClose,
  heldBills,
  onResumeHeldBill,
  onDeleteHeldBill,
}: BillingHeldDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Parked & Held Checks</h3>
              <p className="text-xs text-slate-500">
                {heldBills.length} {heldBills.length === 1 ? "check" : "checks"} currently on hold
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {heldBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
              <AlertCircle className="h-10 w-10 text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-bold text-slate-700">No Held Checks</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                You can park active orders using the "Hold [F4]" button when customers take time to
                decide.
              </p>
            </div>
          ) : (
            heldBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-amber-400 transition"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {bill.tableNumber || "Takeaway Order"}
                      </span>
                      <span className="text-[10.5px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.2 rounded">
                        {bill.billNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {bill.heldAt}
                      </span>
                      <span>·</span>
                      <span>Steward: {bill.captainName}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900">
                      ₹{bill.grandTotal.toLocaleString()}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {bill.items.reduce((sum, i) => sum + i.quantity, 0)} Items
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80 space-y-0.5">
                  {bill.items.slice(0, 3).map((item) => (
                    <div key={item.cartId} className="flex justify-between text-[11.5px]">
                      <span className="truncate pr-2">
                        {item.quantity}× {item.item.name}
                      </span>
                      <span className="text-slate-500">₹{item.item.price * item.quantity}</span>
                    </div>
                  ))}
                  {bill.items.length > 3 && (
                    <div className="text-[10.5px] text-slate-400 font-semibold pt-0.5">
                      + {bill.items.length - 3} more items...
                    </div>
                  )}
                </div>

                {bill.notes && (
                  <div className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-200">
                    Note: {bill.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    onClick={() => onDeleteHeldBill(bill.id)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-transparent transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Discard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onResumeHeldBill(bill);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Resume Order</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
