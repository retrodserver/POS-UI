import { useState } from "react";
import { X, Users, CheckCircle2 } from "lucide-react";
import { MOCK_TABLES_LIST } from "./mockBillingData";

type BillingTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedTable: string;
  onSelectTable: (tableId: string) => void;
};

export function BillingTableModal({
  isOpen,
  onClose,
  selectedTable,
  onSelectTable,
}: BillingTableModalProps) {
  if (!isOpen) return null;

  const [activeArea, setActiveArea] = useState<string>("All Areas");

  const areas = ["All Areas", "Main Dining", "Terrace Garden", "Bar Lounge", "Private Dining Room"];

  const filteredTables =
    activeArea === "All Areas"
      ? MOCK_TABLES_LIST
      : MOCK_TABLES_LIST.filter((t) => t.area === activeArea);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Select Table for Dine-In</h3>
            <p className="text-xs text-slate-500">Pick an active or vacant dining table</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Area Filter Tabs */}
        <div className="p-3 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto">
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setActiveArea(area)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeArea === area
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredTables.map((table) => {
              const isSelected = selectedTable === table.id;
              const isVacant = table.status === "Vacant";
              const isOccupied = table.status === "Occupied";
              const isBilled = table.status === "Billed";

              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => {
                    onSelectTable(table.id);
                    onClose();
                  }}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border text-left transition cursor-pointer shadow-2xs hover:shadow-xs ${
                    isSelected
                      ? "border-teal-600 bg-teal-50/80 ring-2 ring-teal-600"
                      : isVacant
                        ? "border-emerald-200 bg-emerald-50/30 hover:border-emerald-400"
                        : isBilled
                          ? "border-amber-200 bg-amber-50/30 hover:border-amber-400"
                          : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">{table.id}</span>
                      <div className="text-[11px] text-slate-500">{table.area}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-700" />}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Users className="h-3 w-3" /> {table.capacity} PAX
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isVacant
                          ? "bg-emerald-100 text-emerald-800"
                          : isBilled
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
