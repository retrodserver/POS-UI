import { createFileRoute } from "@tanstack/react-router";
import { PosModuleHubManager } from "@/components/shared/pos/PosModuleHubManager";

export const Route = createFileRoute("/pos/marketing")({
  head: () => ({ meta: [{ title: "Marketing — Retrod POS" }] }),
  component: () => (
    <PosModuleHubManager
      eyebrow="SRS §5"
      title="Marketing automation"
      description="Advertisements, WhatsApp campaigns, customers, reputation, and conversations."
      links={[
        { label: "Advertisements", to: "/pos/marketing", hint: "§5.1" },
        { label: "WhatsApp campaigns", to: "/pos/marketing", hint: "§5.2" },
        { label: "Customers", to: "/pos/crm", hint: "§5.3" },
        { label: "Reputation", to: "/pos/marketing", hint: "§5.4" },
        { label: "Conversations", to: "/pos/marketing", hint: "§5.5" },
      ]}
    />
  ),
});
