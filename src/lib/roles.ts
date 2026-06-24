import { Constants, type Database } from "@/types/database.types";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type AppPermission = Database["public"]["Enums"]["app_permission"];

/** Shape of one entry in the JWT `user_roles` claim minted by the auth hook. */
export interface UserRoleClaim {
	role: UserRole;
	churchId: string | null;
}

/** All assignable roles, in hierarchy order (highest → lowest). */
export const ALL_ROLES: UserRole[] = [...Constants.public.Enums.user_role];

/** Human-readable label per role. */
export const ROLE_LABELS: Record<UserRole, string> = {
	super_admin: "Super Admin",
	admin: "Admin",
	manager: "Manager",
	editor: "Editor",
	contributor: "Contributor",
	viewer: "Viewer",
};

/** Tailwind badge classes per role (light + dark). */
export const ROLE_COLORS: Record<UserRole, string> = {
	super_admin:
		"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	admin:
		"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	editor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
	contributor:
		"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	viewer: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

/** Roles that are allowed to log in to the admin panel */
export const ADMIN_ROLES: UserRole[] = ["super_admin", "admin"];

/** Check if a role can access the admin panel */
export function isAdminRole(role: UserRole): boolean {
	return ADMIN_ROLES.includes(role);
}

/** Check if a role is super_admin */
export function isSuperAdmin(role: UserRole): boolean {
	return role === "super_admin";
}

/** Check if a role is admin */
export function isAdmin(role: UserRole): boolean {
	return role === "admin";
}

/** Check if a role has at least admin-level access (super_admin or admin) */
export function hasAdminAccess(role: UserRole): boolean {
	return role === "super_admin" || role === "admin";
}

/** Check if the role can perform destructive operations (delete) */
export function canDelete(role: UserRole): boolean {
	return role === "super_admin";
}

/**
 * Ban / unban / change `profiles.status` in admin. `admin` cannot; only `super_admin`.
 * (Same gate as destructive deletes; kept as a named export for user-management UI.)
 */
export function canBanUsers(role: UserRole): boolean {
	return isSuperAdmin(role);
}

/**
 * Given the list of roles a user holds (from the `user_roles` JWT claim), return
 * the highest-ranked one. `ALL_ROLES` is ordered highest → lowest.
 */
export function pickPrimaryRole(roles: UserRole[]): UserRole | null {
	for (const role of ALL_ROLES) {
		if (roles.includes(role)) return role;
	}
	return null;
}

/** True when the JWT `permissions` claim contains the requested permission. */
export function hasPermission(
	permissions: string[] | undefined | null,
	permission: AppPermission,
): boolean {
	return !!permissions?.includes(permission);
}
