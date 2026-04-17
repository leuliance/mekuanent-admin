import type { Database } from "@/types/database.types";

export type UserRole = Database["public"]["Enums"]["user_role"];

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
