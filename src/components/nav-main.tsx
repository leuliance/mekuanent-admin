import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          // Instant active state using pathname (doesn't wait for loaders)
          // Exact match for /dashboard, fuzzy (startsWith) for everything else
          const isExact = item.url === "/dashboard"
          const isActive = isExact
            ? pathname === "/dashboard" || pathname === "/dashboard/"
            : pathname.startsWith(item.url)

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={!!isActive}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={!!isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={!!isActive}
                  />
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isSubActive = pathname === subItem.url || pathname === `${subItem.url}/`
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <Link to={subItem.url} className="w-full">
                          <SidebarMenuSubButton isActive={!!isSubActive}>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
