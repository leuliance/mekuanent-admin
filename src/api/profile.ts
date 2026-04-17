import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Get the current user's profile
export const getProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Not authenticated");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw new Error(error.message);

    return serialize(profile);
  }
);

const updateProfileSchema = z.object({
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  language_preference: z.string().optional().nullable(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .inputValidator(updateProfileSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Not authenticated");

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as ProfileUpdate;

    const { error } = await supabase
      .from("profiles")
      .update(cleanData)
      .eq("id", user.id);

    if (error) throw new Error(error.message);

    return { success: true };
  });

const changePasswordSchema = z.object({
  newPassword: z.string().min(6),
});

export const changePassword = createServerFn({ method: "POST" })
  .inputValidator(changePasswordSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) throw new Error(error.message);

    return { success: true };
  });
