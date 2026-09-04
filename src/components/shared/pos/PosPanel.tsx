import { cn } from "@/lib/cn";
import { Card, CardHeader } from "@/components/ui/Primitives";

/** Reusable POS section card — one job per panel. */
export function PosPanel({
  title,
  hint,
  action,
  children,
  className,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader title={title} hint={hint} action={action} />
      <div className="px-4 pb-4 pt-0 md:px-5">{children}</div>
    </Card>
  );
}
