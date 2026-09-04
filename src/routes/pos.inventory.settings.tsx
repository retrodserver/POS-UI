import { createFileRoute } from "@tanstack/react-router";
import { InventorySettingsView } from "@/components/shared/pos/inventory/views/InventorySettingsView";

export const Route = createFileRoute("/pos/inventory/settings")({
  head: () => ({ meta: [{ title: "Inventory Settings — Retrod POS" }] }),
  component: InventorySettingsView,
});
