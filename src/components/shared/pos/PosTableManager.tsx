import React, { useState } from "react";
import {
  usePosTables,
  usePosReservations,
  usePosTableStats,
  useSeatGuestsMutation,
  useCancelReservationMutation,
  useVacateTableMutation,
  useAddReservationMutation,
} from "@/hooks/queries/usePosTables";
import { ReservationSidebar } from "./tables/ReservationSidebar";
import { TableFloorPlan } from "./tables/TableFloorPlan";
import { ReservationDetailSlide } from "./tables/ReservationDetailSlide";
import { NewReservationModal } from "./tables/NewReservationModal";
import type { DiningArea, RestaurantTable, ReservationItem } from "@/types/posTables";

export function PosTableManager() {
  const [activeArea, setActiveArea] = useState<DiningArea>("Main Dining");
  const [selectedDate, setSelectedDate] = useState("Thu, 11 January 2024");

  // Selection state for slide drawer
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationItem | null>(null);
  const [isDetailSlideOpen, setIsDetailSlideOpen] = useState(false);

  // New reservation dialog state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [bookingTableId, setBookingTableId] = useState<string | undefined>(undefined);

  // Queries
  const { data: tables = [], refetch: refetchTables } = usePosTables(activeArea);
  const { data: allTables = [] } = usePosTables(); // for all table selection in modal
  const { data: reservations = [] } = usePosReservations();
  const { data: stats } = usePosTableStats(activeArea);

  // Mutations
  const seatGuestsMutation = useSeatGuestsMutation();
  const cancelReservationMutation = useCancelReservationMutation();
  const vacateTableMutation = useVacateTableMutation();
  const addReservationMutation = useAddReservationMutation();

  // Handlers for Date navigation
  const handlePrevDate = () => {
    setSelectedDate((prev) => (prev.includes("11") ? "Wed, 10 January 2024" : "Tue, 9 January 2024"));
  };

  const handleNextDate = () => {
    setSelectedDate((prev) => (prev.includes("11") ? "Fri, 12 January 2024" : "Sat, 13 January 2024"));
  };

  // Click on a Reserved Table or Reserve Tag
  const handleSelectReserved = (table: RestaurantTable, reservation?: ReservationItem) => {
    setSelectedTable(table);
    setSelectedReservation(reservation || table.activeReservation || null);
    setIsDetailSlideOpen(true);
  };

  // Click on a Vacant or Occupied Table
  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    setSelectedReservation(table.activeReservation || null);
    setIsDetailSlideOpen(true);
  };

  // Click on a Reservation Card in the left sidebar
  const handleSelectReservationFromSidebar = (res: ReservationItem) => {
    setSelectedReservation(res);
    const table = allTables.find((t) => t.id === res.tableId) || null;
    setSelectedTable(table);
    setIsDetailSlideOpen(true);
  };

  // Open New Reservation Modal
  const handleOpenNewBooking = (tableId?: string) => {
    setBookingTableId(tableId);
    setIsNewModalOpen(true);
  };

  // Mutation actions
  const handleSeatGuests = (tableId: string, reservationId?: string) => {
    seatGuestsMutation.mutate({ tableId, reservationId });
  };

  const handleCancelReservation = (reservationId: string) => {
    cancelReservationMutation.mutate(reservationId);
  };

  const handleVacateTable = (tableId: string) => {
    vacateTableMutation.mutate(tableId);
  };

  const handleSaveReservation = (
    data: Omit<ReservationItem, "id" | "createdAt" | "status">
  ) => {
    addReservationMutation.mutate(data);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100 font-sans">
      {/* 1. Left Reservations Sidebar */}
      <ReservationSidebar
        reservations={reservations}
        tables={tables}
        selectedDate={selectedDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
        onSelectReservation={handleSelectReservationFromSidebar}
        onOpenNewBookingModal={() => handleOpenNewBooking()}
      />

      {/* 2. Main Visual Floor Plan Grid */}
      <TableFloorPlan
        tables={tables}
        activeArea={activeArea}
        onSelectArea={setActiveArea}
        onSelectReserved={handleSelectReserved}
        onSelectTable={handleSelectTable}
        stats={stats}
        onRefresh={() => refetchTables()}
      />

      {/* 3. Card Slide (Slide-over Drawer for Reservation & Table Details) */}
      <ReservationDetailSlide
        isOpen={isDetailSlideOpen}
        onClose={() => setIsDetailSlideOpen(false)}
        selectedTable={selectedTable}
        selectedReservation={selectedReservation}
        onSeatGuests={handleSeatGuests}
        onCancelReservation={handleCancelReservation}
        onVacateTable={handleVacateTable}
        onOpenNewBooking={handleOpenNewBooking}
      />

      {/* 4. New Reservation Modal Dialog */}
      <NewReservationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        tables={allTables}
        preselectedTableId={bookingTableId}
        onSaveReservation={handleSaveReservation}
      />
    </div>
  );
}
