import { createFileRoute } from "@tanstack/react-router";
import { VirtualWalletView } from "@/components/shared/pos/management/views/accounting/VirtualWalletView";

export const Route = createFileRoute("/pos/management/accounting/payments/wallet")({
  head: () => ({ meta: [{ title: "Virtual Wallet — Retrod POS" }] }),
  component: VirtualWalletView,
});
