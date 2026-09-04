import { createFileRoute } from "@tanstack/react-router";
import { SubOrderTypeListView } from "@/components/shared/pos/management/views/SubOrderTypeListView";

export const Route = createFileRoute("/pos/management/configuration/sub-order-type")({
  head: () => ({ meta: [{ title: "Sub Order Type — Retrod POS" }] }),
  component: SubOrderTypeListView,
});
