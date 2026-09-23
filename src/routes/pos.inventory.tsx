import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { PosInventoryHeader } from "@/components/shared/pos/inventory/PosInventoryHeader";
import { InventoryDashboardView } from "@/components/shared/pos/inventory/views/InventoryDashboardView";

export const Route = createFileRoute("/pos/inventory")({
  head: () => ({ meta: [{ title: "Stock Overview — Retrod POS" }] }),
  component: InventoryLayoutRoute,
});

function InventoryLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRootInventory = pathname === "/pos/inventory" || pathname === "/pos/inventory/";

  return (
    <div className="space-y-4">
      <PosInventoryHeader />
      {isRootInventory ? <InventoryDashboardView /> : <Outlet />}
    </div>
  );
}
