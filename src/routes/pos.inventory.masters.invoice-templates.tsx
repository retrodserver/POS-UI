import { createFileRoute } from "@tanstack/react-router";
import { InvoiceTemplatesView } from "@/components/shared/pos/inventory/views/InvoiceTemplatesView";

export const Route = createFileRoute("/pos/inventory/masters/invoice-templates")({
  head: () => ({ meta: [{ title: "Invoice Format — Retrod POS" }] }),
  component: InvoiceTemplatesView,
});
