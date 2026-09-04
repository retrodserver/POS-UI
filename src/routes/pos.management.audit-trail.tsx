import { createFileRoute } from "@tanstack/react-router";
import { AuditTrailView } from "@/components/shared/pos/management/views/audit/AuditTrailView";

export const Route = createFileRoute("/pos/management/audit-trail")({
  head: () => ({ meta: [{ title: "Audit Trail — Retrod POS" }] }),
  component: AuditTrailView,
});
