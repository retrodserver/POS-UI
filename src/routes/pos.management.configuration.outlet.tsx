import { createFileRoute } from "@tanstack/react-router";
import { OutletConfigurationHubView } from "@/components/shared/pos/management/views/OutletConfigurationHubView";

export const Route = createFileRoute("/pos/management/configuration/outlet")({
  head: () => ({ meta: [{ title: "Outlet Configuration — Retrod POS" }] }),
  component: OutletConfigurationHubView,
});
