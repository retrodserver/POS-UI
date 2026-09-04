import { PosPanel } from "@/components/shared/pos/PosPanel";
import { PosStatTile } from "@/components/shared/pos/PosStatTile";

/** §1.2 Sales Statistics Panel */
export function PosSalesStatsPanel() {
  return (
    <PosPanel title="Sales statistics" hint="Payment-mode breakdown · business day">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <PosStatTile label="Total sales" value="₹1,84,260" tone="success" hint="Gross paid" />
        <PosStatTile label="Not paid" value="₹12,400" tone="warning" hint="Credit / due" />
        <PosStatTile label="Cash" value="₹48,920" />
        <PosStatTile label="Card" value="₹62,110" />
        <PosStatTile label="Online" value="₹61,230" hint="UPI / wallets" />
        <PosStatTile label="Other" value="₹12,000" hint="Vouchers" />
      </div>
    </PosPanel>
  );
}
