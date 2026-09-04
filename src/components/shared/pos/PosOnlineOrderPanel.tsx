import { PosPanel } from "@/components/shared/pos/PosPanel";
import { PosStatTile } from "@/components/shared/pos/PosStatTile";
import { StatusBadge } from "@/components/ui/Primitives";

const CHANNELS = [
  { name: "Swiggy", orders: 28, revenue: "₹41,200", status: "Synced" },
  { name: "Zomato", orders: 22, revenue: "₹36,800", status: "Synced" },
  { name: "Direct app", orders: 6, revenue: "₹9,140", status: "Live" },
] as const;

/** §1.7 Online Order Panel */
export function PosOnlineOrderPanel() {
  return (
    <PosPanel title="Online order panel" hint="Aggregator channels · today">
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PosStatTile label="Online orders" value={56} tone="info" />
        <PosStatTile label="Online revenue" value="₹87,140" tone="success" />
        <PosStatTile label="Avg ticket" value="₹1,556" />
        <PosStatTile label="Rejects" value={2} tone="error" />
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[420px] text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/50 text-left">
              {["Channel", "Orders", "Revenue", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map((row) => (
              <tr key={row.name} className="border-b border-border-subtle last:border-0">
                <td className="px-3 py-2.5 font-medium">{row.name}</td>
                <td className="px-3 py-2.5 font-mono">{row.orders}</td>
                <td className="px-3 py-2.5 font-mono">{row.revenue}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge tone="success">{row.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PosPanel>
  );
}
