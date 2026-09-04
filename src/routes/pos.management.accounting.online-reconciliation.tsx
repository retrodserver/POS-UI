import { createFileRoute } from "@tanstack/react-router";
import { OnlineOrderReconciliationView } from "@/components/shared/pos/management/views/accounting/OnlineOrderReconciliationView";

export const Route = createFileRoute("/pos/management/accounting/online-reconciliation")({
  head: () => ({ meta: [{ title: "Online Order Reconciliation — Retrod POS" }] }),
  component: OnlineOrderReconciliationView,
});
