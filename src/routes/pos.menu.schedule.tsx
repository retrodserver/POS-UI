import { createFileRoute } from "@tanstack/react-router";
import { ScheduleChangesView } from "@/components/shared/pos/menu/views/ScheduleChangesView";

export const Route = createFileRoute("/pos/menu/schedule")({
  head: () => ({ meta: [{ title: "Menu Schedule — Retrod POS" }] }),
  component: ScheduleChangesView,
});
