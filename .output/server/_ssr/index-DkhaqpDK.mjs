import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { a7 as Route$6, a8 as updateEvent, a9 as updateEventStatus, aa as deleteEvent } from "./router-deJypcsT.mjs";
import { E as EventStatusBadge } from "./event-status-badge-Cc4u8kjj.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { u as useLocaleStore, g as getLocalizedText, L as LOCALES } from "./locale-store-Cb3Cdr7y.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D6RZxBhq.mjs";
import { S as Switch } from "./switch-DFkPXkmz.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { ag as ArrowLeft, a5 as Video, c as Calendar, aj as RotateCcw, L as LoaderCircle, z as Save, Q as Pencil, N as Trash2, n as Clock, J as Globe, a6 as ExternalLink, a7 as MapPin, a as Church, x as User, U as Users, D as DollarSign, X, ak as CircleQuestionMark, l as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_chunks/_libs/@radix-ui/react-avatar.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-use-is-hydrated.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/zustand.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
const rsvpStatusConfig = {
  going: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
    label: "Going",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
  },
  maybe: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-3 w-3" }),
    label: "Maybe",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
  },
  not_going: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
    label: "Not Going",
    className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  }
};
function getInitials$1(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}
function EventRsvpTable({ rsvps }) {
  if (!rsvps || rsvps.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No RSVPs yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Attendees will appear here once they RSVP." })
    ] });
  }
  const going = rsvps.filter((r) => r.status === "going");
  const maybe = rsvps.filter((r) => r.status === "maybe");
  const notGoing = rsvps.filter((r) => r.status === "not_going");
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-emerald-500" }),
        going.length,
        " Going"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-amber-500" }),
        maybe.length,
        " Maybe"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-red-500" }),
        notGoing.length,
        " Not Going"
      ] }),
      totalGuests > rsvps.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "(",
        totalGuests,
        " total guests)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Attendee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Guests" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Date" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: rsvps.map((rsvp) => {
        const config = rsvpStatusConfig[rsvp.status] || rsvpStatusConfig.going;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: rsvp.profiles?.avatar_url || "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px] bg-primary/10 text-primary", children: getInitials$1(rsvp.profiles?.first_name, rsvp.profiles?.last_name) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: rsvp.profiles ? `${rsvp.profiles.first_name || ""} ${rsvp.profiles.last_name || ""}`.trim() || "Unknown" : "Unknown" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`, children: [
            config.icon,
            config.label
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-muted-foreground", children: rsvp.guest_count || 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-muted-foreground", children: new Date(rsvp.created_at).toLocaleDateString() })
        ] }, rsvp.id);
      }) })
    ] }) })
  ] });
}
function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "A";
}
function formatCurrency(amount, currency = "ETB") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0
  }).format(amount);
}
const donationStatusColors = {
  pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  refunded: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
};
function EventDonationsTable({ donations }) {
  if (!donations || donations.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-6 w-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No donations yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Donations for this event will appear here." })
    ] });
  }
  const totalAmount = donations.filter((d) => d.status === "completed").reduce((sum, d) => sum + d.amount, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-600 dark:text-emerald-400", children: formatCurrency(totalAmount) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "raised from ",
        donations.length,
        " donation",
        donations.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Donor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Date" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: donations.map((donation) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: donation.is_anonymous ? "" : donation.profiles?.avatar_url || "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px] bg-primary/10 text-primary", children: donation.is_anonymous ? "A" : getInitials(donation.profiles?.first_name, donation.profiles?.last_name) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: donation.is_anonymous ? "Anonymous" : donation.profiles ? `${donation.profiles.first_name || ""} ${donation.profiles.last_name || ""}`.trim() || "Unknown" : "Unknown" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-600 dark:text-emerald-400", children: formatCurrency(donation.amount, donation.currency) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${donationStatusColors[donation.status] || ""}`, children: donation.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-muted-foreground", children: new Date(donation.created_at).toLocaleDateString() })
      ] }, donation.id)) })
    ] }) })
  ] });
}
const STATUS_OPTIONS = [{
  value: "draft",
  label: "Draft"
}, {
  value: "published",
  label: "Published"
}, {
  value: "completed",
  label: "Completed"
}, {
  value: "cancelled",
  label: "Cancelled"
}];
function getLocalizedHtml(value, locale) {
  const text = getLocalizedText(value, locale);
  return typeof text === "string" ? text : "";
}
function EventDetailPage() {
  const {
    event: eventData,
    donations
  } = Route$6.useLoaderData();
  const {
    locale
  } = useLocaleStore();
  const router = useRouter();
  const {
    user
  } = Route$6.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const item = eventData;
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [statusChanging, setStatusChanging] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [editTitle, setEditTitle] = reactExports.useState({});
  const [editDescription, setEditDescription] = reactExports.useState({});
  const [editStartTime, setEditStartTime] = reactExports.useState("");
  const [editEndTime, setEditEndTime] = reactExports.useState("");
  const [editIsOnline, setEditIsOnline] = reactExports.useState(false);
  const [editMeetingUrl, setEditMeetingUrl] = reactExports.useState("");
  const [editAddress, setEditAddress] = reactExports.useState({});
  const [editMaxAttendees, setEditMaxAttendees] = reactExports.useState("");
  const [editRsvpDeadline, setEditRsvpDeadline] = reactExports.useState("");
  const title = getLocalizedText(item.title, locale);
  const description = getLocalizedHtml(item.description, locale);
  const churchName = item.churches ? getLocalizedText(item.churches.name, locale) : "";
  const locationText = getLocalizedText(item.location, locale);
  const addressText = getLocalizedText(item.address, locale);
  const displayLocation = locationText || addressText;
  const creatorProfile = item.profiles;
  const creatorName = creatorProfile ? `${creatorProfile.first_name || ""} ${creatorProfile.last_name || ""}`.trim() : "Unknown";
  const rsvps = item.event_rsvps || [];
  const goingCount = rsvps.filter((r) => r.status === "going").length;
  const now = /* @__PURE__ */ new Date();
  const startDate = new Date(item.start_time);
  const endDate = new Date(item.end_time);
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;
  const startEditing = () => {
    const titleObj = {};
    const descObj = {};
    const addrObj = {};
    for (const loc of LOCALES) {
      titleObj[loc.value] = getLocalizedText(item.title, loc.value);
      descObj[loc.value] = getLocalizedText(item.description, loc.value);
      addrObj[loc.value] = getLocalizedText(item.address, loc.value);
    }
    setEditTitle(titleObj);
    setEditDescription(descObj);
    setEditAddress(addrObj);
    setEditStartTime(formatDateTimeLocal(item.start_time));
    setEditEndTime(formatDateTimeLocal(item.end_time));
    setEditIsOnline(item.is_online || false);
    setEditMeetingUrl(item.meeting_url || "");
    setEditMaxAttendees(item.max_attendees ? String(item.max_attendees) : "");
    setEditRsvpDeadline(item.rsvp_deadline ? formatDateTimeLocal(item.rsvp_deadline) : "");
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      await updateEvent({
        data: {
          id: item.id,
          title: editTitle,
          description: editDescription,
          start_time: new Date(editStartTime).toISOString(),
          end_time: new Date(editEndTime).toISOString(),
          is_online: editIsOnline,
          meeting_url: editIsOnline ? editMeetingUrl || null : null,
          address: Object.values(editAddress).some((v) => v.trim()) ? editAddress : null,
          max_attendees: editMaxAttendees ? Number(editMaxAttendees) : null,
          rsvp_deadline: editRsvpDeadline ? new Date(editRsvpDeadline).toISOString() : null
        }
      });
      toast.success("Event updated successfully");
      setIsEditing(false);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed to update: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleStatusChange = async (newStatus) => {
    if (newStatus === item.status) return;
    if (newStatus === "published" && isPast) {
      toast.error("Cannot publish a past event");
      return;
    }
    if (newStatus === "completed" && isUpcoming) {
      toast.error("Cannot mark as completed — the event hasn't started yet");
      return;
    }
    setStatusChanging(true);
    try {
      await updateEventStatus({
        data: {
          id: item.id,
          status: newStatus
        }
      });
      toast.success(`Status changed to ${STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus}`);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed to update status: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setStatusChanging(false);
    }
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent({
        data: {
          id: item.id
        }
      });
      toast.success("Event deleted successfully");
      router.navigate({
        to: "/dashboard/events",
        search: {
          page: 1,
          search: void 0
        }
      });
    } catch (error) {
      toast.error(`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const formatTime = (date) => new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/events", search: {
        page: 1,
        search: void 0
      } }), nativeButton: false, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Back to Events"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden", children: [
        item.cover_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-64 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.cover_image_url, alt: title, className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex gap-2", children: [
            item.is_online && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 bg-purple-500 text-white text-xs rounded-full flex items-center gap-1.5 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-3 h-3" }),
              "Online"
            ] }),
            isOngoing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-green-500 text-white text-xs rounded-full font-medium animate-pulse", children: "Live Now" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-48 bg-muted flex items-center justify-center relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-16 w-16 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 flex gap-2", children: item.is_online && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 bg-purple-500 text-white text-xs rounded-full flex items-center gap-1.5 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-3 h-3" }),
            "Online"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: title || "Untitled Event" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(EventStatusBadge, { status: item.status }),
              isPast && item.status !== "completed" && item.status !== "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400", children: "Past Event" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleCancelEdit, disabled: isSubmitting, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Cancel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: handleSaveEdit, disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }),
              "Saving..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Save Changes"
            ] }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: startEditing, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Edit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: item.status, onValueChange: handleStatusChange, disabled: statusChanging, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px] h-9 text-sm", children: statusChanging ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                "Updating..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
            ] }),
            showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive hover:text-destructive h-9 w-9", onClick: () => setDeleteDialogOpen(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }) })
      ] }),
      isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditEventForm, { editTitle, setEditTitle, editDescription, setEditDescription, editStartTime, setEditStartTime, editEndTime, setEditEndTime, editIsOnline, setEditIsOnline, editMeetingUrl, setEditMeetingUrl, editAddress, setEditAddress, editMaxAttendees, setEditMaxAttendees, editRsvpDeadline, setEditRsvpDeadline }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Event Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }), label: "Date", value: formatDate(item.start_time) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), label: "Time", value: `${formatTime(item.start_time)} - ${formatTime(item.end_time)}` }),
              item.is_online ? item.meeting_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Meeting Link" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: item.meeting_url, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-medium text-primary hover:underline flex items-center gap-1", children: [
                    "Join Meeting",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4 text-muted-foreground" }), label: "Format", value: "Online Event" }) : displayLocation ? /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }), label: "Location", value: displayLocation }) : null,
              churchName && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "h-4 w-4 text-muted-foreground" }), label: "Church", value: churchName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground" }), label: "Created by", value: creatorName }),
              item.rsvp_deadline && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), label: "RSVP Deadline", value: formatDate(item.rsvp_deadline) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Engagement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 mx-auto mb-1 text-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: goingCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attending" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 mx-auto mb-1 text-amber-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: rsvps.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total RSVPs" })
              ] }),
              item.max_attendees && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 mx-auto mb-1 text-purple-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: item.max_attendees }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Max Capacity" })
              ] }),
              item.has_donation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 mx-auto mb-1 text-green-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: item.donation_currency || "ETB",
                  minimumFractionDigits: 0
                }).format(item.donation_current_amount || 0) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.donation_goal_amount ? `of ${new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: item.donation_currency || "ETB",
                  minimumFractionDigits: 0
                }).format(item.donation_goal_amount)} goal` : "Raised" })
              ] })
            ] }),
            item.event_co_hosts && item.event_co_hosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Co-hosts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: item.event_co_hosts.map((coHost) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-5 w-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: coHost.churches?.logo_url || "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[8px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "h-3 w-3" }) })
                ] }),
                coHost.churches ? getLocalizedText(coHost.churches.name, locale) : "Unknown"
              ] }, coHost.id)) })
            ] })
          ] }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none",
                dangerouslySetInnerHTML: {
                  __html: description
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "rsvps", className: "rounded-xl border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "rsvps", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-1.5" }),
              "RSVPs (",
              rsvps.length,
              ")"
            ] }),
            item.has_donation && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "donations", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 mr-1.5" }),
              "Donations (",
              donations.length,
              ")"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rsvps", className: "p-5 mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventRsvpTable, { rsvps }) }),
          item.has_donation && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "donations", className: "p-5 mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventDonationsTable, { donations }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          'Are you sure you want to delete "',
          title,
          '"? This action cannot be undone.'
        ] })
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
function InfoRow({
  icon,
  label,
  value
}) {
  if (!value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-muted shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: value })
    ] })
  ] });
}
function formatDateTimeLocal(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function EditEventForm({
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editStartTime,
  setEditStartTime,
  editEndTime,
  setEditEndTime,
  editIsOnline,
  setEditIsOnline,
  editMeetingUrl,
  setEditMeetingUrl,
  editAddress,
  setEditAddress,
  editMaxAttendees,
  setEditMaxAttendees,
  editRsvpDeadline,
  setEditRsvpDeadline
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: LOCALES.slice(0, 2).map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
          loc.label,
          " ",
          loc.value === "en" || loc.value === "am" ? "*" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editTitle[loc.value] || "", onChange: (e) => setEditTitle((prev) => ({
          ...prev,
          [loc.value]: e.target.value
        })), placeholder: `Title in ${loc.label}` })
      ] }, loc.value)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: LOCALES.slice(0, 2).map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: loc.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: editDescription[loc.value] || "", onChange: (e) => setEditDescription((prev) => ({
          ...prev,
          [loc.value]: e.target.value
        })), placeholder: `Description in ${loc.label}`, rows: 3, className: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" })
      ] }, loc.value)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Date & Time" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Start Time *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: editStartTime, onChange: (e) => setEditStartTime(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "End Time *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: editEndTime, onChange: (e) => setEditEndTime(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "RSVP Deadline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: editRsvpDeadline, onChange: (e) => setEditRsvpDeadline(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Max Attendees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editMaxAttendees, onChange: (e) => setEditMaxAttendees(e.target.value), placeholder: "No limit" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: editIsOnline, onCheckedChange: setEditIsOnline }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Online Event" })
      ] }),
      editIsOnline ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Meeting URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editMeetingUrl, onChange: (e) => setEditMeetingUrl(e.target.value), placeholder: "https://zoom.us/..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: LOCALES.slice(0, 2).map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
          "Address (",
          loc.label,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editAddress[loc.value] || "", onChange: (e) => setEditAddress((prev) => ({
          ...prev,
          [loc.value]: e.target.value
        })), placeholder: `Address in ${loc.label}` })
      ] }, loc.value)) })
    ] })
  ] });
}
export {
  EventDetailPage as component
};
