import { useState } from "react";
import { PosSidebar } from "@/components/layout/pos/PosSidebar";
import { PosTopBar } from "@/components/layout/pos/PosTopBar";
import { ThemePreference } from "@/components/shared/pos/ThemePreference";
import { OnlineOrderAlertModal } from "@/components/shared/pos/orders/OnlineOrderAlertModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = 240;

export function PosShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-background text-foreground",
        mobileOpen && isMobile ? "h-screen overflow-hidden" : "",
      )}
    >
      {isMobile && mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/45"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Fixed sidebar — stays put while main content scrolls */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-dvh transition-transform duration-200",
          isMobile && !mobileOpen ? "-translate-x-full" : "translate-x-0",
        )}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <PosSidebar
          collapsed={false}
          onNavigate={isMobile ? () => setMobileOpen(false) : undefined}
        />
      </div>

      {/* Content column offset by sidebar width on desktop */}
      <div
        className="flex min-h-dvh min-w-0 flex-col bg-[#f6f5f0]"
        style={{ marginLeft: isMobile ? 0 : SIDEBAR_WIDTH }}
      >
        <PosTopBar onOpenMobileNav={isMobile ? () => setMobileOpen(true) : undefined} />
        <main className="flex-1 min-w-0 p-2.5 sm:p-3.5 lg:p-4 overflow-x-auto pb-[env(safe-area-inset-bottom)]">
          {children}
        </main>
      </div>

      <ThemePreference variant="fab" />
      <OnlineOrderAlertModal />
    </div>
  );
}
