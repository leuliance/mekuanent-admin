import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Tables, Database } from "@/types/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type UserAccountStatusEnum = Database["public"]["Enums"]["user_account_status"];

export type Profile = Tables<"profiles">;
export type UserRole = Tables<"user_roles">;

// Helper to serialize data for server function return
const serialize = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// Schemas
const getUsersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  role: z.enum(["super_admin", "admin", "church_admin", "content_admin", "content_creator", "user"]).optional(),
});

const getUserSchema = z.object({
  id: z.string(),
});

const assignUserRoleSchema = z.object({
  user_id: z.string(),
  role: z.enum(["super_admin", "admin", "church_admin", "content_admin", "content_creator", "user"]),
  church_id: z.string().optional(),
  assigned_by: z.string(),
});

const removeUserRoleSchema = z.object({
  role_id: z.string(),
});

// Get all users with pagination
export const getUsers = createServerFn({ method: "GET" })
  .inputValidator(getUsersSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("profiles")
      .select(
        `
          *,
          user_roles!user_roles_user_id_fkey(role, church_id, churches(name))
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.search) {
      query = query.or(
        `first_name.ilike.%${data.search}%,last_name.ilike.%${data.search}%,email.ilike.%${data.search}%,phone_number.ilike.%${data.search}%`
      );
    }

    const { data: users, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Filter by role if specified
    let filteredUsers = users || [];
    if (data.role) {
      filteredUsers = filteredUsers.filter((user) =>
        user.user_roles?.some(
          (r: { role: string }) => r.role === data.role
        )
      );
    }

    return serialize({
      users: filteredUsers,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  });

// Get single user by ID
export const getUser = createServerFn({ method: "GET" })
  .inputValidator(getUserSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: user, error } = await supabase
      .from("profiles")
      .select(
        `
          *,
          user_roles!user_roles_user_id_fkey(*, churches(name, logo_url)),
          user_follows(church_id, churches(name, logo_url)),
          donations(id, amount, status, created_at),
          event_rsvps(id, event_id, status)
        `
      )
      .eq("id", data.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return serialize(user);
  });

// Assign role to user
export const assignUserRole = createServerFn({ method: "POST" })
  .inputValidator(assignUserRoleSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: role, error } = await supabase
      .from("user_roles")
      .insert({
        user_id: data.user_id,
        role: data.role,
        church_id: data.church_id || null,
        assigned_by: data.assigned_by,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return serialize(role);
  });

// Remove user role
export const removeUserRole = createServerFn({ method: "POST" })
  .inputValidator(removeUserRoleSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", data.role_id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

// ============ USER STATUS MANAGEMENT ============
// Status lives directly on profiles.status column (enum: active, inactive, suspended, banned)
// Audit trail lives in user_status_log table

export type UserAccountStatus = "active" | "inactive" | "suspended" | "banned";

const updateUserStatusSchema = z.object({
  user_id: z.string(),
  status: z.enum(["active", "inactive", "suspended", "banned"]),
  reason: z.string().optional(),
  changed_by: z.string(),
});

// Update user status (directly on profiles.status)
export const updateUserStatus = createServerFn({ method: "POST" })
  .inputValidator(updateUserStatusSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    // Get current status for audit log
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", data.user_id)
      .single();

    const oldStatus: UserAccountStatusEnum = profile?.status ?? "active";

    // Update the status column directly on profiles
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ status: data.status as UserAccountStatusEnum })
      .eq("id", data.user_id);

    if (updateError) throw new Error(updateError.message);

    // Log the change for audit trail (non-fatal)
    try {
      await supabase
        .from("user_status_log")
        .insert({
          user_id: data.user_id,
          old_status: oldStatus,
          new_status: data.status as UserAccountStatusEnum,
          reason: data.reason || null,
          changed_by: data.changed_by,
        });
    } catch (e) {
      console.error("Failed to log status change:", e);
    }

    return { success: true };
  });

// Get user statistics
export const getUserStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();

    const [total, superAdmins, churchAdmins, contentAdmins] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "super_admin"),
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "church_admin"),
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "content_admin"),
      ]);

    return {
      total: total.count || 0,
      superAdmins: superAdmins.count || 0,
      churchAdmins: churchAdmins.count || 0,
      contentAdmins: contentAdmins.count || 0,
    };
  }
);
