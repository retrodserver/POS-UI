import { createFileRoute } from "@tanstack/react-router";
import { BarcodeGenerationView } from "@/components/shared/pos/inventory/views/BarcodeGenerationView";

export const Route = createFileRoute("/pos/inventory/production/barcode")({
  head: () => ({ meta: [{ title: "Create Barcodes — Retrod POS" }] }),
  component: BarcodeGenerationView,
});
