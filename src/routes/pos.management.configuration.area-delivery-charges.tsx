import { createFileRoute } from "@tanstack/react-router";
import { AreaDeliveryChargesListView } from "@/components/shared/pos/management/views/AreaDeliveryChargesListView";

export const Route = createFileRoute("/pos/management/configuration/area-delivery-charges")({
  head: () => ({ meta: [{ title: "Area Wise Delivery Charges — Retrod POS" }] }),
  component: AreaDeliveryChargesListView,
});
