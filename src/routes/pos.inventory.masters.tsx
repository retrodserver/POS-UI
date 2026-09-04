import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { RawMaterialsManagementView } from "@/components/shared/pos/inventory/views/RawMaterialsManagementView";

export const Route = createFileRoute("/pos/inventory/masters")({
  head: () => ({ meta: [{ title: "Raw Materials Management — Retrod POS Inventory" }] }),
  component: MastersLayoutRoute,
});

function MastersLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRoot =
    pathname === "/pos/inventory/masters" ||
    pathname === "/pos/inventory/masters/" ||
    pathname === "/pos/inventory/masters/raw-materials";
  return isRoot ? <RawMaterialsManagementView /> : <Outlet />;
}

