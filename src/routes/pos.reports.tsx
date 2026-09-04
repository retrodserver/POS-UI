import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { DayEndSummaryView } from "@/components/shared/pos/reports/views/DayEndSummaryView";

export const Route = createFileRoute("/pos/reports")({
  head: () => ({ meta: [{ title: "Reports — Retrod POS" }] }),
  component: ReportsMainLayoutRoute,
});

function ReportsMainLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRoot =
    pathname === "/pos/reports" ||
    pathname === "/pos/reports/" ||
    pathname === "/pos/reports/day-end";
  return isRoot ? <DayEndSummaryView /> : <Outlet />;
}
