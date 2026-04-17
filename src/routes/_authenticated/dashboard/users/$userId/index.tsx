import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Church,
	DollarSign,
	Globe,
	Heart,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Plus,
	Shield,
	Trash2,
	User,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import {
	assignUserRole,
	getUser,
	type Profile,
	removeUserRole,
	type UserRole,
} from "@/api/users";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { isSuperAdmin } from "@/lib/roles";

export const Route = createFileRoute(
	"/_authenticated/dashboard/users/$userId/",
)({
	loader: async ({ params }) => {
		const user = await getUser({ data: { id: params.userId } });
		return { user };
	},
	pendingComponent: UserDetailSkeleton,
	errorComponent: UserDetailError,
	component: UserDetailPage,
});

// ============ LOADING SKELETON ============
function UserDetailSkeleton() {
	return (
		<>
			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-4xl mx-auto space-y-6">
					<Skeleton className="h-8 w-24" />
					<div className="flex items-center gap-6">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-24 rounded-lg" />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

// ============ ERROR STATE ============
function UserDetailError({ error }: { error: Error }) {
	return (
		<>
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="text-center max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
					<h2 className="text-xl font-semibold mb-2">Failed to Load User</h2>
					<p className="text-muted-foreground mb-4">
						{error.message || "An unexpected error occurred."}
					</p>
					<div className="flex gap-2 justify-center">
						<Button
							variant="outline"
							render={
								<Link
									to="/dashboard/users"
									search={{ page: 1, search: undefined }}
								/>
							}
							nativeButton={false}
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Users
						</Button>
						<Button onClick={() => window.location.reload()}>Try Again</Button>
					</div>
				</div>
			</div>
		</>
	);
}

// ============ HELPERS ============
const roleColors: Record<string, string> = {
	super_admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	admin: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
	church_admin:
		"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	content_admin:
		"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	content_creator:
		"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
	user: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | null | undefined;
}) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-3 py-3">
			<div className="shrink-0 rounded-lg bg-muted/80 p-2">
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-sm font-medium text-foreground">{value}</p>
			</div>
		</div>
	);
}

function getLocalizedName(name: unknown): string {
	if (typeof name === "object" && name !== null) {
		const obj = name as { en?: string; am?: string };
		return obj.en || obj.am || "Unknown";
	}
	return String(name || "Unknown");
}

// ============ MAIN PAGE ============
function UserDetailPage() {
	const { user } = Route.useLoaderData();
	const { user: currentUser } = Route.useRouteContext();
	const router = useRouter();
	const canEditRoles = !!currentUser && isSuperAdmin(currentUser.role);

	const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
	const [newRole, setNewRole] = useState("");
	const [isAssigning, setIsAssigning] = useState(false);
	const [isDeletingRole, setIsDeletingRole] = useState<string | null>(null);

	const typedUser = user as Profile & {
		user_roles?: Array<{
			id: string;
			role: string;
			church_id: string | null;
			churches?: { name: unknown; logo_url: string | null } | null;
		}>;
		user_follows?: Array<{
			church_id: string;
			churches?: { name: unknown; logo_url: string | null } | null;
		}>;
		donations?: Array<{
			id: string;
			amount: number;
			status: string;
			created_at: string;
		}>;
		event_rsvps?: Array<{
			id: string;
			event_id: string;
			status: string;
		}>;
	};

	const fullName =
		`${typedUser.first_name || ""} ${typedUser.last_name || ""}`.trim() ||
		"Unnamed User";

	const isOwnProfile = currentUser?.id === typedUser.id;
	const showRoleManagement = canEditRoles && !isOwnProfile;

	const handleAssignRole = async () => {
		if (!newRole) return;
		setIsAssigning(true);
		try {
			await assignUserRole({
				data: {
					user_id: typedUser.id,
					role: newRole as UserRole["role"],
				},
			});
			setAddRoleDialogOpen(false);
			setNewRole("");
			router.invalidate();
			setIsAssigning(false);
		} catch (error) {
			console.error("Failed to assign role:", error);
			setIsAssigning(false);
		}
	};

	const handleRemoveRole = async (roleId: string) => {
		setIsDeletingRole(roleId);
		try {
			await removeUserRole({ data: { role_id: roleId } });
			router.invalidate();
			setIsDeletingRole(null);
		} catch (error) {
			console.error("Failed to remove role:", error);
			setIsDeletingRole(null);
		}
	};

	const totalDonations =
		typedUser.donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="min-h-0 flex-1 overflow-auto bg-muted/30 p-4 sm:p-6">
				<div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-2 text-muted-foreground hover:text-foreground"
						render={
							<Link
								to="/dashboard/users"
								search={{ page: 1, search: undefined }}
							/>
						}
						nativeButton={false}
					>
						<ArrowLeft className="mr-2 size-4" />
						Back to Users
					</Button>

					<div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
						<div className="relative bg-linear-to-br from-primary/15 via-card to-card px-5 py-6 sm:px-8 sm:py-8">
							<div
								className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl"
								aria-hidden
							/>
							<div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
								<div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background shadow-inner sm:size-28">
									{typedUser.avatar_url ? (
										<img
											src={typedUser.avatar_url}
											alt={fullName}
											className="size-full object-cover"
										/>
									) : (
										<User className="size-10 text-muted-foreground" />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
										{fullName}
									</h1>
									<p className="mt-1 break-all text-sm text-muted-foreground sm:text-base">
										{typedUser.email || "No email on file"}
									</p>
									<div className="mt-4 flex flex-wrap gap-2">
										{typedUser.email_verified && (
											<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
												<CheckCircle className="size-3" />
												Email verified
											</span>
										)}
										{typedUser.phone_verified && (
											<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
												<CheckCircle className="size-3" />
												Phone verified
											</span>
										)}
										{!typedUser.email_verified && (
											<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
												<XCircle className="size-3" />
												Email not verified
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
						<div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-sm sm:p-5">
							<Shield className="mx-auto mb-2 size-5 text-primary" />
							<p className="text-2xl font-bold tabular-nums text-foreground">
								{typedUser.user_roles?.length || 0}
							</p>
							<p className="text-xs text-muted-foreground">Roles</p>
						</div>
						<div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-sm sm:p-5">
							<Heart className="mx-auto mb-2 size-5 text-rose-500" />
							<p className="text-2xl font-bold tabular-nums text-foreground">
								{typedUser.user_follows?.length || 0}
							</p>
							<p className="text-xs text-muted-foreground">Following</p>
						</div>
						<div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-sm sm:p-5">
							<DollarSign className="mx-auto mb-2 size-5 text-emerald-600" />
							<p className="text-2xl font-bold tabular-nums text-foreground">
								{typedUser.donations?.length || 0}
							</p>
							<p className="text-xs text-muted-foreground">Donations</p>
						</div>
						<div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-sm sm:p-5">
							<Calendar className="mx-auto mb-2 size-5 text-violet-500" />
							<p className="text-2xl font-bold tabular-nums text-foreground">
								{typedUser.event_rsvps?.length || 0}
							</p>
							<p className="text-xs text-muted-foreground">RSVPs</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Personal Info */}
						<div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6">
							<h2 className="font-semibold text-foreground mb-4">
								Personal Information
							</h2>
							<div className="divide-y divide-border">
								<InfoRow
									icon={Phone}
									label="Phone"
									value={typedUser.phone_number}
								/>
								<InfoRow icon={Mail} label="Email" value={typedUser.email} />
								<InfoRow icon={User} label="Gender" value={typedUser.gender} />
								<InfoRow
									icon={Calendar}
									label="Date of Birth"
									value={
										typedUser.date_of_birth
											? new Date(typedUser.date_of_birth).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
													},
												)
											: null
									}
								/>
								<InfoRow
									icon={Globe}
									label="Language"
									value={typedUser.language_preference}
								/>
							</div>
						</div>

						{/* Location */}
						<div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6">
							<h2 className="font-semibold text-foreground mb-4">
								Location & Account
							</h2>
							<div className="divide-y divide-border">
								<InfoRow icon={MapPin} label="City" value={typedUser.city} />
								<InfoRow
									icon={MapPin}
									label="Country"
									value={typedUser.country}
								/>
								<InfoRow
									icon={Calendar}
									label="Joined"
									value={new Date(typedUser.created_at).toLocaleDateString(
										"en-US",
										{
											year: "numeric",
											month: "long",
											day: "numeric",
										},
									)}
								/>
								{typedUser.referral_code && (
									<InfoRow
										icon={User}
										label="Referral Code"
										value={typedUser.referral_code}
									/>
								)}
								{typedUser.points !== null &&
									typedUser.points !== undefined && (
										<InfoRow
											icon={DollarSign}
											label="Points"
											value={String(typedUser.points)}
										/>
									)}
							</div>
						</div>

						{/* Bio */}
						{typedUser.bio && (
							<div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6 md:col-span-2">
								<h2 className="font-semibold text-foreground mb-4">
									Bio
								</h2>
								<p className="text-muted-foreground leading-relaxed">
									{typedUser.bio}
								</p>
							</div>
						)}

						{/* Roles */}
						<div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="font-semibold text-foreground">
									Roles
								</h2>
								{showRoleManagement && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setAddRoleDialogOpen(true)}
									>
										<Plus className="w-3 h-3 mr-1" />
										Add Role
									</Button>
								)}
							</div>
							{typedUser.user_roles && typedUser.user_roles.length > 0 ? (
								<div className="space-y-3">
									{typedUser.user_roles.map((role) => (
										<div
											key={role.id}
											className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<Shield className="w-4 h-4 text-slate-400" />
												<div>
													<span
														className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
															roleColors[role.role] || roleColors.user
														}`}
													>
														{role.role.replace("_", " ")}
													</span>
													{role.churches && (
														<p className="text-xs text-muted-foreground mt-1">
															<Church className="w-3 h-3 inline mr-1" />
															{getLocalizedName(role.churches.name)}
														</p>
													)}
												</div>
											</div>
											{showRoleManagement && (
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7"
													onClick={() => handleRemoveRole(role.id)}
													disabled={isDeletingRole === role.id}
												>
													{isDeletingRole === role.id ? (
														<Loader2 className="w-3 h-3 animate-spin" />
													) : (
														<Trash2 className="w-3 h-3 text-destructive" />
													)}
												</Button>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No roles assigned.
								</p>
							)}
						</div>

						{/* Following */}
						<div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6">
							<h2 className="font-semibold text-foreground mb-4">
								Following Churches
							</h2>
							{typedUser.user_follows && typedUser.user_follows.length > 0 ? (
								<div className="space-y-3">
									{typedUser.user_follows.map((follow) => (
										<div
											key={follow.church_id}
											className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
										>
											<div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden shrink-0">
												{follow.churches?.logo_url ? (
													<img
														src={follow.churches.logo_url}
														alt=""
														className="w-full h-full object-cover"
													/>
												) : (
													<Church className="w-4 h-4 text-slate-400" />
												)}
											</div>
											<p className="text-sm font-medium">
												{follow.churches
													? getLocalizedName(follow.churches.name)
													: "Unknown Church"}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Not following any churches.
								</p>
							)}
						</div>

						{/* Recent Donations */}
						{typedUser.donations && typedUser.donations.length > 0 && (
							<div className="rounded-2xl border border-border/80 bg-card shadow-sm p-6 md:col-span-2">
								<div className="flex items-center justify-between mb-4">
									<h2 className="font-semibold text-foreground">
										Recent Donations
									</h2>
									<p className="text-sm text-muted-foreground">
										Total: ETB {totalDonations.toLocaleString()}
									</p>
								</div>
								<div className="space-y-2">
									{typedUser.donations.slice(0, 10).map((donation) => (
										<div
											key={donation.id}
											className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<DollarSign className="w-4 h-4 text-green-500" />
												<div>
													<p className="text-sm font-medium">
														ETB {donation.amount.toLocaleString()}
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(donation.created_at).toLocaleDateString()}
													</p>
												</div>
											</div>
											<span
												className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
													donation.status === "completed"
														? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
														: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
												}`}
											>
												{donation.status}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Add Role Dialog */}
			<Dialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Role</DialogTitle>
						<DialogDescription>
							Assign a new role to {fullName}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2">
						<label className="text-sm font-medium">Role</label>
						<Select
							value={newRole}
							onValueChange={(value) => setNewRole(value || "")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="super_admin">Super Admin</SelectItem>
								<SelectItem value="church_admin">Church Admin</SelectItem>
								<SelectItem value="content_admin">Content Admin</SelectItem>
								<SelectItem value="content_creator">Content Creator</SelectItem>
								<SelectItem value="user">User</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setAddRoleDialogOpen(false)}
							disabled={isAssigning}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAssignRole}
							disabled={isAssigning || !newRole}
						>
							{isAssigning ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Assigning...
								</>
							) : (
								"Assign Role"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
