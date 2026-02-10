import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { a as cn } from "./router-deJypcsT.mjs";
import { l as Check } from "../_libs/lucide-react.mjs";
import { M as MenuRoot, p as MenuTrigger, q as MenuPortal, r as MenuPositioner, s as MenuPopup, t as MenuGroup, v as MenuGroupLabel, S as Separator, w as MenuItem, x as MenuCheckboxItem, y as MenuCheckboxItemIndicator } from "../_chunks/_libs/@base-ui/react.mjs";
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRoot, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuTrigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuPositioner,
    {
      className: "isolate z-50 outline-none",
      align,
      alignOffset,
      side,
      sideOffset,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuPopup,
        {
          "data-slot": "dropdown-menu-content",
          className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-32 rounded-md p-1 shadow-md ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden", className),
          ...props
        }
      )
    }
  ) });
}
function DropdownMenuGroup({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuGroupLabel,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn("text-muted-foreground px-2 py-1.5 text-xs font-medium data-inset:pl-8", className),
      ...props
    }
  );
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuItem,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-sm px-2 py-1.5 text-sm data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    MenuCheckboxItem,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      "data-inset": inset,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      checked,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute right-2 flex items-center justify-center pointer-events-none",
            "data-slot": "dropdown-menu-checkbox-item-indicator",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuCheckboxItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Check,
              {}
            ) })
          }
        ),
        children
      ]
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
export {
  DropdownMenu as D,
  DropdownMenuTrigger as a,
  DropdownMenuContent as b,
  DropdownMenuGroup as c,
  DropdownMenuLabel as d,
  DropdownMenuSeparator as e,
  DropdownMenuItem as f,
  DropdownMenuCheckboxItem as g
};
