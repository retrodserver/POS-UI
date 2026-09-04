import { cn } from "@/lib/cn";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent",
        className,
      )}
    />
  );
}
