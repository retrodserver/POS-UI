import { createFileRoute } from "@tanstack/react-router";
import { MultiItemImagesUploadView } from "@/components/shared/pos/menu/views/MultiItemImagesUploadView";

export const Route = createFileRoute("/pos/menu/images")({
  head: () => ({ meta: [{ title: "Multi-Item Images Upload — Retrod POS" }] }),
  component: MultiItemImagesUploadView,
});
