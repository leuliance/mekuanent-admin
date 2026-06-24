declare module "usfm-js" {
	/** Minimal typings for usfm-js v3 — the package ships no TypeScript types. */
	export function toJSON(
		usfm: string,
		params?: Record<string, unknown>,
	): unknown;
	export function toUSFM(
		json: Record<string, unknown>,
		params?: { forcedNewLines?: boolean; [key: string]: unknown },
	): string;
	export function removeMarker(usfm: string): string;
	const _default: {
		toJSON: typeof toJSON;
		toUSFM: typeof toUSFM;
		removeMarker: typeof removeMarker;
	};
	export default _default;
}
