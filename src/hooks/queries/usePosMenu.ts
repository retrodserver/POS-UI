import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posMenuService } from "@/services/posMenuService";

export const MENU_QUERY_KEYS = {
  specialNotes: ["pos", "menu", "special-notes"] as const,
  commissions: ["pos", "menu", "commissions"] as const,
  stockItems: ["pos", "menu", "stock-items"] as const,
  schedules: ["pos", "menu", "schedules"] as const,
  virtualOutlets: ["pos", "menu", "virtual-outlets"] as const,
  physicalMenus: ["pos", "menu", "physical-menus"] as const,
};

export function useSpecialNotes() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.specialNotes,
    queryFn: posMenuService.getSpecialNotes,
  });
}

export function useAddSpecialNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, available }: { name: string; available?: boolean }) =>
      posMenuService.addSpecialNote(name, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.specialNotes });
    },
  });
}

export function useToggleSpecialNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posMenuService.toggleSpecialNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.specialNotes });
    },
  });
}

export function useDeleteSpecialNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posMenuService.deleteSpecialNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.specialNotes });
    },
  });
}

export function useItemCommissions() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.commissions,
    queryFn: posMenuService.getCommissions,
  });
}

export function useUpdateItemCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      commissionType,
      commissionValue,
    }: {
      id: string;
      commissionType: "Not Configured" | "Percentage" | "Fixed Amount";
      commissionValue: number | null;
    }) => posMenuService.updateCommission(id, commissionType, commissionValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.commissions });
    },
  });
}

export function useMenuStockItems() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.stockItems,
    queryFn: posMenuService.getStockItems,
  });
}

export function useToggleMenuStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posMenuService.toggleStockStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.stockItems });
    },
  });
}

export function useMenuSchedules() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.schedules,
    queryFn: posMenuService.getSchedules,
  });
}

export function useVirtualOutlets() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.virtualOutlets,
    queryFn: posMenuService.getVirtualOutlets,
  });
}

export function useAddVirtualOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, cuisine }: { name: string; cuisine: string }) =>
      posMenuService.addVirtualOutlet(name, cuisine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.virtualOutlets });
    },
  });
}

export function usePhysicalMenus() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.physicalMenus,
    queryFn: posMenuService.getPhysicalMenus,
  });
}

export function useAddPhysicalMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, type, fileSize }: { name: string; type: string; fileSize: string }) =>
      posMenuService.addPhysicalMenu(name, type, fileSize),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.physicalMenus });
    },
  });
}

export function useDeletePhysicalMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posMenuService.deletePhysicalMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.physicalMenus });
    },
  });
}

export function useSyncPos() {
  return useMutation({
    mutationFn: posMenuService.syncPos,
  });
}

export function useScheduleItems() {
  return useQuery({
    queryKey: ["pos", "menu", "schedule-items"],
    queryFn: posMenuService.getScheduleItems,
  });
}

export function useToggleScheduleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posMenuService.toggleScheduleItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "menu", "schedule-items"] });
    },
  });
}

export function useAddScheduleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posMenuService.addScheduleItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "menu", "schedule-items"] });
    },
  });
}

export function useScheduleCategories() {
  return useQuery({
    queryKey: ["pos", "menu", "schedule-categories"],
    queryFn: posMenuService.getScheduleCategories,
  });
}

export function useAddScheduleCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentCategory }: { name: string; parentCategory?: string }) =>
      posMenuService.addScheduleCategory(name, parentCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "menu", "schedule-categories"] });
    },
  });
}

export function useScheduleVariants() {
  return useQuery({
    queryKey: ["pos", "menu", "schedule-variants"],
    queryFn: posMenuService.getScheduleVariants,
  });
}

export function useAddScheduleVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, departmentName }: { name: string; departmentName: string }) =>
      posMenuService.addScheduleVariant(name, departmentName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "menu", "schedule-variants"] });
    },
  });
}

export function useScheduleTables() {
  return useQuery({
    queryKey: ["pos", "menu", "schedule-tables"],
    queryFn: posMenuService.getScheduleTables,
  });
}

export function useToggleScheduleTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posMenuService.toggleScheduleTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "menu", "schedule-tables"] });
    },
  });
}

export function useAddScheduleTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableNo, areaName, noOfPersons }: { tableNo: string; areaName: string; noOfPersons?: number }) =>
      posMenuService.addScheduleTable(tableNo, areaName, noOfPersons),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "menu", "schedule-tables"] });
    },
  });
}

