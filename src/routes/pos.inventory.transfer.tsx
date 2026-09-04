import { createFileRoute } from "@tanstack/react-router";
import { StockTransferView } from "@/components/shared/pos/inventory/views/StockTransferView";

export const Route = createFileRoute("/pos/inventory/transfer")({
  head: () => ({ meta: [{ title: "Stock Transfer — Retrod POS Inventory" }] }),
  component: StockTransferView,
});
