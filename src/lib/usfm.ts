import usfm from "usfm-js";

/**
 * Thin, isomorphic wrapper around `usfm-js` (a pure-JS USFM <-> JSON converter).
 * Unlike `usfm-grammar`, usfm-js has no native (tree-sitter) bindings, so it runs
 * in the browser, in Node, and on Cloudflare Workers. Used by the Bible USFM
 * editor (client-side live preview) and the Bible server functions.
 */

export type UsfmVerseObject = {
	type?: string;
	tag?: string;
	text?: string;
	content?: string;
	number?: string;
	endTag?: string;
	children?: UsfmVerseObject[];
	[key: string]: unknown;
};

export type UsfmChapter = Record<
	string,
	{ verseObjects?: UsfmVerseObject[] } | undefined
>;

export type UsfmJson = {
	headers?: Array<{ tag?: string; content?: string }>;
	chapters: Record<string, UsfmChapter>;
};

// Note containers whose inner text must NOT be merged into the verse body.
const NOTE_TYPES = new Set(["footnote", "xref"]);
const NOTE_TAGS = new Set(["f", "fe", "x", "fr", "ft", "fk", "fq", "xo", "xt"]);

function collectText(objs?: UsfmVerseObject[]): string {
	if (!objs) return "";
	let out = "";
	for (const o of objs) {
		if (!o || typeof o !== "object") continue;
		if (o.type && NOTE_TYPES.has(o.type)) continue;
		if (o.tag && NOTE_TAGS.has(o.tag)) continue;
		if (typeof o.text === "string") out += o.text;
		if (Array.isArray(o.children)) out += collectText(o.children);
	}
	return out;
}

/** Parse a USFM string into usfm-js JSON. */
export function usfmToJson(text: string): UsfmJson {
	return usfm.toJSON(text) as UsfmJson;
}

/** Serialize usfm-js JSON back into a USFM string. */
export function jsonToUsfm(json: unknown): string {
	return usfm.toUSFM(json as Record<string, unknown>, {
		forcedNewLines: false,
	});
}

/** Strip every USFM marker from a string, leaving plain text. */
export function stripMarkers(text: string): string {
	return usfm.removeMarker(text) as string;
}

/**
 * Flatten the FIRST chapter found in `json` into ordered verse rows, with notes
 * removed from the verse text. (`front` and other non-numeric keys are skipped.)
 */
export function extractVerses(
	json: UsfmJson,
): { verse_number: number; text: string }[] {
	const chapters = json?.chapters ?? {};
	const firstKey = Object.keys(chapters)[0];
	if (!firstKey) return [];
	const chap = chapters[firstKey] ?? {};
	const rows: { verse_number: number; text: string }[] = [];
	for (const [key, val] of Object.entries(chap)) {
		const n = Number(key);
		if (!Number.isInteger(n) || n <= 0) continue;
		const text = collectText(val?.verseObjects).replace(/\s+/g, " ").trim();
		if (text) rows.push({ verse_number: n, text });
	}
	return rows.sort((a, b) => a.verse_number - b.verse_number);
}

/** Lightweight, non-fatal validation hints for the editor UI. */
export function lintUsfm(
	json: UsfmJson,
	verses: { verse_number: number }[],
): string[] {
	const warnings: string[] = [];
	if (!json.chapters || Object.keys(json.chapters).length === 0) {
		warnings.push("No \\c chapter marker found.");
	}
	if (verses.length === 0) {
		warnings.push("No \\v verses were detected.");
	}
	const seen = new Set<number>();
	for (const v of verses) {
		if (seen.has(v.verse_number)) {
			warnings.push(`Duplicate verse number ${v.verse_number}.`);
		}
		seen.add(v.verse_number);
	}
	return warnings;
}

/** Parse + extract + lint in one call. */
export function parseUsfmString(text: string): {
	json: UsfmJson;
	verses: { verse_number: number; text: string }[];
	warnings: string[];
} {
	const json = usfmToJson(text);
	const verses = extractVerses(json);
	return { json, verses, warnings: lintUsfm(json, verses) };
}

/** Build minimal usfm-js JSON for one chapter from flat verse rows. */
export function buildChapterJson(
	bookCode: string,
	chapterNumber: number,
	verses: { verse_number: number; text: string }[],
): UsfmJson {
	const chapter: UsfmChapter = {
		front: { verseObjects: [{ type: "paragraph", tag: "p" }] },
	};
	for (const v of verses) {
		chapter[String(v.verse_number)] = {
			verseObjects: [{ type: "text", text: v.text }],
		};
	}
	return {
		headers: [{ tag: "id", content: bookCode }],
		chapters: { [String(chapterNumber)]: chapter },
	};
}
