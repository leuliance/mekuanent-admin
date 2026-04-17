import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	AlertCircle,
	Building,
	Calendar,
	Church,
	CreditCard,
	DollarSign,
	Eye,
	EyeOff,
	FileText,
	Flag,
	Globe,
	Key,
	Loader2,
	Lock,
	Pencil,
	Plus,
	Save,
	Trash2,
	User,
	Users,
	Webhook,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword, getProfile, updateProfile } from "@/api/profile";
import {
	createFeatureFlag,
	deleteFeatureFlag,
	deletePaymentGateway,
	getAppOverviewStats,
	getFeatureFlags,
	getPaymentGateways,
	updateFeatureFlag,
	updatePaymentGateway,
} from "@/api/settings";
import { ResponsiveTabs } from "@/components/responsive-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { canDelete } from "@/lib/roles";
import { getLocalizedText, useLocaleStore } from "@/stores/locale-store";
import type { Database } from "@/types/database.types";

type FeatureFlagScope = Database["public"]["Enums"]["feature_flag_scope"];

export const Route = createFileRoute("/_authenticated/dashboard/settings/")({
	validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
		tab: (search.tab as string) || "profile",
	}),
	loader: async () => {
		const [flags, gateways, stats, profile] = await Promise.all([
			getFeatureFlags({ data: {} }),
			getPaymentGateways(),
			getAppOverviewStats(),
			getProfile(),
		]);
		return { flags, gateways, stats, profile };
	},
	pendingComponent: SettingsLoadingSkeleton,
	errorComponent: SettingsErrorState,
	component: SettingsPage,
});

// ============ LOADING SKELETON ============
function SettingsLoadingSkeleton() {
	return (
		<>
			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-5xl mx-auto space-y-6">
					<Skeleton className="h-8 w-32" />
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-24 rounded-xl" />
						))}
					</div>
					<Skeleton className="h-96 rounded-xl" />
				</div>
			</div>
		</>
	);
}

// ============ ERROR STATE ============
function SettingsErrorState({ error }: { error: Error }) {
	return (
		<>
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="text-center max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
					<h2 className="text-xl font-semibold mb-2">
						Failed to Load Settings
					</h2>
					<p className="text-muted-foreground mb-4">{error.message}</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</div>
			</div>
		</>
	);
}

// ============ MAIN PAGE ============
function SettingsPage() {
	const { flags, gateways, stats, profile } = Route.useLoaderData();
	const searchParams = Route.useSearch();
	const { locale } = useLocaleStore();
	const router = useRouter();
	const navigate = useNavigate({ from: Route.fullPath });
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);

	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data
	const typedFlags = flags as any[];
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data
	const typedGateways = gateways as any[];
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data
	const typedProfile = profile as any;

	// ---- Feature Flag state ----
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [togglingId, setTogglingId] = useState<string | null>(null);

	const [newFlagKey, setNewFlagKey] = useState("");
	const [newFlagNameEn, setNewFlagNameEn] = useState("");
	const [newFlagNameAm, setNewFlagNameAm] = useState("");
	const [newFlagDescEn, setNewFlagDescEn] = useState("");
	const [newFlagScope, setNewFlagScope] = useState<FeatureFlagScope>("global");
	const [isCreating, setIsCreating] = useState(false);

	// ---- Profile state ----
	const [firstName, setFirstName] = useState(typedProfile?.first_name || "");
	const [lastName, setLastName] = useState(typedProfile?.last_name || "");
	const [email, setEmail] = useState(typedProfile?.email || "");
	const [phone, setPhone] = useState(typedProfile?.phone_number || "");
	const [bio, setBio] = useState(typedProfile?.bio || "");
	const [city, setCity] = useState(typedProfile?.city || "");
	const [country, setCountry] = useState(typedProfile?.country || "");
	const [gender, setGender] = useState(typedProfile?.gender || "");
	const [langPref, setLangPref] = useState(
		typedProfile?.language_preference || "en",
	);
	const [isSavingProfile, setIsSavingProfile] = useState(false);

	// ---- Password state ----
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// ---- Gateway edit state ----
	const [editGatewayOpen, setEditGatewayOpen] = useState(false);
	const [editingGateway, setEditingGateway] = useState<Record<
		string,
		unknown
	> | null>(null);
	const [gwApiKey, setGwApiKey] = useState("");
	const [gwWebhookSecret, setGwWebhookSecret] = useState("");
	const [showApiKey, setShowApiKey] = useState(false);
	const [showWebhook, setShowWebhook] = useState(false);
	const [isSavingGateway, setIsSavingGateway] = useState(false);

	// ---- Gateway delete state ----
	const [deleteGatewayOpen, setDeleteGatewayOpen] = useState(false);
	const [deletingGatewayId, setDeletingGatewayId] = useState<string | null>(
		null,
	);
	const [isDeletingGateway, setIsDeletingGateway] = useState(false);

	const isSuperAdminUser = user?.role === "super_admin";

	// ---- Feature Flag handlers ----
	const handleToggleFlag = async (id: string, currentValue: boolean) => {
		setTogglingId(id);
		try {
			await updateFeatureFlag({ data: { id, is_enabled: !currentValue } });
			toast.success(`Feature flag ${!currentValue ? "enabled" : "disabled"}`);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setTogglingId(null);
		}
	};

	const handleToggleGateway = async (
		id: string,
		field: "is_active" | "test_mode",
		currentValue: boolean,
	) => {
		setTogglingId(id + field);
		try {
			await updatePaymentGateway({ data: { id, [field]: !currentValue } });
			toast.success("Payment gateway updated");
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
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
						am: newFlagNameAm.trim() || newFlagNameEn.trim(),
					},
					description: newFlagDescEn.trim()
						? { en: newFlagDescEn.trim() }
						: undefined,
					is_enabled: false,
					scope: newFlagScope,
				},
			});
			toast.success("Feature flag created");
			setCreateDialogOpen(false);
			resetCreateForm();
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsCreating(false);
		}
	};

	const handleDeleteFlag = async () => {
		if (!deletingId) return;
		setIsDeleting(true);
		try {
			await deleteFeatureFlag({ data: { id: deletingId } });
			toast.success("Feature flag deleted");
			setDeleteDialogOpen(false);
			setDeletingId(null);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
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

	// ---- Gateway handlers ----
	const openEditGateway = (gw: Record<string, unknown>) => {
		setEditingGateway(gw);
		setGwApiKey((gw.api_key as string) || "");
		setGwWebhookSecret((gw.webhook_secret as string) || "");
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
					id: editingGateway.id as string,
					api_key: gwApiKey.trim() || null,
					webhook_secret: gwWebhookSecret.trim() || null,
				},
			});
			toast.success("Payment gateway updated");
			setEditGatewayOpen(false);
			setEditingGateway(null);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsSavingGateway(false);
		}
	};

	const handleDeleteGateway = async () => {
		if (!deletingGatewayId) return;
		setIsDeletingGateway(true);
		try {
			await deletePaymentGateway({ data: { id: deletingGatewayId } });
			toast.success("Payment gateway deleted");
			setDeleteGatewayOpen(false);
			setDeletingGatewayId(null);
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsDeletingGateway(false);
		}
	};

	// ---- Profile handlers ----
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
					language_preference: langPref || null,
				},
			});
			toast.success("Profile updated successfully");
			router.invalidate();
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
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
			await changePassword({ data: { newPassword } });
			toast.success("Password changed successfully");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			toast.error(
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsChangingPassword(false);
		}
	};

	return (
		<>
			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-5xl mx-auto space-y-6">
					{/* Title */}
					<div>
						<h1 className="text-2xl font-bold">Settings</h1>
						<p className="text-muted-foreground mt-1">
							Platform configuration and your profile
						</p>
					</div>

					{/* App Overview Stats */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						<OverviewCard
							icon={
								<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							}
							iconBg="bg-blue-100 dark:bg-blue-900/30"
							label="Users"
							value={String(stats.users)}
						/>
						<OverviewCard
							icon={
								<Church className="h-5 w-5 text-purple-600 dark:text-purple-400" />
							}
							iconBg="bg-purple-100 dark:bg-purple-900/30"
							label="Churches"
							value={String(stats.churches)}
						/>
						<OverviewCard
							icon={
								<Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
							}
							iconBg="bg-green-100 dark:bg-green-900/30"
							label="Events"
							value={String(stats.events)}
						/>
						<OverviewCard
							icon={
								<DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
							}
							iconBg="bg-emerald-100 dark:bg-emerald-900/30"
							label="Donations"
							value={new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "ETB",
								minimumFractionDigits: 0,
							}).format(stats.totalDonations)}
						/>
						<OverviewCard
							icon={
								<FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
							}
							iconBg="bg-amber-100 dark:bg-amber-900/30"
							label="Content"
							value={String(stats.content)}
						/>
					</div>

					{/* Tabs */}
					<ResponsiveTabs
						value={searchParams.tab || "profile"}
						onValueChange={(tab) => navigate({ search: { tab } })}
						selectPlaceholder="Settings section"
						items={[
							{
								value: "profile",
								label: "Profile",
								trigger: (
									<>
										<User className="h-4 w-4 mr-1.5" />
										Profile
									</>
								),
							},
							{
								value: "feature-flags",
								label: "Feature Flags",
								trigger: (
									<>
										<Flag className="h-4 w-4 mr-1.5" />
										Feature Flags
									</>
								),
							},
							{
								value: "payment-gateways",
								label: "Payment Gateways",
								trigger: (
									<>
										<CreditCard className="h-4 w-4 mr-1.5" />
										Payment Gateways
									</>
								),
							},
						]}
						listClassName="flex w-full flex-wrap gap-1"
					>
						{/* ============ PROFILE TAB ============ */}
						<TabsContent value="profile" className="mt-4 space-y-6">
							{/* Profile Info Card */}
							<div className="rounded-xl border bg-card p-6 space-y-6">
								<div className="flex items-center gap-4">
									<Avatar className="h-16 w-16">
										<AvatarImage src={typedProfile?.avatar_url || ""} />
										<AvatarFallback className="text-lg bg-primary/10 text-primary">
											{(
												(typedProfile?.first_name?.[0] || "") +
												(typedProfile?.last_name?.[0] || "")
											).toUpperCase() || "A"}
										</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="text-lg font-semibold">
											{`${typedProfile?.first_name || ""} ${typedProfile?.last_name || ""}`.trim() ||
												"Admin"}
										</h2>
										<p className="text-sm text-muted-foreground">
											{typedProfile?.email || "No email"}
										</p>
										<span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
											{user?.role || "admin"}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label className="text-xs">First Name</Label>
										<Input
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											placeholder="First name"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Last Name</Label>
										<Input
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											placeholder="Last name"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Email</Label>
										<Input
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Email"
											type="email"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Phone</Label>
										<Input
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											placeholder="+251..."
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">City</Label>
										<Input
											value={city}
											onChange={(e) => setCity(e.target.value)}
											placeholder="City"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Country</Label>
										<Input
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											placeholder="Country"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Gender</Label>
										<Select
											value={gender || "unset"}
											onValueChange={(v) => setGender(v === "unset" ? "" : v)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="unset">Prefer not to say</SelectItem>
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Language Preference</Label>
										<Select
											value={langPref || "en"}
											onValueChange={(v) => {
												if (v) setLangPref(v);
											}}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="en">English</SelectItem>
												<SelectItem value="am">Amharic</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs">Bio</Label>
									<textarea
										value={bio}
										onChange={(e) => setBio(e.target.value)}
										placeholder="Tell us about yourself..."
										className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										rows={3}
									/>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={handleSaveProfile}
										disabled={isSavingProfile}
									>
										{isSavingProfile ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Saving...
											</>
										) : (
											<>
												<Save className="h-4 w-4 mr-2" />
												Save Profile
											</>
										)}
									</Button>
								</div>
							</div>

							{/* Change Password */}
							<div className="rounded-xl border bg-card p-6 space-y-4">
								<div className="flex items-center gap-2">
									<Lock className="h-5 w-5 text-muted-foreground" />
									<h3 className="font-semibold">Change Password</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label className="text-xs">New Password</Label>
										<Input
											type="password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Min. 6 characters"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs">Confirm Password</Label>
										<Input
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="Repeat password"
										/>
									</div>
								</div>
								<div className="flex justify-end">
									<Button
										onClick={handleChangePassword}
										disabled={
											isChangingPassword || !newPassword || !confirmPassword
										}
										variant="outline"
									>
										{isChangingPassword ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Changing...
											</>
										) : (
											<>
												<Lock className="h-4 w-4 mr-2" />
												Change Password
											</>
										)}
									</Button>
								</div>
							</div>
						</TabsContent>

						{/* ============ FEATURE FLAGS TAB ============ */}
						<TabsContent value="feature-flags" className="mt-4 space-y-4">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-sm text-muted-foreground">
									{typedFlags.length} feature flag
									{typedFlags.length !== 1 ? "s" : ""}
								</p>
								{isSuperAdminUser && (
									<Button
										size="sm"
										className="w-full sm:w-auto shrink-0"
										onClick={() => setCreateDialogOpen(true)}
									>
										<Plus className="h-4 w-4 mr-1.5" />
										Add Flag
									</Button>
								)}
							</div>

							{typedFlags.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
									<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
										<Flag className="h-7 w-7 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-1">
										No feature flags
									</h3>
									<p className="text-sm text-muted-foreground max-w-sm mb-4">
										Create feature flags to toggle functionality across the
										platform.
									</p>
									{isSuperAdminUser ? (
										<Button onClick={() => setCreateDialogOpen(true)}>
											<Plus className="h-4 w-4 mr-1.5" />
											Create First Flag
										</Button>
									) : (
										<p className="text-xs text-muted-foreground">
											Only a super administrator can create feature flags.
										</p>
									)}
								</div>
							) : (
								<div className="rounded-xl border bg-card overflow-hidden">
									<div className="divide-y">
										{typedFlags.map((flag: any) => (
											<div
												key={flag.id}
												className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
											>
												<div className="flex items-center gap-3 min-w-0 flex-1">
													<div
														className={`h-2 w-2 rounded-full shrink-0 ${flag.is_enabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
													/>
													<div className="min-w-0">
														<div className="flex items-center gap-2">
															<p className="font-medium text-sm truncate">
																{getLocalizedText(flag.name, locale)}
															</p>
															<code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
																{flag.key}
															</code>
															<span
																className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${flag.scope === "global" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"}`}
															>
																{flag.scope === "global" ? (
																	<Globe className="h-2.5 w-2.5" />
																) : (
																	<Building className="h-2.5 w-2.5" />
																)}
																{flag.scope}
															</span>
														</div>
														{flag.description && (
															<p className="text-xs text-muted-foreground mt-0.5 truncate">
																{getLocalizedText(flag.description, locale)}
															</p>
														)}
													</div>
												</div>
												<div className="flex items-center gap-3 shrink-0">
													<Switch
														checked={flag.is_enabled}
														onCheckedChange={() =>
															handleToggleFlag(flag.id, flag.is_enabled)
														}
														disabled={togglingId === flag.id}
													/>
													{showDelete && (
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-destructive hover:text-destructive"
															onClick={() => {
																setDeletingId(flag.id);
																setDeleteDialogOpen(true);
															}}
														>
															<Trash2 className="h-3.5 w-3.5" />
														</Button>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</TabsContent>

						{/* ============ PAYMENT GATEWAYS TAB ============ */}
						<TabsContent value="payment-gateways" className="mt-4 space-y-4">
							<p className="text-sm text-muted-foreground">
								{typedGateways.length} payment gateway
								{typedGateways.length !== 1 ? "s" : ""} configured.
							</p>

							{typedGateways.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
									<div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
										<CreditCard className="h-7 w-7 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-1">
										No payment gateways
									</h3>
									<p className="text-sm text-muted-foreground max-w-sm">
										No gateways have been configured yet.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{typedGateways.map((gw: any) => (
										<div
											key={gw.id}
											className="rounded-xl border bg-card p-5 space-y-4"
										>
											<div className="flex items-start justify-between">
												<div className="flex items-center gap-3">
													{gw.icon_url ? (
														<img
															src={gw.icon_url}
															alt={gw.name}
															className="h-10 w-10 rounded-lg object-contain"
														/>
													) : (
														<div
															className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
															style={{ backgroundColor: gw.color || "#6366f1" }}
														>
															{gw.name.slice(0, 2).toUpperCase()}
														</div>
													)}
													<div>
														<h3 className="font-semibold text-sm">
															{getLocalizedText(gw.display_name, locale) ||
																gw.name}
														</h3>
														<code className="text-[10px] text-muted-foreground font-mono">
															{gw.slug}
														</code>
													</div>
												</div>
												<div className="flex items-center gap-1">
													<div
														className={`h-2 w-2 rounded-full mr-2 ${gw.is_active ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
													/>
													<Button
														variant="ghost"
														size="icon"
														className="h-7 w-7"
														onClick={() => openEditGateway(gw)}
													>
														<Pencil className="h-3.5 w-3.5" />
													</Button>
													{isSuperAdminUser && (
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 text-destructive hover:text-destructive"
															onClick={() => {
																setDeletingGatewayId(gw.id);
																setDeleteGatewayOpen(true);
															}}
														>
															<Trash2 className="h-3.5 w-3.5" />
														</Button>
													)}
												</div>
											</div>

											{/* API Key / Webhook indicators */}
											<div className="flex items-center gap-3 text-[11px] text-muted-foreground">
												<span className="flex items-center gap-1">
													<Key className="h-3 w-3" />
													API Key:{" "}
													{gw.api_key ? (
														<span className="text-green-600 dark:text-green-400 font-medium">
															Set
														</span>
													) : (
														<span className="text-amber-600 dark:text-amber-400">
															Not set
														</span>
													)}
												</span>
												<span className="flex items-center gap-1">
													<Webhook className="h-3 w-3" />
													Webhook:{" "}
													{gw.webhook_secret ? (
														<span className="text-green-600 dark:text-green-400 font-medium">
															Set
														</span>
													) : (
														<span className="text-amber-600 dark:text-amber-400">
															Not set
														</span>
													)}
												</span>
											</div>

											<div className="flex items-center justify-between pt-3 border-t">
												<div className="flex items-center gap-2">
													<Label
														htmlFor={`s-active-${gw.id}`}
														className="text-xs"
													>
														Active
													</Label>
													<Switch
														id={`s-active-${gw.id}`}
														checked={gw.is_active}
														onCheckedChange={() =>
															handleToggleGateway(
																gw.id,
																"is_active",
																gw.is_active,
															)
														}
														disabled={togglingId === gw.id + "is_active"}
													/>
												</div>
												<div className="flex items-center gap-2">
													<Label
														htmlFor={`s-test-${gw.id}`}
														className="text-xs"
													>
														Test Mode
													</Label>
													<Switch
														id={`s-test-${gw.id}`}
														checked={gw.test_mode}
														onCheckedChange={() =>
															handleToggleGateway(
																gw.id,
																"test_mode",
																gw.test_mode,
															)
														}
														disabled={togglingId === gw.id + "test_mode"}
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</TabsContent>
					</ResponsiveTabs>
				</div>
			</div>

			{/* Create Feature Flag Dialog */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Feature Flag</DialogTitle>
						<DialogDescription>
							Add a new feature flag to toggle functionality.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-1.5">
							<Label className="text-xs">Key *</Label>
							<Input
								value={newFlagKey}
								onChange={(e) =>
									setNewFlagKey(
										e.target.value
											.toLowerCase()
											.replace(/\s+/g, "_")
											.replace(/[^a-z0-9_]/g, ""),
									)
								}
								placeholder="e.g. enable_live_streaming"
								className="font-mono text-sm"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs">Name (English) *</Label>
								<Input
									value={newFlagNameEn}
									onChange={(e) => setNewFlagNameEn(e.target.value)}
									placeholder="English name"
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">Name (Amharic)</Label>
								<Input
									value={newFlagNameAm}
									onChange={(e) => setNewFlagNameAm(e.target.value)}
									placeholder="የአማርኛ ስም"
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs">Description</Label>
							<Input
								value={newFlagDescEn}
								onChange={(e) => setNewFlagDescEn(e.target.value)}
								placeholder="What does this flag control?"
							/>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs">Scope *</Label>
							<Select
								value={newFlagScope}
								onValueChange={(v) => {
									if (v) setNewFlagScope(v as FeatureFlagScope);
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="global">
										<div className="flex items-center gap-2">
											<Globe className="h-3.5 w-3.5" />
											Global
										</div>
									</SelectItem>
									<SelectItem value="church">
										<div className="flex items-center gap-2">
											<Building className="h-3.5 w-3.5" />
											Church
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setCreateDialogOpen(false);
								resetCreateForm();
							}}
							disabled={isCreating}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateFlag}
							disabled={
								isCreating || !newFlagKey.trim() || !newFlagNameEn.trim()
							}
						>
							{isCreating ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Creating...
								</>
							) : (
								"Create Flag"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Feature Flag Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Feature Flag</DialogTitle>
						<DialogDescription>This action cannot be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteFlag}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Payment Gateway Dialog */}
			<Dialog open={editGatewayOpen} onOpenChange={setEditGatewayOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<CreditCard className="h-5 w-5" />
							Edit {(editingGateway as any)?.name || "Gateway"}
						</DialogTitle>
						<DialogDescription>
							Update API credentials for this payment gateway.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-1.5">
							<Label className="text-xs flex items-center gap-1.5">
								<Key className="h-3.5 w-3.5" /> API Key
							</Label>
							<div className="relative">
								<Input
									type={showApiKey ? "text" : "password"}
									value={gwApiKey}
									onChange={(e) => setGwApiKey(e.target.value)}
									placeholder="Enter API key..."
									className="pr-10 font-mono text-sm"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full w-10"
									onClick={() => setShowApiKey(!showApiKey)}
								>
									{showApiKey ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label className="text-xs flex items-center gap-1.5">
								<Webhook className="h-3.5 w-3.5" /> Webhook Secret
							</Label>
							<div className="relative">
								<Input
									type={showWebhook ? "text" : "password"}
									value={gwWebhookSecret}
									onChange={(e) => setGwWebhookSecret(e.target.value)}
									placeholder="Enter webhook secret..."
									className="pr-10 font-mono text-sm"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full w-10"
									onClick={() => setShowWebhook(!showWebhook)}
								>
									{showWebhook ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditGatewayOpen(false)}
							disabled={isSavingGateway}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveGateway} disabled={isSavingGateway}>
							{isSavingGateway ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									Save
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Payment Gateway Dialog */}
			<Dialog open={deleteGatewayOpen} onOpenChange={setDeleteGatewayOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Payment Gateway</DialogTitle>
						<DialogDescription>
							This will permanently remove this gateway and its configuration.
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteGatewayOpen(false)}
							disabled={isDeletingGateway}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteGateway}
							disabled={isDeletingGateway}
						>
							{isDeletingGateway ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Gateway"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

// ============ OVERVIEW CARD ============
function OverviewCard({
	icon,
	iconBg,
	label,
	value,
}: {
	icon: React.ReactNode;
	iconBg: string;
	label: string;
	value: string;
}) {
	return (
		<div className="bg-card rounded-xl p-4 border">
			<div className="flex items-center gap-3">
				<div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
				<div className="min-w-0">
					<p className="text-xs text-muted-foreground">{label}</p>
					<p className="text-lg font-bold truncate">{value}</p>
				</div>
			</div>
		</div>
	);
}
