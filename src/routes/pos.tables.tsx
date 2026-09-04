import { createFileRoute } from "@tanstack/react-router";
import { PosTableManager } from "@/components/shared/pos/PosTableManager";

export const Route = createFileRoute("/pos/tables")({
  head: () => ({ meta: [{ title: "Table Management — Retrod POS" }] }),
  component: PosTableManager,
});
