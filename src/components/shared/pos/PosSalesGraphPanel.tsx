import { PosPanel } from "@/components/shared/pos/PosPanel";

const OUTCOMES = [
  { key: "successful", label: "Successful", value: 142, color: "bg-success" },
  { key: "complementary", label: "Complementary", value: 8, color: "bg-info" },
  { key: "cancelled", label: "Cancelled", value: 11, color: "bg-error" },
] as const;

/** §1.3 Sales Graph — outcome bars (mock; swap for Recharts later). */
export function PosSalesGraphPanel() {
  const max = Math.max(...OUTCOMES.map((o) => o.value));
  return (
    <PosPanel title="Sales graph" hint="Orders by outcome · today">
      <div className="flex h-40 items-end gap-4">
        {OUTCOMES.map((o) => (
          <div key={o.key} className="flex flex-1 flex-col items-center gap-2">
            <span className="font-mono text-xs text-text-secondary">{o.value}</span>
            <div
              className={`w-full max-w-[64px] rounded-t-md ${o.color}`}
              style={{ height: `${Math.max(8, (o.value / max) * 100)}%` }}
              title={o.label}
            />
            <span className="text-center text-[11px] text-text-secondary">{o.label}</span>
          </div>
        ))}
      </div>
    </PosPanel>
  );
}
