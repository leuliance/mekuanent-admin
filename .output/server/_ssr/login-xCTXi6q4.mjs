import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { c as createSsrRpc } from "./router-deJypcsT.mjs";
import { u as useRouter, e as useNavigate } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useForm } from "../_chunks/_libs/@tanstack/react-form.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { c as createServerFn } from "./index.mjs";
import { a as Church, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as object, s as string, e as email } from "../_libs/zod.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/react-query.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "../_libs/sonner.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_chunks/_libs/@tanstack/form-core.mjs";
import "../_chunks/_libs/@tanstack/store.mjs";
import "../_chunks/_libs/@tanstack/pacer-lite.mjs";
import "../_chunks/_libs/@tanstack/devtools-event-client.mjs";
import "../_chunks/_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
const loginSchema = object({
  email: email("Please enter a valid email address"),
  password: string().min(6, "Password must be at least 6 characters")
});
const loginInputSchema = object({
  email: email(),
  password: string().min(1)
});
const loginAdmin = createServerFn({
  method: "POST"
}).inputValidator((data) => loginInputSchema.parse(data)).handler(createSsrRpc("5909636ce7d90039623b5f81fb83e3c99d4b48e120873e19a0a0926f321e6c78"));
function LoginPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const [error, setError] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onChange: loginSchema
    },
    onSubmit: async ({
      value
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        await loginAdmin({
          data: value
        });
        await router.invalidate();
        await navigate({
          to: "/dashboard"
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
      } finally {
        setIsLoading(false);
      }
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Mekuanent Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mt-2", children: "Sign in to manage your church platform" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm text-center", children: error }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "email", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-slate-300", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "admin@example.com", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur, className: "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500" }),
          field.state.meta.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: typeof field.state.meta.errors[0] === "string" ? field.state.meta.errors[0] : field.state.meta.errors[0]?.message })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "password", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-slate-300", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", placeholder: "Enter your password", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur, className: "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500" }),
          field.state.meta.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: typeof field.state.meta.errors[0] === "string" ? field.state.meta.errors[0] : field.state.meta.errors[0]?.message })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, className: "w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Signing in..."
        ] }) : "Sign In" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-slate-500 text-sm mt-6", children: "Mekuanent Church Management Platform" })
  ] }) });
}
export {
  LoginPage as component
};
