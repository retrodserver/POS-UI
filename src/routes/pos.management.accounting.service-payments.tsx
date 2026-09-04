import { createFileRoute } from "@tanstack/react-router";
import { ServicePaymentHistoryView } from "@/components/shared/pos/management/views/accounting/ServicePaymentHistoryView";

export const Route = createFileRoute("/pos/management/accounting/service-payments")({
  head: () => ({ meta: [{ title: "Service Payment History — Retrod POS" }] }),
  component: ServicePaymentHistoryView,
});
