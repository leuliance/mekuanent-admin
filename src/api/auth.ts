import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildAdminUser } from "@/lib/admin-user";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type { AdminUser } from "@/lib/admin-user";

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Schemas
const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

// Login with email and password
export const loginAdmin = createServerFn({ method: "POST" })
	.validator(loginSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});

		if (authError) {
			throw new Error(authError.message);
		}

		if (!authData.user) {
			throw new Error("Login failed");
		}

		// Roles + permissions come from the verified JWT claims.
		const adminUser = await buildAdminUser(supabase);

		if (!adminUser) {
			await supabase.auth.signOut();
			throw new Error(
				"Access denied. Only administrators can access this portal.",
			);
		}

		return serialize({
			user: adminUser,
			session: authData.session,
		});
	});

// Get current session
export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return null;
		}

		const adminUser = await buildAdminUser(supabase);

		if (!adminUser) {
			return null;
		}

		return serialize({
			user: adminUser,
			session,
		});
	},
);

// Logout
export const logout = createServerFn({ method: "POST" }).handler(async () => {
	const supabase = getSupabaseServerClient();
	await supabase.auth.signOut();
	return { success: true };
});
