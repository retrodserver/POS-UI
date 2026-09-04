import { createFileRoute } from "@tanstack/react-router";
import { PosPanel } from "@/components/shared/pos/PosPanel";

export const Route = createFileRoute("/pos/settings")({
  head: () => ({ meta: [{ title: "Settings — Retrod POS" }] }),
  component: () => (
    <div className="p-6 space-y-6">
      <PosPanel title="POS System Settings" hint="Printer setup, tax configuration, bill layout, and terminal preferences.">
        <p className="text-sm text-slate-500">Configure receipt headers, KOT routing, and store profile.</p>
      </PosPanel>
    </div>
  ),
});
