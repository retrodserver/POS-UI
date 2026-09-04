import { createFileRoute } from "@tanstack/react-router";
import { DayEndSummaryView } from "@/components/shared/pos/reports/views/DayEndSummaryView";

export const Route = createFileRoute("/pos/reports/day-end")({
  head: () => ({ meta: [{ title: "Day End Summary — Retrod POS Reports" }] }),
  component: DayEndSummaryView,
});
