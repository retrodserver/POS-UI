import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posTablesService } from "@/services/posTablesService";
import type { DiningArea, ReservationItem } from "@/types/posTables";

export const POS_TABLES_QUERY_KEY = ["pos", "tables"];
export const POS_RESERVATIONS_QUERY_KEY = ["pos", "reservations"];
export const POS_TABLE_STATS_QUERY_KEY = ["pos", "table-stats"];
export const POS_AREAS_QUERY_KEY = ["pos", "dining-areas"];

export function useDiningAreas() {
  return useQuery({
    queryKey: POS_AREAS_QUERY_KEY,
    queryFn: () => posTablesService.getAreas(),
    staleTime: 1000 * 60,
  });
}

export function useAddAreaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (areaName: string) => posTablesService.addArea(areaName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_AREAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}

export function useAddTableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      tableNumber: string;
      capacity: number;
      area: string;
      shape?: "rectangle" | "square" | "circle";
    }) => posTablesService.addTable(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}

export function usePosTables(area?: DiningArea) {
  return useQuery({
    queryKey: [...POS_TABLES_QUERY_KEY, area],
    queryFn: () => posTablesService.getTables(area),
    staleTime: 1000 * 10,
  });
}

export function usePosReservations() {
  return useQuery({
    queryKey: POS_RESERVATIONS_QUERY_KEY,
    queryFn: () => posTablesService.getReservations(),
    staleTime: 1000 * 10,
  });
}

export function usePosTableStats(area?: DiningArea) {
  return useQuery({
    queryKey: [...POS_TABLE_STATS_QUERY_KEY, area],
    queryFn: () => posTablesService.getStats(area),
    staleTime: 1000 * 10,
  });
}

export function useSeatGuestsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, reservationId }: { tableId: string; reservationId?: string }) =>
      posTablesService.seatGuests(tableId, reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}

export function useCancelReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) => posTablesService.cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}

export function useVacateTableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tableId: string) => posTablesService.vacateTable(tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}

export function useAddReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ReservationItem, "id" | "createdAt" | "status">) =>
      posTablesService.addReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}

export function useCreateTableOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof posTablesService.createTableOrder>[0]) =>
      posTablesService.createTableOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "live"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "kot"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "all"] });
    },
  });
}

export function useUpdateTableOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof posTablesService.updateTableOrder>[0]) =>
      posTablesService.updateTableOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "live"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "kot"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "due-bills"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "orders", "all"] });
    },
  });
}


