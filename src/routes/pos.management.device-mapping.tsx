import { createFileRoute } from "@tanstack/react-router";
import { DeviceMappingView } from "@/components/shared/pos/management/views/devices/DeviceMappingView";

export const Route = createFileRoute("/pos/management/device-mapping")({
  head: () => ({ meta: [{ title: "Device Mapping — Retrod POS" }] }),
  component: DeviceMappingView,
});
