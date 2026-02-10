import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { a as cn } from "./router-deJypcsT.mjs";
import { T as TooltipProvider$1, i as TooltipRoot, j as TooltipPortal, k as TooltipPositioner, l as TooltipPopup, n as TooltipArrow, o as TooltipTrigger$1 } from "../_chunks/_libs/@base-ui/react.mjs";
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipProvider$1,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRoot, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger$1, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipPositioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TooltipPopup,
        {
          "data-slot": "tooltip-content",
          className: cn(
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-md px-3 py-1.5 text-xs data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin)",
            className
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipArrow, { className: "size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 bg-foreground fill-foreground z-50 data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}
export {
  Tooltip as T,
  TooltipContent as a,
  TooltipTrigger as b,
  TooltipProvider as c
};
