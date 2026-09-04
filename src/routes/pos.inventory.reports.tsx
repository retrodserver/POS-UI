import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { CurrentStockReportView } from "@/components/shared/pos/inventory/views/CurrentStockReportView";

export const Route = createFileRoute("/pos/inventory/reports")({
  head: () => ({ meta: [{ title: "Current Stock Report — Retrod POS Inventory" }] }),
  component: ReportsLayoutRoute,
});

function ReportsLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRoot = pathname === "/pos/inventory/reports" || pathname === "/pos/inventory/reports/";
  return isRoot ? <CurrentStockReportView /> : <Outlet />;
}

