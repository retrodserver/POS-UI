import { createFileRoute } from "@tanstack/react-router";
import { ExpenseLogsView } from "@/components/shared/pos/management/views/logs/ExpenseLogsView";

export const Route = createFileRoute("/pos/management/logs/expenses")({
  head: () => ({ meta: [{ title: "Expense Logs — Retrod POS" }] }),
  component: ExpenseLogsView,
});
