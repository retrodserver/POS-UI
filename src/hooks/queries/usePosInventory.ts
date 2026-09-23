import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posInventoryService } from "@/services/posInventoryService";
import type {
  StockPurchaseRecord,
  PurchaseOrderRecord,
  PurchaseReturnRecord,
} from "@/types/posInventory";

export const INVENTORY_QUERY_KEYS = {
  vendors: ["pos", "inventory", "vendors"] as const,
  purchases: ["pos", "inventory", "purchases"] as const,
  purchaseOrders: ["pos", "inventory", "purchase-orders"] as const,
  purchaseReturns: ["pos", "inventory", "purchase-returns"] as const,
};

export function useInventoryVendors() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.vendors,
    queryFn: posInventoryService.getVendors,
  });
}

export const useVendors = useInventoryVendors;

// Purchases
export function useStockPurchases() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.purchases,
    queryFn: posInventoryService.getPurchases,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<StockPurchaseRecord, "id">) => posInventoryService.createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.purchases });
    },
  });
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posInventoryService.deletePurchase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.purchases });
    },
  });
}

// Purchase Orders
export function usePurchaseOrders() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.purchaseOrders,
    queryFn: posInventoryService.getPurchaseOrders,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PurchaseOrderRecord, "id">) =>
      posInventoryService.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.purchaseOrders });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posInventoryService.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.purchaseOrders });
    },
  });
}

// Purchase Returns
export function usePurchaseReturns() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.purchaseReturns,
    queryFn: posInventoryService.getPurchaseReturns,
  });
}

export function useCreatePurchaseReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PurchaseReturnRecord, "id">) =>
      posInventoryService.createPurchaseReturn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.purchaseReturns });
    },
  });
}

export function useDeletePurchaseReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posInventoryService.deletePurchaseReturn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.purchaseReturns });
    },
  });
}

// Stock Management (Available & Closing Stock)
export function useStockItems() {
  return useQuery({
    queryKey: ["pos", "inventory", "stock-items"],
    queryFn: posInventoryService.getStockItems,
  });
}

export function useUpdateStockItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newStock, notes }: { id: string; newStock: number; notes?: string }) =>
      posInventoryService.updateStockItem(id, newStock, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "inventory", "stock-items"] });
    },
  });
}

export function useSaveClosingStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entries: { id: string; newStock: number; notes?: string }[]) =>
      posInventoryService.saveClosingStock(entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "inventory", "stock-items"] });
    },
  });
}
