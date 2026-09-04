import { createFileRoute } from "@tanstack/react-router";
import { ClosingStockView } from "@/components/shared/pos/inventory/views/ClosingStockView";

export const Route = createFileRoute("/pos/inventory/closing-stock")({
  head: () => ({ meta: [{ title: "Closing Stock — Retrod POS Inventory" }] }),
  component: ClosingStockView,
});
