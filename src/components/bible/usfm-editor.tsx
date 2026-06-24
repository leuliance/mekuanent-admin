import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	parseUsfmString,
	type UsfmJson,
	type UsfmVerseObject,
} from "@/lib/usfm";
import { cn } from "@/lib/utils";

/**
 * A lightweight "rich" editor for USFM: a marker toolbar + raw USFM textarea on
 * the left, and a live, formatted scripture preview on the right. Parsing is done
 * client-side with usfm-js so the preview updates instantly as you type.
 */

type MarkerAction =
	| { kind: "line"; insert: string; label: string; title: string }
	| { kind: "wrap"; open: string; close: string; label: string; title: string };

const TOOLBAR: MarkerAction[] = [
	{ kind: "line", insert: "\\c ", label: "\\c", title: "Chapter number" },
	{ kind: "line", insert: "\\v ", label: "\\v", title: "Verse number" },
	{ kind: "line", insert: "\\p", label: "\\p", title: "Paragraph" },
	{ kind: "line", insert: "\\m", label: "\\m", title: "Margin paragraph" },
	{ kind: "line", insert: "\\s1 ", label: "\\s1", title: "Section heading" },
	{ kind: "line", insert: "\\q1 ", label: "\\q1", title: "Poetry line 1" },
	{ kind: "line", insert: "\\q2 ", label: "\\q2", title: "Poetry line 2" },
	{ kind: "line", insert: "\\b", label: "\\b", title: "Blank line" },
	{
		kind: "wrap",
		open: "\\wj ",
		close: "\\wj*",
		label: "\\wj",
		title: "Words of Jesus",
	},
	{
		kind: "wrap",
		open: "\\nd ",
		close: "\\nd*",
		label: "\\nd",
		title: "Divine name (LORD)",
	},
	{
		kind: "wrap",
		open: "\\add ",
		close: "\\add*",
		label: "\\add",
		title: "Translator addition",
	},
	{
		kind: "wrap",
		open: "\\f + \\ft ",
		close: "\\f*",
		label: "\\f",
		title: "Footnote",
	},
	{
		kind: "wrap",
		open: "\\x + \\xt ",
		close: "\\x*",
		label: "\\x",
		title: "Cross reference",
	},
];

function renderObjects(
	objs: UsfmVerseObject[] | undefined,
	keyPrefix: string,
): React.ReactNode[] {
	if (!objs) return [];
	const out: React.ReactNode[] = [];
	objs.forEach((o, i) => {
		const key = `${keyPrefix}-${i}`;
		if (!o || typeof o !== "object") return;
		if (o.type === "section") {
			out.push(
				<h4 key={key} className="mt-3 mb-1 font-semibold text-foreground">
					{(o.content ?? o.text ?? "").trim()}
				</h4>,
			);
			return;
		}
		if (o.type === "paragraph") {
			out.push(<span key={key} className="block h-2" />);
			return;
		}
		if (o.type === "footnote" || o.type === "xref") {
			out.push(
				<sup
					key={key}
					title={o.content ?? o.text ?? ""}
					className="mx-0.5 cursor-help text-primary"
				>
					{o.type === "xref" ? "✦" : "*"}
				</sup>,
			);
			return;
		}
		if (o.tag === "wj") {
			out.push(
				<span key={key} className="text-red-600 dark:text-red-400">
					{o.text}
				</span>,
			);
			return;
		}
		if (o.tag === "nd") {
			out.push(
				<span key={key} className="uppercase tracking-wide">
					{o.text}
				</span>,
			);
			return;
		}
		if (o.type === "quote" || (o.tag && /^q\d?$/.test(o.tag))) {
			out.push(
				<span key={key} className="block pl-6 italic">
					{o.text}
				</span>,
			);
			return;
		}
		if (typeof o.text === "string") {
			out.push(<span key={key}>{o.text}</span>);
			return;
		}
		if (Array.isArray(o.children)) {
			out.push(...renderObjects(o.children, key));
		}
	});
	return out;
}

function Preview({ json }: { json: UsfmJson }) {
	const chapters = Object.entries(json.chapters ?? {});
	if (chapters.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Start typing USFM to see a live preview.
			</p>
		);
	}
	return (
		<div className="space-y-4">
			{chapters.map(([cnum, chap]) => {
				const verseEntries = Object.entries(chap ?? {})
					.filter(([k]) => /^\d+$/.test(k))
					.sort((a, b) => Number(a[0]) - Number(b[0]));
				const front = chap?.front;
				return (
					<div key={cnum}>
						<div className="mb-1 text-3xl font-bold text-primary">{cnum}</div>
						{front && (
							<div>{renderObjects(front.verseObjects, `f-${cnum}`)}</div>
						)}
						<p className="leading-loose text-foreground">
							{verseEntries.map(([vnum, v]) => (
								<span key={vnum}>
									<sup className="mr-0.5 font-bold text-primary">{vnum}</sup>
									{renderObjects(v?.verseObjects, `${cnum}-${vnum}`)}{" "}
								</span>
							))}
						</p>
					</div>
				);
			})}
		</div>
	);
}

export function UsfmEditor({
	value,
	onChange,
	className,
}: {
	value: string;
	onChange: (next: string) => void;
	className?: string;
}) {
	const ref = useRef<HTMLTextAreaElement>(null);

	const { json, verses, warnings } = useMemo(() => {
		if (!value.trim()) {
			return {
				json: { chapters: {} } as UsfmJson,
				verses: [],
				warnings: [],
			};
		}
		try {
			return parseUsfmString(value);
		} catch {
			return {
				json: { chapters: {} } as UsfmJson,
				verses: [],
				warnings: ["Could not parse USFM."],
			};
		}
	}, [value]);

	const applyMarker = (action: MarkerAction) => {
		const el = ref.current;
		const start = el?.selectionStart ?? value.length;
		const end = el?.selectionEnd ?? value.length;
		const before = value.slice(0, start);
		const selected = value.slice(start, end);
		const after = value.slice(end);

		let next: string;
		let caret: number;
		if (action.kind === "wrap") {
			next = `${before}${action.open}${selected}${action.close}${after}`;
			caret = selected
				? before.length +
					action.open.length +
					selected.length +
					action.close.length
				: before.length + action.open.length;
		} else {
			// Put line markers at the start of a fresh line.
			const needsNewline = before.length > 0 && !before.endsWith("\n");
			const prefix = needsNewline ? "\n" : "";
			next = `${before}${prefix}${action.insert}${selected}${after}`;
			caret =
				before.length + prefix.length + action.insert.length + selected.length;
		}
		onChange(next);
		requestAnimationFrame(() => {
			el?.focus();
			el?.setSelectionRange(caret, caret);
		});
	};

	return (
		<div className={cn("grid gap-3 lg:grid-cols-2", className)}>
			<div className="flex min-h-0 flex-col">
				<div className="mb-2 flex flex-wrap gap-1">
					{TOOLBAR.map((a) => (
						<Button
							key={a.label}
							type="button"
							variant="outline"
							size="sm"
							title={a.title}
							className="h-7 px-2 font-mono text-xs"
							onClick={() => applyMarker(a)}
						>
							{a.label}
						</Button>
					))}
				</div>
				<Textarea
					ref={ref}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					spellCheck={false}
					className="min-h-[320px] flex-1 resize-none font-mono text-xs leading-relaxed"
					placeholder={
						"\\c 1\n\\s1 Section heading\n\\p\n\\v 1 In the beginning..."
					}
				/>
				<div className="mt-2 flex items-center justify-between text-xs">
					<span className="text-muted-foreground">
						{verses.length} verse{verses.length === 1 ? "" : "s"} detected
					</span>
					{warnings.length > 0 && (
						<span className="text-amber-600" title={warnings.join("\n")}>
							{warnings.length} warning{warnings.length === 1 ? "" : "s"}
						</span>
					)}
				</div>
			</div>
			<div className="min-h-[320px] overflow-y-auto rounded-lg border bg-muted/30 p-4">
				<Preview json={json} />
			</div>
		</div>
	);
}
