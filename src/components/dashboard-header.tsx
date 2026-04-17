import { Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import React from "react";

// Map route segments to readable labels
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  churches: "Churches",
  users: "Users",
  content: "Content",
  events: "Events",
  donations: "Donations",
  settings: "Settings",
  payments: "Payments",
  categories: "Categories",
  notifications: "Notifications",
  bible: "Bible",
  features: "Feature Flags",
};

function generateBreadcrumbs(pathname: string) {
  // Remove the /_authenticated prefix since it's a layout route
  const segments = pathname
    .replace(/^\//, "")
    .split("/")
    .filter((s) => s && s !== "_authenticated");

  const crumbs: { label: string; href?: string }[] = [];

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    const label = SEGMENT_LABELS[segment] || decodeURIComponent(segment);

    if (i === segments.length - 1) {
      // Last segment = current page, no link
      crumbs.push({ label });
    } else {
      crumbs.push({ label, href: currentPath });
    }
  }

  return crumbs;
}

export function DashboardHeader() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const pathname = lastMatch?.pathname || "/dashboard";
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 min-w-0 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="-ml-1 shrink-0" />
      <Separator
        orientation="vertical"
        className="mr-2 hidden h-4 shrink-0 sm:block"
      />
      <Breadcrumb className="hidden min-w-0 flex-1 overflow-hidden xl:flex">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {/* md–lg: current page only (saves horizontal space next to locale/theme) */}
      <span className="hidden min-w-0 flex-1 truncate text-sm font-medium md:block xl:hidden">
        {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
      </span>
      {/* Mobile: show only current page name */}
      <span className="text-sm font-medium truncate md:hidden">
        {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
