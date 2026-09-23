import { createFileRoute } from "@tanstack/react-router";
import { SupplierManagementView } from "@/components/shared/pos/inventory/views/SupplierManagementView";

export const Route = createFileRoute("/pos/inventory/masters/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Retrod POS" }] }),
  component: SupplierManagementView,
});
