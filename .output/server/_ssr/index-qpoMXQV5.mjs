import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { h as Route$h, i as updateProfile, j as changePassword, k as updateFeatureFlag, l as updatePaymentGateway, m as createFeatureFlag, n as deleteFeatureFlag, o as deletePaymentGateway } from "./router-deJypcsT.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { S as Switch } from "./switch-DFkPXkmz.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-gUnlM3z5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D6RZxBhq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { U as Users, a as Church, c as Calendar, D as DollarSign, F as FileText, x as User, y as Flag, e as CreditCard, L as LoaderCircle, z as Save, G as Lock, H as Plus, J as Globe, K as Building, N as Trash2, Q as Pencil, R as Key, W as Webhook, V as EyeOff, E as Eye } from "../_libs/lucide-react.mjs";
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
function SettingsPage() {
  const {
    flags,
    gateways,
    stats,
    profile
  } = Route$h.useLoaderData();
  const searchParams = Route$h.useSearch();
  const {
    locale
  } = useLocaleStore();
  const router = useRouter();
  const {
    user
  } = Route$h.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const typedFlags = flags;
  const typedGateways = gateways;
  const typedProfile = profile;
  const [createDialogOpen, setCreateDialogOpen] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [togglingId, setTogglingId] = reactExports.useState(null);
  const [newFlagKey, setNewFlagKey] = reactExports.useState("");
  const [newFlagNameEn, setNewFlagNameEn] = reactExports.useState("");
  const [newFlagNameAm, setNewFlagNameAm] = reactExports.useState("");
  const [newFlagDescEn, setNewFlagDescEn] = reactExports.useState("");
  const [newFlagScope, setNewFlagScope] = reactExports.useState("global");
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [firstName, setFirstName] = reactExports.useState(typedProfile?.first_name || "");
  const [lastName, setLastName] = reactExports.useState(typedProfile?.last_name || "");
  const [email, setEmail] = reactExports.useState(typedProfile?.email || "");
  const [phone, setPhone] = reactExports.useState(typedProfile?.phone_number || "");
  const [bio, setBio] = reactExports.useState(typedProfile?.bio || "");
  const [city, setCity] = reactExports.useState(typedProfile?.city || "");
  const [country, setCountry] = reactExports.useState(typedProfile?.country || "");
  const [gender, setGender] = reactExports.useState(typedProfile?.gender || "");
  const [langPref, setLangPref] = reactExports.useState(typedProfile?.language_preference || "en");
  const [isSavingProfile, setIsSavingProfile] = reactExports.useState(false);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [isChangingPassword, setIsChangingPassword] = reactExports.useState(false);
  const [editGatewayOpen, setEditGatewayOpen] = reactExports.useState(false);
  const [editingGateway, setEditingGateway] = reactExports.useState(null);
  const [gwApiKey, setGwApiKey] = reactExports.useState("");
  const [gwWebhookSecret, setGwWebhookSecret] = reactExports.useState("");
  const [showApiKey, setShowApiKey] = reactExports.useState(false);
  const [showWebhook, setShowWebhook] = reactExports.useState(false);
  const [isSavingGateway, setIsSavingGateway] = reactExports.useState(false);
  const [deleteGatewayOpen, setDeleteGatewayOpen] = reactExports.useState(false);
  const [deletingGatewayId, setDeletingGatewayId] = reactExports.useState(null);
  const [isDeletingGateway, setIsDeletingGateway] = reactExports.useState(false);
  const isSuperAdminUser = user?.role === "super_admin";
  const handleToggleFlag = async (id, currentValue) => {
    setTogglingId(id);
    try {
      await updateFeatureFlag({
        data: {
          id,
          is_enabled: !currentValue
        }
      });
      toast.success(`Feature flag ${!currentValue ? "enabled" : "disabled"}`);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setTogglingId(null);
    }
  };
  const handleToggleGateway = async (id, field, currentValue) => {
    setTogglingId(id + field);
    try {
      await updatePaymentGateway({
        data: {
          id,
          [field]: !currentValue
        }
      });
      toast.success("Payment gateway updated");
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setTogglingId(null);
    }
  };
  const handleCreateFlag = async () => {
    if (!newFlagKey.trim() || !newFlagNameEn.trim()) {
      toast.error("Key and English name are required");
      return;
    }
    setIsCreating(true);
    try {
      await createFeatureFlag({
        data: {
          key: newFlagKey.trim(),
          name: {
            en: newFlagNameEn.trim(),
            am: newFlagNameAm.trim() || newFlagNameEn.trim()
          },
          description: newFlagDescEn.trim() ? {
            en: newFlagDescEn.trim()
          } : void 0,
          is_enabled: false,
          scope: newFlagScope,
          created_by: user?.id || ""
        }
      });
      toast.success("Feature flag created");
      setCreateDialogOpen(false);
      resetCreateForm();
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };
  const handleDeleteFlag = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteFeatureFlag({
        data: {
          id: deletingId
        }
      });
      toast.success("Feature flag deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };
  const resetCreateForm = () => {
    setNewFlagKey("");
    setNewFlagNameEn("");
    setNewFlagNameAm("");
    setNewFlagDescEn("");
    setNewFlagScope("global");
  };
  const openEditGateway = (gw) => {
    setEditingGateway(gw);
    setGwApiKey(gw.api_key || "");
    setGwWebhookSecret(gw.webhook_secret || "");
    setShowApiKey(false);
    setShowWebhook(false);
    setEditGatewayOpen(true);
  };
  const handleSaveGateway = async () => {
    if (!editingGateway) return;
    setIsSavingGateway(true);
    try {
      await updatePaymentGateway({
        data: {
          id: editingGateway.id,
          api_key: gwApiKey.trim() || null,
          webhook_secret: gwWebhookSecret.trim() || null
        }
      });
      toast.success("Payment gateway updated");
      setEditGatewayOpen(false);
      setEditingGateway(null);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSavingGateway(false);
    }
  };
  const handleDeleteGateway = async () => {
    if (!deletingGatewayId) return;
    setIsDeletingGateway(true);
    try {
      await deletePaymentGateway({
        data: {
          id: deletingGatewayId
        }
      });
      toast.success("Payment gateway deleted");
      setDeleteGatewayOpen(false);
      setDeletingGatewayId(null);
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeletingGateway(false);
    }
  };
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        data: {
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          email: email.trim() || null,
          phone_number: phone.trim() || null,
          bio: bio.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
          gender: gender || null,
          language_preference: langPref || null
        }
      });
      toast.success("Profile updated successfully");
      router.invalidate();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSavingProfile(false);
    }
  };
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword({
        data: {
          newPassword
        }
      });
      toast.success("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsChangingPassword(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Platform configuration and your profile" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }), iconBg: "bg-blue-100 dark:bg-blue-900/30", label: "Users", value: String(stats.users) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }), iconBg: "bg-purple-100 dark:bg-purple-900/30", label: "Churches", value: String(stats.churches) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-green-600 dark:text-green-400" }), iconBg: "bg-green-100 dark:bg-green-900/30", label: "Events", value: String(stats.events) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), iconBg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Donations", value: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "ETB",
          minimumFractionDigits: 0
        }).format(stats.totalDonations) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }), iconBg: "bg-amber-100 dark:bg-amber-900/30", label: "Content", value: String(stats.content) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: searchParams.tab || "profile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "profile", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 mr-1.5" }),
            "Profile"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "feature-flags", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4 mr-1.5" }),
            "Feature Flags"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "payment-gateways", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 mr-1.5" }),
            "Payment Gateways"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "profile", className: "mt-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-6 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-16 w-16", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: typedProfile?.avatar_url || "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-lg bg-primary/10 text-primary", children: ((typedProfile?.first_name?.[0] || "") + (typedProfile?.last_name?.[0] || "")).toUpperCase() || "A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: `${typedProfile?.first_name || ""} ${typedProfile?.last_name || ""}`.trim() || "Admin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: typedProfile?.email || "No email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", children: user?.role || "admin" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "First Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: firstName, onChange: (e) => setFirstName(e.target.value), placeholder: "First name" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Last Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: lastName, onChange: (e) => setLastName(e.target.value), placeholder: "Last name" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", type: "email" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+251..." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "City" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: city, onChange: (e) => setCity(e.target.value), placeholder: "City" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Country" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: country, onChange: (e) => setCountry(e.target.value), placeholder: "Country" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Gender" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: gender || "unset", onValueChange: (v) => setGender(v === "unset" ? "" : v), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select gender" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unset", children: "Prefer not to say" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "male", children: "Male" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "female", children: "Female" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Language Preference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: langPref || "en", onValueChange: (v) => {
                  if (v) setLangPref(v);
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "en", children: "English" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "am", children: "Amharic" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Bio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), placeholder: "Tell us about yourself...", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", rows: 3 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveProfile, disabled: isSavingProfile, children: isSavingProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
              "Saving..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
              "Save Profile"
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Change Password" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "New Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "Min. 6 characters" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Confirm Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Repeat password" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleChangePassword, disabled: isChangingPassword || !newPassword || !confirmPassword, variant: "outline", children: isChangingPassword ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
              "Changing..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 mr-2" }),
              "Change Password"
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "feature-flags", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              typedFlags.length,
              " feature flag",
              typedFlags.length !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setCreateDialogOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
              "Add Flag"
            ] })
          ] }),
          typedFlags.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-7 w-7 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No feature flags" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-4", children: "Create feature flags to toggle functionality across the platform." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateDialogOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
              "Create First Flag"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: typedFlags.map((flag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full shrink-0 ${flag.is_enabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: getLocalizedText(flag.name, locale) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono", children: flag.key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${flag.scope === "global" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"}`, children: [
                    flag.scope === "global" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "h-2.5 w-2.5" }),
                    flag.scope
                  ] })
                ] }),
                flag.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: getLocalizedText(flag.description, locale) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: flag.is_enabled, onCheckedChange: () => handleToggleFlag(flag.id, flag.is_enabled), disabled: togglingId === flag.id }),
              showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive hover:text-destructive", onClick: () => {
                setDeletingId(flag.id);
                setDeleteDialogOpen(true);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }, flag.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "payment-gateways", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            typedGateways.length,
            " payment gateway",
            typedGateways.length !== 1 ? "s" : "",
            " configured."
          ] }),
          typedGateways.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-7 w-7 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No payment gateways" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "No gateways have been configured yet." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: typedGateways.map((gw) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                gw.icon_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gw.icon_url, alt: gw.name, className: "h-10 w-10 rounded-lg object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", style: {
                  backgroundColor: gw.color || "#6366f1"
                }, children: gw.name.slice(0, 2).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: getLocalizedText(gw.display_name, locale) || gw.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px] text-muted-foreground font-mono", children: gw.slug })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full mr-2 ${gw.is_active ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => openEditGateway(gw), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
                isSuperAdminUser && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-destructive hover:text-destructive", onClick: () => {
                  setDeletingGatewayId(gw.id);
                  setDeleteGatewayOpen(true);
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-3 w-3" }),
                "API Key: ",
                gw.api_key ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400 font-medium", children: "Set" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 dark:text-amber-400", children: "Not set" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "h-3 w-3" }),
                "Webhook: ",
                gw.webhook_secret ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400 font-medium", children: "Set" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 dark:text-amber-400", children: "Not set" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `s-active-${gw.id}`, className: "text-xs", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: `s-active-${gw.id}`, checked: gw.is_active, onCheckedChange: () => handleToggleGateway(gw.id, "is_active", gw.is_active), disabled: togglingId === gw.id + "is_active" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `s-test-${gw.id}`, className: "text-xs", children: "Test Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: `s-test-${gw.id}`, checked: gw.test_mode, onCheckedChange: () => handleToggleGateway(gw.id, "test_mode", gw.test_mode), disabled: togglingId === gw.id + "test_mode" })
              ] })
            ] })
          ] }, gw.id)) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createDialogOpen, onOpenChange: setCreateDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create Feature Flag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Add a new feature flag to toggle functionality." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Key *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newFlagKey, onChange: (e) => setNewFlagKey(e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")), placeholder: "e.g. enable_live_streaming", className: "font-mono text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name (English) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newFlagNameEn, onChange: (e) => setNewFlagNameEn(e.target.value), placeholder: "English name" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name (Amharic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newFlagNameAm, onChange: (e) => setNewFlagNameAm(e.target.value), placeholder: "የአማርኛ ስም" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newFlagDescEn, onChange: (e) => setNewFlagDescEn(e.target.value), placeholder: "What does this flag control?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Scope *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newFlagScope, onValueChange: (v) => {
            if (v) setNewFlagScope(v);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "global", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
                "Global"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "church", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "h-3.5 w-3.5" }),
                "Church"
              ] }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setCreateDialogOpen(false);
          resetCreateForm();
        }, disabled: isCreating, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleCreateFlag, disabled: isCreating || !newFlagKey.trim() || !newFlagNameEn.trim(), children: isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Creating..."
        ] }) : "Create Flag" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Feature Flag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeleteFlag, disabled: isDeleting, children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editGatewayOpen, onOpenChange: setEditGatewayOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5" }),
          "Edit ",
          editingGateway?.name || "Gateway"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update API credentials for this payment gateway." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-3.5 w-3.5" }),
            " API Key"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: showApiKey ? "text" : "password", value: gwApiKey, onChange: (e) => setGwApiKey(e.target.value), placeholder: "Enter API key...", className: "pr-10 font-mono text-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "absolute right-0 top-0 h-full w-10", onClick: () => setShowApiKey(!showApiKey), children: showApiKey ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "h-3.5 w-3.5" }),
            " Webhook Secret"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: showWebhook ? "text" : "password", value: gwWebhookSecret, onChange: (e) => setGwWebhookSecret(e.target.value), placeholder: "Enter webhook secret...", className: "pr-10 font-mono text-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "absolute right-0 top-0 h-full w-10", onClick: () => setShowWebhook(!showWebhook), children: showWebhook ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditGatewayOpen(false), disabled: isSavingGateway, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveGateway, disabled: isSavingGateway, children: isSavingGateway ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Saving..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
          "Save"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteGatewayOpen, onOpenChange: setDeleteGatewayOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Payment Gateway" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "This will permanently remove this gateway and its configuration. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteGatewayOpen(false), disabled: isDeletingGateway, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeleteGateway, disabled: isDeletingGateway, children: isDeletingGateway ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete Gateway" })
      ] })
    ] }) })
  ] });
}
function OverviewCard({
  icon,
  iconBg,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl p-4 border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${iconBg}`, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold truncate", children: value })
    ] })
  ] }) });
}
export {
  SettingsPage as component
};
