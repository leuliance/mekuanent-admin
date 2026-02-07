import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

export type DashboardStats = {
  churches: {
    total: number;
    pending: number;
    approved: number;
  };
  users: {
    total: number;
    newThisMonth: number;
  };
  content: {
    total: number;
    pending: number;
  };
  donations: {
    totalAmount: number;
    totalCount: number;
    activeCampaigns: number;
  };
  events: {
    total: number;
    upcoming: number;
  };
};

// Get dashboard statistics
export const getDashboardStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();
    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const [
      totalChurches,
      pendingChurches,
      approvedChurches,
      totalUsers,
      newUsersThisMonth,
      totalContent,
      pendingContent,
      completedDonations,
      activeCampaigns,
      totalEvents,
      upcomingEvents,
    ] = await Promise.all([
      // Churches
      supabase.from("churches").select("*", { count: "exact", head: true }),
      supabase
        .from("churches")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("churches")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),
      // Users
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth),
      // Content
      supabase
        .from("content_items")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("content_items")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_approval"),
      // Donations
      supabase
        .from("donations")
        .select("amount")
        .eq("status", "completed"),
      supabase
        .from("donation_campaigns")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      // Events
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .gte("start_time", now.toISOString()),
    ]);

    const totalDonationAmount =
      completedDonations.data?.reduce((sum, d) => sum + d.amount, 0) || 0;

    return {
      churches: {
        total: totalChurches.count || 0,
        pending: pendingChurches.count || 0,
        approved: approvedChurches.count || 0,
      },
      users: {
        total: totalUsers.count || 0,
        newThisMonth: newUsersThisMonth.count || 0,
      },
      content: {
        total: totalContent.count || 0,
        pending: pendingContent.count || 0,
      },
      donations: {
        totalAmount: totalDonationAmount,
        totalCount: completedDonations.data?.length || 0,
        activeCampaigns: activeCampaigns.count || 0,
      },
      events: {
        total: totalEvents.count || 0,
        upcoming: upcomingEvents.count || 0,
      },
    } as DashboardStats;
  }
);

// Get recent activities
export const getRecentActivities = createServerFn({ method: "GET" })
  .inputValidator((data: { limit?: number }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const limit = data.limit || 10;

    const [recentChurches, recentContent, recentDonations] =
      await Promise.all([
        supabase
          .from("churches")
          .select("id, name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("content_items")
          .select(
            "id, title, status, content_type, created_at, churches(name)"
          )
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("donations")
          .select(
            "id, amount, status, created_at, profiles(first_name, last_name), donation_campaigns(title)"
          )
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(limit),
      ]);

    return serialize({
      recentChurches: recentChurches.data || [],
      recentContent: recentContent.data || [],
      recentDonations: recentDonations.data || [],
    });
  });
