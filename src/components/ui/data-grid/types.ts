import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface DataGridColumn<T = any> {
  key?: string;
  id?: string;
  header: ReactNode | string;
  width?: string | number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  enableSorting?: boolean;
  filterable?: boolean;
  enableFiltering?: boolean;
  pinned?: "left" | "right" | false;
  hideable?: boolean;
  defaultVisible?: boolean;
  accessorKey?: keyof T | string;
  getValue?: (row: T) => any;
  filterValueAccessor?: (row: T) => any;
  render?: (value: any, row: T, index: number) => ReactNode;
  cell?: (info: { row: T; value: any; index: number }) => ReactNode;
  headerRender?: () => ReactNode;
}

export interface ColumnSortState {
  columnKey: string;
  direction: "asc" | "desc";
}

export interface ColumnFilterState {
  columnKey: string;
  selectedValues: string[];
  searchQuery?: string;
}

export interface PosDataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn<T>[];
  keyField?: keyof T | ((row: T) => string) | string;
  selectable?: boolean;
  enableSelection?: boolean;
  selectedRows?: T[];
  selectedRowIds?: string[];
  onSelectionChange?: ((selectedRows: any[]) => void) | ((selectedIds: string[]) => void);
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  initialSort?: ColumnSortState;
  emptyMessage?: ReactNode;
  loading?: boolean;
  isLoading?: boolean;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  toolbar?: ReactNode;
  dense?: boolean;
}
