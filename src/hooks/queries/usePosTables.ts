import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posTablesService } from "@/services/posTablesService";
import type { DiningArea, ReservationItem } from "@/types/posTables";

export const POS_TABLES_QUERY_KEY = ["pos", "tables"];
export const POS_RESERVATIONS_QUERY_KEY = ["pos", "reservations"];
export const POS_TABLE_STATS_QUERY_KEY = ["pos", "table-stats"];

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
    mutationFn: ({
      tableId,
      reservationId,
    }: {
      tableId: string;
      reservationId?: string;
    }) => posTablesService.seatGuests(tableId, reservationId),
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
    mutationFn: (reservationId: string) =>
      posTablesService.cancelReservation(reservationId),
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
    mutationFn: (
      data: Omit<ReservationItem, "id" | "createdAt" | "status">
    ) => posTablesService.addReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_TABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: POS_TABLE_STATS_QUERY_KEY });
    },
  });
}
