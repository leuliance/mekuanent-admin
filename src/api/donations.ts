import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Tables } from "@/types/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Donation = Tables<"donations">;
export type DonationCampaign = Tables<"donation_campaigns">;

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// Schemas
const getDonationsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  campaign_id: z.string().optional(),
  search: z.string().optional(),
});

const getCampaignsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]).optional(),
  church_id: z.string().optional(),
  search: z.string().optional(),
});

const getCampaignSchema = z.object({
  id: z.string(),
});

const getCampaignGoalChangesSchema = z.object({
  campaign_id: z.string(),
});

const getCampaignPaymentMethodsSchema = z.object({
  campaign_id: z.string(),
});

const updateCampaignStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]),
  rejected_reason: z.string().optional(),
  verified_by: z.string().optional(),
});

const deleteCampaignSchema = z.object({
  id: z.string(),
});

// Get all donations with pagination
export const getDonations = createServerFn({ method: "GET" })
  .inputValidator(getDonationsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("donations")
      .select(
        `
          *,
          profiles(first_name, last_name, avatar_url, email, phone_number),
          donation_campaigns(title, churches(name)),
          payments(id, payment_method, payment_gateway, gateway_transaction_id, status, gateway_reference)
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.status) {
      query = query.eq("status", data.status);
    }

    if (data.campaign_id) {
      query = query.eq("campaign_id", data.campaign_id);
    }

    const { data: donations, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return serialize({
      donations: donations || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  });

// Get all donation campaigns
export const getCampaigns = createServerFn({ method: "GET" })
  .inputValidator(getCampaignsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("donation_campaigns")
      .select(
        `
          *,
          churches(name, logo_url),
          profiles!donation_campaigns_created_by_fkey(first_name, last_name),
          donation_categories(name, icon, color),
          donations(id, amount, status)
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.status) {
      query = query.eq("status", data.status);
    }

    if (data.church_id) {
      query = query.eq("church_id", data.church_id);
    }

    if (data.search) {
      query = query.or(
        `title->>en.ilike.%${data.search}%,title->>am.ilike.%${data.search}%`
      );
    }

    const { data: campaigns, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return serialize({
      campaigns: campaigns || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  });

// Get campaign details
export const getCampaign = createServerFn({ method: "GET" })
  .inputValidator(getCampaignSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: campaign, error } = await supabase
      .from("donation_campaigns")
      .select(
        `
          *,
          churches(name, logo_url),
          profiles!donation_campaigns_created_by_fkey(first_name, last_name, avatar_url),
          donation_categories(name, icon, color),
          donations(*, profiles(first_name, last_name, avatar_url))
        `
      )
      .eq("id", data.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return serialize(campaign);
  });

// Update campaign status
export const updateCampaignStatus = createServerFn({ method: "POST" })
  .inputValidator(updateCampaignStatusSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const updateData: Record<string, unknown> = {
      status: data.status,
      rejected_reason: data.rejected_reason || null,
    };

    if (data.status === "active" && data.verified_by) {
      updateData.verified_at = new Date().toISOString();
      updateData.verified_by = data.verified_by;
    }

    const { error } = await supabase
      .from("donation_campaigns")
      .update(updateData)
      .eq("id", data.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

// Delete campaign
export const deleteCampaign = createServerFn({ method: "POST" })
  .inputValidator(deleteCampaignSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("donation_campaigns")
      .delete()
      .eq("id", data.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

// Get campaign goal change history
export const getCampaignGoalChanges = createServerFn({ method: "GET" })
  .inputValidator(getCampaignGoalChangesSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: changes, error } = await supabase
      .from("campaign_goal_changes")
      .select("*, profiles:changed_by(first_name, last_name)")
      .eq("campaign_id", data.campaign_id)
      .order("changed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return serialize(changes || []);
  });

// Get campaign payment methods
export const getCampaignPaymentMethods = createServerFn({ method: "GET" })
  .inputValidator(getCampaignPaymentMethodsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: methods, error } = await supabase
      .from("campaign_payment_methods")
      .select("*, church_payment_methods(*, payment_gateways(name, slug, display_name, icon_url, color))")
      .eq("campaign_id", data.campaign_id);
    if (error) throw new Error(error.message);
    return serialize(methods || []);
  });

// Get donation statistics
export const getDonationStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();

    const [totalDonations, completedDonations, activeCampaigns, totalRaised] =
      await Promise.all([
        supabase
          .from("donations")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("donations")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed"),
        supabase
          .from("donation_campaigns")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("donations")
          .select("amount")
          .eq("status", "completed"),
      ]);

    const totalAmount =
      totalRaised.data?.reduce((sum, d) => sum + d.amount, 0) || 0;

    return {
      totalDonations: totalDonations.count || 0,
      completedDonations: completedDonations.count || 0,
      activeCampaigns: activeCampaigns.count || 0,
      totalRaised: totalAmount,
    };
  }
);
