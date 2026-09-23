import { createFileRoute } from "@tanstack/react-router";
import { AvailableStockView } from "@/components/shared/pos/inventory/views/AvailableStockView";

export const Route = createFileRoute("/pos/inventory/available-stock")({
  head: () => ({ meta: [{ title: "Available Stock — Retrod POS" }] }),
  component: AvailableStockView,
});
