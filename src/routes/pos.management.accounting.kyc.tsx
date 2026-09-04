import { createFileRoute } from "@tanstack/react-router";
import { KycDetailsView } from "@/components/shared/pos/management/views/accounting/KycDetailsView";

export const Route = createFileRoute("/pos/management/accounting/kyc")({
  head: () => ({ meta: [{ title: "KYC Details — Retrod POS" }] }),
  component: KycDetailsView,
});
