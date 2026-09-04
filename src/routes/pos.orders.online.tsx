import { createFileRoute } from "@tanstack/react-router";
import { PosOnlineOrdersManager } from "@/components/shared/pos/orders/PosOnlineOrdersManager";

export const Route = createFileRoute("/pos/orders/online")({
  head: () => ({ meta: [{ title: "Online Orders — Retrod POS" }] }),
  component: PosOnlineOrdersManager,
});
