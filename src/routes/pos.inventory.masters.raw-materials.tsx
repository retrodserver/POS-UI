import { createFileRoute } from "@tanstack/react-router";
import { RawMaterialsManagementView } from "@/components/shared/pos/inventory/views/RawMaterialsManagementView";

export const Route = createFileRoute("/pos/inventory/masters/raw-materials")({
  head: () => ({ meta: [{ title: "Raw Materials — Retrod POS" }] }),
  component: RawMaterialsManagementView,
});
