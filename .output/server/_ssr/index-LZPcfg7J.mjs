import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useSuspenseQuery, q as queryOptions } from "../_chunks/_libs/@tanstack/react-query.mjs";
import { s as Route$f, t as getNotifications, w as searchUsersForNotification, x as sendNotification, y as deleteNotification, v as getNotificationStats } from "./router-deJypcsT.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a1 as Megaphone, d as Bell, a2 as BellRing, p as Funnel, a3 as MailOpen, q as Mail, N as Trash2, _ as ChevronLeft, g as ChevronRight, L as LoaderCircle, a4 as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/zustand.mjs";
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
import "../_chunks/_libs/@radix-ui/react-avatar.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-use-is-hydrated.mjs";
const NOTIFICATION_TYPE_LABELS = {
  verse_of_day: "Verse of the Day",
  new_content: "New Content",
  event_reminder: "Event Reminder",
  event_update: "Event Update",
  donation_received: "Donation Received",
  role_invitation: "Role Invitation",
  content_approved: "Content Approved",
  content_rejected: "Content Rejected",
  room_started: "Room Started",
  donation_campaign_update: "Campaign Update",
  prayer_request: "Prayer Request",
  church_announcement: "Church Announcement",
  system_message: "System Message",
  achievement: "Achievement"
};
const NOTIFICATION_TYPE_COLORS = {
  verse_of_day: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  new_content: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  event_reminder: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  event_update: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  donation_received: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  role_invitation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  content_approved: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  content_rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  room_started: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  donation_campaign_update: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  prayer_request: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  church_announcement: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  system_message: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  achievement: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
};
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
function NotificationsPage() {
  const searchParams = Route$f.useSearch();
  const navigate = useNavigate({
    from: Route$f.fullPath
  });
  const {
    locale
  } = useLocaleStore();
  const {
    user
  } = Route$f.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const notificationsQuery = useSuspenseQuery(notificationsQueryOptions({
    page: searchParams.page,
    type: searchParams.type
  }));
  const statsQuery = useSuspenseQuery(notificationStatsQueryOptions());
  const stats = statsQuery.data;
  const [sendDialogOpen, setSendDialogOpen] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [sendTitleEn, setSendTitleEn] = reactExports.useState("");
  const [sendTitleAm, setSendTitleAm] = reactExports.useState("");
  const [sendBodyEn, setSendBodyEn] = reactExports.useState("");
  const [sendBodyAm, setSendBodyAm] = reactExports.useState("");
  const [sendType, setSendType] = reactExports.useState("system_message");
  const [isSending, setIsSending] = reactExports.useState(false);
  const [sendTarget, setSendTarget] = reactExports.useState("all");
  const [userSearchQuery, setUserSearchQuery] = reactExports.useState("");
  const [userSearchResults, setUserSearchResults] = reactExports.useState([]);
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [isSearchingUsers, setIsSearchingUsers] = reactExports.useState(false);
  const handleTypeFilter = (value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: !value || value === "all" ? void 0 : value,
        page: 1
      })
    });
  };
  const handleSearchUsers = async (query) => {
    setUserSearchQuery(query);
    if (query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    try {
      const results = await searchUsersForNotification({
        data: {
          query: query.trim()
        }
      });
      setUserSearchResults(results);
    } catch {
      setUserSearchResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };
  const handleSendNotification = async () => {
    if (!sendTitleEn.trim() || !sendBodyEn.trim()) {
      toast.error("Title and body are required");
      return;
    }
    if (sendTarget === "single" && !selectedUser) {
      toast.error("Please select a user");
      return;
    }
    setIsSending(true);
    try {
      const result = await sendNotification({
        data: {
          title: {
            en: sendTitleEn.trim(),
            am: sendTitleAm.trim() || sendTitleEn.trim()
          },
          body: {
            en: sendBodyEn.trim(),
            am: sendBodyAm.trim() || sendBodyEn.trim()
          },
          type: sendType,
          user_ids: sendTarget === "single" && selectedUser ? [selectedUser.id] : void 0,
          sent_by: user?.id
        }
      });
      toast.success(result.broadcast ? "Broadcast notification sent to all users" : `Notification sent to ${result.sent} user${result.sent !== 1 ? "s" : ""}`);
      setSendDialogOpen(false);
      resetSendForm();
      notificationsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSending(false);
    }
  };
  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteNotification({
        data: {
          id: deletingId
        }
      });
      toast.success("Notification deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      notificationsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };
  const resetSendForm = () => {
    setSendTitleEn("");
    setSendTitleAm("");
    setSendBodyEn("");
    setSendBodyAm("");
    setSendType("system_message");
    setSendTarget("all");
    setSelectedUser(null);
    setUserSearchQuery("");
    setUserSearchResults([]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Send and manage notifications to all users" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setSendDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4 mr-1.5" }),
          "Send Notification"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }), iconBg: "bg-blue-100 dark:bg-blue-900/30", label: "Total Sent", value: String(stats.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }), iconBg: "bg-amber-100 dark:bg-amber-900/30", label: "Unread", value: String(stats.unread) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" }), iconBg: "bg-slate-100 dark:bg-slate-900/30", label: "System Messages", value: String(stats.systemMessages) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchParams.type || "all", onValueChange: handleTypeFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-[220px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Types" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Types" }),
          Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: key, children: label }, key))
        ] })
      ] }) }),
      notificationsQuery.data.notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-4", children: "Send a notification to all users to get started." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setSendDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4 mr-1.5" }),
          "Send First Notification"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: notificationsQuery.data.notifications.map((notif) => {
          const profiles = notif.profiles;
          const isRead = notif.is_read;
          const notifType = notif.type;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors ${!isRead ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 shrink-0", children: isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(MailOpen, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-blue-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: getLocalizedText(notif.title, locale) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${NOTIFICATION_TYPE_COLORS[notifType] || "bg-muted text-muted-foreground"}`, children: NOTIFICATION_TYPE_LABELS[notifType] || notifType })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: getLocalizedText(notif.body, locale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground", children: [
                notif.is_broadcast ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-2.5 w-2.5" }),
                  "Broadcast"
                ] }) : profiles ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "To: ",
                  profiles.first_name || "",
                  " ",
                  profiles.last_name || ""
                ] }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(notif.created_at).toLocaleString() })
              ] })
            ] }),
            showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 shrink-0 text-destructive hover:text-destructive", onClick: () => {
              setDeletingId(notif.id);
              setDeleteDialogOpen(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }, notif.id);
        }) }),
        notificationsQuery.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (notificationsQuery.data.page - 1) * 20 + 1,
            " to",
            " ",
            Math.min(notificationsQuery.data.page * 20, notificationsQuery.data.total),
            " ",
            "of ",
            notificationsQuery.data.total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: notificationsQuery.data.page <= 1, onClick: () => navigate({
              search: (prev) => ({
                ...prev,
                page: notificationsQuery.data.page - 1
              })
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              "Previous"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: notificationsQuery.data.page >= notificationsQuery.data.totalPages, onClick: () => navigate({
              search: (prev) => ({
                ...prev,
                page: notificationsQuery.data.page + 1
              })
            }), children: [
              "Next",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: sendDialogOpen, onOpenChange: setSendDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Send Notification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Broadcast sends one notification visible to all users. Targeted sends to a specific user." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Send To *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: sendTarget === "all" ? "default" : "outline", size: "sm", onClick: () => {
              setSendTarget("all");
              setSelectedUser(null);
            }, children: "All Users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: sendTarget === "single" ? "default" : "outline", size: "sm", onClick: () => setSendTarget("single"), children: "Single User" })
          ] })
        ] }),
        sendTarget === "single" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: selectedUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: selectedUser.avatar_url || "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-primary/10 text-primary", children: (selectedUser.first_name?.[0] || "") + (selectedUser.last_name?.[0] || "") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: `${selectedUser.first_name || ""} ${selectedUser.last_name || ""}`.trim() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedUser.email || "" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedUser(null), children: "Change" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name, email, or phone...", value: userSearchQuery, onChange: (e) => handleSearchUsers(e.target.value) }),
          isSearchingUsers && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Searching..." }),
          userSearchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border max-h-40 overflow-auto divide-y", children: userSearchResults.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "w-full flex items-center gap-2.5 p-2.5 hover:bg-muted/50 text-left transition-colors", onClick: () => {
            setSelectedUser(u);
            setUserSearchResults([]);
            setUserSearchQuery("");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: u.avatar_url || "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px] bg-primary/10 text-primary", children: (u.first_name?.[0] || "") + (u.last_name?.[0] || "") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: u.email || "" })
            ] })
          ] }, u.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sendType, onValueChange: (v) => {
            if (v) setSendType(v);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "system_message", children: "System Message" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "church_announcement", children: "Church Announcement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new_content", children: "New Content" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "event_reminder", children: "Event Reminder" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "prayer_request", children: "Prayer Request" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "verse_of_day", children: "Verse of the Day" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title (English) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: sendTitleEn, onChange: (e) => setSendTitleEn(e.target.value), placeholder: "Notification title" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title (Amharic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: sendTitleAm, onChange: (e) => setSendTitleAm(e.target.value), placeholder: "የማሳወቂያ ርዕስ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Body (English) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: sendBodyEn, onChange: (e) => setSendBodyEn(e.target.value), placeholder: "Write the notification message...", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", rows: 3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Body (Amharic)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: sendBodyAm, onChange: (e) => setSendBodyAm(e.target.value), placeholder: "የማሳወቂያ መልእክት ይጻፉ...", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", rows: 3 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setSendDialogOpen(false);
          resetSendForm();
        }, disabled: isSending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSendNotification, disabled: isSending || !sendTitleEn.trim() || !sendBodyEn.trim(), children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Sending..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
          sendTarget === "single" ? "Send to User" : "Send to All Users"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Notification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "This will permanently remove this notification." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) })
  ] });
}
function StatCard({
  icon,
  iconBg,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl p-4 border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${iconBg}`, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: value })
    ] })
  ] }) });
}
export {
  NotificationsPage as component
};
