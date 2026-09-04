import { Link } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader } from "@/components/ui/Primitives";

type LinkItem = { label: string; to: string; hint?: string };

/** Thin module hub — reuses PageHeader/Card for every POS area shell. */
export function PosModuleHubManager({
  eyebrow,
  title,
  description,
  links,
}: {
  eyebrow: string;
  title: string;
  description: string;
  links: LinkItem[];
}) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
        {links.map((item) => (
          <Card key={item.to + item.label}>
            <CardHeader title={item.label} hint={item.hint} />
            <div className="px-4 pb-4">
              <Link
                to={item.to}
                className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-[12px] font-medium text-primary hover:bg-surface-2"
              >
                Open
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
