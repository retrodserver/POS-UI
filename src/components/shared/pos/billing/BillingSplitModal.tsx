import { useState } from "react";
import { X, Users, Split, Check, CreditCard, Banknote, QrCode } from "lucide-react";
import type { BillingCartItem } from "@/types/posBilling";

type BillingSplitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  guestCount: number;
  cartItems: BillingCartItem[];
  onConfirmSplitPayment: (splitCount: number, perPersonAmount: number) => void;
};

export function BillingSplitModal({
  isOpen,
  onClose,
  grandTotal,
  guestCount,
  cartItems,
  onConfirmSplitPayment,
}: BillingSplitModalProps) {
  if (!isOpen) return null;

  const [splitMode, setSplitMode] = useState<"equal" | "items" | "custom">("equal");
  const [splitCount, setSplitCount] = useState(Math.max(2, guestCount || 2));
  const [guestPayments, setGuestPayments] = useState<{
    [guestIndex: number]: "cash" | "upi" | "card";
  }>({
    0: "cash",
    1: "upi",
    2: "card",
    3: "cash",
  });

  const perPersonAmount = Math.round(grandTotal / splitCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Split className="h-5 w-5 text-teal-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Split Bill Settlement</h3>
              <p className="text-xs text-slate-500">
                Total Bill:{" "}
                <strong className="text-slate-900">₹{grandTotal.toLocaleString()}</strong>
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

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Split Mode Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSplitMode("equal")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                splitMode === "equal"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Equal Split
            </button>
            <button
              type="button"
              onClick={() => setSplitMode("items")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                splitMode === "items"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Split by Items
            </button>
            <button
              type="button"
              onClick={() => setSplitMode("custom")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                splitMode === "custom"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Custom Share
            </button>
          </div>

          {/* Equal Split Options */}
          {splitMode === "equal" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs">
                <div>
                  <span className="font-semibold text-teal-800">Split between Guests:</span>
                  <div className="text-[11px] text-teal-600 mt-0.5">
                    Equal share per guest: <strong>₹{perPersonAmount.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                    className="h-7 w-7 rounded-lg bg-white border border-teal-300 text-teal-900 font-bold hover:bg-teal-100 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-teal-950">
                    {splitCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                    className="h-7 w-7 rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Guest Shares Breakdown List */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Individual Guest Tender Breakdown ({splitCount} parts)
                </label>
                {Array.from({ length: splitCount }).map((_, index) => {
                  const currentMode = guestPayments[index] || "cash";
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                          #{index + 1}
                        </span>
                        <span className="font-semibold text-slate-800">Guest {index + 1}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          ₹{perPersonAmount.toLocaleString()}
                        </span>

                        {/* Payment mode chip selector */}
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                          {(["cash", "upi", "card"] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setGuestPayments((prev) => ({ ...prev, [index]: m }))}
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition cursor-pointer ${
                                currentMode === m
                                  ? "bg-teal-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Item Split Mode */}
          {splitMode === "items" && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Assign specific ordered dishes to each split check:
              </p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {cartItems.map((ci) => (
                  <div
                    key={ci.cartId}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{ci.item.name}</span>
                      <div className="text-[11px] text-slate-500">
                        Qty: {ci.quantity} × ₹{ci.item.price}
                      </div>
                    </div>
                    <select className="text-xs bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-teal-800">
                      <option value="1">Sub-Check 1</option>
                      <option value="2">Sub-Check 2</option>
                      <option value="3">Shared by All</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Amount Mode */}
          {splitMode === "custom" && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-bold">Custom Payment Portions:</span>
                <p className="text-[11.5px] text-amber-800 mt-1">
                  Enter arbitrary amounts per tender method (e.g. ₹1,000 in Cash and remainder via
                  Card).
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Portion 1 (Cash)
                  </label>
                  <input
                    type="number"
                    defaultValue={Math.round(grandTotal / 2)}
                    className="w-full text-xs font-bold p-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Portion 2 (UPI / Card)
                  </label>
                  <input
                    type="number"
                    defaultValue={grandTotal - Math.round(grandTotal / 2)}
                    className="w-full text-xs font-bold p-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmSplitPayment(splitCount, perPersonAmount);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Check className="h-4 w-4" />
            <span>Confirm Split & Settle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
