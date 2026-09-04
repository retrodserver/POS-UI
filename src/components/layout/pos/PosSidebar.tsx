import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { POS_NAV_ITEMS, POS_FOOTER_NAV_ITEMS } from "@/app/navigation/pos-nav-config";
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

  // Default closed: for the first time it opens with all sidebar tabs closed; users can click to open and check
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Default closed: always opens with no inside sections open; user can click dropdown to open
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const isLinkActive = (to?: string) => {
    if (!to || !pathname) return false;
    if (pathname === to || pathname === `${to}/`) return true;
    if (pathname.startsWith(`${to}/`)) {
      const hasMoreSpecific = ALL_NAV_LINKS.some(
        (other) =>
          other !== to &&
          other.length > to.length &&
          (pathname === other || pathname.startsWith(`${other}/`))
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
        "flex h-full flex-col border-r border-slate-800/60 bg-[#0b192c] text-white shadow-xl transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-800/80 px-4">
        {!collapsed ? (
          <Link to="/pos" onClick={onNavigate} className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500 font-display text-[18px] font-bold text-white shadow-md shadow-teal-500/20">
              R
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold tracking-tight text-white">
                Retrod POS
              </div>
              <div className="truncate text-[11px] font-normal text-slate-400">
                Hotel & Restaurant
              </div>
            </div>
          </Link>
        ) : (
          <Link
            to="/pos"
            onClick={onNavigate}
            title="Retrod POS"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 font-display text-[18px] font-bold text-white shadow-md shadow-teal-500/20"
          >
            R
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin" aria-label="POS navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const active = isActive(item.to, item.exact);
          const groupOpen = Boolean(openGroups[item.id]);

          if (hasChildren && !collapsed) {
            return (
              <div key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setOpenGroups((s) => ({ ...s, [item.id]: !groupOpen }))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer",
                    active
                      ? "bg-teal-600 text-white shadow-sm font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {groupOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 transition" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 transition" />
                  )}
                </button>
                {groupOpen && (
                  <div className="ml-5 space-y-0.5 border-l border-slate-700/60 pl-3 py-1">
                    {item.children!.map((child) => {
                      const renderNavChild = (node: typeof child, depth = 0): React.ReactNode => {
                        if (node.children?.length) {
                          const isFolderOpen = Boolean(openFolders[node.id]);
                          const folderHasActive = node.children.some((c) =>
                            c.to ? isLinkActive(c.to) : c.children?.some((sc) => isLinkActive(sc.to))
                          );

                          return (
                            <div key={node.id} className="space-y-0.5 pt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenFolders((s) => ({ ...s, [node.id]: !isFolderOpen }))
                                }
                                className={cn(
                                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12px] font-semibold transition cursor-pointer",
                                  folderHasActive
                                    ? "text-teal-300"
                                    : "text-slate-300 hover:text-white hover:bg-white/5",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Folder className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{node.label}</span>
                                </div>
                                {isFolderOpen ? (
                                  <ChevronDown className="h-3 w-3 text-slate-400" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-slate-400" />
                                )}
                              </button>

                              {isFolderOpen && (
                                <div className="ml-3 space-y-0.5 border-l border-slate-700/60 pl-2.5 py-0.5">
                                  {node.children.map((subNode) =>
                                    renderNavChild(subNode, depth + 1)
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Leaf Link
                        const childActive = isLinkActive(node.to);
                        return (
                          <Link
                            key={node.id}
                            to={node.to!}
                            onClick={onNavigate}
                            className={cn(
                              "flex items-center rounded-md px-2 py-1 text-[11.5px] transition-all",
                              childActive
                                ? "font-semibold text-teal-400 bg-white/5"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
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

          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-teal-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation (Help & Settings) */}
      <div className="border-t border-slate-800/80 p-3 space-y-1">
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
                  ? "bg-teal-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
