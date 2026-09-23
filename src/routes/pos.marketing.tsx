import { createFileRoute } from "@tanstack/react-router";
import { PosMarketingManager } from "@/components/shared/pos/marketing/PosMarketingManager";

export const Route = createFileRoute("/pos/marketing")({
  head: () => ({ meta: [{ title: "Marketing Automation — Retrod POS" }] }),
  component: PosMarketingManager,
});
