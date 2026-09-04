/** Shared list/pagination envelopes used across domain APIs. */

export type SortOrder = "asc" | "desc";

export type ListParams = {
  page: number;
  page_size: number;
  search?: string;
  order_by?: string;
  sort_order?: SortOrder;
  [filter: string]: unknown;
};

export type PaginatedResponse<T> = {
  count: number;
  results: T[];
};
