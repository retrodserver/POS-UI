import { createFileRoute } from "@tanstack/react-router";
import { ReportNotificationView } from "@/components/shared/pos/reports/views/ReportNotificationView";

export const Route = createFileRoute("/pos/reports/notifications")({
  head: () => ({ meta: [{ title: "Report Notification — Retrod POS Reports" }] }),
  component: ReportNotificationView,
});
