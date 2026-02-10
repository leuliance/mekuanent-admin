import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { a as cn } from "./router-deJypcsT.mjs";
import { $ as ChevronDown, l as Check, a0 as ChevronUp } from "../_libs/lucide-react.mjs";
import { z as SelectRoot, A as SelectTrigger$1, E as SelectIcon, F as SelectValue$1, G as SelectPortal, H as SelectPositioner, J as SelectPopup, K as SelectList, L as SelectItem$1, N as SelectItemText, O as SelectItemIndicator, P as SelectScrollUpArrow, Q as SelectScrollDownArrow } from "../_chunks/_libs/@base-ui/react.mjs";
const Select = SelectRoot;
function SelectValue({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectValue$1,
    {
      "data-slot": "select-value",
      className: cn("flex flex-1 text-left", className),
      ...props
    }
  );
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectTrigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-md border bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectIcon,
          {
            render: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "text-muted-foreground size-4 pointer-events-none" })
          }
        )
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectPositioner,
    {
      side,
      sideOffset,
      align,
      alignOffset,
      alignItemWithTrigger,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SelectPopup,
        {
          "data-slot": "select-content",
          "data-align-trigger": alignItemWithTrigger,
          className: cn("bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-md shadow-md ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", className),
          ...props,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectList, { children }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
          ]
        }
      )
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectItem$1,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { className: "flex flex-1 gap-2 shrink-0 whitespace-nowrap", children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectItemIndicator,
          {
            render: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "pointer-events-none" })
          }
        )
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollUpArrow,
    {
      "data-slot": "select-scroll-up-button",
      className: cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full", className),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ChevronUp,
        {}
      )
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollDownArrow,
    {
      "data-slot": "select-scroll-down-button",
      className: cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full", className),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ChevronDown,
        {}
      )
    }
  );
}
export {
  Select as S,
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d
};
