import { createFileRoute } from "@tanstack/react-router";
import { StockPurchaseView } from "@/components/shared/pos/inventory/views/StockPurchaseView";

export const Route = createFileRoute("/pos/inventory/purchase")({
  head: () => ({ meta: [{ title: "Add Purchase — Retrod POS" }] }),
  component: StockPurchaseView,
});
