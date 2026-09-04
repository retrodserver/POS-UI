import { createFileRoute } from "@tanstack/react-router";
import { LoginPageFeature } from "@/features/auth/components/LoginPageFeature";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Retrod POS" }] }),
  component: LoginPageFeature,
});
