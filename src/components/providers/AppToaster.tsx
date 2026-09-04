import type { ComponentProps } from "react";
import { Toaster } from "@/components/ui/sonner";

export function AppToaster(props: ComponentProps<typeof Toaster>) {
  return <Toaster richColors {...props} />;
}
