import React from "react";
import { Users, Clock, Receipt, CalendarCheck } from "lucide-react";
import type { RestaurantTable, ReservationItem } from "@/types/posTables";

interface TableCardItemProps {
  table: RestaurantTable;
  onSelectReserved: (table: RestaurantTable, reservation?: ReservationItem) => void;
  onSelectTable: (table: RestaurantTable) => void;
}

/**
 * Renders an individual chair positioned outside the table border.
 */
function Chair({
  orientation,
  status,
}: {
  orientation: "top" | "bottom" | "left" | "right";
  status: RestaurantTable["status"];
}) {
  // Color palette for chairs matching table status
  let chairBg = "bg-slate-300 border-slate-400/80";
  if (status === "reserved") {
    chairBg = "bg-teal-700 border-teal-800 shadow-xs";
  } else if (status === "occupied") {
    chairBg = "bg-orange-600 border-orange-700 shadow-xs";
  }

  const isHorizontal = orientation === "top" || orientation === "bottom";

  return (
    <div
      className={`relative rounded-xs border transition-all duration-200 ${chairBg} ${
        isHorizontal
          ? "h-2 w-3.5 sm:h-2.5 sm:w-4"
          : "h-3.5 w-2 sm:h-4 sm:w-2.5"
      }`}
    >
      {/* Inner backrest cushion curve */}
      <div
        className={`absolute inset-0.5 rounded-[1px] bg-white/25`}
      />
    </div>
  );
}

export function TableCardItem({
  table,
  onSelectReserved,
  onSelectTable,
}: TableCardItemProps) {
  const { status, capacity, tableNumber, activeReservation, activeOrder } = table;

  // Determine chair layout count based on capacity
  let topChairs = 1;
  let bottomChairs = 1;
  let leftChairs = 0;
  let rightChairs = 0;

  if (capacity === 2) {
    // 2 seats: either 1 left & 1 right, or 1 top & 1 bottom
    topChairs = 1;
    bottomChairs = 1;
  } else if (capacity === 4) {
    topChairs = 1;
    bottomChairs = 1;
    leftChairs = 1;
    rightChairs = 1;
  } else if (capacity === 6) {
    topChairs = 3;
    bottomChairs = 3;
    leftChairs = 0;
    rightChairs = 0;
  } else if (capacity === 7 || capacity === 8) {
    topChairs = 3;
    bottomChairs = 3;
    leftChairs = 1;
    rightChairs = capacity === 8 ? 1 : 0;
  } else if (capacity >= 10) {
    topChairs = 4;
    bottomChairs = 4;
    leftChairs = 1;
    rightChairs = 1;
  }

  // Visual styling of the table surface based on status
  // Reserved: soft mint/teal
  // Occupied: soft peach/coral
  // Vacant: clean neutral with subtle slate/sky border - NO TAG!
  let tableStyle = "bg-slate-50/90 text-slate-700 border-slate-200/90 hover:border-slate-400 hover:bg-slate-100/80 shadow-xs";
  let statusBadge = null;

  if (status === "reserved") {
    tableStyle =
      "bg-[#ddf2ed] text-[#0d695b] border-[#9fdad0] hover:bg-[#d0ece5] shadow-sm ring-1 ring-teal-500/20";
    statusBadge = (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectReserved(table, activeReservation);
        }}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-600 text-white shadow-xs hover:bg-teal-700 transition-colors cursor-pointer"
        title="Click to view reservation details"
      >
        <CalendarCheck className="w-3 h-3" />
        Reserved
      </button>
    );
  } else if (status === "occupied") {
    tableStyle =
      "bg-[#fdebe7] text-[#b83823] border-[#f6c3b9] hover:bg-[#fadfd9] shadow-sm ring-1 ring-orange-500/20";
    statusBadge = (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-600 text-white shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        On Dine
      </div>
    );
  } else {
    // Vacant -> AS DIRECTED BY USER: "in vacant show no tag"
    statusBadge = null;
  }

  const isWide = capacity >= 6;

  const handleClick = () => {
    if (status === "reserved") {
      onSelectReserved(table, activeReservation);
    } else {
      onSelectTable(table);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col items-center justify-center p-3 select-none cursor-pointer transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Top Chairs Row */}
      {topChairs > 0 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
          {Array.from({ length: topChairs }).map((_, i) => (
            <Chair key={`top-${i}`} orientation="top" status={status} />
          ))}
        </div>
      )}

      {/* Middle Row: Left Chairs + Table Surface + Right Chairs */}
      <div className="flex items-center justify-center gap-1">
        {/* Left Chairs */}
        {leftChairs > 0 && (
          <div className="flex flex-col items-center justify-center gap-2 mr-0.5">
            {Array.from({ length: leftChairs }).map((_, i) => (
              <Chair key={`left-${i}`} orientation="left" status={status} />
            ))}
          </div>
        )}

        {/* The Physical Table Surface */}
        <div
          className={`relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-200 ${tableStyle} ${
            isWide
              ? "w-44 sm:w-52 h-24 sm:h-28 px-3"
              : "w-28 sm:w-32 h-24 sm:h-28 px-2"
          }`}
        >
          {/* Table Header / Number */}
          <span className="text-[13.5px] sm:text-[14.5px] font-bold tracking-tight">
            {tableNumber}
          </span>

          {/* Capacity Indicator */}
          <div className="flex items-center gap-1 text-[11px] sm:text-[12px] opacity-80 mt-0.5 font-medium">
            <Users className="w-3 h-3" />
            <span>{capacity} Seats</span>
          </div>

          {/* Reservation / On-Dine Tag */}
          <div className="mt-1.5 min-h-[22px] flex items-center justify-center">
            {statusBadge}
          </div>

          {/* Active order info / reservation summary mini ticker */}
          {status === "occupied" && activeOrder && (
            <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold opacity-75">
              <Clock className="w-2.5 h-2.5" />
              <span>{activeOrder.elapsedMinutes}m</span>
              <span>•</span>
              <Receipt className="w-2.5 h-2.5" />
              <span>${activeOrder.totalAmount.toFixed(2)}</span>
            </div>
          )}

          {status === "reserved" && activeReservation && (
            <div className="mt-0.5 text-[10px] font-medium opacity-85 truncate max-w-[120px]">
              {activeReservation.customerName.split(" ")[0]} ({activeReservation.reservationTime})
            </div>
          )}
        </div>

        {/* Right Chairs */}
        {rightChairs > 0 && (
          <div className="flex flex-col items-center justify-center gap-2 ml-0.5">
            {Array.from({ length: rightChairs }).map((_, i) => (
              <Chair key={`right-${i}`} orientation="right" status={status} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Chairs Row */}
      {bottomChairs > 0 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
          {Array.from({ length: bottomChairs }).map((_, i) => (
            <Chair key={`bottom-${i}`} orientation="bottom" status={status} />
          ))}
        </div>
      )}
    </div>
  );
}
