import { createFileRoute } from "@tanstack/react-router";
import { ClosingHourLogsView } from "@/components/shared/pos/management/views/logs/ClosingHourLogsView";

export const Route = createFileRoute("/pos/management/logs/closing-hours")({
  head: () => ({ meta: [{ title: "Closing Hour Logs — Retrod POS" }] }),
  component: ClosingHourLogsView,
});
