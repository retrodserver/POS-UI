import { createFileRoute } from "@tanstack/react-router";
import { DeliveryManagementView } from "@/components/shared/pos/reports/views/DeliveryManagementView";

export const Route = createFileRoute("/pos/reports/delivery")({
  head: () => ({ meta: [{ title: "Delivery Management — Retrod POS Reports" }] }),
  component: DeliveryManagementView,
});
