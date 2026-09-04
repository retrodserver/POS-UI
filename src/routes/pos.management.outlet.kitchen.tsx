import { createFileRoute } from "@tanstack/react-router";
import { OutletFormView } from "@/components/shared/pos/management/views/outlet/OutletFormView";

export const Route = createFileRoute("/pos/management/outlet/kitchen")({
  head: () => ({ meta: [{ title: "Add New Kitchen — Retrod POS" }] }),
  component: () => <OutletFormView type="Kitchen" />,
});
