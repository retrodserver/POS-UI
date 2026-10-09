import { createFileRoute } from "@tanstack/react-router";
import { AutoAcceptLogsView } from "@/components/shared/pos/management/views/logs/AutoAcceptLogsView";

export const Route = createFileRoute("/pos/management/logs/auto-accept")({
  head: () => ({ meta: [{ title: "Auto Accept Change Logs — Retrod POS" }] }),
  component: AutoAcceptLogsView,
});
