import { createFileRoute } from "@tanstack/react-router";
import { MenuListManagerView } from "@/components/shared/pos/menu/views/MenuListManagerView";

export const Route = createFileRoute("/pos/menu/images")({
  head: () => ({ meta: [{ title: "Menu List (Photos) — Retrod POS" }] }),
  component: MenuListManagerView,
});
