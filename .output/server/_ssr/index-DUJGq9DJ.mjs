import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { w as CircleAlert, ag as ArrowLeft } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./router-deJypcsT.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/react-query.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_libs/sonner.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
function UserDetailError({
  error
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 text-destructive" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: "Failed to Load User" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: error.message || "An unexpected error occurred." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/users", search: {
        page: 1,
        search: void 0
      } }), nativeButton: false, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        "Back to Users"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => window.location.reload(), children: "Try Again" })
    ] })
  ] }) }) });
}
export {
  UserDetailError as errorComponent
};
