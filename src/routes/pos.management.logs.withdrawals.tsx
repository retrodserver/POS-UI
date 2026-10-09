import { createFileRoute } from "@tanstack/react-router";
import { WithdrawalLogsView } from "@/components/shared/pos/management/views/logs/WithdrawalLogsView";

export const Route = createFileRoute("/pos/management/logs/withdrawals")({
  head: () => ({ meta: [{ title: "Withdrawal Logs — Retrod POS" }] }),
  component: WithdrawalLogsView,
});
