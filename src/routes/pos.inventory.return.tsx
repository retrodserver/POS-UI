import { createFileRoute } from "@tanstack/react-router";
import { PurchaseReturnView } from "@/components/shared/pos/inventory/views/PurchaseReturnView";

export const Route = createFileRoute("/pos/inventory/return")({
  head: () => ({ meta: [{ title: "Purchase Return List — Retrod POS Inventory" }] }),
  component: PurchaseReturnView,
});
