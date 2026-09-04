import { createFileRoute } from "@tanstack/react-router";
import { PosAllOrdersManager } from "@/components/shared/pos/orders/PosAllOrdersManager";

export const Route = createFileRoute("/pos/orders/all")({
  head: () => ({ meta: [{ title: "All Orders — Retrod POS" }] }),
  component: PosAllOrdersManager,
});
