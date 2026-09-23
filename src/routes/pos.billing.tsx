import { createFileRoute } from "@tanstack/react-router";
import { PosBillingManager } from "@/components/shared/pos/billing/PosBillingManager";

export const Route = createFileRoute("/pos/billing")({
  head: () => ({ meta: [{ title: "Fast Touch Billing — Retrod POS" }] }),
  component: PosBillingManager,
});
