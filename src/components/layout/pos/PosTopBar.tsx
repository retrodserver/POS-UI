import { useState } from "react";
import { Bell, ChevronDown, Menu, Search, Store } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function PosTopBar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const { user } = useAuth();
  const [activeOutlet, setActiveOutlet] = useState("Main Restaurant");
  const [showOutletMenu, setShowOutletMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-13 sm:h-14 items-center justify-between border-b border-slate-300 bg-white px-3 sm:px-4 lg:px-5 shadow-2xs">
      {/* Left: Mobile Nav Toggle & Search Bar */}
      <div className="flex flex-1 items-center gap-2.5">
        {onOpenMobileNav && (
          <button
            type="button"
            aria-label="Open navigation"
            onClick={onOpenMobileNav}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, tables, rooms..."
            aria-label="Search orders, tables, rooms"
            className="h-8.5 w-full rounded-lg border border-slate-300 bg-slate-50 pl-8.5 pr-3 text-[12.5px] text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Right: Outlet Selector, Notifications, User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Outlet / Property Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOutletMenu(!showOutletMenu)}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <Store className="h-4 w-4 text-slate-500" />
            <span>{activeOutlet}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showOutletMenu && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg z-30 animate-in fade-in zoom-in-95">
              {["Main Restaurant", "Rooftop Lounge", "Poolside Bar", "Banquet Hall"].map(
                (outlet) => (
                  <button
                    key={outlet}
                    type="button"
                    onClick={() => {
                      setActiveOutlet(outlet);
                      setShowOutletMenu(false);
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[12.5px] transition ${
                      activeOutlet === outlet
                        ? "bg-teal-50 text-teal-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {outlet}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* Notifications Bell with Badge */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9.5px] font-bold text-white shadow-xs">
            12
          </span>
        </button>

        {/* User Profile / Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-[11px] text-slate-700">
            {user?.initials ?? "RA"}
          </div>
          <div className="hidden text-left sm:block">
            <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-800 leading-tight">
              <span>{user?.name ?? "Retrod Admin"}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
