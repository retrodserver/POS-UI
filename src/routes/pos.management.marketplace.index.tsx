import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceHubView } from "@/components/shared/pos/management/views/marketplace/MarketplaceHubView";

export const Route = createFileRoute("/pos/management/marketplace/")({
  head: () => ({ meta: [{ title: "Marketplace — Retrod POS" }] }),
  component: MarketplaceHubView,
});
