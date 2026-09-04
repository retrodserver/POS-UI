import { PosPanel } from "@/components/shared/pos/PosPanel";
import { PosStatTile } from "@/components/shared/pos/PosStatTile";

/** §1.6 Expenses, Withdrawals & Cash Top-up */
export function PosCashFloatPanel() {
  return (
    <PosPanel title="Expenses, withdrawals & cash top-up" hint="Shift float activity">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <PosStatTile label="Expenses" value="₹4,820" hint="7 entries" tone="warning" />
        <PosStatTile label="Withdrawals" value="₹8,000" hint="2 authorised" />
        <PosStatTile label="Cash top-up" value="₹5,000" hint="1 top-up" tone="success" />
      </div>
    </PosPanel>
  );
}
