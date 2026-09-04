import { createFileRoute } from "@tanstack/react-router";
import { BillerAppManagementView } from "@/components/shared/pos/management/views/users/BillerAppManagementView";

export const Route = createFileRoute("/pos/management/users/biller-app")({
  head: () => ({ meta: [{ title: "Biller App Users — Retrod POS" }] }),
  component: BillerAppManagementView,
});
