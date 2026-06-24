/**
 * Ethiopian (Amete Mihret) <-> Gregorian date conversion.
 *
 * Pure-JS port of the PL/pgSQL functions in
 * `supabase/migrations/20260621000001_fasting_calendar_schema.sql` (JDN method),
 * so the admin UI can convert dates client-side without a round-trip. The DB
 * remains the source of truth — these match it exactly for all modern dates.
 */

export type EthiopianDate = { year: number; month: number; day: number };

/** Ethiopian month names (1-13). Pagume is the 13th, 5–6 days. */
export const ETHIOPIAN_MONTHS = [
	{ am: "መስከረም", en: "Meskerem" },
	{ am: "ጥቅምት", en: "Tikimt" },
	{ am: "ኅዳር", en: "Hidar" },
	{ am: "ታኅሣሥ", en: "Tahsas" },
	{ am: "ጥር", en: "Tir" },
	{ am: "የካቲት", en: "Yekatit" },
	{ am: "መጋቢት", en: "Megabit" },
	{ am: "ሚያዝያ", en: "Miyazya" },
	{ am: "ግንቦት", en: "Ginbot" },
	{ am: "ሰኔ", en: "Sene" },
	{ am: "ሐምሌ", en: "Hamle" },
	{ am: "ነሐሴ", en: "Nehase" },
	{ am: "ጳጉሜን", en: "Pagume" },
] as const;

/** Ethiopian (year, month, day) -> Gregorian Date (local, midnight). */
export function ethiopianToGregorian(
	year: number,
	month: number,
	day: number,
): Date {
	const jdn =
		1723856 +
		365 +
		365 * (year - 1) +
		Math.floor(year / 4) +
		30 * (month - 1) +
		(day - 1);

	const a = jdn + 32044;
	const b = Math.floor((4 * a + 3) / 146097);
	const c = a - Math.floor((146097 * b) / 4);
	const d = Math.floor((4 * c + 3) / 1461);
	const e = c - Math.floor((1461 * d) / 4);
	const m = Math.floor((5 * e + 2) / 153);
	const gd = e - Math.floor((153 * m + 2) / 5) + 1;
	const gm = m + 3 - 12 * Math.floor(m / 10);
	const gy = 100 * b + d - 4800 + Math.floor(m / 10);
	return new Date(gy, gm - 1, gd);
}

/** Gregorian Date -> Ethiopian (year, month, day). */
export function gregorianToEthiopian(date: Date): EthiopianDate {
	const gy = date.getFullYear();
	const gm = date.getMonth() + 1;
	const gd = date.getDate();

	const a = Math.floor((14 - gm) / 12);
	const y = gy + 4800 - a;
	const m = gm + 12 * a - 3;
	const jdn =
		gd +
		Math.floor((153 * m + 2) / 5) +
		365 * y +
		Math.floor(y / 4) -
		Math.floor(y / 100) +
		Math.floor(y / 400) -
		32045;

	const ofs = jdn - 1723856;
	const r = ((ofs % 1461) + 1461) % 1461;
	const n = (r % 365) + 365 * Math.floor(r / 1460);
	const year =
		4 * Math.floor(ofs / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
	const month = Math.floor(n / 30) + 1;
	const day = (n % 30) + 1;
	return { year, month, day };
}

/** "ታኅሣሥ 29, 2018 ዓ.ም" style label. */
export function formatEthiopian(
	d: EthiopianDate,
	lang: "am" | "en" = "am",
): string {
	const mon = ETHIOPIAN_MONTHS[d.month - 1];
	const name = mon ? mon[lang] : String(d.month);
	return lang === "am"
		? `${name} ${d.day}, ${d.year} ዓ.ም`
		: `${name} ${d.day}, ${d.year} E.C.`;
}

/** Parse a "yyyy-MM-dd" string into a local Date (no timezone shift). */
export function parseISODate(value: string): Date | undefined {
	if (!value) return undefined;
	const [y, m, d] = value.split("-").map(Number);
	if (!y || !m || !d) return undefined;
	return new Date(y, m - 1, d);
}

/** Format a Date as "yyyy-MM-dd" (local). */
export function toISODate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}
