import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { u as useDebouncer } from "../_chunks/_libs/@tanstack/react-pacer.mjs";
import { d as Route$i, S as Skeleton, g as getUsers, f as updateUserStatus, e as getUserStats } from "./router-deJypcsT.mjs";
import { i as isSuperAdmin } from "./roles-B1zM8dwz.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { T as Textarea } from "./textarea-CK6DvV64.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { p as Funnel, U as Users, q as Mail, r as Phone, s as Ban, t as Pause, u as UserX, v as ShieldCheck, E as Eye, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@tanstack/pacer.mjs";
import "../_chunks/_libs/@tanstack/devtools-event-client.mjs";
import "../_chunks/_libs/@tanstack/store.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@radix-ui/react-avatar.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-use-is-hydrated.mjs";
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
function UsersPage() {
  const searchParams = Route$i.useSearch();
  const navigate = useNavigate({
    from: Route$i.fullPath
  });
  const [searchInput, setSearchInput] = reactExports.useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = reactExports.useState(false);
  const {
    user: currentUser
  } = Route$i.useRouteContext();
  const isCurrentSuperAdmin = !!currentUser && isSuperAdmin(currentUser.role);
  const [statusDialogOpen, setStatusDialogOpen] = reactExports.useState(false);
  const [statusTargetUser, setStatusTargetUser] = reactExports.useState(null);
  const [newStatus, setNewStatus] = reactExports.useState("active");
  const [statusReason, setStatusReason] = reactExports.useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = reactExports.useState(false);
  const usersQuery = useSuspenseQuery(usersQueryOptions({
    page: searchParams.page,
    role: searchParams.role,
    search: searchParams.search
  }));
  const statsQuery = useSuspenseQuery(userStatsQueryOptions());
  const {
    users,
    total,
    page,
    totalPages
  } = usersQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && usersQuery.isRefetching;
  const debouncedSearch = useDebouncer((value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: value.trim() || void 0,
        page: 1
      })
    });
  }, {
    wait: 500
  });
  reactExports.useEffect(() => {
    if (searchInput || searchParams.search) {
      setHasSearched(true);
    }
    debouncedSearch.maybeExecute(searchInput);
  }, [searchInput, searchParams.search]);
  const handleRoleFilter = (newRole) => {
    navigate({
      search: (prev) => ({
        ...prev,
        role: newRole === "all" ? void 0 : newRole,
        page: 1
      })
    });
  };
  const handlePageChange = (newPage) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage
      })
    });
  };
  const handleStatusUpdate = async () => {
    if (!statusTargetUser || !currentUser) return;
    setIsUpdatingStatus(true);
    try {
      await updateUserStatus({
        data: {
          user_id: statusTargetUser.id,
          status: newStatus,
          reason: statusReason.trim() || void 0,
          changed_by: currentUser.id
        }
      });
      toast.success(`User status updated to ${newStatus}`);
      setStatusDialogOpen(false);
      setStatusTargetUser(null);
      setStatusReason("");
      usersQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  const getUserStatusFromData = (user) => {
    return user.status || "active";
  };
  const isUserSuperAdmin = (u) => {
    const roles = u.user_roles;
    return roles?.some((r) => r.role === "super_admin") || false;
  };
  const roleColors = {
    super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    admin: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    church_admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    content_admin: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    content_creator: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    user: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  };
  const statusConfig = {
    active: {
      label: "Active",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: ShieldCheck
    },
    inactive: {
      label: "Inactive",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      icon: UserX
    },
    suspended: {
      label: "Suspended",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Pause
    },
    banned: {
      label: "Banned",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: Ban
    }
  };
  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage platform users and their roles" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-400", children: [
            stats.superAdmins,
            " Super Admins"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400", children: [
            stats.churchAdmins,
            " Church Admins"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300", children: [
            stats.total,
            " Total"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search users by name, email, or phone...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "w-full" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.role || "all", onValueChange: (value) => handleRoleFilter(value || ""), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Role: All" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Role: All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "super_admin", children: "Super Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "church_admin", children: "Church Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "content_admin", children: "Content Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "content_creator", children: "Content Creator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "user", children: "User" })
          ] })
        ] })
      ] }) }),
      isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Roles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Joined" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: Array.from({
          length: 5
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8" }) })
        ] }, i)) })
      ] }) }) }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No users found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "Try adjusting your search or filter criteria." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Contact" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Roles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Joined" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: users.map((user) => {
            const userStatus = getUserStatusFromData(user);
            const statusInfo = statusConfig[userStatus];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar_url || "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-linear-to-br from-cyan-500 to-blue-600 text-white", children: getInitials(user.first_name, user.last_name) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-sm", children: [
                    user.first_name,
                    " ",
                    user.last_name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "ID: ",
                    user.id.slice(0, 8),
                    "..."
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                user.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }),
                  user.email
                ] }),
                user.phone_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3" }),
                  user.phone_number
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: user.user_roles && user.user_roles.length > 0 ? user.user_roles.map((ur, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[ur.role]}`, children: ur.role.replace("_", " ") }, idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${roleColors.user}`, children: "user" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.color}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(statusInfo.icon, { className: "w-3 h-3" }),
                statusInfo.label
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 text-sm text-muted-foreground", children: new Date(user.created_at).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/users/$userId", params: {
                  userId: user.id
                } }), nativeButton: false, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 mr-1" }),
                  "View"
                ] }),
                isCurrentSuperAdmin && !isUserSuperAdmin(user) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: userStatus !== "active" ? "text-green-600 hover:text-green-700" : "text-destructive hover:text-destructive", onClick: () => {
                  setStatusTargetUser(user);
                  setNewStatus(userStatus === "active" ? "banned" : "active");
                  setStatusReason("");
                  setStatusDialogOpen(true);
                }, children: [
                  userStatus !== "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-4 h-4 mr-1" }),
                  userStatus !== "active" ? "Activate" : "Ban"
                ] })
              ] }) })
            ] }, user.id);
          }) })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (page - 1) * 10 + 1,
            " to ",
            Math.min(page * 10, total),
            " ",
            "of ",
            total,
            " users"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === 1, onClick: () => handlePageChange(page - 1), children: "Previous" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === totalPages, onClick: () => handlePageChange(page + 1), children: "Next" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: statusDialogOpen, onOpenChange: setStatusDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Change User Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Update the status for ",
          statusTargetUser?.first_name || "",
          " ",
          statusTargetUser?.last_name || "",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "New Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newStatus, onValueChange: (v) => setNewStatus(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-green-600" }),
                " Active"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "w-3.5 h-3.5 text-gray-600" }),
                " Inactive"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "suspended", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5 text-yellow-600" }),
                " Suspended"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "banned", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3.5 h-3.5 text-red-600" }),
                " Banned"
              ] }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Why are you changing this user's status?", value: statusReason, onChange: (e) => setStatusReason(e.target.value), rows: 3 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setStatusDialogOpen(false), disabled: isUpdatingStatus, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: newStatus === "banned" ? "destructive" : "default", onClick: handleStatusUpdate, disabled: isUpdatingStatus, children: isUpdatingStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Updating..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Update Status" }) })
      ] })
    ] }) })
  ] });
}
export {
  UsersPage as component
};
