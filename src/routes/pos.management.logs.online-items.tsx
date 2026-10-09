import { createFileRoute } from "@tanstack/react-router";
import { OnlineItemLogsView } from "@/components/shared/pos/management/views/logs/OnlineItemLogsView";

export const Route = createFileRoute("/pos/management/logs/online-items")({
  head: () => ({ meta: [{ title: "Online Item On/Off Logs — Retrod POS" }] }),
  component: OnlineItemLogsView,
});
