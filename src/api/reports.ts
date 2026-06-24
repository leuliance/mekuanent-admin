import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types.
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

type ReportTargetType = Database["public"]["Enums"]["report_target_type"];
type ReportStatus = Database["public"]["Enums"]["report_status"];
type ReportReasonInsert =
	Database["public"]["Tables"]["report_reasons"]["Insert"];
type ReportReasonUpdate =
	Database["public"]["Tables"]["report_reasons"]["Update"];

const TARGET_TABLE: Record<ReportTargetType, { table: string; label: string }> =
	{
		event: { table: "events", label: "title" },
		donation: { table: "donation_campaigns", label: "title" },
		content: { table: "content_items", label: "title" },
		church: { table: "churches", label: "name" },
	};

// ---------------------------------------------------------------------------
// Reports list
// ---------------------------------------------------------------------------

const getReportsSchema = z.object({
	status: z
		.enum(["pending", "reviewing", "resolved", "dismissed", "action_taken"])
		.optional(),
	target_type: z.enum(["event", "donation", "content", "church"]).optional(),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
});

export const getReports = createServerFn({ method: "GET" })
	.validator(getReportsSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const from = (data.page - 1) * data.limit;
		const to = from + data.limit - 1;

		let query = supabase
			.from("reports")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(from, to);

		if (data.status) query = query.eq("status", data.status);
		if (data.target_type) query = query.eq("target_type", data.target_type);

		const { data: reports, error, count } = await query;
		if (error) throw new Error(error.message);

		const rows = reports ?? [];

		// Resolve reason labels and reporter names in bulk.
		const reasonKeys = [...new Set(rows.map((r) => r.reason_key))];
		const reporterIds = [...new Set(rows.map((r) => r.reporter_id))];

		const [{ data: reasons }, { data: reporters }] = await Promise.all([
			reasonKeys.length
				? supabase
						.from("report_reasons")
						.select("reason_key, target_type, label")
						.in("reason_key", reasonKeys)
				: Promise.resolve({
						data: [] as {
							reason_key: string;
							target_type: string;
							label: unknown;
						}[],
					}),
			reporterIds.length
				? supabase
						.from("profiles")
						.select("id, first_name, last_name, email")
						.in("id", reporterIds)
				: Promise.resolve({
						data: [] as {
							id: string;
							first_name: string | null;
							last_name: string | null;
							email: string | null;
						}[],
					}),
		]);

		const reasonMap = new Map(
			(reasons ?? []).map((r) => [`${r.target_type}:${r.reason_key}`, r.label]),
		);
		const reporterMap = new Map((reporters ?? []).map((p) => [p.id, p]));

		const enriched = rows.map((r) => ({
			...r,
			reason_label: reasonMap.get(`${r.target_type}:${r.reason_key}`) ?? null,
			reporter: reporterMap.get(r.reporter_id) ?? null,
		}));

		return serialize({
			reports: enriched,
			total: count ?? 0,
			page: data.page,
			totalPages: Math.max(1, Math.ceil((count ?? 0) / data.limit)),
		});
	});

// ---------------------------------------------------------------------------
// Single report (resolves target + church + review permission)
// ---------------------------------------------------------------------------

export const getReport = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: report, error } = await supabase
			.from("reports")
			.select("*")
			.eq("id", data.id)
			.single();
		if (error) throw new Error(error.message);

		const targetType = report.target_type as ReportTargetType;
		const cfg = TARGET_TABLE[targetType];

		const [
			{ data: reason },
			{ data: reporter },
			{ data: targetRow },
			{
				data: { user },
			},
		] = await Promise.all([
			supabase
				.from("report_reasons")
				.select("label, description")
				.eq("target_type", targetType)
				.eq("reason_key", report.reason_key)
				.maybeSingle(),
			supabase
				.from("profiles")
				.select("id, first_name, last_name, email, avatar_url")
				.eq("id", report.reporter_id)
				.maybeSingle(),
			supabase
				.from(cfg.table as "events")
				.select("*")
				.eq("id", report.target_id)
				.maybeSingle(),
			supabase.auth.getUser(),
		]);

		// Owning church + whether the current user may review this report.
		let targetChurch: string | null = null;
		let canReview = false;
		try {
			const { data: churchId } = await supabase.rpc("report_target_church", {
				p_target_id: report.target_id,
				p_target_type: targetType,
			});
			targetChurch = (churchId as string | null) ?? null;
		} catch {
			targetChurch = null;
		}
		if (user) {
			try {
				const { data: allowed } = await supabase.rpc("can_review_report", {
					p_target_id: report.target_id,
					p_target_type: targetType,
					p_user: user.id,
				});
				canReview = Boolean(allowed);
			} catch {
				canReview = false;
			}
		}

		// biome-ignore lint/suspicious/noExplicitAny: target shape varies per type.
		const tr = targetRow as any;
		const targetLabel = tr
			? (tr[cfg.label] ?? tr.title ?? tr.name ?? null)
			: null;

		return serialize({
			report,
			reason,
			reporter,
			target: targetRow ?? null,
			targetLabel,
			targetChurch,
			canReview,
		});
	});

const updateStatusSchema = z.object({
	id: z.uuid(),
	status: z.enum([
		"pending",
		"reviewing",
		"resolved",
		"dismissed",
		"action_taken",
	]),
	resolution_note: z.string().optional(),
});

export const updateReportStatus = createServerFn({ method: "POST" })
	.validator(updateStatusSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const terminal: ReportStatus[] = ["resolved", "dismissed", "action_taken"];
		const isTerminal = terminal.includes(data.status);

		const { data: row, error } = await supabase
			.from("reports")
			.update({
				status: data.status,
				resolution_note: data.resolution_note ?? null,
				resolved_by: isTerminal ? (user?.id ?? null) : null,
				resolved_at: isTerminal ? new Date().toISOString() : null,
			})
			.eq("id", data.id)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

// ---------------------------------------------------------------------------
// Report reasons catalog
// ---------------------------------------------------------------------------

export const getReportReasons = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data, error } = await supabase
			.from("report_reasons")
			.select("*")
			.order("target_type", { ascending: true })
			.order("sort_order", { ascending: true });
		if (error) throw new Error(error.message);
		return serialize(data ?? []);
	},
);

const localizedSchema = z.record(z.string(), z.string());

const createReasonSchema = z.object({
	reason_key: z.string().min(1),
	target_type: z.enum(["event", "donation", "content", "church"]),
	label: localizedSchema,
	description: localizedSchema.optional(),
	is_active: z.boolean().default(true),
	sort_order: z.number().int().default(0),
});

export const createReportReason = createServerFn({ method: "POST" })
	.validator(createReasonSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const insert: ReportReasonInsert = {
			reason_key: data.reason_key,
			target_type: data.target_type,
			label: data.label,
			description: data.description ?? null,
			is_active: data.is_active,
			sort_order: data.sort_order,
		};
		const { data: row, error } = await supabase
			.from("report_reasons")
			.insert(insert)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

const updateReasonSchema = createReasonSchema.partial().extend({
	id: z.uuid(),
});

export const updateReportReason = createServerFn({ method: "POST" })
	.validator(updateReasonSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...rest } = data;
		const update = Object.fromEntries(
			Object.entries(rest).filter(([, v]) => v !== undefined),
		) as ReportReasonUpdate;
		const { data: row, error } = await supabase
			.from("report_reasons")
			.update(update)
			.eq("id", id)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

export const deleteReportReason = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("report_reasons")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});
