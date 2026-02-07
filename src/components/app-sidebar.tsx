import { Link } from "@tanstack/react-router";
import {
  Church,
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Settings,
  Bell,
  BookOpen,
  CreditCard,
  Tags,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { AdminUser } from "@/routes/__root";

// Navigation items for admin
const getNavItems = (role: string) => {
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Churches",
      url: "/dashboard/churches",
      icon: Church,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Content",
      url: "/dashboard/content",
      icon: FileText,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Donations",
      url: "/dashboard/donations",
      icon: DollarSign,
    },
    {
      title: "Bible Content",
      url: "/dashboard/bible",
      icon: BookOpen,
    },
  ];

  // Add super admin only items
  if (role === "super_admin") {
    items.push(
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
        icon: CreditCard,
      },
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Tags,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    );
  }

  return items;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AdminUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navItems = getNavItems(user.role);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 text-white">
                <Church className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Mekuanent</span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin",
            email: user.email || "",
            avatar: user.avatar_url || "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
