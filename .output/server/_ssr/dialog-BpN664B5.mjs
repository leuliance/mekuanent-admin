import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { a as cn } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { X } from "../_libs/lucide-react.mjs";
import { D as DialogRoot, a as DialogPopup, b as DialogClose, c as DialogTitle$1, d as DialogDescription$1, g as DialogPortal$1, h as DialogBackdrop } from "../_chunks/_libs/@base-ui/react.mjs";
function Dialog({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, { "data-slot": "dialog", ...props });
}
function DialogPortal({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal$1, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogBackdrop,
    {
      "data-slot": "dialog-overlay",
      className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50", className),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogPopup,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-6 rounded-xl p-6 text-sm ring-1 duration-100 sm:max-w-md fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogClose,
            {
              "data-slot": "dialog-close",
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
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("gap-2 flex flex-col", className),
      ...props
    }
  );
}
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline" }), children: "Close" })
      ]
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle$1,
    {
      "data-slot": "dialog-title",
      className: cn("leading-none font-medium", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription$1,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3", className),
      ...props
    }
  );
}
export {
  Dialog as D,
  DialogContent as a,
  DialogHeader as b,
  DialogTitle as c,
  DialogDescription as d,
  DialogFooter as e
};
