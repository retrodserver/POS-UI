import { createFileRoute } from "@tanstack/react-router";
import { SpecialNoteView } from "@/components/shared/pos/menu/views/SpecialNoteView";

export const Route = createFileRoute("/pos/menu/special-notes")({
  head: () => ({ meta: [{ title: "Special Note — Retrod POS" }] }),
  component: SpecialNoteView,
});
