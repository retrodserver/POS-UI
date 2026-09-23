import React from "react";
import { DataTableFooter } from "@/components/common/DataTableHeader";

export interface DataGridPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  totalCount?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  storageKey?: string;
  selectedCount?: number;
  onClearSelection?: () => void;
  itemName?: string;
  className?: string;
}

export function DataGridPagination({
  currentPage,
  totalPages,
  totalRecords,
  totalCount,
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  storageKey,
  selectedCount,
  onClearSelection,
  itemName = "records",
  className,
}: DataGridPaginationProps) {
  const effectiveTotal = typeof totalCount === "number" ? totalCount : typeof totalRecords === "number" ? totalRecords : 0;

  return (
    <DataTableFooter
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={effectiveTotal}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      storageKey={storageKey}
      selectedCount={selectedCount}
      onClearSelection={onClearSelection}
      itemName={itemName}
      className={className}
    />
  );
}

export default DataGridPagination;
