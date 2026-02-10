import { j as jsxRuntimeExports, r as reactExports, a as React } from "../_chunks/_libs/react.mjs";
import { O as Outlet, L as Link, f as useMatches, g as useLocation, e as useNavigate } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { R as Route$l, a as cn, u as useTheme, c as createSsrRpc } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { T as Tooltip, a as TooltipContent, b as TooltipTrigger } from "./tooltip-BpKl2fwd.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuGroup, d as DropdownMenuLabel, e as DropdownMenuSeparator, f as DropdownMenuItem, g as DropdownMenuCheckboxItem } from "./dropdown-menu-C2-xvfpV.mjs";
import { c as createServerFn } from "./index.mjs";
import { u as useLocaleStore, L as LOCALES } from "./locale-store-Cb3Cdr7y.mjs";
import { a as Church, b as LayoutDashboard, U as Users, F as FileText, c as Calendar, D as DollarSign, B as BookOpen, d as Bell, e as CreditCard, f as Tags, S as Settings, g as ChevronRight, h as ChevronsUpDown, i as BadgeCheck, j as LogOut, P as PanelLeft, k as Languages, l as Check, m as Sun, M as Moon, X } from "../_libs/lucide-react.mjs";
import { u as useRender, m as mergeProps, S as Separator$1, D as DialogRoot, a as DialogPopup, b as DialogClose, c as DialogTitle, d as DialogDescription, C as CollapsibleRoot, e as CollapsibleTrigger$1, f as CollapsiblePanel, g as DialogPortal, h as DialogBackdrop } from "../_chunks/_libs/@base-ui/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/react-query.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tailwind-merge.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_chunks/_libs/@radix-ui/react-avatar.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-use-is-hydrated.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/zustand.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
function Collapsible({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleRoot, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger$1, { "data-slot": "collapsible-trigger", ...props });
}
function CollapsibleContent({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsiblePanel, { "data-slot": "collapsible-content", ...props });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = reactExports.useState(void 0);
  reactExports.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator$1,
    {
      "data-slot": "separator",
      orientation,
      className: cn(
        "bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, { "data-slot": "sheet", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogBackdrop,
    {
      "data-slot": "sheet-overlay",
      className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50", className),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogPopup,
      {
        "data-slot": "sheet-content",
        "data-side": side,
        className: cn("bg-background data-open:animate-in data-closed:animate-out data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10 fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogClose,
            {
              "data-slot": "sheet-close",
              render: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  className: "absolute top-4 right-4",
                  size: "icon-sm"
                }
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {}
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("gap-1.5 p-4 flex flex-col", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-medium", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = reactExports.createContext(null);
function useSidebar() {
  const context = reactExports.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = reactExports.useState(false);
  const [_open, _setOpen] = reactExports.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = reactExports.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = reactExports.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  reactExports.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = reactExports.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SheetContent,
      {
        dir,
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            "data-side": side,
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:ring-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 flex size-full flex-col",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon-sm",
      className: cn(className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeft, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 relative flex w-full flex-1 flex-col",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("gap-2 p-2 flex flex-col", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("gap-2 p-2 flex flex-col", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "no-scrollbar gap-2 flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn(
        "p-2 relative flex w-full min-w-0 flex-col",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps(
      {
        className: cn(
          "text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0",
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-label",
      sidebar: "group-label"
    }
  });
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("gap-1 flex w-full min-w-0 flex-col", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const { isMobile, state } = useSidebar();
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className)
      },
      props
    ),
    render: !tooltip ? render : TooltipTrigger,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive
    }
  });
  if (!tooltip) {
    return comp;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
    comp,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
function SidebarMenuSub({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-sub",
      className: cn("border-sidebar-border mx-3.5 translate-x-px gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden flex min-w-0 flex-col", className),
      ...props
    }
  );
}
function SidebarMenuSubItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      className: cn("group/menu-sub-item relative", className),
      ...props
    }
  );
}
function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      {
        className: cn(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4 flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0",
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive
    }
  });
}
function NavMain({
  items
}) {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarGroup, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupLabel, { children: "Platform" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: items.map((item) => {
      const hasSubItems = item.items && item.items.length > 0;
      const isExact = item.url === "/dashboard";
      const isActive = isExact ? pathname === "/dashboard" || pathname === "/dashboard/" : pathname.startsWith(item.url);
      if (!hasSubItems) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.url, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SidebarMenuButton,
          {
            tooltip: item.title,
            isActive: !!isActive,
            children: [
              item.icon && /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.title })
            ]
          }
        ) }) }, item.title);
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Collapsible,
        {
          defaultOpen: !!isActive,
          className: "group/collapsible",
          render: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, {}),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              CollapsibleTrigger,
              {
                render: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SidebarMenuButton,
                  {
                    tooltip: item.title,
                    isActive: !!isActive
                  }
                ),
                children: [
                  item.icon && /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuSub, { children: item.items?.map((subItem) => {
              const isSubActive = pathname === subItem.url || pathname === `${subItem.url}/`;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: subItem.url, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuSubButton, { isActive: !!isSubActive, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: subItem.title }) }) }) }, subItem.title);
            }) }) })
          ]
        },
        item.title
      );
    }) })
  ] });
}
const loginSchema = object({
  email: string().email(),
  password: string().min(1)
});
createServerFn({
  method: "POST"
}).inputValidator(loginSchema).handler(createSsrRpc("a22835464017e84bbc79f0ddf69d6f8b2b781ca158c0781a6ff7a205d55e5c7d"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("4eb0c01dba3360c4fb5fd4f9944fc0e51c41e541a851f7619eeb8d9eaf05c49e"));
const logout = createServerFn({
  method: "POST"
}).handler(createSsrRpc("09ce32683f41a7f1c6b569399c6bd0f1e9aeafb53cd69b043bd4aac5b7d62831"));
function NavUser({
  user
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "AD";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DropdownMenuTrigger,
      {
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SidebarMenuButton,
          {
            size: "lg",
            className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8 rounded-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar, alt: user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 text-white", children: getInitials(user.name) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs text-muted-foreground", children: user.email })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-auto size-4" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DropdownMenuContent,
      {
        className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
        side: isMobile ? "bottom" : "right",
        align: "end",
        sideOffset: 4,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar, alt: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 text-white", children: getInitials(user.name) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs text-muted-foreground", children: user.email })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "mr-2 h-4 w-4" }),
              "Profile"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-4 w-4" }),
              "Settings"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: handleLogout,
              className: "text-red-600 focus:text-red-600 dark:text-red-400",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                "Log out"
              ]
            }
          ) })
        ]
      }
    )
  ] }) }) });
}
const getNavItems = (role) => {
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Churches",
      url: "/dashboard/churches",
      icon: Church
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users
    },
    {
      title: "Content",
      url: "/dashboard/content",
      icon: FileText
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar
    },
    {
      title: "Donations",
      url: "/dashboard/donations",
      icon: DollarSign
    },
    {
      title: "Bible Content",
      url: "/dashboard/bible",
      icon: BookOpen
    }
  ];
  if (role === "super_admin") {
    items.push(
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
        icon: CreditCard
      },
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Tags
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings
      }
    );
  }
  return items;
};
function AppSidebar({ user, ...props }) {
  const navItems = getNavItems(user.role);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { collapsible: "icon", ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarMenuButton, { size: "lg", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard" }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold", children: "Mekuanent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs text-muted-foreground", children: "Admin Portal" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NavMain, { items: navItems }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      NavUser,
      {
        user: {
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin",
          email: user.email || "",
          avatar: user.avatar_url || ""
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarRail, {})
  ] });
}
function Breadcrumb({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      "aria-label": "breadcrumb",
      "data-slot": "breadcrumb",
      className: cn(className),
      ...props
    }
  );
}
function BreadcrumbList({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "text-muted-foreground gap-1.5 text-sm sm:gap-2.5 flex flex-wrap items-center wrap-break-word",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("gap-1.5 inline-flex items-center", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  className,
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      {
        className: cn("hover:text-foreground transition-colors", className)
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link"
    }
  });
}
function BreadcrumbPage({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("text-foreground font-normal", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, {})
    }
  );
}
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuTrigger, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon" }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle theme" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DropdownMenuCheckboxItem,
        {
          checked: theme === "light",
          onCheckedChange: (v) => v && setTheme("light"),
          children: "Light"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DropdownMenuCheckboxItem,
        {
          checked: theme === "dark",
          onCheckedChange: (v) => v && setTheme("dark"),
          children: "Dark"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DropdownMenuCheckboxItem,
        {
          checked: theme === "system",
          onCheckedChange: (v) => v && setTheme("system"),
          children: "System"
        }
      )
    ] })
  ] });
}
function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const current = LOCALES.find((l) => l.value === locale);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DropdownMenuTrigger,
      {
        render: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "gap-1.5 text-xs font-semibold"
          }
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-4 w-4" }),
          current?.value.toUpperCase() || "EN"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, { align: "end", children: LOCALES.map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      DropdownMenuItem,
      {
        onClick: () => setLocale(loc.value),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium w-6", children: loc.value.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs flex-1", children: loc.nativeLabel }),
          locale === loc.value && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-primary" })
        ] })
      },
      loc.value
    )) })
  ] });
}
const SEGMENT_LABELS = {
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
  features: "Feature Flags"
};
function generateBreadcrumbs(pathname) {
  const segments = pathname.replace(/^\//, "").split("/").filter((s) => s && s !== "_authenticated");
  const crumbs = [];
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    const label = SEGMENT_LABELS[segment] || decodeURIComponent(segment);
    if (i === segments.length - 1) {
      crumbs.push({ label });
    } else {
      crumbs.push({ label, href: currentPath });
    }
  }
  return crumbs;
}
function DashboardHeader() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const pathname = lastMatch?.pathname || "/dashboard";
  const breadcrumbs = generateBreadcrumbs(pathname);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, { className: "-ml-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "mr-2 h-4 hidden sm:block" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, { className: "hidden sm:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbList, { children: breadcrumbs.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbItem, { children: item.href ? /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbLink, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.href, children: item.label }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbPage, { children: item.label }) }),
      index < breadcrumbs.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbSeparator, {})
    ] }, `${item.label}-${index}`)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden text-sm font-medium truncate", children: breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleSwitcher, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitcher, {})
    ] })
  ] });
}
function AuthenticatedLayout() {
  const {
    user
  } = Route$l.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, { user }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
    ] })
  ] });
}
export {
  AuthenticatedLayout as component
};
