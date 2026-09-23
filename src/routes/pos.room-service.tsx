import { createFileRoute } from "@tanstack/react-router";
import { PosRoomServiceManager } from "@/components/shared/pos/roomService/PosRoomServiceManager";

export const Route = createFileRoute("/pos/room-service")({
  head: () => ({ meta: [{ title: "Room Orders — Retrod POS" }] }),
  component: PosRoomServiceManager,
});
