import { createFileRoute } from "@tanstack/react-router";
import { PosModuleHubManager } from "@/components/shared/pos/PosModuleHubManager";

export const Route = createFileRoute("/pos/aggregators")({
  head: () => ({ meta: [{ title: "Aggregators — Retrod POS" }] }),
  component: () => (
    <PosModuleHubManager
      eyebrow="SRS §9"
      title="Aggregator center"
      description="Connect and monitor Swiggy and other delivery platforms."
      links={[
        { label: "Swiggy integration", to: "/pos/aggregators", hint: "§9.1" },
        { label: "Online order panel", to: "/pos", hint: "Dashboard §1.7" },
      ]}
    />
  ),
});
