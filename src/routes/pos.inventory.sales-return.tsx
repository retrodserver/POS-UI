import { createFileRoute } from "@tanstack/react-router";
import { SalesReturnListView } from "@/components/shared/pos/inventory/views/SalesReturnListView";

export const Route = createFileRoute("/pos/inventory/sales-return")({
  head: () => ({ meta: [{ title: "Sales Return List — Retrod POS Inventory" }] }),
  component: SalesReturnListView,
});
