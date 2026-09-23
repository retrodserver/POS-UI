import { createFileRoute } from "@tanstack/react-router";
import { PurchaseOrderView } from "@/components/shared/pos/inventory/views/PurchaseOrderView";

export const Route = createFileRoute("/pos/inventory/order")({
  head: () => ({ meta: [{ title: "Purchase Orders — Retrod POS" }] }),
  component: PurchaseOrderView,
});
