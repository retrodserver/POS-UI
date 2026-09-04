import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import { PosStatTile } from "@/components/shared/pos/PosStatTile";

const DEMO_ROWS = [
  { id: "ORD-441", channel: "Dine in", party: "T-12", amount: "₹4,860", status: "Open" },
  { id: "ORD-440", channel: "Delivery", party: "Swiggy", amount: "₹1,240", status: "Preparing" },
  { id: "ORD-439", channel: "Pick up", party: "Counter", amount: "₹680", status: "Ready" },
];

/** Shared list shell for Live / All / Online order screens. */
export function PosOrdersListManager({
  title,
  description,
  filterHint,
}: {
  title: string;
  description: string;
  filterHint: string;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Daily operation"
        title={title}
        description={description}
        actions={
          <Button size="sm" variant="outline">
            Refresh
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PosStatTile label="Open" value={8} tone="info" />
          <PosStatTile label="Preparing" value={5} tone="warning" />
          <PosStatTile label="Ready" value={3} tone="success" />
          <PosStatTile label="Closed today" value={142} />
        </div>
        <Card>
          <CardHeader title="Orders" hint={filterHint} />
          <div className="overflow-x-auto px-0 pb-2">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Order", "Type", "Party", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_ROWS.map((row) => (
                  <tr key={row.id} className="border-b border-border-subtle hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-mono text-[12px]">{row.id}</td>
                    <td className="px-4 py-3">{row.channel}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.party}</td>
                    <td className="px-4 py-3 font-mono">{row.amount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        tone={row.status === "Preparing" ? "warning" : row.status === "Open" ? "info" : "success"}
                      >
                        {row.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
