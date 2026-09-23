import { createFileRoute } from "@tanstack/react-router";
import { StockSummaryReportView } from "@/components/shared/pos/inventory/views/StockSummaryReportView";

export const Route = createFileRoute("/pos/inventory/reports/stock-summary")({
  head: () => ({ meta: [{ title: "Stock Summary — Retrod POS" }] }),
  component: StockSummaryReportView,
});
