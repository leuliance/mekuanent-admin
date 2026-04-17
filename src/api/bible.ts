import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertSuperAdmin } from "@/lib/server-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json, Tables } from "@/types/database.types";

type BibleBookInsert = Database["public"]["Tables"]["bible_books"]["Insert"];
type BibleBookUpdate = Database["public"]["Tables"]["bible_books"]["Update"];
type BibleCrossRefInsert =
	Database["public"]["Tables"]["bible_cross_references"]["Insert"];

// Types
export type BibleBook = Tables<"bible_books">;
export type BibleChapter = Tables<"bible_chapters">;
export type BibleVerse = Tables<"bible_verses">;
export type BibleFootnote = Tables<"bible_footnotes">;
export type BibleCrossReference = Tables<"bible_cross_references">;

// Helper to serialize data for server function return
// biome-ignore lint/suspicious/noExplicitAny: Required for JSON serialization of Supabase types with unknown fields
const serialize = <T>(data: T): any => JSON.parse(JSON.stringify(data));

// ==================== BIBLE BOOKS ====================

const getBooksSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	search: z.string().optional(),
	testament: z.enum(["old", "new"]).optional(),
});

export const getBibleBooks = createServerFn({ method: "GET" })
	.inputValidator(getBooksSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const page = data.page || 1;
		const limit = data.limit || 66;
		const offset = (page - 1) * limit;

		let query = supabase
			.from("bible_books")
			.select("*", { count: "exact" })
			.order("book_number", { ascending: true })
			.range(offset, offset + limit - 1);

		if (data.search) {
			query = query.or(
				`name->>en.ilike.%${data.search}%,name->>am.ilike.%${data.search}%`,
			);
		}

		const { data: books, error, count } = await query;

		if (error) {
			throw new Error(error.message);
		}

		// Filter by testament if provided
		let filteredBooks = books || [];
		if (data.testament) {
			filteredBooks = filteredBooks.filter((book) => {
				const t = book.testament;
				const s = typeof t === "string" ? t.toLowerCase() : "";
				if (data.testament === "old") {
					return s.includes("old");
				}
				return s.includes("new");
			});
		}

		return serialize({
			books: filteredBooks,
			total: count || 0,
			page,
			limit,
			totalPages: Math.ceil((count || 0) / limit),
		});
	});

export const getBibleBook = createServerFn({ method: "GET" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: book, error } = await supabase
			.from("bible_books")
			.select("*")
			.eq("id", data.id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(book);
	});

export const getBibleBookStats = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const { data: books, error } = await supabase
			.from("bible_books")
			.select("testament");

		if (error) {
			throw new Error(error.message);
		}

		const oldTestament =
			books?.filter((b) => {
				const s =
					typeof b.testament === "string" ? b.testament.toLowerCase() : "";
				return s.includes("old");
			}).length || 0;

		const newTestament =
			books?.filter((b) => {
				const s =
					typeof b.testament === "string" ? b.testament.toLowerCase() : "";
				return s.includes("new");
			}).length || 0;

		return serialize({
			total: books?.length || 0,
			oldTestament,
			newTestament,
		});
	},
);

const createBookSchema = z.object({
	book_number: z.number(),
	chapter_count: z.number(),
	name: z.object({
		en: z.string(),
		am: z.string().optional(),
	}),
	testament: z.object({
		en: z.string(),
		am: z.string().optional(),
	}),
});

function testamentString(testament: { en: string; am?: string }): string {
	return testament.en;
}

function bibleBookCategory(testamentEn: string): string {
	return testamentEn.toLowerCase().includes("old") ? "OT" : "NT";
}

function deriveParatextCode(nameEn: string, bookNumber: number): string {
	const alpha = nameEn.replace(/[^a-zA-Z]/g, "").toUpperCase();
	if (alpha.length >= 3) return alpha.slice(0, 11);
	return `BK${bookNumber}`.toUpperCase().slice(0, 11);
}

export const createBibleBook = createServerFn({ method: "POST" })
	.inputValidator(createBookSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const testamentStr = testamentString(data.testament);
		const row: BibleBookInsert = {
			book_number: data.book_number,
			chapter_count: data.chapter_count,
			name: data.name as Json,
			testament: testamentStr,
			category: bibleBookCategory(testamentStr),
			paratext_code: deriveParatextCode(data.name.en, data.book_number),
		};

		const { data: book, error } = await supabase
			.from("bible_books")
			.insert(row)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(book);
	});

const updateBookSchema = z.object({
	id: z.string(),
	book_number: z.number().optional(),
	chapter_count: z.number().optional(),
	name: z
		.object({
			en: z.string(),
			am: z.string().optional(),
		})
		.optional(),
	testament: z
		.object({
			en: z.string(),
			am: z.string().optional(),
		})
		.optional(),
});

export const updateBibleBook = createServerFn({ method: "POST" })
	.inputValidator(updateBookSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...rest } = data;
		const updatePayload: BibleBookUpdate = {};
		if (rest.book_number !== undefined) {
			updatePayload.book_number = rest.book_number;
		}
		if (rest.chapter_count !== undefined) {
			updatePayload.chapter_count = rest.chapter_count;
		}
		if (rest.name !== undefined) {
			updatePayload.name = rest.name as Json;
		}
		if (rest.testament !== undefined) {
			const testamentStr = testamentString(rest.testament);
			updatePayload.testament = testamentStr;
			updatePayload.category = bibleBookCategory(testamentStr);
		}

		const { data: book, error } = await supabase
			.from("bible_books")
			.update(updatePayload)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(book);
	});

export const deleteBibleBook = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("bible_books")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// ==================== BIBLE CHAPTERS ====================

const getChaptersSchema = z.object({
	bookId: z.string(),
	page: z.number().optional(),
	limit: z.number().optional(),
});

export const getBibleChapters = createServerFn({ method: "GET" })
	.inputValidator(getChaptersSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const page = data.page || 1;
		const limit = data.limit || 150;
		const offset = (page - 1) * limit;

		const {
			data: chapters,
			error,
			count,
		} = await supabase
			.from("bible_chapters")
			.select("*", { count: "exact" })
			.eq("book_id", data.bookId)
			.order("chapter_number", { ascending: true })
			.range(offset, offset + limit - 1);

		if (error) {
			throw new Error(error.message);
		}

		return serialize({
			chapters: chapters || [],
			total: count || 0,
			page,
			limit,
			totalPages: Math.ceil((count || 0) / limit),
		});
	});

export const getBibleChapter = createServerFn({ method: "GET" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: chapter, error } = await supabase
			.from("bible_chapters")
			.select("*, bible_books(*)")
			.eq("id", data.id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(chapter);
	});

const createChapterSchema = z.object({
	book_id: z.string(),
	chapter_number: z.number(),
	verse_count: z.number(),
});

export const createBibleChapter = createServerFn({ method: "POST" })
	.inputValidator(createChapterSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: chapter, error } = await supabase
			.from("bible_chapters")
			.insert(data)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(chapter);
	});

const updateChapterSchema = z.object({
	id: z.string(),
	chapter_number: z.number().optional(),
	verse_count: z.number().optional(),
});

export const updateBibleChapter = createServerFn({ method: "POST" })
	.inputValidator(updateChapterSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, ...updateData } = data;

		const { data: chapter, error } = await supabase
			.from("bible_chapters")
			.update(updateData)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(chapter);
	});

export const deleteBibleChapter = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("bible_chapters")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// ==================== BIBLE VERSES ====================

const getVersesSchema = z.object({
	chapterId: z.string(),
	page: z.number().optional(),
	limit: z.number().optional(),
	search: z.string().optional(),
});

export const getBibleVerses = createServerFn({ method: "GET" })
	.inputValidator(getVersesSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const page = data.page || 1;
		const limit = data.limit || 200;
		const offset = (page - 1) * limit;

		let query = supabase
			.from("bible_verses")
			.select("*", { count: "exact" })
			.eq("chapter_id", data.chapterId)
			.order("verse_number", { ascending: true })
			.range(offset, offset + limit - 1);

		if (data.search) {
			query = query.or(
				`text->>en.ilike.%${data.search}%,text->>am.ilike.%${data.search}%`,
			);
		}

		const { data: verses, error, count } = await query;

		if (error) {
			throw new Error(error.message);
		}

		return serialize({
			verses: verses || [],
			total: count || 0,
			page,
			limit,
			totalPages: Math.ceil((count || 0) / limit),
		});
	});

export const getBibleVerse = createServerFn({ method: "GET" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: verse, error } = await supabase
			.from("bible_verses")
			.select("*, bible_chapters(*, bible_books(*))")
			.eq("id", data.id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(verse);
	});

const createVerseSchema = z.object({
	chapter_id: z.string(),
	verse_number: z.number(),
	text: z.object({
		en: z.string(),
		am: z.string().optional(),
	}),
});

export const createBibleVerse = createServerFn({ method: "POST" })
	.inputValidator(createVerseSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: verse, error } = await supabase
			.from("bible_verses")
			.insert({
				chapter_id: data.chapter_id,
				verse_number: data.verse_number,
				text: data.text as Json,
			})
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(verse);
	});

const bulkCreateVersesSchema = z.object({
	chapter_id: z.string(),
	verses: z
		.array(
			z.object({
				verse_number: z.number().int().positive(),
				text: z.object({
					en: z.string().min(1),
					am: z.string().optional(),
				}),
			}),
		)
		.min(1)
		.max(200),
});

/** Insert many verses in one request (same chapter). */
export const bulkCreateBibleVerses = createServerFn({ method: "POST" })
	.inputValidator(bulkCreateVersesSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const rows = data.verses.map((v) => ({
			chapter_id: data.chapter_id,
			verse_number: v.verse_number,
			text: v.text as Json,
		}));

		const { data: inserted, error } = await supabase
			.from("bible_verses")
			.insert(rows)
			.select();

		if (error) {
			throw new Error(error.message);
		}

		return serialize({ count: inserted?.length ?? 0, verses: inserted || [] });
	});

const updateVerseSchema = z.object({
	id: z.string(),
	verse_number: z.number().optional(),
	text: z
		.object({
			en: z.string(),
			am: z.string().optional(),
		})
		.optional(),
});

export const updateBibleVerse = createServerFn({ method: "POST" })
	.inputValidator(updateVerseSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { id, verse_number, text } = data;
		const patch: Database["public"]["Tables"]["bible_verses"]["Update"] = {};
		if (verse_number !== undefined) {
			patch.verse_number = verse_number;
		}
		if (text !== undefined) {
			patch.text = text as Json;
		}

		const { data: verse, error } = await supabase
			.from("bible_verses")
			.update(patch)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(verse);
	});

export const deleteBibleVerse = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("bible_verses")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// ==================== SEARCH ====================

export const searchBibleVerses = createServerFn({ method: "GET" })
	.inputValidator(z.object({ query: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: results, error } = await supabase.rpc(
			"search_bible_verses_text",
			{ search_query: data.query },
		);

		if (error) {
			throw new Error(error.message);
		}

		return serialize(results || []);
	});

// ==================== FOOTNOTES ====================

export const getBibleFootnotes = createServerFn({ method: "GET" })
	.inputValidator(z.object({ verseId: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: footnotes, error } = await supabase
			.from("bible_footnotes")
			.select("*")
			.eq("verse_id", data.verseId)
			.order("created_at", { ascending: true });

		if (error) {
			throw new Error(error.message);
		}

		return serialize(footnotes || []);
	});

const createFootnoteSchema = z.object({
	verse_id: z.string(),
	marker: z.object({
		en: z.string(),
		am: z.string().optional(),
	}),
	note: z.object({
		en: z.string(),
		am: z.string().optional(),
	}),
	type: z.string().optional(),
});

export const createBibleFootnote = createServerFn({ method: "POST" })
	.inputValidator(createFootnoteSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: footnote, error } = await supabase
			.from("bible_footnotes")
			.insert({
				verse_id: data.verse_id,
				marker: data.marker as Json,
				note: data.note as Json,
				type: data.type ?? "general",
			})
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(footnote);
	});

const updateFootnoteSchema = z.object({
	id: z.string(),
	marker: z
		.object({
			en: z.string(),
			am: z.string().optional(),
		})
		.optional(),
	note: z
		.object({
			en: z.string(),
			am: z.string().optional(),
		})
		.optional(),
	type: z.string().optional(),
});

export const updateBibleFootnote = createServerFn({ method: "POST" })
	.inputValidator(updateFootnoteSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { id, marker, note, type } = data;
		const patch: Database["public"]["Tables"]["bible_footnotes"]["Update"] = {};
		if (marker !== undefined) {
			patch.marker = marker as Json;
		}
		if (note !== undefined) {
			patch.note = note as Json;
		}
		if (type !== undefined) {
			patch.type = type;
		}
		const { data: footnote, error } = await supabase
			.from("bible_footnotes")
			.update(patch)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(footnote);
	});

export const deleteBibleFootnote = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("bible_footnotes")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});

// ==================== CROSS REFERENCES ====================

export const getBibleCrossReferences = createServerFn({ method: "GET" })
	.inputValidator(z.object({ verseId: z.string() }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { data: references, error } = await supabase
			.from("bible_cross_references")
			.select("*, bible_books!bible_cross_references_ref_book_id_fkey(*)")
			.eq("verse_id", data.verseId)
			.order("created_at", { ascending: true });

		if (error) {
			throw new Error(error.message);
		}

		return serialize(references || []);
	});

const createCrossRefSchema = z.object({
	verse_id: z.string(),
	reference: z.object({
		en: z.string(),
		am: z.string().optional(),
	}),
	description: z
		.object({
			en: z.string(),
			am: z.string().optional(),
		})
		.optional(),
	reference_book_id: z.string().min(1),
	reference_chapter: z.number(),
	reference_verse_start: z.number(),
	reference_verse_end: z.number().optional(),
});

export const createBibleCrossReference = createServerFn({ method: "POST" })
	.inputValidator(createCrossRefSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const description: Json = data.description
			? (data.description as Json)
			: ({
					en: data.reference.en,
					...(data.reference.am ? { am: data.reference.am } : {}),
				} as Json);

		const row: BibleCrossRefInsert = {
			verse_id: data.verse_id,
			ref_book_id: data.reference_book_id,
			ref_chapter: data.reference_chapter,
			ref_verse_start: data.reference_verse_start,
			ref_verse_end:
				data.reference_verse_end !== undefined && data.reference_verse_end > 0
					? data.reference_verse_end
					: null,
			description,
		};

		const { data: reference, error } = await supabase
			.from("bible_cross_references")
			.insert(row)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return serialize(reference);
	});

export const deleteBibleCrossReference = createServerFn({ method: "POST" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await assertSuperAdmin();
		const supabase = getSupabaseServerClient();

		const { error } = await supabase
			.from("bible_cross_references")
			.delete()
			.eq("id", data.id);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	});
