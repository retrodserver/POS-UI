import { cn } from "@/lib/cn";
import { formatNumber } from "@/utils/formatUtils";

export function PosStatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "error" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "border-success/25 bg-success/5"
      : tone === "warning"
        ? "border-warning/25 bg-warning/5"
        : tone === "error"
          ? "border-error/25 bg-error/5"
          : tone === "info"
            ? "border-info/25 bg-info/5"
            : "border-border bg-surface";

  return (
    <div className={cn("rounded-lg border px-3 py-3 shadow-e1", toneClass)}>
      <p className="label-uppercase text-text-secondary">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-text-primary tabular-nums">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {hint ? <p className="mt-0.5 text-[11px] text-text-secondary">{hint}</p> : null}
    </div>
  );
}
