import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, Check, Filter } from "lucide-react";

interface ColumnFilterPopoverProps {
  columnKey: string;
  columnTitle?: React.ReactNode;
  allValues: string[];
  selectedValues?: string[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (selected: string[]) => void;
}

export function ColumnFilterPopover({
  columnKey,
  columnTitle,
  allValues,
  selectedValues,
  isOpen,
  onClose,
  onApply,
}: ColumnFilterPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Distinct sorted values
  const uniqueValues = useMemo(() => {
    const set = new Set<string>();
    allValues.forEach((val) => {
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        set.add(String(val));
      } else {
        set.add("(Blanks)");
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allValues]);

  // Local selection state (defaults to all selected if undefined)
  const [tempSelected, setTempSelected] = useState<Set<string>>(() => {
    return new Set(selectedValues && selectedValues.length > 0 ? selectedValues : uniqueValues);
  });

  useEffect(() => {
    if (isOpen) {
      setTempSelected(
        new Set(selectedValues && selectedValues.length > 0 ? selectedValues : uniqueValues),
      );
      setSearchQuery("");
    }
  }, [isOpen, selectedValues, uniqueValues]);

  // Handle click outside to close & apply
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onApply(Array.from(tempSelected));
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, tempSelected, onApply, onClose]);

  // Filtered values by search
  const visibleValues = useMemo(() => {
    if (!searchQuery.trim()) return uniqueValues;
    const q = searchQuery.toLowerCase();
    return uniqueValues.filter((v) => v.toLowerCase().includes(q));
  }, [uniqueValues, searchQuery]);

  const isAllVisibleSelected =
    visibleValues.length > 0 && visibleValues.every((v) => tempSelected.has(v));
  const isSomeVisibleSelected =
    visibleValues.some((v) => tempSelected.has(v)) && !isAllVisibleSelected;

  const handleToggleSelectAll = () => {
    const next = new Set(tempSelected);
    if (isAllVisibleSelected) {
      visibleValues.forEach((v) => next.delete(v));
    } else {
      visibleValues.forEach((v) => next.add(v));
    }
    setTempSelected(next);
    onApply(Array.from(next));
  };

  const handleToggleItem = (val: string) => {
    const next = new Set(tempSelected);
    if (next.has(val)) {
      next.delete(val);
    } else {
      next.add(val);
    }
    setTempSelected(next);
    onApply(Array.from(next));
  };

  const handleClearAll = () => {
    const next = new Set(uniqueValues);
    setTempSelected(next);
    onApply([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full left-0 z-50 mt-1 w-60 rounded-xl border border-slate-300 bg-white p-2.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-800 font-sans"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Search Box */}
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-sky-400 bg-white pl-8 pr-2.5 py-1.5 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden"
          autoFocus
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Select All Option */}
      <div className="border-b border-slate-100 pb-1.5 mb-1.5">
        <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-[12px] font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={isAllVisibleSelected}
            ref={(el) => {
              if (el) el.indeterminate = isSomeVisibleSelected;
            }}
            onChange={handleToggleSelectAll}
            className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
          <span>(Select All)</span>
        </label>
      </div>

      {/* Scrollable Checklist */}
      <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 text-[12px]">
        {visibleValues.length === 0 ? (
          <div className="py-3 text-center text-[11.5px] text-slate-400">No matching values</div>
        ) : (
          visibleValues.map((val) => {
            const isChecked = tempSelected.has(val);
            return (
              <label
                key={val}
                className={`flex items-center gap-2 px-1.5 py-1 rounded-md transition cursor-pointer text-[12px] ${
                  isChecked
                    ? "text-slate-900 font-medium hover:bg-sky-50/50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleItem(val)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span className="truncate">{val}</span>
              </label>
            );
          })
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2 text-[11px]">
        <button
          type="button"
          onClick={handleClearAll}
          className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
        >
          Reset Filter
        </button>
        <button
          type="button"
          onClick={() => {
            onApply(Array.from(tempSelected));
            onClose();
          }}
          className="rounded-md bg-sky-600 px-3 py-1 font-bold text-white hover:bg-sky-700 cursor-pointer shadow-2xs"
        >
          Done
        </button>
      </div>
    </div>
  );
}
