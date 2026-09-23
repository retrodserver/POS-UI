import React, { useState, useMemo, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import {
  DataTableHeader,
  DataTableFooter,
  DataTableFilterBar,
  DataTableSelectionBar,
  DataTableToolbar,
  getTableBodyCellPinnedStyle,
  exportTableToCsv,
  type DataTableColumn,
  type ThemeVariant,
} from "@/components/common/DataTableHeader";
import type {
  DataGridColumn,
  PosDataGridProps,
  ColumnSortState,
} from "./types";
import { cn } from "@/lib/utils";

export interface ExtendedPosDataGridProps<T = any> extends PosDataGridProps<T> {
  themeVariant?: ThemeVariant;
  storageKey?: string;
  onExport?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  searchPlaceholder?: string;
  showToolbar?: boolean;
}

export function PosDataGrid<T>({
  data = [],
  columns: rawColumns = [],
  keyField = "id" as any,
  selectable = false,
  enableSelection = false,
  selectedRows = [],
  selectedRowIds,
  onSelectionChange,
  pageSize: initialPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  initialSort,
  emptyMessage = "No records found.",
  loading = false,
  isLoading = false,
  className = "",
  onRowClick,
  toolbar,
  dense = false,
  themeVariant = "primary",
  storageKey,
  onExport,
  title,
  subtitle,
  searchPlaceholder = "Search records...",
  showToolbar = false,
}: ExtendedPosDataGridProps<T>) {
  const isGridLoading = loading || isLoading;
  const isSelectable = selectable || enableSelection;

  // Normalize column definitions so id/key, cell/render, accessorKey/getValue work seamlessly with DataTableColumn
  const columns: DataTableColumn<T>[] = useMemo(() => {
    return rawColumns.map((col, idx) => {
      const colId =
        col.id ||
        col.key ||
        (typeof col.accessorKey === "string" ? col.accessorKey : `col-${idx}`);
      const sortable = col.sortable ?? col.enableSorting ?? false;
      const filterable = col.filterable ?? col.enableFiltering ?? false;
      const label =
        typeof col.header === "string"
          ? col.header
          : (col.header as any)?.props?.children || colId;

      const getValue =
        col.getValue ||
        (col.accessorKey
          ? (row: T) => {
              const val = (row as any)[col.accessorKey as string];
              return val !== undefined && val !== null ? String(val) : "";
            }
          : (row: T) => {
              const val = (row as any)[colId];
              return val !== undefined && val !== null ? String(val) : "";
            });

      return {
        id: colId,
        key: colId,
        label,
        defaultWidth: col.width,
        minWidth: col.minWidth,
        maxWidth: col.maxWidth,
        align: col.align || "left",
        sortable,
        filterable,
        getValue,
      };
    });
  }, [rawColumns]);

  // 1. Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    try {
      if (storageKey) {
        const saved = localStorage.getItem(`retrod:${storageKey}:visible-columns`);
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    const initial: Record<string, boolean> = {};
    rawColumns.forEach((col, idx) => {
      const id = col.id || col.key || (typeof col.accessorKey === "string" ? col.accessorKey : `col-${idx}`);
      initial[id] = col.defaultVisible !== false;
    });
    return initial;
  });

  const handleVisibleColumnsChange = (updated: Record<string, boolean>) => {
    setVisibleColumns(updated);
    try {
      if (storageKey) {
        localStorage.setItem(`retrod:${storageKey}:visible-columns`, JSON.stringify(updated));
      }
    } catch {}
  };

  // 2. Column Pinning State
  const [columnPins, setColumnPins] = useState<Record<string, "left" | "right" | "none">>(() => {
    try {
      if (storageKey) {
        const saved = localStorage.getItem(`retrod:${storageKey}:column-pins`);
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    const pins: Record<string, "left" | "right" | "none"> = {};
    rawColumns.forEach((col, idx) => {
      const id = col.id || col.key || (typeof col.accessorKey === "string" ? col.accessorKey : `col-${idx}`);
      if (col.pinned) pins[id] = col.pinned as any;
    });
    return pins;
  });

  const handlePinChange = (pins: Record<string, "left" | "right" | "none">) => {
    setColumnPins(pins);
    try {
      if (storageKey) {
        localStorage.setItem(`retrod:${storageKey}:column-pins`, JSON.stringify(pins));
      }
    } catch {}
  };

  // 3. Column Order State
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    try {
      if (storageKey) {
        const saved = localStorage.getItem(`retrod:${storageKey}:column-order`);
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return columns.map((c) => c.id || "");
  });

  const handleColumnOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder);
    try {
      if (storageKey) {
        localStorage.setItem(`retrod:${storageKey}:column-order`, JSON.stringify(newOrder));
      }
    } catch {}
  };

  // 4. Column Widths State
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    try {
      if (storageKey) {
        const saved = localStorage.getItem(`retrod:${storageKey}:column-widths`);
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return {};
  });

  const handleColumnWidthsChange = (widths: Record<string, number>) => {
    setColumnWidths(widths);
    try {
      if (storageKey) {
        localStorage.setItem(`retrod:${storageKey}:column-widths`, JSON.stringify(widths));
      }
    } catch {}
  };

  // 5. Sorting State
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(
    initialSort ? { colId: initialSort.columnKey, direction: initialSort.direction } : null
  );

  // 6. Multi-Column Filter State
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // 7. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      if (storageKey) {
        const saved = localStorage.getItem(`retrod:${storageKey}:page-size`);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
      }
    } catch {}
    return initialPageSize;
  });

  // Helper to extract row key
  const getRowKey = useCallback(
    (row: T, index: number): string => {
      if (typeof keyField === "function") return keyField(row);
      if (typeof keyField === "string" && (row as any)[keyField] !== undefined) {
        return String((row as any)[keyField]);
      }
      return `row-${index}`;
    },
    [keyField]
  );

  // Selected row keys set for O(1) lookup
  const selectedKeySet = useMemo(() => {
    const set = new Set<string>();
    if (selectedRowIds && Array.isArray(selectedRowIds)) {
      selectedRowIds.forEach((id) => set.add(id));
    } else if (selectedRows && Array.isArray(selectedRows)) {
      selectedRows.forEach((r, idx) => set.add(getRowKey(r, idx)));
    }
    return set;
  }, [selectedRows, selectedRowIds, getRowKey]);

  // Helper to get raw cell value for a column
  const getRawCellValue = useCallback((row: T, colId: string) => {
    const rawCol = rawColumns.find(
      (c, idx) =>
        (c.id || c.key || (typeof c.accessorKey === "string" ? c.accessorKey : `col-${idx}`)) === colId
    );
    if (!rawCol) return (row as any)[colId];
    if (rawCol.filterValueAccessor) return rawCol.filterValueAccessor(row);
    if (rawCol.getValue) return rawCol.getValue(row);
    if (rawCol.accessorKey) return (row as any)[rawCol.accessorKey];
    return (row as any)[colId];
  }, [rawColumns]);

  // Ordered visible columns
  const orderedColumns = useMemo(() => {
    const map = new Map(columns.map((c) => [c.id || "", c]));
    const result: DataTableColumn<T>[] = [];
    columnOrder.forEach((id) => {
      const col = map.get(id);
      if (col && visibleColumns[id] !== false) {
        result.push(col);
        map.delete(id);
      }
    });
    map.forEach((col) => {
      if (col.id && visibleColumns[col.id] !== false) {
        result.push(col);
      }
    });
    return result;
  }, [columns, columnOrder, visibleColumns]);

  // 8. Filtering Logic
  const filteredData = useMemo(() => {
    let result = data;

    // Apply Global Search if present
    if (globalSearch.trim()) {
      const query = globalSearch.toLowerCase().trim();
      result = result.filter((row: any) => {
        return columns.some((col) => {
          if (!col.id) return false;
          const val = getRawCellValue(row, col.id);
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        });
      });
    }

    // Apply Column-level Filters
    const filterKeys = Object.keys(columnFilters).filter(
      (k) => columnFilters[k] && columnFilters[k].length > 0
    );

    if (filterKeys.length > 0) {
      result = result.filter((row) => {
        for (const colId of filterKeys) {
          const allowed = columnFilters[colId];
          if (!allowed || allowed.length === 0) continue;
          const rawVal = getRawCellValue(row, colId);
          const strVal =
            rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== ""
              ? String(rawVal).trim()
              : "(Blanks)";
          if (!allowed.includes(strVal)) {
            return false;
          }
        }
        return true;
      });
    }

    return result;
  }, [data, globalSearch, columnFilters, columns, getRawCellValue]);

  // 9. Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const colId = sortConfig.colId;

    return [...filteredData].sort((a, b) => {
      const valA = getRawCellValue(a, colId);
      const valB = getRawCellValue(b, colId);

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      let cmp = 0;
      if (typeof valA === "number" && typeof valB === "number") {
        cmp = valA - valB;
      } else {
        cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      }

      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortConfig, getRawCellValue]);

  // 10. Pagination Slicing
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // 11. Selection Handlers
  const isAllPaginatedSelected =
    paginatedData.length > 0 &&
    paginatedData.every((r, idx) => selectedKeySet.has(getRowKey(r, idx)));
  const isSomePaginatedSelected =
    paginatedData.some((r, idx) => selectedKeySet.has(getRowKey(r, idx))) &&
    !isAllPaginatedSelected;

  const handleToggleSelectAll = () => {
    if (!onSelectionChange) return;
    const usesIdArray = selectedRowIds !== undefined;

    if (isAllPaginatedSelected) {
      const paginatedKeys = new Set(paginatedData.map((r, idx) => getRowKey(r, idx)));
      if (usesIdArray) {
        onSelectionChange((selectedRowIds || []).filter((id) => !paginatedKeys.has(id)) as any);
      } else {
        onSelectionChange(selectedRows.filter((r, idx) => !paginatedKeys.has(getRowKey(r, idx))) as any);
      }
    } else {
      if (usesIdArray) {
        const existing = [...(selectedRowIds || [])];
        paginatedData.forEach((r, idx) => {
          const k = getRowKey(r, idx);
          if (!existing.includes(k)) existing.push(k);
        });
        onSelectionChange(existing as any);
      } else {
        const existing = [...selectedRows];
        paginatedData.forEach((r, idx) => {
          const k = getRowKey(r, idx);
          if (!selectedKeySet.has(k)) existing.push(r);
        });
        onSelectionChange(existing as any);
      }
    }
  };

  const handleToggleRow = (row: T, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    const k = getRowKey(row, index);
    const usesIdArray = selectedRowIds !== undefined;

    if (usesIdArray) {
      const current = selectedRowIds || [];
      if (current.includes(k)) {
        onSelectionChange(current.filter((id) => id !== k) as any);
      } else {
        onSelectionChange([...current, k] as any);
      }
    } else {
      if (selectedKeySet.has(k)) {
        onSelectionChange(selectedRows.filter((r, idx) => getRowKey(r, idx) !== k) as any);
      } else {
        onSelectionChange([...selectedRows, row] as any);
      }
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }
    const filename = typeof title === "string" ? title : "POS_Export";
    exportTableToCsv(filename, columns, sortedData);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs font-sans",
        className
      )}
    >
      {/* Optional Top Toolbar */}
      {showToolbar && (
        <DataTableToolbar
          title={title}
          subtitle={subtitle}
          searchValue={globalSearch}
          onSearchChange={(v) => {
            setGlobalSearch(v);
            setCurrentPage(1);
          }}
          searchPlaceholder={searchPlaceholder}
          columns={columns}
          visibleColumns={visibleColumns}
          onVisibleColumnsChange={handleVisibleColumnsChange}
          columnOrder={columnOrder}
          onColumnOrderChange={handleColumnOrderChange}
          totalCount={data.length}
          filteredCount={sortedData.length}
          onExport={handleExport}
          storageKey={storageKey}
        />
      )}

      {/* Custom Provided Toolbar */}
      {toolbar && !showToolbar && (
        <div className="border-b border-border bg-surface-2/40 p-2.5 sm:p-3">{toolbar}</div>
      )}

      {/* Active Filter Bar */}
      {Object.keys(columnFilters).length > 0 && (
        <div className="p-2.5 border-b border-border">
          <DataTableFilterBar
            count={sortedData.length}
            filters={columnFilters}
            columns={columns}
            onRemoveFilter={(colId) => {
              const next = { ...columnFilters };
              delete next[colId];
              setColumnFilters(next);
            }}
            onReset={() => setColumnFilters({})}
          />
        </div>
      )}

      {/* Selection Action Bar */}
      {isSelectable && selectedKeySet.size > 0 && (
        <div className="p-2.5 border-b border-border">
          <DataTableSelectionBar
            selectedCount={selectedKeySet.size}
            totalCount={data.length}
            onExport={handleExport}
            onClear={() => {
              if (selectedRowIds !== undefined) onSelectionChange?.([] as any);
              else onSelectionChange?.([] as any);
            }}
          />
        </div>
      )}

      {/* Main Grid Table Container */}
      <div className="overflow-x-auto min-h-[160px]">
        <table className="w-full border-collapse text-left text-[12.5px]">
          <DataTableHeader
            columns={columns}
            data={data}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={handleVisibleColumnsChange}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            columnFilters={columnFilters}
            onColumnFilterChange={setColumnFilters}
            columnPins={columnPins}
            onPinChange={handlePinChange}
            columnOrder={columnOrder}
            onColumnOrderChange={handleColumnOrderChange}
            columnWidths={columnWidths}
            onColumnWidthsChange={handleColumnWidthsChange}
            selectable={isSelectable}
            isAllSelected={isAllPaginatedSelected}
            isSomeSelected={isSomePaginatedSelected}
            onToggleSelectAll={handleToggleSelectAll}
            themeVariant={themeVariant}
          />

          <tbody className="divide-y divide-border/60 bg-surface">
            {isGridLoading ? (
              <tr>
                <td
                  colSpan={orderedColumns.length + (isSelectable ? 1 : 0)}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2 font-medium">
                    <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={orderedColumns.length + (isSelectable ? 1 : 0)}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="space-y-1.5">
                    <p className="text-[13px] font-medium text-foreground">{emptyMessage}</p>
                    {(Object.keys(columnFilters).length > 0 || globalSearch) && (
                      <button
                        type="button"
                        onClick={() => {
                          setColumnFilters({});
                          setGlobalSearch("");
                        }}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Clear all active filters</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowKey = getRowKey(row, index);
                const isSelected = selectedKeySet.has(rowKey);
                const isEven = index % 2 === 1;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row, index)}
                    className={cn(
                      "transition-colors group",
                      isSelected
                        ? "bg-primary/10 hover:bg-primary/15 dark:bg-primary/20"
                        : isEven
                        ? "bg-slate-50/50 dark:bg-surface-2/40 hover:bg-slate-100/70 dark:hover:bg-surface-3/60"
                        : "bg-surface hover:bg-slate-50/80 dark:hover:bg-surface-2/80",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {/* Row Select Checkbox Cell */}
                    {isSelectable && (
                      <td
                        className={cn(
                          "w-12 px-3 py-2.5 text-center border-r border-border/80 sticky left-0 z-10 select-none",
                          isSelected
                            ? "bg-primary/15 dark:bg-primary/25"
                            : isEven
                            ? "bg-slate-50/95 dark:bg-surface-2"
                            : "bg-surface"
                        )}
                        onClick={(e) => handleToggleRow(row, index, e)}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                          />
                        </div>
                      </td>
                    )}

                    {/* Data Cells */}
                    {orderedColumns.map((col) => {
                      const colId = col.id || "";
                      const rawCol = rawColumns.find(
                        (c, idx) =>
                          (c.id || c.key || (typeof c.accessorKey === "string" ? c.accessorKey : `col-${idx}`)) === colId
                      );

                      const rawValue = getRawCellValue(row, colId);
                      const pin = getTableBodyCellPinnedStyle({
                        colId,
                        columnPins,
                        orderedColumns,
                        columnWidths,
                        selectable: isSelectable,
                        isSelected,
                        isEven,
                      });

                      return (
                        <td
                          key={colId}
                          style={pin.style}
                          className={cn(
                            dense ? "py-2 px-3.5" : "py-2.5 px-3.5",
                            "border-r border-border/60 last:border-r-0 align-middle text-foreground transition-colors",
                            col.align === "center"
                              ? "text-center"
                              : col.align === "right"
                              ? "text-right"
                              : "text-left",
                            pin.className
                          )}
                        >
                          {rawCol?.render
                            ? rawCol.render(rawValue, row, index)
                            : rawCol?.cell
                            ? rawCol.cell({ row, value: rawValue, index })
                            : rawValue !== undefined && rawValue !== null && String(rawValue) !== ""
                            ? String(rawValue)
                            : "--"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* POS Data Table Footer Pagination */}
      <DataTableFooter
        currentPage={validPage}
        totalPages={totalPages}
        totalCount={totalRecords}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(p) => setCurrentPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setCurrentPage(1);
        }}
        themeVariant={themeVariant}
        storageKey={storageKey}
      />
    </div>
  );
}
