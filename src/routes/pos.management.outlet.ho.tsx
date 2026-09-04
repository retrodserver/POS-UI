import { createFileRoute } from "@tanstack/react-router";
import { OutletFormView } from "@/components/shared/pos/management/views/outlet/OutletFormView";

export const Route = createFileRoute("/pos/management/outlet/ho")({
  head: () => ({ meta: [{ title: "Add New HO — Retrod POS" }] }),
  component: () => <OutletFormView type="HO" />,
});
