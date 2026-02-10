import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { a4 as Route$7, a5 as removeUserRole, a6 as assignUserRole } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { ag as ArrowLeft, x as User, Y as CircleCheckBig, Z as CircleX, ah as Shield, ai as Heart, D as DollarSign, c as Calendar, r as Phone, q as Mail, J as Globe, a7 as MapPin, H as Plus, a as Church, L as LoaderCircle, N as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/sonner.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
const roleColors = {
  super_admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  church_admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  content_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  content_creator: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  user: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
};
function InfoRow({
  icon: Icon,
  label,
  value
}) {
  if (!value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-slate-500 dark:text-slate-400" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: value })
    ] })
  ] });
}
function getLocalizedName(name) {
  if (typeof name === "object" && name !== null) {
    const obj = name;
    return obj.en || obj.am || "Unknown";
  }
  return String(name || "Unknown");
}
function UserDetailPage() {
  const {
    user
  } = Route$7.useLoaderData();
  const router = useRouter();
  const [addRoleDialogOpen, setAddRoleDialogOpen] = reactExports.useState(false);
  const [newRole, setNewRole] = reactExports.useState("");
  const [isAssigning, setIsAssigning] = reactExports.useState(false);
  const [isDeletingRole, setIsDeletingRole] = reactExports.useState(null);
  const typedUser = user;
  const fullName = `${typedUser.first_name || ""} ${typedUser.last_name || ""}`.trim() || "Unnamed User";
  const handleAssignRole = async () => {
    if (!newRole) return;
    setIsAssigning(true);
    try {
      await assignUserRole({
        data: {
          user_id: typedUser.id,
          role: newRole,
          assigned_by: typedUser.id
          // In real usage, use current admin's ID
        }
      });
      setAddRoleDialogOpen(false);
      setNewRole("");
      router.invalidate();
    } catch (error) {
      console.error("Failed to assign role:", error);
    } finally {
      setIsAssigning(false);
    }
  };
  const handleRemoveRole = async (roleId) => {
    setIsDeletingRole(roleId);
    try {
      await removeUserRole({
        data: {
          role_id: roleId
        }
      });
      router.invalidate();
    } catch (error) {
      console.error("Failed to remove role:", error);
    } finally {
      setIsDeletingRole(null);
    }
  };
  const totalDonations = typedUser.donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/users", search: {
        page: 1,
        search: void 0
      } }), nativeButton: false, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        "Back to Users"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0", children: typedUser.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: typedUser.avatar_url, alt: fullName, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-8 h-8 text-slate-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: typedUser.email || "No email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [
            typedUser.email_verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
              "Email Verified"
            ] }),
            typedUser.phone_verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
              "Phone Verified"
            ] }),
            !typedUser.email_verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
              "Email Not Verified"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-blue-500 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: typedUser.user_roles?.length || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Roles" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 text-red-500 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: typedUser.user_follows?.length || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Following" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5 text-green-500 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: typedUser.donations?.length || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Donations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-5 h-5 text-purple-500 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: typedUser.event_rsvps?.length || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "RSVPs" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white mb-4", children: "Personal Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-200 dark:divide-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Phone, label: "Phone", value: typedUser.phone_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Mail, label: "Email", value: typedUser.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: User, label: "Gender", value: typedUser.gender }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Calendar, label: "Date of Birth", value: typedUser.date_of_birth ? new Date(typedUser.date_of_birth).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }) : null }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Globe, label: "Language", value: typedUser.language_preference })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white mb-4", children: "Location & Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-200 dark:divide-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: MapPin, label: "City", value: typedUser.city }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: MapPin, label: "Country", value: typedUser.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Calendar, label: "Joined", value: new Date(typedUser.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }) }),
            typedUser.referral_code && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: User, label: "Referral Code", value: typedUser.referral_code }),
            typedUser.points !== null && typedUser.points !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: DollarSign, label: "Points", value: String(typedUser.points) })
          ] })
        ] }),
        typedUser.bio && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white mb-4", children: "Bio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 dark:text-slate-400 leading-relaxed", children: typedUser.bio })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white", children: "Roles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setAddRoleDialogOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
              "Add Role"
            ] })
          ] }),
          typedUser.user_roles && typedUser.user_roles.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: typedUser.user_roles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full capitalize ${roleColors[role.role] || roleColors.user}`, children: role.role.replace("_", " ") }),
                role.churches && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "w-3 h-3 inline mr-1" }),
                  getLocalizedName(role.churches.name)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => handleRemoveRole(role.id), disabled: isDeletingRole === role.id, children: isDeletingRole === role.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-destructive" }) })
          ] }, role.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No roles assigned." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white mb-4", children: "Following Churches" }),
          typedUser.user_follows && typedUser.user_follows.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: typedUser.user_follows.map((follow) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden shrink-0", children: follow.churches?.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: follow.churches.logo_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "w-4 h-4 text-slate-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: follow.churches ? getLocalizedName(follow.churches.name) : "Unknown Church" })
          ] }, follow.church_id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Not following any churches." })
        ] }),
        typedUser.donations && typedUser.donations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-900 dark:text-white", children: "Recent Donations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Total: ETB ",
              totalDonations.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: typedUser.donations.slice(0, 10).map((donation) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4 text-green-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
                  "ETB ",
                  donation.amount.toLocaleString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(donation.created_at).toLocaleDateString() })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full capitalize ${donation.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`, children: donation.status })
          ] }, donation.id)) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addRoleDialogOpen, onOpenChange: setAddRoleDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Assign a new role to ",
          fullName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newRole, onValueChange: (value) => setNewRole(value || ""), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a role" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "super_admin", children: "Super Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "church_admin", children: "Church Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "content_admin", children: "Content Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "content_creator", children: "Content Creator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "user", children: "User" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setAddRoleDialogOpen(false), disabled: isAssigning, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAssignRole, disabled: isAssigning || !newRole, children: isAssigning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Assigning..."
        ] }) : "Assign Role" })
      ] })
    ] }) })
  ] });
}
export {
  UserDetailPage as component
};
