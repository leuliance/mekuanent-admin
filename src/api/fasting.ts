import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types.
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

type FastingPeriodInsert =
	Database["public"]["Tables"]["fasting_periods"]["Insert"];
type FastingPeriodUpdate =
	Database["public"]["Tables"]["fasting_periods"]["Update"];
type FastingOccurrenceUpdate =
	Database["public"]["Tables"]["fasting_occurrences"]["Update"];

// Multilingual jsonb; Amharic is required, English optional.
const localizedSchema = z
	.object({
		am: z.string().min(1, "Amharic is required"),
		en: z.string().optional(),
	})
	.catchall(z.string());

const localizedOptionalSchema = z.record(z.string(), z.string()).optional();

// ---------------------------------------------------------------------------
// Fasting periods (the "what")
// ---------------------------------------------------------------------------

export const getFastingPeriods = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data, error } = await supabase
			.from("fasting_periods")
			.select("*")
			.order("sort_order", { ascending: true })
			.order("created_at", { ascending: true });
		if (error) throw new Error(error.message);
		return serialize(data ?? []);
	},
);

export const getFastingPeriod = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: period, error } = await supabase
			.from("fasting_periods")
			.select("*")
			.eq("id", data.id)
			.single();
		if (error) throw new Error(error.message);

		const { data: occurrences, error: occError } = await supabase
			.from("fasting_occurrences")
			.select("*")
			.eq("fasting_id", data.id)
			.order("ethiopian_year", { ascending: false });
		if (occError) throw new Error(occError.message);

		return serialize({ period, occurrences: occurrences ?? [] });
	});

// type/severity are constrained by DB CHECKs. Keep them in sync with the schema.
const FASTING_TYPES = ["movable", "fixed", "weekly"] as const;
const FASTING_SEVERITIES = ["major", "minor", "weekly"] as const;

const createPeriodSchema = z.object({
	// Optional: auto-generated from the name when omitted.
	fasting_key: z.string().optional(),
	name: localizedSchema,
	description: localizedOptionalSchema,
	type: z.enum(FASTING_TYPES),
	severity: z.enum(FASTING_SEVERITIES),
	is_weekly: z.boolean().default(false),
	weekly_days: z.array(z.string()).nullable().optional(),
	start_eth_month: z.number().int().nullable().optional(),
	start_eth_day: z.number().int().nullable().optional(),
	end_eth_month: z.number().int().nullable().optional(),
	end_eth_day: z.number().int().nullable().optional(),
	duration_days: z.number().int().nullable().optional(),
	// Optional: auto-assigned to the end of the list when omitted.
	sort_order: z.number().int().optional(),
	rules: z.record(z.string(), z.unknown()).optional(),
});

/** Slugify a localized name into a stable machine key. */
function slugifyKey(name: { am: string; en?: string }): string {
	const base = (name.en || name.am || "")
		.toLowerCase()
		.normalize("NFKD")
		// keep ascii letters/numbers; collapse everything else to underscores
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
	return base || `fast_${Math.random().toString(36).slice(2, 8)}`;
}

export const createFastingPeriod = createServerFn({ method: "POST" })
	.validator(createPeriodSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		// Auto-generate a unique fasting_key when not supplied.
		let fastingKey = (data.fasting_key ?? "").trim() || slugifyKey(data.name);
		const { data: existing } = await supabase
			.from("fasting_periods")
			.select("fasting_key, sort_order");
		const usedKeys = new Set((existing ?? []).map((r) => r.fasting_key));
		if (usedKeys.has(fastingKey)) {
			let i = 2;
			while (usedKeys.has(`${fastingKey}_${i}`)) i++;
			fastingKey = `${fastingKey}_${i}`;
		}

		// Auto-assign sort_order to the end of the list when not supplied.
		const sortOrder =
			data.sort_order ??
			(existing ?? []).reduce((max, r) => Math.max(max, r.sort_order ?? 0), 0) +
				1;

		const insert: FastingPeriodInsert = {
			fasting_key: fastingKey,
			name: data.name,
			description: data.description ?? null,
			type: data.type,
			severity: data.severity,
			is_weekly: data.is_weekly,
			weekly_days: data.weekly_days ?? null,
			start_eth_month: data.start_eth_month ?? null,
			start_eth_day: data.start_eth_day ?? null,
			end_eth_month: data.end_eth_month ?? null,
			end_eth_day: data.end_eth_day ?? null,
			duration_days: data.duration_days ?? null,
			sort_order: sortOrder,
			rules: (data.rules ?? {}) as FastingPeriodInsert["rules"],
		};
		const { data: row, error } = await supabase
			.from("fasting_periods")
			.insert(insert)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

const updatePeriodSchema = createPeriodSchema.partial().extend({
	id: z.uuid(),
});

export const updateFastingPeriod = createServerFn({ method: "POST" })
	.validator(updatePeriodSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...rest } = data;
		const update = Object.fromEntries(
			Object.entries(rest).filter(([, v]) => v !== undefined),
		) as FastingPeriodUpdate;
		const { data: row, error } = await supabase
			.from("fasting_periods")
			.update(update)
			.eq("id", id)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

export const deleteFastingPeriod = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("fasting_periods")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

// ---------------------------------------------------------------------------
// Fasting occurrences (the "when") — per Ethiopian year
// ---------------------------------------------------------------------------

const occurrenceSchema = z.object({
	fasting_id: z.uuid(),
	ethiopian_year: z.number().int(),
	start_eth_year: z.number().int().nullable().optional(),
	start_eth_month: z.number().int().nullable().optional(),
	start_eth_day: z.number().int().nullable().optional(),
	end_eth_year: z.number().int().nullable().optional(),
	end_eth_month: z.number().int().nullable().optional(),
	end_eth_day: z.number().int().nullable().optional(),
	// Optional: if omitted, computed from the Ethiopian dates via the DB RPC.
	start_gregorian_date: z.string().optional(),
	end_gregorian_date: z.string().optional(),
	notes: localizedOptionalSchema,
});

/** Resolve a Gregorian date from Ethiopian parts using the DB function. */
async function ethToGregorian(
	supabase: ReturnType<typeof getSupabaseServerClient>,
	year: number,
	month: number,
	day: number,
): Promise<string> {
	const { data, error } = await supabase.rpc("ethiopian_to_gregorian", {
		eth_year: year,
		eth_month: month,
		eth_day: day,
	});
	if (error) throw new Error(error.message);
	return data as unknown as string;
}

export const createFastingOccurrence = createServerFn({ method: "POST" })
	.validator(occurrenceSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		let startGregorian = data.start_gregorian_date;
		let endGregorian = data.end_gregorian_date;

		if (
			!startGregorian &&
			data.start_eth_year &&
			data.start_eth_month &&
			data.start_eth_day
		) {
			startGregorian = await ethToGregorian(
				supabase,
				data.start_eth_year,
				data.start_eth_month,
				data.start_eth_day,
			);
		}
		if (
			!endGregorian &&
			data.end_eth_year &&
			data.end_eth_month &&
			data.end_eth_day
		) {
			endGregorian = await ethToGregorian(
				supabase,
				data.end_eth_year,
				data.end_eth_month,
				data.end_eth_day,
			);
		}

		if (!startGregorian || !endGregorian) {
			throw new Error(
				"Provide Gregorian dates or full Ethiopian start/end dates.",
			);
		}

		const { data: row, error } = await supabase
			.from("fasting_occurrences")
			.insert({
				fasting_id: data.fasting_id,
				ethiopian_year: data.ethiopian_year,
				start_eth_year: data.start_eth_year ?? null,
				start_eth_month: data.start_eth_month ?? null,
				start_eth_day: data.start_eth_day ?? null,
				end_eth_year: data.end_eth_year ?? null,
				end_eth_month: data.end_eth_month ?? null,
				end_eth_day: data.end_eth_day ?? null,
				start_gregorian_date: startGregorian,
				end_gregorian_date: endGregorian,
				notes: data.notes ?? null,
			})
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

const updateOccurrenceSchema = occurrenceSchema.partial().extend({
	id: z.uuid(),
});

export const updateFastingOccurrence = createServerFn({ method: "POST" })
	.validator(updateOccurrenceSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, fasting_id: _ignored, ...rest } = data;
		const update = Object.fromEntries(
			Object.entries(rest).filter(([, v]) => v !== undefined),
		) as FastingOccurrenceUpdate;
		const { data: row, error } = await supabase
			.from("fasting_occurrences")
			.update(update)
			.eq("id", id)
			.select()
			.single();
		if (error) throw new Error(error.message);
		return serialize(row);
	});

export const deleteFastingOccurrence = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase
			.from("fasting_occurrences")
			.delete()
			.eq("id", data.id);
		if (error) throw new Error(error.message);
		return { success: true };
	});

// ---------------------------------------------------------------------------
// Calendar preview — per-day fasting tiers across a Gregorian range
// ---------------------------------------------------------------------------

export const getFastsInRange = createServerFn({ method: "POST" })
	.validator(z.object({ start: z.string(), end: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { data: rows, error } = await supabase.rpc("get_fasts_in_range", {
			p_start: data.start,
			p_end: data.end,
		});
		if (error) throw new Error(error.message);
		return serialize(rows ?? []);
	});
