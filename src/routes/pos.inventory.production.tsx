import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ProductionMasterView } from "@/components/shared/pos/inventory/views/ProductionMasterView";

export const Route = createFileRoute("/pos/inventory/production")({
  head: () => ({ meta: [{ title: "Preparation Setup — Retrod POS" }] }),
  component: ProductionLayoutRoute,
});

function ProductionLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRoot =
    pathname === "/pos/inventory/production" || pathname === "/pos/inventory/production/";
  return isRoot ? <ProductionMasterView /> : <Outlet />;
}
