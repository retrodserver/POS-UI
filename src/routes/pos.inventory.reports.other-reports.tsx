import { createFileRoute } from "@tanstack/react-router";
import { OtherReportsView } from "@/components/shared/pos/inventory/views/OtherReportsView";

export const Route = createFileRoute("/pos/inventory/reports/other-reports")({
  head: () => ({ meta: [{ title: "More Reports — Retrod POS" }] }),
  component: OtherReportsView,
});
