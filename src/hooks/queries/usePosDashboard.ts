import { useQuery } from "@tanstack/react-query";
import { getPosDashboardData, getInitialDashboardData } from "@/services/posDashboardService";
import type { DashboardFilterParams, PosDashboardData } from "@/types/posDashboard";

export const POS_DASHBOARD_QUERY_KEY = ["pos", "dashboard"] as const;

/**
 * Custom TanStack Query hook for POS Dashboard
 * Supports auto-refetching and filter state caching
 */
export function usePosDashboard(filters?: DashboardFilterParams) {
  return useQuery<PosDashboardData, Error>({
    queryKey: [...POS_DASHBOARD_QUERY_KEY, filters],
    queryFn: () => getPosDashboardData(filters),
    initialData: () => getInitialDashboardData(),
    staleTime: 1000 * 30, // 30 seconds fresh
    refetchInterval: 1000 * 60, // Auto background refresh every 60s
  });
}
