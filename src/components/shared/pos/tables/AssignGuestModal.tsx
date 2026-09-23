import React, { useState, useEffect } from "react";
import { X, UserPlus, Users, Sparkles, Utensils } from "lucide-react";
import type { RestaurantTable } from "@/types/posTables";

interface AssignGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTables: RestaurantTable[];
  onAssignGuest: (tableId: string, guestName: string, partySize: number) => void;
}

export function AssignGuestModal({
  isOpen,
  onClose,
  availableTables,
  onAssignGuest,
}: AssignGuestModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [partySize, setPartySize] = useState<number>(2);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const firstAvailable = availableTables.find((t) => t.status === "vacant");
      setSelectedTableId(firstAvailable?.id || availableTables[0]?.id || "");
      setGuestName("");
      setPartySize(2);
      setError("");
    }
  }, [isOpen, availableTables]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId) {
      setError("Please select an available table");
      return;
    }
    const name = guestName.trim() || "Walk-in Guest";
    if (partySize <= 0) {
      setError("Please enter a valid party size");
      return;
    }

    onAssignGuest(selectedTableId, name, partySize);
    onClose();
  };

  const selectedTable = availableTables.find((t) => t.id === selectedTableId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
              <UserPlus className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Assign Guest to Table</h2>
              <p className="text-xs text-slate-500">
                Seat walk-in or arriving guests at an open table
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Table Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Available Table <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => {
                setSelectedTableId(e.target.value);
                const tbl = availableTables.find((t) => t.id === e.target.value);
                if (tbl) setPartySize(tbl.capacity);
                if (error) setError("");
              }}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
            >
              {availableTables.length === 0 ? (
                <option value="">No vacant tables available</option>
              ) : (
                availableTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tableNumber} — {t.capacity} Seats ({t.area}){" "}
                    {t.status !== "vacant" ? `[${t.status.toUpperCase()}]` : "[AVAILABLE]"}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Guest Name / Lead (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe / Walk-in party"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
            />
          </div>

          {/* Party Size */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Number of Guests / Party Size <span className="text-rose-500">*</span>
              </label>
              {selectedTable && (
                <span className="text-[11px] text-slate-400">
                  Capacity: {selectedTable.capacity} Seats
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 4, 6, 8].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPartySize(count)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    partySize === count
                      ? "bg-teal-700 text-white border-teal-800"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {count}
                </button>
              ))}
              <input
                type="number"
                min="1"
                max="30"
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value, 10) || 1)}
                className="w-16 px-2 py-1.5 text-xs text-center font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableTables.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Assign & Seat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
