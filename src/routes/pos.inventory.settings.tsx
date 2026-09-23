import { createFileRoute } from "@tanstack/react-router";
import { InventorySettingsView } from "@/components/shared/pos/inventory/views/InventorySettingsView";

export const Route = createFileRoute("/pos/inventory/settings")({
  head: () => ({ meta: [{ title: "Stock Settings — Retrod POS" }] }),
  component: InventorySettingsView,
});
