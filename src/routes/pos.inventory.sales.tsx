import { createFileRoute } from "@tanstack/react-router";
import { SalesConsumptionView } from "@/components/shared/pos/inventory/views/SalesConsumptionView";

export const Route = createFileRoute("/pos/inventory/sales")({
  head: () => ({ meta: [{ title: "Sales Consumption — Retrod POS Inventory" }] }),
  component: SalesConsumptionView,
});
