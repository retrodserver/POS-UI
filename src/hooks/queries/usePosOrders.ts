import { useQuery } from "@tanstack/react-query";
import {
  getLiveOrdersSummary,
  getInitialLiveOrdersData,
  getAllOrders,
  getInitialAllOrdersData,
  getOnlineOrders,
  getInitialOnlineOrdersData,
  getKotOrders,
  getInitialKotData,
} from "@/services/posOrdersService";

export function useLiveOrders() {
  return useQuery({
    queryKey: ["pos", "orders", "live"],
    queryFn: () => getLiveOrdersSummary(),
    initialData: () => getInitialLiveOrdersData(),
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
  });
}

export function useAllOrders(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["pos", "orders", "all", filters],
    queryFn: () => getAllOrders(filters),
    initialData: () => getInitialAllOrdersData(),
    staleTime: 1000 * 30,
  });
}

export function useOnlineOrders(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["pos", "orders", "online", filters],
    queryFn: () => getOnlineOrders(filters),
    initialData: () => getInitialOnlineOrdersData(),
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
  });
}

export function useKotOrders(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["pos", "orders", "kot", filters],
    queryFn: () => getKotOrders(filters),
    initialData: () => getInitialKotData(),
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
  });
}
