import { createFileRoute, Navigate } from "@tanstack/react-router";

/** Root redirects into the POS app (SRS dashboard). */
export const Route = createFileRoute("/")({
  component: () => <Navigate to="/pos" />,
});
