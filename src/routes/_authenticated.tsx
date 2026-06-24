import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "@/components/ui/sidebar";
import type { AdminUser } from "@/routes/__root";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		// User is fetched in root route, check if authenticated
		if (!context.user) {
			throw redirect({ to: "/login" });
		}
		return { user: context.user };
	},
	loader: async ({ context }) => {
		return { user: context.user as AdminUser };
	},
	// Full-screen branded loader (on the themed background) so the transition from
	// login -> dashboard never flashes a blank white page.
	pendingComponent: () => (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	),
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { user } = Route.useLoaderData();

	return (
		<SidebarProvider>
			<AuthenticatedShell user={user} />
		</SidebarProvider>
	);
}

/** Collapse icon rail on tablet / small laptop so the header has room for controls. */
function AuthenticatedShell({ user }: { user: AdminUser }) {
	const { setOpen, isMobile } = useSidebar();

	useEffect(() => {
		if (isMobile) return;
		const mq = window.matchMedia("(min-width: 768px) and (max-width: 1279px)");
		if (mq.matches) setOpen(false);
	}, [isMobile, setOpen]);

	return (
		<>
			<AppSidebar user={user} />
			<SidebarInset>
				<DashboardHeader />
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<Outlet />
				</div>
			</SidebarInset>
		</>
	);
}
