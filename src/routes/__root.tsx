import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	ScriptOnce,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

// Re-exported so existing `import { AdminUser } from "@/routes/__root"` keeps working.
export type { AdminUser } from "@/lib/admin-user";

// Server function to get the authenticated admin user from the verified JWT claims.
const getAdminUser = createServerFn({ method: "GET" }).handler(async () => {
	const { getSupabaseServerClient } = await import("@/lib/supabase/server");
	const { buildAdminUser } = await import("@/lib/admin-user");
	const supabase = getSupabaseServerClient();
	return await buildAdminUser(supabase);
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
			<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
		</div>
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
