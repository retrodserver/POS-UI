import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { PosMenuHeader } from "@/components/shared/pos/menu/PosMenuHeader";
import { MenuDiscountsView } from "@/components/shared/pos/menu/views/MenuDiscountsView";

export const Route = createFileRoute("/pos/menu")({
  head: () => ({ meta: [{ title: "Menu & Discounts — Retrod POS" }] }),
  component: MenuLayoutRoute,
});

function MenuLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRootMenu = pathname === "/pos/menu" || pathname === "/pos/menu/";

  return (
    <div className="space-y-4">
      <PosMenuHeader />
      {isRootMenu ? <MenuDiscountsView /> : <Outlet />}
    </div>
  );
}
