import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { a as cn } from "./router-deJypcsT.mjs";
import { R as Root, I as Image, F as Fallback } from "../_chunks/_libs/@radix-ui/react-avatar.mjs";
function Avatar({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "avatar",
      "data-size": size,
      className: cn(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
        className
      ),
      ...props
    }
  );
}
export {
  Avatar as A,
  AvatarImage as a,
  AvatarFallback as b
};
