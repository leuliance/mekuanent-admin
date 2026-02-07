import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { type AdminUser } from "@/routes/__root";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <DashboardHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
