import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { POS_NAV_ITEMS, POS_FOOTER_NAV_ITEMS } from "@/app/navigation/pos-nav-config";
import { RetrodLogo } from "@/components/common";
import { cn } from "@/lib/utils";

const ALL_NAV_LINKS: string[] = [];
function collectLinks(items: Array<{ to?: string; children?: any[] }>) {
  for (const item of items) {
    if (item.to) ALL_NAV_LINKS.push(item.to);
    if (item.children?.length) collectLinks(item.children);
  }
}
collectLinks(POS_NAV_ITEMS);
collectLinks(POS_FOOTER_NAV_ITEMS);

export function PosSidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Auto-open groups that contain the currently active route
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    POS_NAV_ITEMS.forEach((item) => {
      if (item.children?.length) {
        const isChildActive = item.children.some((c) =>
          c.to
            ? pathname === c.to || pathname.startsWith(`${c.to}/`)
            : c.children?.some((sc) => sc.to && (pathname === sc.to || pathname.startsWith(`${sc.to}/`)))
        );
        if (isChildActive || (item.to && (pathname === item.to || pathname.startsWith(`${item.to}/`)))) {
          initial[item.id] = true;
        }
      }
    });
    return initial;
  });

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    POS_NAV_ITEMS.forEach((item) => {
      item.children?.forEach((child) => {
        if (child.children?.length) {
          const isChildActive = child.children.some(
            (sc) => sc.to && (pathname === sc.to || pathname.startsWith(`${sc.to}/`))
          );
          if (isChildActive) {
            initial[child.id] = true;
          }
        }
      });
    });
    return initial;
  });

  const isLinkActive = (to?: string) => {
    if (!to || !pathname) return false;
    if (pathname === to || pathname === `${to}/`) return true;
    if (pathname.startsWith(`${to}/`)) {
      const hasMoreSpecific = ALL_NAV_LINKS.some(
        (other) =>
          other !== to &&
          other.length > to.length &&
          (pathname === other || pathname.startsWith(`${other}/`)),
      );
      return !hasMoreSpecific;
    }
    return false;
  };

  const isActive = (to: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === to || pathname === `${to}/`;
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const navItems = POS_NAV_ITEMS ?? [];
  const footerItems = POS_FOOTER_NAV_ITEMS ?? [];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >

      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        {!collapsed ? (
          <Link
            to="/pos"
            onClick={onNavigate}
            className="flex min-w-0 items-center py-1 transition-opacity hover:opacity-90 cursor-pointer"
            title="Go to POS Dashboard"
          >
            <RetrodLogo variant="dark" size="md" />
          </Link>
        ) : (
          <Link
            to="/pos"
            onClick={onNavigate}
            title="Go to POS Dashboard"
            className="mx-auto flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          >
            <RetrodLogo collapsed variant="dark" />
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin"
        aria-label="POS navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const active = isActive(item.to, item.exact);
          const groupOpen = Boolean(openGroups[item.id]);

          // Check if any descendant inside this item is the currently open/active page
          const isNodeActive = (node: { to?: string; children?: any[] }): boolean => {
            if (node.to && isLinkActive(node.to)) return true;
            if (node.children?.length) {
              return node.children.some((c) => isNodeActive(c));
            }
            return false;
          };

          const hasActiveChild = hasChildren && Boolean(item.children?.some((c) => isNodeActive(c)));

          if (hasChildren && !collapsed) {
            return (
              <div key={item.id} className="space-y-1">
                {/* Upper Folder Button — slightly light highlighted when any child inside is active */}
                <button
                  type="button"
                  onClick={() => setOpenGroups((s) => ({ ...s, [item.id]: !groupOpen }))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer border",
                    hasActiveChild
                      ? "bg-primary/15 text-sidebar-foreground border-primary/25 font-semibold shadow-2xs"
                      : "text-sidebar-muted border-transparent hover:bg-sidebar-hover hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      hasActiveChild ? "text-primary" : "text-sidebar-muted",
                    )}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {groupOpen ? (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-colors",
                        hasActiveChild ? "text-primary/80" : "text-sidebar-muted",
                      )}
                    />
                  ) : (
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-colors",
                        hasActiveChild ? "text-primary/80" : "text-sidebar-muted",
                      )}
                    />
                  )}
                </button>

                {groupOpen && (
                  <div
                    className={cn(
                      "ml-5 space-y-0.5 border-l pl-3 py-1 transition-colors",
                      hasActiveChild ? "border-primary/30" : "border-sidebar-border",
                    )}
                  >
                    {item.children!.map((child) => {
                      const renderNavChild = (node: typeof child, depth = 0): React.ReactNode => {
                        if (node.children?.length) {
                          const isFolderOpen = Boolean(openFolders[node.id]);
                          const folderHasActive = Boolean(node.children?.some((sc) => isNodeActive(sc)));

                          return (
                            <div key={node.id} className="space-y-0.5 pt-1">
                              {/* Intermediate Folder — slightly light highlighted when containing active page */}
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenFolders((s) => ({ ...s, [node.id]: !isFolderOpen }))
                                }
                                className={cn(
                                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12px] font-semibold transition cursor-pointer border",
                                  folderHasActive
                                    ? "bg-primary/15 text-sidebar-foreground border-primary/25 shadow-2xs"
                                    : "text-sidebar-muted border-transparent hover:text-sidebar-foreground hover:bg-sidebar-hover",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Folder
                                    className={cn(
                                      "h-3.5 w-3.5 shrink-0 transition-colors",
                                      folderHasActive ? "text-primary" : "text-sidebar-muted",
                                    )}
                                  />
                                  <span>{node.label}</span>
                                </div>
                                {isFolderOpen ? (
                                  <ChevronDown
                                    className={cn(
                                      "h-3 w-3 transition-colors",
                                      folderHasActive ? "text-primary/80" : "text-sidebar-muted",
                                    )}
                                  />
                                ) : (
                                  <ChevronRight
                                    className={cn(
                                      "h-3 w-3 transition-colors",
                                      folderHasActive ? "text-primary/80" : "text-sidebar-muted",
                                    )}
                                  />
                                )}
                              </button>

                              {isFolderOpen && (
                                <div
                                  className={cn(
                                    "ml-3 space-y-0.5 border-l pl-2.5 py-0.5 transition-colors",
                                    folderHasActive ? "border-primary/25" : "border-sidebar-border",
                                  )}
                                >
                                  {node.children.map((subNode) =>
                                    renderNavChild(subNode, depth + 1),
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Inside Leaf Item — THE ONE WHICH WE OPEN: theme highlighted
                        const childActive = isLinkActive(node.to);
                        return (
                          <Link
                            key={node.id}
                            to={node.to!}
                            onClick={onNavigate}
                            className={cn(
                              "flex items-center rounded-md px-2.5 py-1.5 text-[12px] transition-all duration-150",
                              childActive
                                ? "font-bold text-primary-foreground bg-primary shadow-xs ring-1 ring-primary/40"
                                : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-hover",
                            )}
                          >
                            {node.label}
                          </Link>
                        );
                      };

                      return renderNavChild(child);
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Top-level item without children (or collapsed)
          const isItemActive = hasChildren ? hasActiveChild : active;
          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 border",
                isItemActive
                  ? hasChildren
                    ? "bg-primary/15 text-primary border-primary/25 font-semibold"
                    : "bg-primary text-primary-foreground shadow-sm font-bold border-transparent ring-1 ring-primary/40"
                  : "text-sidebar-muted border-transparent hover:bg-sidebar-hover hover:text-sidebar-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isItemActive && hasChildren ? "text-primary" : "",
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation (Help & Settings) */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        {footerItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-sidebar-muted" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
