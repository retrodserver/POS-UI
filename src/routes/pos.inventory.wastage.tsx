import { createFileRoute } from "@tanstack/react-router";
import { StockWastageView } from "@/components/shared/pos/inventory/views/StockWastageView";

export const Route = createFileRoute("/pos/inventory/wastage")({
  head: () => ({ meta: [{ title: "Stock Wastage — Retrod POS Inventory" }] }),
  component: StockWastageView,
});
