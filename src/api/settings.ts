import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// ============ FEATURE FLAGS ============

const getFeatureFlagsSchema = z.object({
  scope: z.enum(["global", "church"]).optional(),
});

const updateFeatureFlagSchema = z.object({
  id: z.string(),
  is_enabled: z.boolean(),
});

const createFeatureFlagSchema = z.object({
  key: z.string().min(1),
  name: z.record(z.string(), z.string()),
  description: z.record(z.string(), z.string()).optional(),
  is_enabled: z.boolean(),
  scope: z.enum(["global", "church"]),
  created_by: z.string(),
});

const deleteFeatureFlagSchema = z.object({
  id: z.string(),
});

export const getFeatureFlags = createServerFn({ method: "GET" })
  .inputValidator(getFeatureFlagsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from("feature_flags")
      .select("*")
      .order("created_at", { ascending: false });

    if (data.scope) {
      query = query.eq("scope", data.scope);
    }

    const { data: flags, error } = await query;

    if (error) throw new Error(error.message);

    return serialize(flags || []);
  });

export const updateFeatureFlag = createServerFn({ method: "POST" })
  .inputValidator(updateFeatureFlagSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("feature_flags")
      .update({ is_enabled: data.is_enabled })
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    return { success: true };
  });

export const createFeatureFlag = createServerFn({ method: "POST" })
  .inputValidator(createFeatureFlagSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("feature_flags").insert({
      key: data.key,
      name: data.name,
      description: data.description || null,
      is_enabled: data.is_enabled,
      scope: data.scope,
      created_by: data.created_by,
    });

    if (error) throw new Error(error.message);

    return { success: true };
  });

export const deleteFeatureFlag = createServerFn({ method: "POST" })
  .inputValidator(deleteFeatureFlagSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("feature_flags")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    return { success: true };
  });

// ============ PAYMENT GATEWAYS ============

export const getPaymentGateways = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();

    const { data: gateways, error } = await supabase
      .from("payment_gateways")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return serialize(gateways || []);
  }
);

const updatePaymentGatewaySchema = z.object({
  id: z.string(),
  display_name: z.record(z.string(), z.string()).optional(),
  description: z.record(z.string(), z.string()).optional(),
  is_active: z.boolean().optional(),
  test_mode: z.boolean().optional(),
  api_key: z.string().optional().nullable(),
  webhook_secret: z.string().optional().nullable(),
  config: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const updatePaymentGateway = createServerFn({ method: "POST" })
  .inputValidator(updatePaymentGatewaySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { id, ...updateData } = data;

    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    const { error } = await supabase
      .from("payment_gateways")
      .update(cleanData)
      .eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true };
  });

const createPaymentGatewaySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  display_name: z.record(z.string(), z.string()),
  description: z.record(z.string(), z.string()).optional(),
  icon_url: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  is_active: z.boolean(),
  test_mode: z.boolean(),
});

export const createPaymentGateway = createServerFn({ method: "POST" })
  .inputValidator(createPaymentGatewaySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("payment_gateways").insert({
      name: data.name,
      slug: data.slug,
      display_name: data.display_name,
      description: data.description || null,
      icon_url: data.icon_url || null,
      color: data.color || null,
      is_active: data.is_active,
      test_mode: data.test_mode,
    });

    if (error) throw new Error(error.message);

    return { success: true };
  });

const deletePaymentGatewaySchema = z.object({
  id: z.string(),
});

export const deletePaymentGateway = createServerFn({ method: "POST" })
  .inputValidator(deletePaymentGatewaySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("payment_gateways")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    return { success: true };
  });

// ============ APP STATS (for settings overview) ============

export const getAppOverviewStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();

    const [users, churches, events, donations, content] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("churches").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("amount").eq("status", "completed"),
      supabase.from("content_items").select("*", { count: "exact", head: true }),
    ]);

    const totalDonations = donations.data?.reduce((s, d) => s + d.amount, 0) || 0;

    return {
      users: users.count || 0,
      churches: churches.count || 0,
      events: events.count || 0,
      totalDonations,
      content: content.count || 0,
    };
  }
);
