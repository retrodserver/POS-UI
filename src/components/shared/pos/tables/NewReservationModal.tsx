import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Clock, Users, Phone, User, FileText, Check } from "lucide-react";
import type { RestaurantTable, ReservationItem } from "@/types/posTables";

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: RestaurantTable[];
  preselectedTableId?: string;
  onSaveReservation: (
    data: Omit<ReservationItem, "id" | "createdAt" | "status">
  ) => void;
}

export function NewReservationModal({
  isOpen,
  onClose,
  tables,
  preselectedTableId,
  onSaveReservation,
}: NewReservationModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState(preselectedTableId || "");
  const [reservationDate, setReservationDate] = useState("Thu, 11 Jan 2024");
  const [reservationTime, setReservationTime] = useState("07:30 PM");
  const [notes, setNotes] = useState("");
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    if (preselectedTableId) {
      setSelectedTableId(preselectedTableId);
    } else if (tables.length > 0) {
      const firstVacant = tables.find((t) => t.status === "vacant") || tables[0];
      setSelectedTableId(firstVacant.id);
    }
  }, [preselectedTableId, tables, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !selectedTableId) {
      return;
    }

    const table = tables.find((t) => t.id === selectedTableId);
    const tableNumber = table ? table.tableNumber : "Table #1";

    onSaveReservation({
      tableId: selectedTableId,
      tableNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      guests,
      reservationDate,
      reservationTime,
      endTime: "09:30 PM",
      paymentStatus: "deposit_paid",
      depositAmount: 25,
      isVip,
      notes: notes || undefined,
    });

    // Reset form and close
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setNotes("");
    setIsVip(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Add New Reservation
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Book a table for upcoming dining guests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Usman ibn Hunaif"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Contact Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+1 678 890 300"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guest Count *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Table Selection & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Table *
              </label>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tableNumber} ({t.capacity} Seats - {t.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reservation Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  placeholder="07:30 PM"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Notes / Requests
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Window side preferred, celebration cake, high chair"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* VIP Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vipGuestCheck"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="vipGuestCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
              Mark as VIP Guest
            </label>
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Confirm Reservation
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
