import { createFileRoute } from "@tanstack/react-router";
import { PurchaseBillPaymentsView } from "@/components/shared/pos/inventory/views/PurchaseBillPaymentsView";

export const Route = createFileRoute("/pos/inventory/purchase-payments")({
  head: () => ({ meta: [{ title: "Purchase Bill Payments — Retrod POS" }] }),
  component: PurchaseBillPaymentsView,
});
