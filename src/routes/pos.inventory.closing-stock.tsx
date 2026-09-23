import { createFileRoute } from "@tanstack/react-router";
import { ClosingStockView } from "@/components/shared/pos/inventory/views/ClosingStockView";

export const Route = createFileRoute("/pos/inventory/closing-stock")({
  head: () => ({ meta: [{ title: "Daily Stock Count — Retrod POS" }] }),
  component: ClosingStockView,
});
