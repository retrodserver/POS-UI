import { createFileRoute } from "@tanstack/react-router";
import { PosDueSettlementManager } from "@/components/shared/pos/orders/PosDueSettlementManager";

export const Route = createFileRoute("/pos/settlement")({
  head: () => ({ meta: [{ title: "Due Payment Settlement — Retrod POS" }] }),
  component: PosDueSettlementManager,
});
