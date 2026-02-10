import { E as redirect } from "../_chunks/_libs/@tanstack/router-core.mjs";
import { c as createRouter, a as createRootRouteWithContext, H as HeadContent, S as ScriptOnce, O as Outlet, b as Scripts, d as createFileRoute, l as lazyRouteComponent } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { s as setupRouterSsrQueryIntegration } from "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_chunks/_libs/react.mjs";
import { b as QueryClient } from "../_chunks/_libs/@tanstack/query-core.mjs";
import { q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { L as LoaderCircle, O as OctagonX, T as TriangleAlert, I as Info, C as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as object, s as string, n as number, _ as _enum, b as boolean, r as record, u as unknown, a as array } from "../_libs/zod.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
function getContext() {
  const queryClient = new QueryClient();
  return {
    queryClient
  };
}
const createSsrRpc = (functionId, importer) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const appCss = "/assets/styles-GgvS93Dv.css";
const MEDIA = "(prefers-color-scheme: dark)";
const initialState = {
  theme: "system",
  setTheme: () => null
};
const ThemeProviderContext = reactExports.createContext(initialState);
function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}) {
  const [theme, setTheme] = reactExports.useState(
    () => (typeof window !== "undefined" ? localStorage.getItem(storageKey) : null) || defaultTheme
  );
  const handleMediaQuery = reactExports.useCallback(
    (e) => {
      if (theme !== "system") return;
      const root = window.document.documentElement;
      const targetTheme = e.matches ? "dark" : "light";
      if (!root.classList.contains(targetTheme)) {
        root.classList.remove("light", "dark");
        root.classList.add(targetTheme);
      }
    },
    [theme]
  );
  reactExports.useEffect(() => {
    const media = window.matchMedia(MEDIA);
    media.addEventListener("change", handleMediaQuery);
    handleMediaQuery(media);
    return () => media.removeEventListener("change", handleMediaQuery);
  }, [handleMediaQuery]);
  reactExports.useEffect(() => {
    const root = window.document.documentElement;
    let targetTheme;
    if (theme === "system") {
      localStorage.removeItem(storageKey);
      targetTheme = window.matchMedia(MEDIA).matches ? "dark" : "light";
    } else {
      localStorage.setItem(storageKey, theme);
      targetTheme = theme;
    }
    if (!root.classList.contains(targetTheme)) {
      root.classList.remove("light", "dark");
      root.classList.add(targetTheme);
    }
  }, [theme, storageKey]);
  const value = reactExports.useMemo(
    () => ({
      theme,
      setTheme
    }),
    [theme]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProviderContext, { ...props, value, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScriptOnce, { children: `document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )` }),
    children
  ] });
}
const useTheme = () => {
  const context = reactExports.use(ThemeProviderContext);
  if (context === void 0)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
        info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4" }),
        warning: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
        error: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonX, { className: "size-4" }),
        loading: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      toastOptions: {
        classNames: {
          toast: "cn-toast"
        }
      },
      ...props
    }
  );
};
const getAdminUser = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1dc60576230e5b3f3ae1e63f06a1ef85f0255b45b98a675f3dc802641b3397f9"));
const Route$n = createRootRouteWithContext()({
  beforeLoad: async ({
    context
  }) => {
    await context.queryClient.invalidateQueries({
      queryKey: ["admin-user"]
    });
    const user = await context.queryClient.fetchQuery({
      queryKey: ["admin-user"],
      queryFn: ({
        signal
      }) => getAdminUser({
        signal
      }),
      staleTime: 0
    });
    return {
      user
    };
  },
  head: () => ({
    meta: [{
      charSet: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, {
      title: "Mekuanent Admin"
    }],
    links: [{
      rel: "stylesheet",
      href: appCss
    }]
  }),
  component: RootDocument,
  pendingComponent: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" }),
  notFoundComponent: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-white mb-4", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "Page not found" })
  ] }) })
});
function RootDocument() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { suppressHydrationWarning: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScriptOnce, { children: `document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
          )` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$m = () => import("./login-xCTXi6q4.mjs");
const Route$m = createFileRoute("/login")({
  beforeLoad: async ({
    context
  }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./_authenticated-C9oCqGz4.mjs");
const Route$l = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    context
  }) => {
    if (!context.user) {
      throw redirect({
        to: "/login"
      });
    }
    return {
      user: context.user
    };
  },
  loader: async ({
    context
  }) => {
    return {
      user: context.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./index-BTU5dmpx.mjs");
const Route$k = createFileRoute("/")({
  beforeLoad: async ({
    context
  }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard"
      });
    }
    throw redirect({
      to: "/login"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const getDashboardStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("007a21bb7589e150891997b50aac3dd707bc489310036957f976351564b60607"));
const getRecentActivities = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("504bf72cda5df332f8a2a841b2798be3bc4c47891ababacd361bdf5bfbabb23f"));
const $$splitComponentImporter$j = () => import("./index-Dbk8PbBI.mjs");
const Route$j = createFileRoute("/_authenticated/dashboard/")({
  loader: async () => {
    const [stats, activities] = await Promise.all([getDashboardStats(), getRecentActivities({
      data: {
        limit: 5
      }
    })]);
    return {
      stats,
      activities
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const getUsersSchema = object({
  page: number().optional(),
  limit: number().optional(),
  search: string().optional(),
  role: _enum(["super_admin", "admin", "church_admin", "content_admin", "content_creator", "user"]).optional()
});
const getUserSchema = object({
  id: string()
});
const assignUserRoleSchema = object({
  user_id: string(),
  role: _enum(["super_admin", "admin", "church_admin", "content_admin", "content_creator", "user"]),
  church_id: string().optional(),
  assigned_by: string()
});
const removeUserRoleSchema = object({
  role_id: string()
});
const getUsers = createServerFn({
  method: "GET"
}).inputValidator(getUsersSchema).handler(createSsrRpc("3a1692bea565954feff4245e4fbb84a80a972be31b2b0a2bc6be860e6db5aa00"));
const getUser = createServerFn({
  method: "GET"
}).inputValidator(getUserSchema).handler(createSsrRpc("0ad622c84a88f4110451a2b7dfc786d1dbc78244d8854a27d923e800f4440579"));
const assignUserRole = createServerFn({
  method: "POST"
}).inputValidator(assignUserRoleSchema).handler(createSsrRpc("cdccb35a387e2259c74eeb509397a96ca1d0ded037d5c2571889cfe74fd31439"));
const removeUserRole = createServerFn({
  method: "POST"
}).inputValidator(removeUserRoleSchema).handler(createSsrRpc("b01dd809b803a14f4618f0ec43822986aca0825acdfe46f68a1511817907d0a4"));
const updateUserStatusSchema = object({
  user_id: string(),
  status: _enum(["active", "inactive", "suspended", "banned"]),
  reason: string().optional(),
  changed_by: string()
});
const updateUserStatus = createServerFn({
  method: "POST"
}).inputValidator(updateUserStatusSchema).handler(createSsrRpc("11b7c8172a60af17a88c77f4d7a180ccc723cace74aa30f0cd2bb2406e9fac6d"));
const getUserStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("34bdd4ffa68af3eb1f9633399fd568aa5aa8f0e21e376a1042493aae0170cd4d"));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-muted rounded-md animate-pulse", className),
      ...props
    }
  );
}
const $$splitComponentImporter$i = () => import("./index-Co4kOUSR.mjs");
const $$splitErrorComponentImporter$f = () => import("./index-Bmn-5iov.mjs");
const usersQueryOptions = (params) => queryOptions({
  queryKey: ["users", params],
  queryFn: () => getUsers({
    data: {
      page: params.page,
      limit: 10,
      role: params.role,
      search: params.search || ""
    }
  })
});
const userStatsQueryOptions = () => queryOptions({
  queryKey: ["user-stats"],
  queryFn: () => getUserStats()
});
const Route$i = createFileRoute("/_authenticated/dashboard/users/")({
  validateSearch: (search) => ({
    role: search.role ? search.role : void 0,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(usersQueryOptions({
      page: deps.page,
      role: deps.role,
      search: deps.search
    })), context.queryClient.ensureQueryData(userStatsQueryOptions())]);
  },
  pendingComponent: UsersLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$f, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
function UsersLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full max-w-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", children: Array.from({
      length: 5
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8" })
    ] }, i)) }) })
  ] }) }) });
}
const getFeatureFlagsSchema = object({
  scope: _enum(["global", "church"]).optional()
});
const updateFeatureFlagSchema = object({
  id: string(),
  is_enabled: boolean()
});
const createFeatureFlagSchema = object({
  key: string().min(1),
  name: record(string(), string()),
  description: record(string(), string()).optional(),
  is_enabled: boolean(),
  scope: _enum(["global", "church"]),
  created_by: string()
});
const deleteFeatureFlagSchema = object({
  id: string()
});
const getFeatureFlags = createServerFn({
  method: "GET"
}).inputValidator(getFeatureFlagsSchema).handler(createSsrRpc("5cd8ef9e2af59efd9e64c5a5791c9e2115d7036e53e9996a1a86f034523fc64b"));
const updateFeatureFlag = createServerFn({
  method: "POST"
}).inputValidator(updateFeatureFlagSchema).handler(createSsrRpc("aa05a7d234f5890a0b5ec2cc5ddd5fe87c5e362581fa5abc42f146c5d6772ad0"));
const createFeatureFlag = createServerFn({
  method: "POST"
}).inputValidator(createFeatureFlagSchema).handler(createSsrRpc("51c9c5ea9f760e728623d5a691f8c485732b334922f83b840cc70435708aefa0"));
const deleteFeatureFlag = createServerFn({
  method: "POST"
}).inputValidator(deleteFeatureFlagSchema).handler(createSsrRpc("b534ce809bf5c4b82fa425f81c3fe5f5534926ff0fd2eaa7e77b196273b1de37"));
const getPaymentGateways = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ec939cbd3e160bdf7aec76103177d8737a89799090351166e5aaa2072caf7159"));
const updatePaymentGatewaySchema = object({
  id: string(),
  display_name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  is_active: boolean().optional(),
  test_mode: boolean().optional(),
  api_key: string().optional().nullable(),
  webhook_secret: string().optional().nullable(),
  config: record(string(), unknown()).optional().nullable()
});
const updatePaymentGateway = createServerFn({
  method: "POST"
}).inputValidator(updatePaymentGatewaySchema).handler(createSsrRpc("fa3fb6a3349c85c4cacc5dbeb4d6d1bbb83f217b7d9f7e62cd3f942aae3f4384"));
const createPaymentGatewaySchema = object({
  name: string().min(1),
  slug: string().min(1),
  display_name: record(string(), string()),
  description: record(string(), string()).optional(),
  icon_url: string().optional().nullable(),
  color: string().optional().nullable(),
  is_active: boolean(),
  test_mode: boolean()
});
createServerFn({
  method: "POST"
}).inputValidator(createPaymentGatewaySchema).handler(createSsrRpc("8356125b7a64d1a2d7f23de7aac4fd57785ffb2de4b02d4489c1120a34e468c4"));
const deletePaymentGatewaySchema = object({
  id: string()
});
const deletePaymentGateway = createServerFn({
  method: "POST"
}).inputValidator(deletePaymentGatewaySchema).handler(createSsrRpc("b8ce51d5ed4746ab6a759ad845c4300ce9c2b9418989b238a5915354ea5a7f88"));
const getAppOverviewStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7a89bab8f14fb6d097ad0cc189d5873f872e2494cf0845e4361c2c9c3cb5d18a"));
const getProfile = createServerFn({
  method: "GET"
}).handler(createSsrRpc("596094f5439992d50f4193961481bc9e7def6ccb0e992bd4640854896f0f1bde"));
const updateProfileSchema = object({
  first_name: string().optional().nullable(),
  last_name: string().optional().nullable(),
  email: string().optional().nullable(),
  phone_number: string().optional().nullable(),
  bio: string().optional().nullable(),
  city: string().optional().nullable(),
  country: string().optional().nullable(),
  date_of_birth: string().optional().nullable(),
  gender: string().optional().nullable(),
  language_preference: string().optional().nullable()
});
const updateProfile = createServerFn({
  method: "POST"
}).inputValidator(updateProfileSchema).handler(createSsrRpc("8ba5aafb7d36e01beda344c72a9b902260ffcf2de00c58697e537d663ca5e3bb"));
const changePasswordSchema = object({
  newPassword: string().min(6)
});
const changePassword = createServerFn({
  method: "POST"
}).inputValidator(changePasswordSchema).handler(createSsrRpc("cf9385d1cf921b35f39a11ebe470cc0ef2e4fa92cbea0b38db20a0421631023d"));
const $$splitComponentImporter$h = () => import("./index-qpoMXQV5.mjs");
const $$splitErrorComponentImporter$e = () => import("./index-CWyAYoBV.mjs");
const Route$h = createFileRoute("/_authenticated/dashboard/settings/")({
  validateSearch: (search) => ({
    tab: search.tab || "profile"
  }),
  loader: async () => {
    const [flags, gateways, stats, profile] = await Promise.all([getFeatureFlags({
      data: {}
    }), getPaymentGateways(), getAppOverviewStats(), getProfile()]);
    return {
      flags,
      gateways,
      stats,
      profile
    };
  },
  pendingComponent: SettingsLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$e, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
function SettingsLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4", children: Array.from({
      length: 5
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 rounded-xl" })
  ] }) }) });
}
const getPaymentsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["pending", "completed", "failed", "refunded"]).optional(),
  search: string().optional()
});
const getPayments = createServerFn({
  method: "GET"
}).inputValidator(getPaymentsSchema).handler(createSsrRpc("9f0fa00ed9c962a8a7689ffd8089f801453e3343dd40bdb8cb06d5aa4151cf43"));
const getPaymentStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("05fdee696d535b20c2aac7cbf621ef7f3481efecd91a09553f3924c8de0523a0"));
const $$splitComponentImporter$g = () => import("./index-5x5ahlHe.mjs");
const $$splitErrorComponentImporter$d = () => import("./index-D9hD23t0.mjs");
const paymentsQueryOptions = (params) => queryOptions({
  queryKey: ["payments", params],
  queryFn: () => getPayments({
    data: {
      page: params.page,
      limit: 20,
      status: params.status,
      search: params.search
    }
  })
});
const paymentStatsQueryOptions = () => queryOptions({
  queryKey: ["payment-stats"],
  queryFn: () => getPaymentStats()
});
const Route$g = createFileRoute("/_authenticated/dashboard/payments/")({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    status: search.status ? String(search.status) : void 0,
    search: search.search ? String(search.search) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(paymentsQueryOptions({
      page: deps.page,
      status: deps.status,
      search: deps.search
    })), context.queryClient.ensureQueryData(paymentStatsQueryOptions())]);
  },
  pendingComponent: PaymentsLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$d, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
function PaymentsLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 rounded-xl" })
  ] }) }) });
}
const getNotificationsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  type: string().optional()
});
const getNotifications = createServerFn({
  method: "GET"
}).inputValidator(getNotificationsSchema).handler(createSsrRpc("b50907fadc152289c50b1e0f194a4b2990ed09d09b402d8a1435cd6f50fe392e"));
const sendNotificationSchema = object({
  title: record(string(), string()),
  body: record(string(), string()),
  type: _enum(["verse_of_day", "new_content", "event_reminder", "event_update", "donation_received", "role_invitation", "content_approved", "content_rejected", "room_started", "donation_campaign_update", "prayer_request", "church_announcement", "system_message", "achievement"]),
  data: record(string(), unknown()).optional().nullable(),
  // If user_ids provided, send to specific users. Otherwise broadcast to all.
  user_ids: array(string()).optional(),
  sent_by: string().optional()
});
const sendNotification = createServerFn({
  method: "POST"
}).inputValidator(sendNotificationSchema).handler(createSsrRpc("67b57209bafbfb9e7cace316e5dd2691ee5e7d4f86b8a9c112884482022a7c02"));
const searchUsersSchema = object({
  query: string().min(1)
});
const searchUsersForNotification = createServerFn({
  method: "GET"
}).inputValidator(searchUsersSchema).handler(createSsrRpc("3da8679799672c76a0eead857d967f8d412f1b0c4b7635bdf9b047ac9de6f60c"));
const deleteNotificationSchema = object({
  id: string()
});
const deleteNotification = createServerFn({
  method: "POST"
}).inputValidator(deleteNotificationSchema).handler(createSsrRpc("a19c724e2042280bfea76308cfd0b69677ec14876cd3fcdd59260f3bc77cff26"));
const getNotificationStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("153b734f98cdf66f05757b2393e89cb114a74c06da6c22027bcf4bbbb9b1309a"));
const $$splitComponentImporter$f = () => import("./index-LZPcfg7J.mjs");
const $$splitErrorComponentImporter$c = () => import("./index-BGIHOKN7.mjs");
const notificationsQueryOptions = (params) => queryOptions({
  queryKey: ["notifications", params],
  queryFn: () => getNotifications({
    data: {
      page: params.page,
      limit: 20,
      type: params.type
    }
  })
});
const notificationStatsQueryOptions = () => queryOptions({
  queryKey: ["notification-stats"],
  queryFn: () => getNotificationStats()
});
const Route$f = createFileRoute("/_authenticated/dashboard/notifications/")({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    type: search.type ? String(search.type) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(notificationsQueryOptions({
      page: deps.page,
      type: deps.type
    })), context.queryClient.ensureQueryData(notificationStatsQueryOptions())]);
  },
  pendingComponent: NotificationsLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$c, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
function NotificationsLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: Array.from({
      length: 3
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 rounded-xl" })
  ] }) }) });
}
const getEventsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["draft", "published", "cancelled", "completed"]).optional(),
  church_id: string().optional(),
  search: string().optional()
});
const getEventSchema = object({
  id: string()
});
const updateEventStatusSchema = object({
  id: string(),
  status: _enum(["draft", "published", "cancelled", "completed"])
});
const updateEventSchema = object({
  id: string(),
  title: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  start_time: string().optional(),
  end_time: string().optional(),
  is_online: boolean().optional(),
  meeting_url: string().optional().nullable(),
  address: record(string(), string()).optional().nullable(),
  location: record(string(), string()).optional().nullable(),
  cover_image_url: string().optional().nullable(),
  max_attendees: number().optional().nullable(),
  rsvp_deadline: string().optional().nullable(),
  has_donation: boolean().optional(),
  donation_goal_amount: number().optional().nullable(),
  donation_currency: string().optional().nullable()
});
const deleteEventSchema = object({
  id: string()
});
const getEvents = createServerFn({
  method: "GET"
}).inputValidator(getEventsSchema).handler(createSsrRpc("446166fbb6961e1ab2e3307bb5687d2629c9df32a877a85a55d99250353dbea6"));
const getEvent = createServerFn({
  method: "GET"
}).inputValidator(getEventSchema).handler(createSsrRpc("9632a6df8fe7dce8ae00c4478b2da58ec0fb89d496dfd13df0f7fb6fec2a6dc6"));
const getEventDonations = createServerFn({
  method: "GET"
}).inputValidator(getEventSchema).handler(createSsrRpc("d764e313fd68cc1f8e1a008b3613f68592bd7ab30caecc2f490444be21881b6f"));
const updateEventStatus = createServerFn({
  method: "POST"
}).inputValidator(updateEventStatusSchema).handler(createSsrRpc("620d348b9cbf59fddb4a9438b77aef2729d964f130ea46244a7c4c95158d2c9c"));
const updateEvent = createServerFn({
  method: "POST"
}).inputValidator(updateEventSchema).handler(createSsrRpc("92ab24991e9a6cf511b86c729727bde091ad2d4a6f316592c88a04ef6883feb8"));
const deleteEvent = createServerFn({
  method: "POST"
}).inputValidator(deleteEventSchema).handler(createSsrRpc("a8641be271b447d958bc3a0309843dde257d35d85704450d710e0896871a796b"));
const getEventStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("b4beec82a5024d3a9c4af7dcf99789c2bced8bfd1c9a8b41811e11d8d21690c0"));
const $$splitComponentImporter$e = () => import("./index-DFGV0Jgk.mjs");
const $$splitErrorComponentImporter$b = () => import("./index-Bu4MRzNa.mjs");
const eventsQueryOptions = (params) => queryOptions({
  queryKey: ["events", params],
  queryFn: () => getEvents({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      search: params.search || ""
    }
  })
});
const eventStatsQueryOptions = () => queryOptions({
  queryKey: ["event-stats"],
  queryFn: () => getEventStats()
});
const Route$e = createFileRoute("/_authenticated/dashboard/events/")({
  validateSearch: (search) => ({
    status: search.status ? search.status : void 0,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(eventsQueryOptions({
      page: deps.page,
      status: deps.status,
      search: deps.search
    })), context.queryClient.ensureQueryData(eventStatsQueryOptions())]);
  },
  pendingComponent: EventsLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$b, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
function EventsLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-56" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" })
      ] })
    ] }, i)) })
  ] }) }) });
}
const getDonationsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["pending", "completed", "failed", "refunded"]).optional(),
  campaign_id: string().optional(),
  search: string().optional()
});
const getCampaignsSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["draft", "active", "paused", "completed", "cancelled"]).optional(),
  church_id: string().optional(),
  search: string().optional()
});
const getCampaignSchema = object({
  id: string()
});
const getCampaignGoalChangesSchema = object({
  campaign_id: string()
});
const getCampaignPaymentMethodsSchema = object({
  campaign_id: string()
});
const updateCampaignStatusSchema = object({
  id: string(),
  status: _enum(["draft", "active", "paused", "completed", "cancelled"]),
  rejected_reason: string().optional(),
  verified_by: string().optional()
});
const deleteCampaignSchema = object({
  id: string()
});
const getDonations = createServerFn({
  method: "GET"
}).inputValidator(getDonationsSchema).handler(createSsrRpc("2f915e502125867cde0494a0237ad49b5bd6a74d851434cec58f91318c04741e"));
const getCampaigns = createServerFn({
  method: "GET"
}).inputValidator(getCampaignsSchema).handler(createSsrRpc("2f997a5a50f5eeb22c8aedcebcd6a88c5bcc883cdb1f47159024c6109233dbdb"));
createServerFn({
  method: "GET"
}).inputValidator(getCampaignSchema).handler(createSsrRpc("d5c924b58a83f199282592e469566ecbe5552322b98dff1f7cf795a3ee337bff"));
const updateCampaignStatus = createServerFn({
  method: "POST"
}).inputValidator(updateCampaignStatusSchema).handler(createSsrRpc("51c5f708e402389192fdbe9429196f31868870e2fa780e68c1a90cbbb74f811f"));
const deleteCampaign = createServerFn({
  method: "POST"
}).inputValidator(deleteCampaignSchema).handler(createSsrRpc("966cea9471ea756acda5c64736fdfef68a151d0e6852ec2bdbb5facecfba9297"));
createServerFn({
  method: "GET"
}).inputValidator(getCampaignGoalChangesSchema).handler(createSsrRpc("22abfeb3a75d1e1803b693950008e6b357db403235545ccc562bd113f67b791c"));
createServerFn({
  method: "GET"
}).inputValidator(getCampaignPaymentMethodsSchema).handler(createSsrRpc("8a16b3a841c85ce3c8d57997a9317c391343367a2ced1546538f5e2466bcbcae"));
const getDonationStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("c9d66b61319a199b0e87c9fe133f8d5dfcc08b7ed3d118fc7f66e6d3d7619448"));
const $$splitComponentImporter$d = () => import("./index-D4iyMvUf.mjs");
const $$splitErrorComponentImporter$a = () => import("./index-bbgi-iyS.mjs");
const donationsQueryOptions = (params) => queryOptions({
  queryKey: ["donations", params],
  queryFn: () => getDonations({
    data: {
      page: params.page,
      limit: 10,
      status: params.status
    }
  })
});
const campaignsQueryOptions = (params) => queryOptions({
  queryKey: ["campaigns", params],
  queryFn: () => getCampaigns({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      search: params.search || ""
    }
  })
});
const donationStatsQueryOptions = () => queryOptions({
  queryKey: ["donation-stats"],
  queryFn: () => getDonationStats()
});
const Route$d = createFileRoute("/_authenticated/dashboard/donations/")({
  validateSearch: (search) => ({
    tab: search.tab || "donations",
    status: search.status ? String(search.status) : void 0,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : void 0,
    campaignPage: Number(search.campaignPage) || 1,
    campaignStatus: search.campaignStatus ? String(search.campaignStatus) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(donationsQueryOptions({
      page: deps.page,
      status: deps.status
    })), context.queryClient.ensureQueryData(campaignsQueryOptions({
      page: deps.campaignPage || 1,
      status: deps.campaignStatus,
      search: deps.search
    })), context.queryClient.ensureQueryData(donationStatsQueryOptions())]);
  },
  pendingComponent: DonationsLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$a, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
function DonationsLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-56" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 w-full rounded-xl" })
  ] }) }) });
}
const getContentItems = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("d3f3988455893cc809e64179ae268b2848bddd8201cd2f60e989940142f4afb8"));
const getContentItem = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("09fd6c9e9fd0455b5604a1f9028e1f22ce76509dc659537e35a14d69f5c059aa"));
const approveContent = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("63d408531ec0c9b0119edeb3718367cffe049676e212ef8498bd435cf16a84e6"));
const rejectContent = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("0315e9011fae06aa7045db409ea92b6701bd49f1d5e9d7156f294afab48cc004"));
const createContentItem = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("0eee45c60c19d69dd15877f0f08c988dce08e5321e40e1a3a5081e4bffd6fde9"));
const deleteContentItem = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("5794aa598a4af5e3e7e948e7ee5e4c4454cd27e276b4f0f1035d6a36f3047d57"));
const updateContentStatus = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("d1da1e744e2aeb49a0d3fc8c8416c5be6709c2dcdd05d45dfcc2e51b4cd2bc51"));
const getContentStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("2f08f0eb4a334da2169abd45d94f19503a2ab8b6681eea564f06b67ac5e21725"));
const $$splitComponentImporter$c = () => import("./index-6B_aMNiH.mjs");
const $$splitErrorComponentImporter$9 = () => import("./index-CPRnpDj9.mjs");
const contentQueryOptions = (params) => queryOptions({
  queryKey: ["content", params],
  queryFn: () => getContentItems({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      content_type: params.content_type,
      search: params.search || ""
    }
  })
});
const contentStatsQueryOptions = () => queryOptions({
  queryKey: ["content-stats"],
  queryFn: () => getContentStats()
});
const Route$c = createFileRoute("/_authenticated/dashboard/content/")({
  validateSearch: (search) => ({
    status: search.status ? search.status : void 0,
    type: search.type ? search.type : void 0,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(contentQueryOptions({
      page: deps.page,
      status: deps.status,
      content_type: deps.type,
      search: deps.search
    })), context.queryClient.ensureQueryData(contentStatsQueryOptions())]);
  },
  pendingComponent: ContentLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$9, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
function ContentLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full max-w-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full" })
        ] })
      ] })
    ] }, i)) })
  ] }) }) });
}
const getChurchesSchema = object({
  page: number().optional(),
  limit: number().optional(),
  status: _enum(["pending", "approved", "rejected", "suspended"]).optional(),
  category: _enum(["church", "monastery", "female-monastery"]).optional(),
  search: string().optional()
});
const getChurchSchema = object({
  id: string()
});
const createChurchSchema = object({
  name_en: string(),
  name_am: string(),
  name_or: string().optional(),
  name_so: string().optional(),
  name_ti: string().optional(),
  description_en: string(),
  description_am: string(),
  description_or: string().optional(),
  description_so: string().optional(),
  description_ti: string().optional(),
  category: _enum(["church", "monastery", "female-monastery"]),
  phone_number: string(),
  email: string().optional(),
  website: string().optional(),
  city_en: string().optional(),
  city_am: string().optional(),
  city_or: string().optional(),
  city_so: string().optional(),
  city_ti: string().optional(),
  address_en: string().optional(),
  address_am: string().optional(),
  address_or: string().optional(),
  address_so: string().optional(),
  address_ti: string().optional(),
  country_en: string().optional(),
  country_am: string().optional(),
  country_or: string().optional(),
  country_so: string().optional(),
  country_ti: string().optional(),
  founded_year: number().optional()
});
const updateChurchStatusSchema = object({
  id: string(),
  status: _enum(["pending", "approved", "rejected", "suspended"]),
  rejected_reason: string().optional(),
  verified_by: string().optional()
});
const updateChurchSchema = object({
  id: string(),
  name_en: string().optional(),
  name_am: string().optional(),
  name_or: string().optional(),
  name_so: string().optional(),
  name_ti: string().optional(),
  description_en: string().optional(),
  description_am: string().optional(),
  description_or: string().optional(),
  description_so: string().optional(),
  description_ti: string().optional(),
  category: _enum(["church", "monastery", "female-monastery"]).optional(),
  phone_number: string().optional(),
  email: string().optional(),
  website: string().optional(),
  city_en: string().optional(),
  city_am: string().optional(),
  city_or: string().optional(),
  city_so: string().optional(),
  city_ti: string().optional(),
  address_en: string().optional(),
  address_am: string().optional(),
  address_or: string().optional(),
  address_so: string().optional(),
  address_ti: string().optional(),
  country_en: string().optional(),
  country_am: string().optional(),
  country_or: string().optional(),
  country_so: string().optional(),
  country_ti: string().optional(),
  founded_year: number().optional()
});
const deleteChurchSchema = object({
  id: string()
});
const getChurches = createServerFn({
  method: "GET"
}).inputValidator(getChurchesSchema).handler(createSsrRpc("4576afe9e3a9b0e8d641bc4f425074ac2384138714167d6bde1c6e84772ef98b"));
const getChurch = createServerFn({
  method: "GET"
}).inputValidator(getChurchSchema).handler(createSsrRpc("9fabc4b30983169a50258a3f3fae1d56bf0b2b006ba33733b4231b5699a4e718"));
const updateChurchStatus = createServerFn({
  method: "POST"
}).inputValidator(updateChurchStatusSchema).handler(createSsrRpc("d86e30fc01892b4cbe00858b1efd7e4802cff0cca775bf709d4b6981c2541c83"));
const createChurch = createServerFn({
  method: "POST"
}).inputValidator(createChurchSchema).handler(createSsrRpc("b07882c0ec867177e82e875b6f8f533bef1d5a610264da26f6cf785593e71f79"));
const updateChurch = createServerFn({
  method: "POST"
}).inputValidator(updateChurchSchema).handler(createSsrRpc("a41e722e40caeff835b61245173e16db89f35b6b96262ebb69e79ec479c64be4"));
const deleteChurch = createServerFn({
  method: "POST"
}).inputValidator(deleteChurchSchema).handler(createSsrRpc("6431f569bde83eee2bfd651a0ad8707af2581d5e5eb69544e719554fac62e06b"));
const createBankAccountSchema = object({
  church_id: string(),
  bank_name_en: string(),
  bank_name_am: string(),
  bank_name_or: string().optional(),
  bank_name_so: string().optional(),
  bank_name_ti: string().optional(),
  account_number: string(),
  account_holder_name: string(),
  branch_name: string().optional(),
  swift_code: string().optional(),
  is_primary: boolean().optional()
});
const updateBankAccountSchema = object({
  id: string(),
  bank_name_en: string().optional(),
  bank_name_am: string().optional(),
  bank_name_or: string().optional(),
  bank_name_so: string().optional(),
  bank_name_ti: string().optional(),
  account_number: string().optional(),
  account_holder_name: string().optional(),
  branch_name: string().optional(),
  swift_code: string().optional(),
  is_primary: boolean().optional(),
  is_active: boolean().optional()
});
const deleteBankAccountSchema = object({
  id: string()
});
const createBankAccount = createServerFn({
  method: "POST"
}).inputValidator(createBankAccountSchema).handler(createSsrRpc("09434b04ddfb9bc8dd23161238256bb177429fc231fd294daabd236ba5d50114"));
const updateBankAccount = createServerFn({
  method: "POST"
}).inputValidator(updateBankAccountSchema).handler(createSsrRpc("1d5f890ab567f7d0d2f26001dfa8b95e52d74262d8de4843bf0d0c41059d7ee9"));
const deleteBankAccount = createServerFn({
  method: "POST"
}).inputValidator(deleteBankAccountSchema).handler(createSsrRpc("afca037115020fd75c128bf4041f5001640d37537871b19b247698d378ad74df"));
const addChurchImageSchema = object({
  church_id: string(),
  image_url: string(),
  display_order: number().optional()
});
const deleteChurchImageSchema = object({
  id: string()
});
const addChurchImage = createServerFn({
  method: "POST"
}).inputValidator(addChurchImageSchema).handler(createSsrRpc("94898f40caf014eba8f736b12ed372a4862e3d2a93696a4a5b02e955602a0591"));
const deleteChurchImage = createServerFn({
  method: "POST"
}).inputValidator(deleteChurchImageSchema).handler(createSsrRpc("2225cde09b6b52d7024254faa62bb3d62cad989cff370751df0e12185d165473"));
const getChurchStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("023a581d4cf1baa3062630c1cee168c1db8bf75eef9b60a28f196d64349f3bb2"));
const churches = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addChurchImage,
  createBankAccount,
  createChurch,
  deleteBankAccount,
  deleteChurch,
  deleteChurchImage,
  getChurch,
  getChurchStats,
  getChurches,
  updateBankAccount,
  updateChurch,
  updateChurchStatus
}, Symbol.toStringTag, { value: "Module" }));
const $$splitComponentImporter$b = () => import("./index-Rn_qgHwY.mjs");
const $$splitErrorComponentImporter$8 = () => import("./index-DKijrL4_.mjs");
const churchesQueryOptions = (params) => queryOptions({
  queryKey: ["churches", params],
  queryFn: () => getChurches({
    data: {
      page: params.page,
      limit: 10,
      status: params.status,
      category: params.category,
      search: params.search || ""
    }
  })
});
const churchStatsQueryOptions = () => queryOptions({
  queryKey: ["church-stats"],
  queryFn: () => getChurchStats()
});
const Route$b = createFileRoute("/_authenticated/dashboard/churches/")({
  validateSearch: (search) => ({
    status: search.status ? search.status : void 0,
    category: search.category ? search.category : void 0,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps,
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(churchesQueryOptions({
      page: deps.page,
      status: deps.status,
      category: deps.category,
      search: deps.search
    })), context.queryClient.ensureQueryData(churchStatsQueryOptions())]);
  },
  pendingComponent: ChurchesLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$8, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
function ChurchesLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full max-w-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Array.from({
      length: 5
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-12 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8" })
    ] }, i)) }) }) })
  ] }) }) });
}
const getEventCategories = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1218da09bf96ef013b9b404ef15793fe1b54861a584beea5c944aa940955e237"));
const createEventCategorySchema = object({
  name: record(string(), string()),
  description: record(string(), string()),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const createEventCategory = createServerFn({
  method: "POST"
}).inputValidator(createEventCategorySchema).handler(createSsrRpc("b43020ea87f034acea57dcd95974f7ef2a023b24c734b61b4c70e31b78c7a0fe"));
const updateEventCategorySchema = object({
  id: string(),
  name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const updateEventCategory = createServerFn({
  method: "POST"
}).inputValidator(updateEventCategorySchema).handler(createSsrRpc("ba4910ed0a0570ffcaecdef31bd82390a62a86fb7c3bbdebd3a38cc97d132aac"));
const deleteEventCategorySchema = object({
  id: string()
});
const deleteEventCategory = createServerFn({
  method: "POST"
}).inputValidator(deleteEventCategorySchema).handler(createSsrRpc("e71d97cfec0109a22decce286915dc7d39af1e9df9a373eff86f5b87c5b9148d"));
const getRegionCategories = createServerFn({
  method: "GET"
}).handler(createSsrRpc("eae2b2298318ef09914a943281f133663f24d6e6cd0185c13b9eba3262b98de1"));
const createRegionCategorySchema = object({
  name: string().min(1),
  slug: string().min(1),
  display_name: record(string(), string()),
  description: record(string(), string()).optional(),
  color_start: string(),
  color_end: string(),
  display_order: number(),
  is_active: boolean()
});
const createRegionCategory = createServerFn({
  method: "POST"
}).inputValidator(createRegionCategorySchema).handler(createSsrRpc("295117c54582021d54cee981a0fd3ba09b206fca8c96d7b2f67754ee07300732"));
const updateRegionCategorySchema = object({
  id: string(),
  display_name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  color_start: string().optional(),
  color_end: string().optional(),
  display_order: number().optional(),
  is_active: boolean().optional()
});
const updateRegionCategory = createServerFn({
  method: "POST"
}).inputValidator(updateRegionCategorySchema).handler(createSsrRpc("f7b709e58bccd5dcd737f91016a76c69a9164443d8ef5ade574b13d16a3a7c64"));
const deleteRegionCategorySchema = object({
  id: string()
});
const deleteRegionCategory = createServerFn({
  method: "POST"
}).inputValidator(deleteRegionCategorySchema).handler(createSsrRpc("02e85b2bac4aa206af5c7bfc7c519b1287486f0d9630219870da0fbc21c199a9"));
const getDonationCategories = createServerFn({
  method: "GET"
}).handler(createSsrRpc("309002e200ea3912d224afd6d9532f9c994b85a84a98c6b97c72722574a4de08"));
const createDonationCategorySchema = object({
  name: record(string(), string()),
  description: record(string(), string()),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const createDonationCategory = createServerFn({
  method: "POST"
}).inputValidator(createDonationCategorySchema).handler(createSsrRpc("944a802e2f2822698ab7e618f7899e6b4b01cf0d312f97a574ce6f99570656ea"));
const updateDonationCategorySchema = object({
  id: string(),
  name: record(string(), string()).optional(),
  description: record(string(), string()).optional(),
  icon: string().optional().nullable(),
  color: string().optional().nullable()
});
const updateDonationCategory = createServerFn({
  method: "POST"
}).inputValidator(updateDonationCategorySchema).handler(createSsrRpc("45d4484b7fbc3da996274d4b6c9dfe3736bd54e0340cb8da77a0281ef27f73f8"));
const deleteDonationCategorySchema = object({
  id: string()
});
const deleteDonationCategory = createServerFn({
  method: "POST"
}).inputValidator(deleteDonationCategorySchema).handler(createSsrRpc("72881f6f5d0a9c7765f12128225791fdbc2df958a4fb0f017ac4b856c8fe8231"));
const $$splitComponentImporter$a = () => import("./index-DiCvSyWo.mjs");
const $$splitErrorComponentImporter$7 = () => import("./index-Dc-3MXct.mjs");
const Route$a = createFileRoute("/_authenticated/dashboard/categories/")({
  loader: async () => {
    const [eventCategories, donationCategories, regionCategories] = await Promise.all([getEventCategories(), getDonationCategories(), getRegionCategories()]);
    return {
      eventCategories,
      donationCategories,
      regionCategories
    };
  },
  pendingComponent: () => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 rounded-xl" })
  ] }) }) }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$7, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-JiP7LG_X.mjs");
const Route$9 = createFileRoute("/_authenticated/dashboard/campaigns/")({
  validateSearch: (search) => ({
    status: search.status ? search.status : void 0,
    page: Number(search.page) || 1
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps
  }) => {
    const campaignsData = await getCampaigns({
      data: {
        page: deps.page,
        limit: 10,
        status: deps.status
      }
    });
    return campaignsData;
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const getBooksSchema = object({
  page: number().optional(),
  limit: number().optional(),
  search: string().optional(),
  testament: _enum(["old", "new"]).optional()
});
const getBibleBooks = createServerFn({
  method: "GET"
}).inputValidator(getBooksSchema).handler(createSsrRpc("b0aa7fbaf530a409d7707ef6ca6b59e97ee0003602d48c38ccab1993d5bca973"));
const getBibleBook = createServerFn({
  method: "GET"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("23a130f5adddd1257fbe38399a86ea80f4dcaa4b3dd12e1e3a4a294aee17a8b2"));
const getBibleBookStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("974a6a4b367fa851d6760c17586be5b9a49729e42abf7dffb26bf35ff2d9dd1f"));
const createBookSchema = object({
  book_number: number(),
  chapter_count: number(),
  name: object({
    en: string(),
    am: string().optional()
  }),
  testament: object({
    en: string(),
    am: string().optional()
  })
});
const createBibleBook = createServerFn({
  method: "POST"
}).inputValidator(createBookSchema).handler(createSsrRpc("e0a7307af09d107bd4e5a898c7b073494285a865ce5c85107204b9910ea9a871"));
const updateBookSchema = object({
  id: string(),
  book_number: number().optional(),
  chapter_count: number().optional(),
  name: object({
    en: string(),
    am: string().optional()
  }).optional(),
  testament: object({
    en: string(),
    am: string().optional()
  }).optional()
});
createServerFn({
  method: "POST"
}).inputValidator(updateBookSchema).handler(createSsrRpc("19515615719aaaf084e52fa2f76449e88767ceff7f1f5c7dab0e7470a2d226fd"));
const deleteBibleBook = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("7a134dde487c2e7cada1db962b7b4217665085c37a422d19654e00500f2e10f1"));
const getChaptersSchema = object({
  bookId: string(),
  page: number().optional(),
  limit: number().optional()
});
const getBibleChapters = createServerFn({
  method: "GET"
}).inputValidator(getChaptersSchema).handler(createSsrRpc("763ca99bd77de63dd50c0fc7a604c505b9ffb923cac46e621e5e714cbdbd13e1"));
const getBibleChapter = createServerFn({
  method: "GET"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("90bd3f566c97b140e100dd015f7a8c8e1804513a7ddfabf319e33ad7973d7c5d"));
const createChapterSchema = object({
  book_id: string(),
  chapter_number: number(),
  verse_count: number()
});
const createBibleChapter = createServerFn({
  method: "POST"
}).inputValidator(createChapterSchema).handler(createSsrRpc("b23c4e8fc3655ad01a169be32e6f6f275887781469e7ea47d664dd813048f45b"));
const updateChapterSchema = object({
  id: string(),
  chapter_number: number().optional(),
  verse_count: number().optional()
});
createServerFn({
  method: "POST"
}).inputValidator(updateChapterSchema).handler(createSsrRpc("f81828e97e8e357e43a737f580def7599b1ff26c94aac433c5ba932bce9413f3"));
const deleteBibleChapter = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("8a390080d94832cd6203a07fc65ac930672f111324848664f96421f956b26b29"));
const getVersesSchema = object({
  chapterId: string(),
  page: number().optional(),
  limit: number().optional(),
  search: string().optional()
});
const getBibleVerses = createServerFn({
  method: "GET"
}).inputValidator(getVersesSchema).handler(createSsrRpc("78d78cdbf65e538d15ee23a5a21131c5f2aa632873269f020dd68a5147a0563a"));
createServerFn({
  method: "GET"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("055dfaf82fcd4e3f4f4a05537d864521e33d64a5c723d45725d968e856c2bed1"));
const createVerseSchema = object({
  chapter_id: string(),
  verse_number: number(),
  text: object({
    en: string(),
    am: string().optional()
  })
});
const createBibleVerse = createServerFn({
  method: "POST"
}).inputValidator(createVerseSchema).handler(createSsrRpc("66e151e83e191105c0c1936257b4a2419d311b93c8bc25a86b851755e9b68a41"));
const updateVerseSchema = object({
  id: string(),
  verse_number: number().optional(),
  text: object({
    en: string(),
    am: string().optional()
  }).optional()
});
const updateBibleVerse = createServerFn({
  method: "POST"
}).inputValidator(updateVerseSchema).handler(createSsrRpc("4f3186460542b4a27f94d56d2c85044b2d055d54a616e7facb807f20be081a44"));
const deleteBibleVerse = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("3f0ce2ceb1949445c50d7f4c5853a31755a802a2a0f7adbe2275058686cc41ef"));
createServerFn({
  method: "GET"
}).inputValidator(object({
  query: string()
})).handler(createSsrRpc("4fe7827292a4ddcf42118c15344866a3d97417929dae5d93e853ee453e8437b2"));
const getBibleFootnotes = createServerFn({
  method: "GET"
}).inputValidator(object({
  verseId: string()
})).handler(createSsrRpc("7ab45f46e0ab1f4341be54309229612317db068ed0d753e7d9c2f6fe057e6ed2"));
const createFootnoteSchema = object({
  verse_id: string(),
  marker: object({
    en: string(),
    am: string().optional()
  }),
  note: object({
    en: string(),
    am: string().optional()
  }),
  type: string().optional()
});
const createBibleFootnote = createServerFn({
  method: "POST"
}).inputValidator(createFootnoteSchema).handler(createSsrRpc("580bf606fac1f180eed10d63431459ff38e2e41425150bd36bfbb088cba38051"));
const updateFootnoteSchema = object({
  id: string(),
  marker: object({
    en: string(),
    am: string().optional()
  }).optional(),
  note: object({
    en: string(),
    am: string().optional()
  }).optional(),
  type: string().optional()
});
const updateBibleFootnote = createServerFn({
  method: "POST"
}).inputValidator(updateFootnoteSchema).handler(createSsrRpc("f023346eec6915a8a6a84df84be0563a56bac74bd13d5078b3b9c9a18ee72e7e"));
const deleteBibleFootnote = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("fa14e5b0dc217bb167771e92a6121b5466f00a850355960bc479b7c5a1ce00b0"));
const getBibleCrossReferences = createServerFn({
  method: "GET"
}).inputValidator(object({
  verseId: string()
})).handler(createSsrRpc("6e7f2054dd1923c142a6474e619110c49a1b5a27c8ea5712b5397b53156cd913"));
const createCrossRefSchema = object({
  verse_id: string(),
  reference: object({
    en: string(),
    am: string().optional()
  }),
  description: object({
    en: string(),
    am: string().optional()
  }).optional(),
  reference_book_id: string().optional(),
  reference_chapter: number().optional(),
  reference_verse_start: number().optional(),
  reference_verse_end: number().optional()
});
const createBibleCrossReference = createServerFn({
  method: "POST"
}).inputValidator(createCrossRefSchema).handler(createSsrRpc("97f0e070724bc420208f1f670c9b40c868d4c4ed1d8747121f2844552a2124f6"));
const deleteBibleCrossReference = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(createSsrRpc("d92ea202c6d10a5e673359889c393f5974daec463d97b6fc3481d504f7bfb950"));
const $$splitComponentImporter$8 = () => import("./index-Cn0jrZsu.mjs");
const $$splitErrorComponentImporter$6 = () => import("./index-Cas9117j.mjs");
const Route$8 = createFileRoute("/_authenticated/dashboard/bible/")({
  validateSearch: (search) => ({
    testament: search.testament ? search.testament : void 0,
    page: Number(search.page) || 1,
    search: search.search || ""
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    deps
  }) => {
    const [booksData, stats] = await Promise.all([getBibleBooks({
      data: {
        page: deps.page,
        limit: 66,
        search: deps.search,
        testament: deps.testament
      }
    }), getBibleBookStats()]);
    return {
      ...booksData,
      stats
    };
  },
  pendingComponent: BibleLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$6, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
function BibleLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: Array.from({
      length: 12
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 mb-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" })
      ] })
    ] }, i)) })
  ] }) });
}
const $$splitComponentImporter$7 = () => import("./index-BHSsEMca.mjs");
const $$splitErrorComponentImporter$5 = () => import("./index-DUJGq9DJ.mjs");
const Route$7 = createFileRoute("/_authenticated/dashboard/users/$userId/")({
  loader: async ({
    params
  }) => {
    const user = await getUser({
      data: {
        id: params.userId
      }
    });
    return {
      user
    };
  },
  pendingComponent: UserDetailSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$5, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
function UserDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-20 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }, i)) })
  ] }) }) });
}
const $$splitComponentImporter$6 = () => import("./index-DkhaqpDK.mjs");
const $$splitErrorComponentImporter$4 = () => import("./index-Dpm5v_-B.mjs");
const Route$6 = createFileRoute("/_authenticated/dashboard/events/$eventId/")({
  loader: async ({
    params
  }) => {
    const [event, donations] = await Promise.all([getEvent({
      data: {
        id: params.eventId
      }
    }), getEventDonations({
      data: {
        id: params.eventId
      }
    })]);
    return {
      event,
      donations
    };
  },
  pendingComponent: EventDetailSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
function EventDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" })
    ] })
  ] }) }) });
}
const $$splitComponentImporter$5 = () => import("./index-LpWggRfl.mjs");
const Route$5 = createFileRoute("/_authenticated/dashboard/content/new/")({
  loader: async () => {
    const churchesData = await getChurches({
      data: {
        page: 1,
        limit: 100
      }
    });
    return {
      churches: churchesData.churches
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-KmH-JGym.mjs");
const $$splitErrorComponentImporter$3 = () => import("./index-DbcRajXv.mjs");
const Route$4 = createFileRoute("/_authenticated/dashboard/content/$contentId/")({
  loader: async ({
    params
  }) => {
    const content = await getContentItem({
      data: {
        id: params.contentId
      }
    });
    return {
      content
    };
  },
  pendingComponent: ContentDetailSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
function ContentDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" })
    ] })
  ] }) }) });
}
const $$splitComponentImporter$3 = () => import("./index-DUo-aE1G.mjs");
const Route$3 = createFileRoute("/_authenticated/dashboard/churches/new/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-CrICdpMN.mjs");
const $$splitErrorComponentImporter$2 = () => import("./index-DVIENwJz.mjs");
const Route$2 = createFileRoute("/_authenticated/dashboard/churches/$churchId/")({
  loader: async ({
    params
  }) => {
    const church = await getChurch({
      data: {
        id: params.churchId
      }
    });
    return {
      church
    };
  },
  pendingComponent: ChurchDetailSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
function ChurchDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-24 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, `skel-${i}`)) })
  ] }) }) });
}
const $$splitComponentImporter$1 = () => import("./index-DxapTDuP.mjs");
const $$splitErrorComponentImporter$1 = () => import("./index-CRnmti3H.mjs");
const Route$1 = createFileRoute("/_authenticated/dashboard/bible/$bookId/")({
  validateSearch: (search) => ({
    page: Number(search.page) || 1
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    params,
    deps
  }) => {
    const [book, chaptersData] = await Promise.all([getBibleBook({
      data: {
        id: params.bookId
      }
    }), getBibleChapters({
      data: {
        bookId: params.bookId,
        page: deps.page,
        limit: 150
      }
    })]);
    return {
      book,
      ...chaptersData
    };
  },
  pendingComponent: BookDetailLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function BookDetailLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-16 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3", children: Array.from({
      length: 20
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }, i)) })
  ] }) });
}
const $$splitComponentImporter = () => import("./index-0nwtq1Fj.mjs");
const $$splitErrorComponentImporter = () => import("./index-C8V7mdO_.mjs");
const Route = createFileRoute("/_authenticated/dashboard/bible/$bookId/$chapterId/")({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    search: search.search || ""
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    params,
    deps
  }) => {
    const [chapter, versesData] = await Promise.all([getBibleChapter({
      data: {
        id: params.chapterId
      }
    }), getBibleVerses({
      data: {
        chapterId: params.chapterId,
        page: deps.page,
        limit: 200,
        search: deps.search
      }
    })]);
    return {
      chapter,
      ...versesData
    };
  },
  pendingComponent: ChapterDetailLoadingSkeleton,
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
function ChapterDetailLoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-16 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-64 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full max-w-md mb-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Array.from({
      length: 10
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-8 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
      ] })
    ] }) }, i)) })
  ] }) });
}
const LoginRoute = Route$m.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$n
});
const AuthenticatedRoute = Route$l.update({
  id: "/_authenticated",
  getParentRoute: () => Route$n
});
const IndexRoute = Route$k.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$n
});
const AuthenticatedDashboardIndexRoute = Route$j.update({
  id: "/dashboard/",
  path: "/dashboard/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardUsersIndexRoute = Route$i.update({
  id: "/dashboard/users/",
  path: "/dashboard/users/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardSettingsIndexRoute = Route$h.update({
  id: "/dashboard/settings/",
  path: "/dashboard/settings/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardPaymentsIndexRoute = Route$g.update({
  id: "/dashboard/payments/",
  path: "/dashboard/payments/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardNotificationsIndexRoute = Route$f.update({
  id: "/dashboard/notifications/",
  path: "/dashboard/notifications/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardEventsIndexRoute = Route$e.update({
  id: "/dashboard/events/",
  path: "/dashboard/events/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardDonationsIndexRoute = Route$d.update({
  id: "/dashboard/donations/",
  path: "/dashboard/donations/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardContentIndexRoute = Route$c.update({
  id: "/dashboard/content/",
  path: "/dashboard/content/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardChurchesIndexRoute = Route$b.update({
  id: "/dashboard/churches/",
  path: "/dashboard/churches/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardCategoriesIndexRoute = Route$a.update({
  id: "/dashboard/categories/",
  path: "/dashboard/categories/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardCampaignsIndexRoute = Route$9.update({
  id: "/dashboard/campaigns/",
  path: "/dashboard/campaigns/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardBibleIndexRoute = Route$8.update({
  id: "/dashboard/bible/",
  path: "/dashboard/bible/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardUsersUserIdIndexRoute = Route$7.update({
  id: "/dashboard/users/$userId/",
  path: "/dashboard/users/$userId/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardEventsEventIdIndexRoute = Route$6.update({
  id: "/dashboard/events/$eventId/",
  path: "/dashboard/events/$eventId/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardContentNewIndexRoute = Route$5.update({
  id: "/dashboard/content/new/",
  path: "/dashboard/content/new/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardContentContentIdIndexRoute = Route$4.update({
  id: "/dashboard/content/$contentId/",
  path: "/dashboard/content/$contentId/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardChurchesNewIndexRoute = Route$3.update({
  id: "/dashboard/churches/new/",
  path: "/dashboard/churches/new/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardChurchesChurchIdIndexRoute = Route$2.update({
  id: "/dashboard/churches/$churchId/",
  path: "/dashboard/churches/$churchId/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardBibleBookIdIndexRoute = Route$1.update({
  id: "/dashboard/bible/$bookId/",
  path: "/dashboard/bible/$bookId/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardBibleBookIdChapterIdIndexRoute = Route.update({
  id: "/dashboard/bible/$bookId/$chapterId/",
  path: "/dashboard/bible/$bookId/$chapterId/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedRouteChildren = {
  AuthenticatedDashboardIndexRoute,
  AuthenticatedDashboardBibleIndexRoute,
  AuthenticatedDashboardCampaignsIndexRoute,
  AuthenticatedDashboardCategoriesIndexRoute,
  AuthenticatedDashboardChurchesIndexRoute,
  AuthenticatedDashboardContentIndexRoute,
  AuthenticatedDashboardDonationsIndexRoute,
  AuthenticatedDashboardEventsIndexRoute,
  AuthenticatedDashboardNotificationsIndexRoute,
  AuthenticatedDashboardPaymentsIndexRoute,
  AuthenticatedDashboardSettingsIndexRoute,
  AuthenticatedDashboardUsersIndexRoute,
  AuthenticatedDashboardBibleBookIdIndexRoute,
  AuthenticatedDashboardChurchesChurchIdIndexRoute,
  AuthenticatedDashboardChurchesNewIndexRoute,
  AuthenticatedDashboardContentContentIdIndexRoute,
  AuthenticatedDashboardContentNewIndexRoute,
  AuthenticatedDashboardEventsEventIdIndexRoute,
  AuthenticatedDashboardUsersUserIdIndexRoute,
  AuthenticatedDashboardBibleBookIdChapterIdIndexRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute
};
const routeTree = Route$n._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const rqContext = getContext();
  const router2 = createRouter({
    routeTree,
    context: {
      ...rqContext,
      queryClient: rqContext.queryClient,
      user: null
    },
    defaultPreload: "intent",
    defaultPendingMs: 100,
    // Show indicator if loading takes > 100ms
    defaultPendingMinMs: 500
  });
  setupRouterSsrQueryIntegration({ router: router2, queryClient: rqContext.queryClient });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  deleteRegionCategory as $,
  getEvents as A,
  getEventStats as B,
  Route$d as C,
  getDonations as D,
  getCampaigns as E,
  getDonationStats as F,
  updateCampaignStatus as G,
  deleteCampaign as H,
  Route$c as I,
  getContentItems as J,
  getContentStats as K,
  updateContentStatus as L,
  deleteContentItem as M,
  Route$b as N,
  getChurches as O,
  getChurchStats as P,
  Route$a as Q,
  Route$l as R,
  Skeleton as S,
  updateEventCategory as T,
  updateDonationCategory as U,
  createEventCategory as V,
  createDonationCategory as W,
  deleteEventCategory as X,
  deleteDonationCategory as Y,
  updateRegionCategory as Z,
  createRegionCategory as _,
  cn as a,
  Route$9 as a0,
  Route$8 as a1,
  createBibleBook as a2,
  deleteBibleBook as a3,
  Route$7 as a4,
  removeUserRole as a5,
  assignUserRole as a6,
  Route$6 as a7,
  updateEvent as a8,
  updateEventStatus as a9,
  updateBibleVerse as aA,
  deleteBibleFootnote as aB,
  deleteBibleCrossReference as aC,
  deleteBibleVerse as aD,
  churches as aE,
  router as aF,
  deleteEvent as aa,
  Route$5 as ab,
  createContentItem as ac,
  Route$4 as ad,
  approveContent as ae,
  rejectContent as af,
  createChurch as ag,
  updateChurchStatus as ah,
  deleteChurch as ai,
  updateBankAccount as aj,
  createBankAccount as ak,
  addChurchImage as al,
  Route$2 as am,
  updateChurch as an,
  deleteChurchImage as ao,
  Route$1 as ap,
  createBibleChapter as aq,
  deleteBibleChapter as ar,
  Route as as,
  createBibleVerse as at,
  createBibleFootnote as au,
  createBibleCrossReference as av,
  updateBibleFootnote as aw,
  getBibleFootnotes as ax,
  getBibleCrossReferences as ay,
  getBibleBooks as az,
  Route$j as b,
  createSsrRpc as c,
  Route$i as d,
  getUserStats as e,
  updateUserStatus as f,
  getUsers as g,
  Route$h as h,
  updateProfile as i,
  changePassword as j,
  updateFeatureFlag as k,
  updatePaymentGateway as l,
  createFeatureFlag as m,
  deleteFeatureFlag as n,
  deletePaymentGateway as o,
  Route$g as p,
  getPayments as q,
  getPaymentStats as r,
  Route$f as s,
  getNotifications as t,
  useTheme as u,
  getNotificationStats as v,
  searchUsersForNotification as w,
  sendNotification as x,
  deleteNotification as y,
  Route$e as z
};
