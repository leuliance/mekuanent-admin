import {
  HeadContent,
  Outlet,
  Scripts,
  ScriptOnce,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import type { Database } from "@/types/database.types";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
// Admin user type
export interface AdminUser {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: Database["public"]["Enums"]["user_role"];
  church_id: string | null;
}

// Server function to get authenticated admin user
const getAdminUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = getSupabaseServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Check if user has super_admin or admin role
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select("role, church_id")
    .eq("user_id", user.id)
    .in("role", ["super_admin", "admin"]);

  if (!userRoles || userRoles.length === 0) {
    return null;
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: profile?.email || user.email || null,
    first_name: profile?.first_name || null,
    last_name: profile?.last_name || null,
    avatar_url: profile?.avatar_url || null,
    role: userRoles[0].role,
    church_id: userRoles[0].church_id,
  } as AdminUser;
});

export interface MyRouterContext {
  queryClient: QueryClient;
  user: Awaited<ReturnType<typeof getAdminUser>>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    // Invalidate the user query to ensure fresh data
    await context.queryClient.invalidateQueries({ queryKey: ["admin-user"] });

    const user = await context.queryClient.fetchQuery({
      queryKey: ["admin-user"],
      queryFn: ({ signal }) => getAdminUser({ signal }),
      staleTime: 0,
    });

    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Mekuanent Admin",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
  pendingComponent: () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-slate-400">Page not found</p>
      </div>
    </div>
  ),
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
          )`}
        </ScriptOnce>
        <ThemeProvider>
        <Toaster />
        <Outlet />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
