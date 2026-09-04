import { createFileRoute } from "@tanstack/react-router";
import { OrderwiseConsumptionView } from "@/components/shared/pos/inventory/views/OrderwiseConsumptionView";

export const Route = createFileRoute("/pos/inventory/reports/orderwise-consumption")({
  head: () => ({ meta: [{ title: "Orderwise Consumption — Retrod POS Inventory" }] }),
  component: OrderwiseConsumptionView,
});
