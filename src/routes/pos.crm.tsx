import { createFileRoute } from "@tanstack/react-router";
import { PosModuleHubManager } from "@/components/shared/pos/PosModuleHubManager";

export const Route = createFileRoute("/pos/crm")({
  head: () => ({ meta: [{ title: "CRM — Retrod POS" }] }),
  component: () => (
    <PosModuleHubManager
      eyebrow="SRS §8"
      title="CRM"
      description="Campaigns, customers, feedback, gift cards, loyalty, and eBill templates."
      links={[
        { label: "Marketing & campaigns", to: "/pos/crm", hint: "§8.1" },
        { label: "Customers", to: "/pos/crm", hint: "§8.2" },
        { label: "Feedback", to: "/pos/crm", hint: "§8.3" },
        { label: "Gift card", to: "/pos/crm", hint: "§8.4" },
        { label: "Retrod Loyalty", to: "/pos/crm", hint: "§8.5" },
        { label: "eBill templates", to: "/pos/crm", hint: "§8.6" },
      ]}
    />
  ),
});
