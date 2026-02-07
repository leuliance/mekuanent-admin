import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

const getPaymentsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  search: z.string().optional(),
});

export const getPayments = createServerFn({ method: "GET" })
  .inputValidator(getPaymentsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const page = data.page || 1;
    const limit = data.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("payments")
      .select(
        `
        *,
        profiles!payments_user_id_fkey(first_name, last_name, avatar_url, email, phone_number)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.status) {
      query = query.eq("status", data.status);
    }

    if (data.search) {
      // search by gateway reference or transaction id
      query = query.or(
        `gateway_reference.ilike.%${data.search}%,gateway_transaction_id.ilike.%${data.search}%`
      );
    }

    const { data: payments, error, count } = await query;
    if (error) throw new Error(error.message);

    return serialize({
      payments: payments || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  });

export const getPaymentStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getSupabaseServerClient();

    const [total, completed, failed, totalAmount] = await Promise.all([
      supabase.from("payments").select("*", { count: "exact", head: true }),
      supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("payments").select("amount").eq("status", "completed"),
    ]);

    const sum = totalAmount.data?.reduce((s, p) => s + p.amount, 0) || 0;

    return {
      total: total.count || 0,
      completed: completed.count || 0,
      failed: failed.count || 0,
      totalAmount: sum,
    };
  }
);
