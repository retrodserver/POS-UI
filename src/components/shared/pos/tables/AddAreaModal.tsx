import React, { useState } from "react";
import { X, Plus, Layers } from "lucide-react";

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArea: (areaName: string) => void;
  existingAreas: string[];
}

export function AddAreaModal({ isOpen, onClose, onAddArea, existingAreas }: AddAreaModalProps) {
  const [areaName, setAreaName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = areaName.trim();
    if (!trimmed) {
      setError("Please enter an area name");
      return;
    }
    if (existingAreas.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setError("An area with this name already exists");
      return;
    }
    onAddArea(trimmed);
    setAreaName("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Floor / Area</h2>
              <p className="text-xs text-slate-500">
                Create a new dining section (e.g. Terrace, Outdoor, Rooftop)
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Area / Floor Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Rooftop Lounge, Garden Terrace, Poolside"
              value={areaName}
              onChange={(e) => {
                setAreaName(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
          </div>

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
              Add Area
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
