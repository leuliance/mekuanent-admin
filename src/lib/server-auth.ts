import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Ensures the current session belongs to a user with the `super_admin` role.
 * Use on server functions for destructive or highly sensitive mutations.
 */
export async function assertSuperAdmin(): Promise<{ userId: string }> {
	const supabase = getSupabaseServerClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw new Error("You must be signed in.");
	}

	const { data: rows, error: roleError } = await supabase
		.from("user_roles")
		.select("id")
		.eq("user_id", user.id)
		.eq("role", "super_admin")
		.limit(1);

	if (roleError) {
		throw new Error(roleError.message);
	}

	if (!rows?.length) {
		throw new Error("Only super administrators can perform this action.");
	}

	return { userId: user.id };
}
