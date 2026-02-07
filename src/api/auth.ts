import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/types/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Types
export type AdminUser = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: Database["public"]["Enums"]["user_role"];
  church_id: string | null;
};

// Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Login with email and password
export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
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

      // Check if user has super_admin or admin role
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role, church_id")
        .eq("user_id", authData.user.id)
        .in("role", ["super_admin", "admin"]);

      if (rolesError) {
        throw new Error("Failed to verify admin access");
      }

      if (!userRoles || userRoles.length === 0) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Only administrators can access this portal.");
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      return serialize({
        user: {
          id: authData.user.id,
          email: profile?.email || authData.user.email,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          avatar_url: profile?.avatar_url,
          role: userRoles[0].role,
          church_id: userRoles[0].church_id,
        } as AdminUser,
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

      // Check if user has super_admin or admin role
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role, church_id")
        .eq("user_id", session.user.id)
        .in("role", ["super_admin", "admin"]);

      if (!userRoles || userRoles.length === 0) {
        return null;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return serialize({
        user: {
          id: session.user.id,
          email: profile?.email || session.user.email,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          avatar_url: profile?.avatar_url,
          role: userRoles[0].role,
          church_id: userRoles[0].church_id,
        } as AdminUser,
        session,
      });
  }
);

// Logout
export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return { success: true };
});
