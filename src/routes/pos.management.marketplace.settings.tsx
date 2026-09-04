import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceSettingsView } from "@/components/shared/pos/management/views/marketplace/MarketplaceSettingsView";

export const Route = createFileRoute("/pos/management/marketplace/settings")({
  head: () => ({ meta: [{ title: "Marketplace Settings — Retrod POS" }] }),
  component: MarketplaceSettingsView,
});
