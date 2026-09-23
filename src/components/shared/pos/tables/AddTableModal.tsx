import React, { useState, useEffect } from "react";
import { X, Plus, Utensils, Users, LayoutGrid } from "lucide-react";
import type { TableShape } from "@/types/posTables";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  areas: string[];
  defaultArea: string;
  onAddTable: (data: {
    tableNumber: string;
    capacity: number;
    area: string;
    shape?: TableShape;
  }) => void;
  nextTableNumberHint?: number;
}

const SEATER_OPTIONS = [2, 4, 6, 8, 10, 12];

export function AddTableModal({
  isOpen,
  onClose,
  areas,
  defaultArea,
  onAddTable,
  nextTableNumberHint = 13,
}: AddTableModalProps) {
  const [tableNumber, setTableNumber] = useState(`Table #${nextTableNumberHint}`);
  const [capacity, setCapacity] = useState<number>(4);
  const [customCapacity, setCustomCapacity] = useState("");
  const [isCustomCapacity, setIsCustomCapacity] = useState(false);
  const [selectedArea, setSelectedArea] = useState(defaultArea);
  const [shape, setShape] = useState<TableShape>("square");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTableNumber(`Table #${nextTableNumberHint}`);
      setSelectedArea(defaultArea || areas[0] || "Main Dining");
      setCapacity(4);
      setIsCustomCapacity(false);
      setCustomCapacity("");
      setError("");
    }
  }, [isOpen, defaultArea, areas, nextTableNumberHint]);

  if (!isOpen) return null;

  const handleCapacitySelect = (seats: number) => {
    setIsCustomCapacity(false);
    setCapacity(seats);
    if (seats >= 6) {
      setShape("rectangle");
    } else {
      setShape("square");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCapacity = isCustomCapacity ? parseInt(customCapacity, 10) : capacity;

    if (!tableNumber.trim()) {
      setError("Please enter a table name or number");
      return;
    }
    if (!finalCapacity || finalCapacity <= 0) {
      setError("Please choose a valid number of seats");
      return;
    }
    if (!selectedArea) {
      setError("Please choose an area");
      return;
    }

    onAddTable({
      tableNumber: tableNumber.trim(),
      capacity: finalCapacity,
      area: selectedArea,
      shape: finalCapacity >= 6 && shape === "square" ? "rectangle" : shape,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
              <LayoutGrid className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Table</h2>
              <p className="text-xs text-slate-500">
                Configure table seating capacity, area, and visual layout
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Table Name / Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Table Name / Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => {
                setTableNumber(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Table #14 or VIP 1"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
            />
          </div>

          {/* Area Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dining Area / Floor <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Seater / Capacity Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Seater / Seating Capacity <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {isCustomCapacity ? `${customCapacity || 0} Seats` : `${capacity} Seats`}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {SEATER_OPTIONS.map((num) => {
                const isSelected = !isCustomCapacity && capacity === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleCapacitySelect(num)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-teal-700 text-white border-teal-800 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {num} Seats
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setIsCustomCapacity(true);
                  if (!customCapacity) setCustomCapacity("5");
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isCustomCapacity
                    ? "bg-teal-700 text-white border-teal-800 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                Custom
              </button>
            </div>

            {isCustomCapacity && (
              <div className="mt-2.5">
                <input
                  type="number"
                  min="1"
                  max="30"
                  placeholder="Enter custom seat count (1 - 30)"
                  value={customCapacity}
                  onChange={(e) => setCustomCapacity(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                />
              </div>
            )}
          </div>

          {/* Table Shape Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Visual Layout:</span>{" "}
              {(!isCustomCapacity ? capacity : parseInt(customCapacity, 10) || 0) >= 6
                ? "Wide Rectangle layout with surrounding chairs"
                : "Compact Square layout with chairs"}
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
              Auto configured
            </span>
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          {/* Actions */}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
