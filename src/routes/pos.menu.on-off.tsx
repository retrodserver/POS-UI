import { createFileRoute } from "@tanstack/react-router";
import { MenuOnOffView } from "@/components/shared/pos/menu/views/MenuOnOffView";

export const Route = createFileRoute("/pos/menu/on-off")({
  head: () => ({ meta: [{ title: "Item Availability — Retrod POS" }] }),
  component: MenuOnOffView,
});
