import { createFileRoute } from "@tanstack/react-router";
import { SupplierManagementView } from "@/components/shared/pos/inventory/views/SupplierManagementView";

export const Route = createFileRoute("/pos/inventory/masters/suppliers")({
  head: () => ({ meta: [{ title: "Supplier/Third Party Management — Retrod POS Inventory" }] }),
  component: SupplierManagementView,
});
