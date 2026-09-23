import { useState, useEffect, useRef } from "react";
import {
  ArrowUp,
  ArrowDown,
  Pin,
  Columns,
  RotateCcw,
  Maximize2,
  ChevronRight,
  Check,
} from "lucide-react";
import type { DataGridColumn, SortDirection } from "./types";

interface ColumnMenuPopoverProps<T> {
  columnKey: string;
  columnTitle?: React.ReactNode;
  columns: (DataGridColumn<T> & { key?: string })[];
  currentSortDirection?: SortDirection;
  currentPinned?: "left" | "right" | false;
  visibleColumns: Set<string>;
  isOpen: boolean;
  onClose: () => void;
  onSort: (direction: "asc" | "desc" | null) => void;
  onPin: (pinned: "left" | "right" | false) => void;
  onToggleColumnVisibility: (colKey: string) => void;
  onResetColumns: () => void;
  onAutosizeColumn?: () => void;
}

export function ColumnMenuPopover<T>({
  columnKey,
  columnTitle,
  columns,
  currentSortDirection,
  currentPinned,
  visibleColumns,
  isOpen,
  onClose,
  onSort,
  onPin,
  onToggleColumnVisibility,
  onResetColumns,
  onAutosizeColumn,
}: ColumnMenuPopoverProps<T>) {
  const [activeSubmenu, setActiveSubmenu] = useState<"pin" | "columns" | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveSubmenu(null);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full left-0 z-50 mt-1 w-56 rounded-xl border border-slate-300 bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-800 font-sans text-[12px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-0.5">
        {/* Sort Ascending */}
        <button
          type="button"
          onClick={() => {
            onSort("asc");
            onClose();
          }}
          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium transition cursor-pointer ${
            currentSortDirection === "asc"
              ? "bg-sky-50 text-sky-700 font-bold"
              : "hover:bg-slate-100 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
            <span>Sort Ascending</span>
          </div>
          {currentSortDirection === "asc" && <Check className="h-3.5 w-3.5 text-sky-600" />}
        </button>

        {/* Sort Descending */}
        <button
          type="button"
          onClick={() => {
            onSort("desc");
            onClose();
          }}
          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium transition cursor-pointer ${
            currentSortDirection === "desc"
              ? "bg-sky-50 text-sky-700 font-bold"
              : "hover:bg-slate-100 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
            <span>Sort Descending</span>
          </div>
          {currentSortDirection === "desc" && <Check className="h-3.5 w-3.5 text-sky-600" />}
        </button>

        <div className="my-1 border-t border-slate-200" />

        {/* Pin Column Submenu */}
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setActiveSubmenu("pin")}
            onClick={() => setActiveSubmenu(activeSubmenu === "pin" ? null : "pin")}
            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Pin className="h-3.5 w-3.5 text-slate-500" />
              <span>Pin Column</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {activeSubmenu === "pin" && (
            <div className="absolute left-full top-0 ml-1 w-36 rounded-xl border border-slate-300 bg-white p-1.5 shadow-2xl animate-in fade-in z-50">
              <button
                type="button"
                onClick={() => {
                  onPin("left");
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left font-medium cursor-pointer ${
                  currentPinned === "left"
                    ? "bg-sky-50 text-sky-700 font-bold"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>Pin Left</span>
                {currentPinned === "left" && <Check className="h-3 w-3 text-sky-600" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  onPin("right");
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left font-medium cursor-pointer ${
                  currentPinned === "right"
                    ? "bg-sky-50 text-sky-700 font-bold"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>Pin Right</span>
                {currentPinned === "right" && <Check className="h-3 w-3 text-sky-600" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  onPin(false);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left font-medium cursor-pointer ${
                  !currentPinned
                    ? "bg-sky-50 text-sky-700 font-bold"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>No Pin</span>
                {!currentPinned && <Check className="h-3 w-3 text-sky-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Autosize This Column */}
        <button
          type="button"
          onClick={() => {
            onAutosizeColumn?.();
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-medium hover:bg-slate-100 text-slate-700 cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Autosize This Column</span>
        </button>

        <div className="my-1 border-t border-slate-200" />

        {/* Choose Columns Submenu */}
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setActiveSubmenu("columns")}
            onClick={() => setActiveSubmenu(activeSubmenu === "columns" ? null : "columns")}
            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Columns className="h-3.5 w-3.5 text-slate-500" />
              <span>Choose Columns</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {activeSubmenu === "columns" && (
            <div className="absolute left-full top-0 ml-1 w-48 max-h-56 overflow-y-auto rounded-xl border border-slate-300 bg-white p-2 shadow-2xl animate-in fade-in z-50 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider mb-1">
                Visible Columns
              </div>
              {columns
                .filter((c) => c.hideable !== false)
                .map((col, idx) => {
                  const keySafe = col.key || col.id || `col-${idx}`;
                  const isVisible = visibleColumns.has(keySafe);
                  return (
                    <label
                      key={keySafe}
                      className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-[12px] font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => onToggleColumnVisibility(keySafe)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span className="truncate">{col.header}</span>
                    </label>
                  );
                })}
            </div>
          )}
        </div>

        {/* Reset Columns */}
        <button
          type="button"
          onClick={() => {
            onResetColumns();
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-medium hover:bg-rose-50 text-rose-700 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
          <span>Reset Columns</span>
        </button>
      </div>
    </div>
  );
}
