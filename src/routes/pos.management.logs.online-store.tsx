import { createFileRoute } from "@tanstack/react-router";
import { OnlineStoreLogsView } from "@/components/shared/pos/management/views/logs/OnlineStoreLogsView";

export const Route = createFileRoute("/pos/management/logs/online-store")({
  head: () => ({ meta: [{ title: "Online Store Logs — Retrod POS" }] }),
  component: OnlineStoreLogsView,
});
