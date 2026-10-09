import { createFileRoute } from "@tanstack/react-router";
import { CashTopUpLogsView } from "@/components/shared/pos/management/views/logs/CashTopUpLogsView";

export const Route = createFileRoute("/pos/management/logs/cash-topup")({
  head: () => ({ meta: [{ title: "Cash Top-Up Logs — Retrod POS" }] }),
  component: CashTopUpLogsView,
});
