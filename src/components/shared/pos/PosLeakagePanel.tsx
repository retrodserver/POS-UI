import { PosPanel } from "@/components/shared/pos/PosPanel";
import { PosStatTile } from "@/components/shared/pos/PosStatTile";

/** §1.4 Leakage Indicators */
export function PosLeakagePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PosPanel title="KOT leakage" hint="Post-creation kitchen tickets">
        <div className="grid grid-cols-2 gap-3">
          <PosStatTile label="Cancelled KOTs" value={11} tone="error" />
          <PosStatTile label="Modified KOTs" value={17} tone="warning" />
          <PosStatTile label="Not used bills" value={4} tone="warning" />
          <PosStatTile label="Shifted" value={3} />
        </div>
      </PosPanel>
      <PosPanel title="Bill leakage" hint="Post-generation bill events">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <PosStatTile label="Modified bills" value={6} tone="warning" />
          <PosStatTile label="Re-prints" value={9} />
          <PosStatTile label="Waived off" value="₹2,150" tone="error" />
        </div>
      </PosPanel>
    </div>
  );
}
