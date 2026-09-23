import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  Navigate,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { PosShell } from "@/components/layout/pos/PosShell";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppToaster } from "@/components/providers/AppToaster";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PosOutletProvider } from "@/context/PosOutletContext";
import { useAuth } from "@/hooks/useAuth";
import { applyTheme, readSavedTheme } from "@/app/theme/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This POS route does not exist.</p>
        <div className="mt-6">
          <Link
            to="/pos"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-pressed"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-pressed"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Retrod POS" },
      {
        name: "description",
        content: "Restaurant point of sale — dashboard, orders, menu, inventory, and more.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthGate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/login") return <Outlet />;

  // POS-only product: every screen uses PosShell
  return (
    <PosShell>
      <Outlet />
    </PosShell>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    applyTheme(readSavedTheme());
  }, []);

  return (
    <QueryProvider client={queryClient}>
      <AuthProvider>
        <PosOutletProvider>
          <AppToaster />
          <AuthGate />
        </PosOutletProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
