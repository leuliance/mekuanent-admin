import type { SupabaseClient } from "@supabase/supabase-js";
import {
	ADMIN_ROLES,
	pickPrimaryRole,
	type UserRole,
	type UserRoleClaim,
} from "@/lib/roles";
import type { Database } from "@/types/database.types";

/**
 * The authenticated admin, assembled from the JWT custom claims
 * (`user_roles` + `permissions`, minted by `custom_access_token_hook`) plus the
 * profile row. Roles/permissions come from `auth.getClaims()`; mutable profile
 * fields come from `auth.getUser()` + the `profiles` table.
 */
export interface AdminUser {
	id: string;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
	/** Highest-ranked role the user holds. */
	role: UserRole;
	/** All roles the user holds (per-church). */
	roles: UserRoleClaim[];
	/** Owning church for the primary role (null = platform-wide). */
	church_id: string | null;
	/** Flat, de-duplicated permission set from the JWT claim. */
	permissions: string[];
}

function readRoleClaims(claims: Record<string, unknown>): UserRoleClaim[] {
	const raw = claims.user_roles;
	if (!Array.isArray(raw)) return [];
	return raw
		.map((entry) => {
			if (!entry || typeof entry !== "object") return null;
			const obj = entry as Record<string, unknown>;
			if (typeof obj.role !== "string") return null;
			return {
				role: obj.role as UserRole,
				churchId: typeof obj.churchId === "string" ? obj.churchId : null,
			} satisfies UserRoleClaim;
		})
		.filter((entry): entry is UserRoleClaim => entry !== null);
}

function readPermissions(claims: Record<string, unknown>): string[] {
	const raw = claims.permissions;
	if (!Array.isArray(raw)) return [];
	return raw.filter((p): p is string => typeof p === "string");
}

/**
 * Build the admin user from the verified JWT claims. Returns `null` when there
 * is no session, the claims can't be read, or the user lacks an admin-level role.
 */
export async function buildAdminUser(
	supabase: SupabaseClient<Database>,
): Promise<AdminUser | null> {
	// Roles + permissions: read straight from the verified token claims.
	const { data: claimsData, error: claimsError } =
		await supabase.auth.getClaims();
	const claims = claimsData?.claims as Record<string, unknown> | undefined;
	if (claimsError || !claims) return null;

	const roleClaims = readRoleClaims(claims);
	const permissions = readPermissions(claims);
	const primaryRole = pickPrimaryRole(roleClaims.map((r) => r.role));

	if (!primaryRole || !ADMIN_ROLES.includes(primaryRole)) return null;

	// Profile data: fetched against the auth server / profiles table.
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabase
		.from("profiles")
		.select("email, first_name, last_name, avatar_url")
		.eq("id", user.id)
		.single();

	const church_id =
		roleClaims.find((r) => r.role === primaryRole)?.churchId ?? null;

	return {
		id: user.id,
		email: profile?.email ?? user.email ?? null,
		first_name: profile?.first_name ?? null,
		last_name: profile?.last_name ?? null,
		avatar_url: profile?.avatar_url ?? null,
		role: primaryRole,
		roles: roleClaims,
		church_id,
		permissions,
	};
}
