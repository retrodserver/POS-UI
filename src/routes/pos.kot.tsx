import { createFileRoute } from "@tanstack/react-router";
import { PosKotManager } from "@/components/shared/pos/orders/PosKotManager";

export const Route = createFileRoute("/pos/kot")({
  head: () => ({ meta: [{ title: "Kitchen Orders (KOT) — Retrod POS" }] }),
  component: PosKotManager,
});
