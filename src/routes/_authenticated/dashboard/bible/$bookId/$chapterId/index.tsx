import { useForm } from "@tanstack/react-form";
import {
	createFileRoute,
	Link,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	BookOpen,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Edit2,
	FileText,
	Link2,
	Loader2,
	MessageSquare,
	Plus,
	Save,
	Search,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import type {
	BibleBook,
	BibleChapter,
	BibleCrossReference,
	BibleFootnote,
	BibleVerse,
} from "@/api/bible";
import {
	bulkCreateBibleVerses,
	createBibleCrossReference,
	createBibleFootnote,
	createBibleVerse,
	deleteBibleCrossReference,
	deleteBibleFootnote,
	deleteBibleVerse,
	getBibleBooks,
	getBibleChapter,
	getBibleChapters,
	getBibleCrossReferences,
	getBibleFootnotes,
	getBibleVerses,
	updateBibleFootnote,
	updateBibleVerse,
} from "@/api/bible";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { canDelete } from "@/lib/roles";

// Validation schema for creating a verse
const createVerseSchema = z.object({
	verse_number: z.number().min(1, "Verse number is required"),
	text_en: z.string().min(1, "English text is required"),
	text_am: z.string(),
});

// Validation schema for creating a footnote
const createFootnoteSchema = z.object({
	marker_en: z.string().min(1, "Marker is required"),
	marker_am: z.string(),
	note_en: z.string().min(1, "Note text is required"),
	note_am: z.string(),
});

// Validation schema for creating a cross reference
const createCrossRefSchema = z.object({
	reference_book_id: z.string().min(1, "Book is required"),
	reference_chapter: z.number().min(1, "Chapter is required"),
	reference_verse_start: z.number().min(1, "Start verse is required"),
	reference_verse_end: z.number(),
});

interface ChapterWithBook extends BibleChapter {
	bible_books: BibleBook;
}

/** Each non-empty line becomes a verse. Use `12|Verse text` or `12. Verse text` to set verse numbers explicitly. */
function parseBulkVerseLines(
	raw: string,
	defaultStartVerse: number,
): { verse_number: number; text: { en: string } }[] {
	const lines = raw
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter((l) => l.length > 0);
	const numbered = /^(\d+)\s*[|:\t.]\s*(.+)$/;
	let auto = defaultStartVerse;
	const rows: { verse_number: number; text: { en: string } }[] = [];
	for (const line of lines) {
		const m = line.match(numbered);
		if (m) {
			rows.push({ verse_number: Number(m[1]), text: { en: m[2].trim() } });
		} else {
			rows.push({ verse_number: auto, text: { en: line } });
			auto += 1;
		}
	}
	return rows;
}

export const Route = createFileRoute(
	"/_authenticated/dashboard/bible/$bookId/$chapterId/",
)({
	validateSearch: (
		search: Record<string, unknown>,
	): { page: number; search: string } => ({
		page: Number(search.page) || 1,
		search: (search.search as string) || "",
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ params, deps }) => {
		const [chapter, versesData, bookChaptersData] = await Promise.all([
			getBibleChapter({ data: { id: params.chapterId } }),
			getBibleVerses({
				data: {
					chapterId: params.chapterId,
					page: deps.page,
					limit: 200,
					search: deps.search,
				},
			}),
			getBibleChapters({
				data: { bookId: params.bookId, page: 1, limit: 200 },
			}),
		]);
		const chaptersSorted = [
			...(bookChaptersData.chapters as BibleChapter[]),
		].sort((a, b) => a.chapter_number - b.chapter_number);
		const idx = chaptersSorted.findIndex((c) => c.id === params.chapterId);
		const prevChapter = idx > 0 ? chaptersSorted[idx - 1] : null;
		const nextChapter =
			idx >= 0 && idx < chaptersSorted.length - 1
				? chaptersSorted[idx + 1]
				: null;
		return {
			chapter,
			...versesData,
			prevChapterId: prevChapter?.id ?? null,
			nextChapterId: nextChapter?.id ?? null,
			prevChapterNumber: prevChapter?.chapter_number ?? null,
			nextChapterNumber: nextChapter?.chapter_number ?? null,
		};
	},
	pendingComponent: ChapterDetailLoadingSkeleton,
	errorComponent: ChapterDetailErrorState,
	component: ChapterDetailPage,
});

// Loading Skeleton Component
function ChapterDetailLoadingSkeleton() {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto p-4">
				{/* Back Button & Title Skeleton */}
				<div className="mb-6">
					<Skeleton className="h-8 w-24 mb-4" />
					<div className="flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div>
							<Skeleton className="h-6 w-64 mb-2" />
							<Skeleton className="h-4 w-40" />
						</div>
					</div>
				</div>

				{/* Search Skeleton */}
				<Skeleton className="h-10 w-full max-w-md mb-6" />

				{/* Verses Skeleton */}
				<div className="space-y-4">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="bg-card rounded-lg border p-4">
							<div className="flex gap-3">
								<Skeleton className="h-6 w-8 shrink-0" />
								<div className="flex-1">
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Error State Component
function ChapterDetailErrorState({ error }: { error: Error }) {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="text-center max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
					<h2 className="text-xl font-semibold mb-2">Failed to Load Chapter</h2>
					<p className="text-muted-foreground mb-4">
						{error.message ||
							"An unexpected error occurred while loading the chapter."}
					</p>
					<div className="flex gap-2 justify-center">
						<Button
							variant="outline"
							onClick={() =>
								navigate({
									to: "/dashboard/bible",
									search: { testament: undefined, page: 1, search: "" },
								})
							}
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Books
						</Button>
						<Button onClick={() => window.location.reload()}>Try Again</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

// Empty State Component
function VersesEmptyState({
	bookName,
	chapterNumber,
	searchTerm,
	onClearSearch,
	onAddVerse,
	onBulkImport,
}: {
	bookName: string;
	chapterNumber: number;
	searchTerm: string;
	onClearSearch: () => void;
	onAddVerse: () => void;
	onBulkImport: () => void;
}) {
	return (
		<div className="flex-1 flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
					<FileText className="w-8 h-8 text-muted-foreground" />
				</div>
				<h2 className="text-xl font-semibold mb-2">No Verses Found</h2>
				<p className="text-muted-foreground mb-4">
					{searchTerm
						? `No verses match "${searchTerm}" in ${bookName} Chapter ${chapterNumber}.`
						: `${bookName} Chapter ${chapterNumber} doesn't have any verses yet.`}
				</p>
				<div className="flex flex-col sm:flex-row gap-2 justify-center">
					{searchTerm && (
						<Button variant="outline" onClick={onClearSearch}>
							Clear Search
						</Button>
					)}
					<Button variant="outline" onClick={onBulkImport}>
						<Upload className="w-4 h-4 mr-2" />
						Import verses
					</Button>
					<Button onClick={onAddVerse}>
						<Plus className="w-4 h-4 mr-2" />
						Add Verse
					</Button>
				</div>
			</div>
		</div>
	);
}

function ChapterDetailPage() {
	const {
		chapter,
		verses,
		total,
		page,
		totalPages,
		prevChapterId,
		nextChapterId,
		prevChapterNumber,
		nextChapterNumber,
	} = Route.useLoaderData();
	const { bookId, chapterId } = Route.useParams();
	const { search } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const router = useRouter();
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);

	const [searchInput, setSearchInput] = useState(search || "");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [verseToDelete, setVerseToDelete] = useState<BibleVerse | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [editingVerse, setEditingVerse] = useState<BibleVerse | null>(null);
	const [editTextEn, setEditTextEn] = useState("");
	const [editTextAm, setEditTextAm] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Create verse state
	const [createVerseDialogOpen, setCreateVerseDialogOpen] = useState(false);
	const [isCreatingVerse, setIsCreatingVerse] = useState(false);
	const [bulkImportOpen, setBulkImportOpen] = useState(false);
	const [bulkPaste, setBulkPaste] = useState("");
	const [isBulkImporting, setIsBulkImporting] = useState(false);

	// Footnotes state
	const [expandedVerse, setExpandedVerse] = useState<string | null>(null);
	const [footnotes, setFootnotes] = useState<Record<string, BibleFootnote[]>>(
		{},
	);
	const [crossRefs, setCrossRefs] = useState<
		Record<string, BibleCrossReference[]>
	>({});
	const [loadingFootnotes, setLoadingFootnotes] = useState<string | null>(null);
	const [addFootnoteDialogOpen, setAddFootnoteDialogOpen] = useState(false);
	const [addCrossRefDialogOpen, setAddCrossRefDialogOpen] = useState(false);
	const [selectedVerseForAdd, setSelectedVerseForAdd] =
		useState<BibleVerse | null>(null);
	const [isCreatingFootnote, setIsCreatingFootnote] = useState(false);
	const [isCreatingCrossRef, setIsCreatingCrossRef] = useState(false);
	const [allBooks, setAllBooks] = useState<BibleBook[]>([]);

	// Edit footnote state
	const [editFootnoteDialogOpen, setEditFootnoteDialogOpen] = useState(false);
	const [editingFootnote, setEditingFootnote] = useState<BibleFootnote | null>(
		null,
	);
	const [editingFootnoteVerseId, setEditingFootnoteVerseId] = useState<
		string | null
	>(null);
	const [isUpdatingFootnote, setIsUpdatingFootnote] = useState(false);

	const typedChapter = chapter as ChapterWithBook;
	const typedVerses = verses as BibleVerse[];
	const book = typedChapter.bible_books;

	// Fetch all books for cross-reference selection
	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const result = await getBibleBooks({ data: { page: 1, limit: 100 } });
				setAllBooks(result.books as BibleBook[]);
			} catch (error) {
				console.error("Failed to fetch books:", error);
			}
		};
		fetchBooks();
	}, []);

	// Create verse form
	const createVerseForm = useForm({
		defaultValues: {
			verse_number: (typedVerses.length || 0) + 1,
			text_en: "",
			text_am: "",
		},
		validators: {
			onChange: createVerseSchema,
		},
		onSubmit: async ({ value }) => {
			setIsCreatingVerse(true);
			try {
				await createBibleVerse({
					data: {
						chapter_id: chapterId,
						verse_number: value.verse_number,
						text: {
							en: value.text_en,
							am: value.text_am || undefined,
						},
					},
				});
				setCreateVerseDialogOpen(false);
				createVerseForm.reset();
				router.invalidate();
			} catch (error) {
				console.error("Failed to create verse:", error);
			} finally {
				setIsCreatingVerse(false);
			}
		},
	});

	// Create footnote form
	const createFootnoteForm = useForm({
		defaultValues: {
			marker_en: "",
			marker_am: "",
			note_en: "",
			note_am: "",
		},
		validators: {
			onChange: createFootnoteSchema,
		},
		onSubmit: async ({ value }) => {
			if (!selectedVerseForAdd) return;
			setIsCreatingFootnote(true);
			try {
				await createBibleFootnote({
					data: {
						verse_id: selectedVerseForAdd.id,
						marker: {
							en: value.marker_en,
							am: value.marker_am || undefined,
						},
						note: {
							en: value.note_en,
							am: value.note_am || undefined,
						},
					},
				});
				setAddFootnoteDialogOpen(false);
				createFootnoteForm.reset();
				// Refresh footnotes for this verse
				await loadFootnotesForVerse(selectedVerseForAdd.id);
			} catch (error) {
				console.error("Failed to create footnote:", error);
			} finally {
				setIsCreatingFootnote(false);
			}
		},
	});

	// Create cross reference form
	const createCrossRefForm = useForm({
		defaultValues: {
			reference_book_id: "",
			reference_chapter: 1,
			reference_verse_start: 1,
			reference_verse_end: 0,
		},
		validators: {
			onChange: createCrossRefSchema,
		},
		onSubmit: async ({ value }) => {
			if (!selectedVerseForAdd) return;
			setIsCreatingCrossRef(true);
			try {
				const refBook = allBooks.find((b) => b.id === value.reference_book_id);
				const refBookName = refBook
					? getLocalizedName(refBook.name)
					: "Unknown";
				const verseRange =
					value.reference_verse_end && value.reference_verse_end > 0
						? `${value.reference_verse_start}-${value.reference_verse_end}`
						: String(value.reference_verse_start);

				await createBibleCrossReference({
					data: {
						verse_id: selectedVerseForAdd.id,
						reference: {
							en: `${refBookName} ${value.reference_chapter}:${verseRange}`,
						},
						reference_book_id: value.reference_book_id,
						reference_chapter: value.reference_chapter,
						reference_verse_start: value.reference_verse_start,
						reference_verse_end:
							value.reference_verse_end && value.reference_verse_end > 0
								? value.reference_verse_end
								: undefined,
					},
				});
				setAddCrossRefDialogOpen(false);
				createCrossRefForm.reset();
				// Refresh cross refs for this verse
				await loadCrossRefsForVerse(selectedVerseForAdd.id);
			} catch (error) {
				console.error("Failed to create cross reference:", error);
			} finally {
				setIsCreatingCrossRef(false);
			}
		},
	});

	// Edit footnote form
	const editFootnoteForm = useForm({
		defaultValues: {
			marker_en: "",
			marker_am: "",
			note_en: "",
			note_am: "",
		},
		validators: {
			onChange: createFootnoteSchema,
		},
		onSubmit: async ({ value }) => {
			if (!editingFootnote || !editingFootnoteVerseId) return;
			setIsUpdatingFootnote(true);
			try {
				await updateBibleFootnote({
					data: {
						id: editingFootnote.id,
						marker: {
							en: value.marker_en,
							am: value.marker_am || undefined,
						},
						note: {
							en: value.note_en,
							am: value.note_am || undefined,
						},
					},
				});
				setEditFootnoteDialogOpen(false);
				setEditingFootnote(null);
				// Refresh footnotes for this verse
				await loadFootnotesForVerse(editingFootnoteVerseId);
				setEditingFootnoteVerseId(null);
			} catch (error) {
				console.error("Failed to update footnote:", error);
			} finally {
				setIsUpdatingFootnote(false);
			}
		},
	});

	const handleEditFootnote = (footnote: BibleFootnote, verseId: string) => {
		setEditingFootnote(footnote);
		setEditingFootnoteVerseId(verseId);
		editFootnoteForm.setFieldValue(
			"marker_en",
			getLocalizedText(footnote.marker, "en"),
		);
		editFootnoteForm.setFieldValue(
			"marker_am",
			getLocalizedText(footnote.marker, "am"),
		);
		editFootnoteForm.setFieldValue(
			"note_en",
			getLocalizedText(footnote.note, "en"),
		);
		editFootnoteForm.setFieldValue(
			"note_am",
			getLocalizedText(footnote.note, "am"),
		);
		setEditFootnoteDialogOpen(true);
	};

	const loadFootnotesForVerse = async (verseId: string) => {
		setLoadingFootnotes(verseId);
		try {
			const [footnotesResult, crossRefsResult] = await Promise.all([
				getBibleFootnotes({ data: { verseId } }),
				getBibleCrossReferences({ data: { verseId } }),
			]);
			// APIs return arrays directly
			setFootnotes((prev) => ({
				...prev,
				[verseId]: footnotesResult as BibleFootnote[],
			}));
			setCrossRefs((prev) => ({
				...prev,
				[verseId]: crossRefsResult as BibleCrossReference[],
			}));
		} catch (error) {
			console.error("Failed to load footnotes:", error);
		} finally {
			setLoadingFootnotes(null);
		}
	};

	const loadCrossRefsForVerse = async (verseId: string) => {
		try {
			const result = await getBibleCrossReferences({ data: { verseId } });
			// API returns array directly
			setCrossRefs((prev) => ({
				...prev,
				[verseId]: result as BibleCrossReference[],
			}));
		} catch (error) {
			console.error("Failed to load cross refs:", error);
		}
	};

	const handleToggleExpand = async (verseId: string) => {
		if (expandedVerse === verseId) {
			setExpandedVerse(null);
		} else {
			setExpandedVerse(verseId);
			if (!footnotes[verseId]) {
				await loadFootnotesForVerse(verseId);
			}
		}
	};

	const handleDeleteFootnote = async (footnoteId: string, verseId: string) => {
		try {
			await deleteBibleFootnote({ data: { id: footnoteId } });
			await loadFootnotesForVerse(verseId);
		} catch (error) {
			console.error("Failed to delete footnote:", error);
		}
	};

	const handleDeleteCrossRef = async (crossRefId: string, verseId: string) => {
		try {
			await deleteBibleCrossReference({ data: { id: crossRefId } });
			await loadCrossRefsForVerse(verseId);
		} catch (error) {
			console.error("Failed to delete cross reference:", error);
		}
	};

	const getLocalizedName = (name: unknown): string => {
		if (typeof name === "object" && name !== null) {
			const nameObj = name as { en?: string; am?: string };
			return nameObj.en || nameObj.am || "Unknown";
		}
		return String(name || "Unknown");
	};

	const getLocalizedText = (text: unknown, lang: "en" | "am"): string => {
		if (typeof text === "object" && text !== null) {
			const textObj = text as { en?: string; am?: string };
			return textObj[lang] || "";
		}
		return String(text || "");
	};

	const bookName = getLocalizedName(book.name);
	const testamentText = getLocalizedName(book.testament);
	const isOldTestament = testamentText.toLowerCase().includes("old");

	const handleBulkImport = async () => {
		const defaultStart =
			typedVerses.length > 0
				? Math.max(...typedVerses.map((v) => v.verse_number)) + 1
				: 1;
		const rows = parseBulkVerseLines(bulkPaste, defaultStart);
		if (rows.length === 0) {
			toast.error("Paste at least one line of text");
			return;
		}
		const seen = new Set<number>();
		for (const r of rows) {
			if (seen.has(r.verse_number)) {
				toast.error(`Duplicate verse number ${r.verse_number} in import`);
				return;
			}
			seen.add(r.verse_number);
		}
		if (rows.length > 200) {
			toast.error("Maximum 200 verses per import");
			return;
		}
		setIsBulkImporting(true);
		try {
			await bulkCreateBibleVerses({
				data: { chapter_id: chapterId, verses: rows },
			});
			toast.success(`Imported ${rows.length} verse(s)`);
			setBulkImportOpen(false);
			setBulkPaste("");
			router.invalidate();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Import failed");
		} finally {
			setIsBulkImporting(false);
		}
	};

	const handleSearch = () => {
		navigate({
			search: { page: 1, search: searchInput },
		});
	};

	const handlePageChange = (newPage: number) => {
		navigate({
			search: { page: newPage, search },
		});
	};

	const handleDelete = async () => {
		if (!verseToDelete) return;
		setIsDeleting(true);
		try {
			await deleteBibleVerse({ data: { id: verseToDelete.id } });
			setDeleteDialogOpen(false);
			setVerseToDelete(null);
			navigate({
				to: "/dashboard/bible/$bookId/$chapterId",
				params: { bookId, chapterId },
				search: { page, search },
			});
		} catch (error) {
			console.error("Failed to delete verse:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEditStart = (verse: BibleVerse) => {
		setEditingVerse(verse);
		setEditTextEn(getLocalizedText(verse.text, "en"));
		setEditTextAm(getLocalizedText(verse.text, "am"));
	};

	const handleEditCancel = () => {
		setEditingVerse(null);
		setEditTextEn("");
		setEditTextAm("");
	};

	const handleEditSave = async () => {
		if (!editingVerse) return;
		setIsSaving(true);
		try {
			await updateBibleVerse({
				data: {
					id: editingVerse.id,
					text: {
						en: editTextEn,
						am: editTextAm || undefined,
					},
				},
			});
			setEditingVerse(null);
			navigate({
				to: "/dashboard/bible/$bookId/$chapterId",
				params: { bookId, chapterId },
				search: { page, search },
			});
		} catch (error) {
			console.error("Failed to update verse:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto p-4">
				{/* Back Button */}
				<Button
					variant="ghost"
					size="sm"
					className="mb-4 h-auto min-h-8 w-fit max-w-full justify-start gap-2 whitespace-normal text-left"
					render={
						<Link
							to="/dashboard/bible/$bookId"
							params={{ bookId }}
							search={{ page: 1 }}
						/>
					}
					nativeButton={false}
				>
					<ArrowLeft className="size-4 shrink-0" />
					<span className="min-w-0 break-words">
						Back to {bookName}
					</span>
				</Button>

				{/* Chapter Info */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
					<div className="flex items-center gap-4 min-w-0">
						<div
							className={`p-4 rounded-full shrink-0 ${
								isOldTestament
									? "bg-amber-500/10 text-amber-500"
									: "bg-blue-500/10 text-blue-500"
							}`}
						>
							<BookOpen className="w-8 h-8" />
						</div>
						<div className="min-w-0">
							<h1 className="text-xl sm:text-2xl font-bold truncate">
								{bookName} Chapter {typedChapter.chapter_number}
							</h1>
							<p className="text-muted-foreground text-sm">
								{testamentText} • {typedChapter.verse_count} verses
							</p>
							<div className="flex flex-wrap gap-2 mt-3">
								{prevChapterId && prevChapterNumber != null && (
									<Button
										variant="outline"
										size="sm"
										className="shrink-0"
										nativeButton={false}
										render={
											<Link
												to="/dashboard/bible/$bookId/$chapterId"
												params={{ bookId, chapterId: prevChapterId }}
												search={{ page: 1, search: "" }}
											/>
										}
									>
										<ChevronLeft className="w-4 h-4 mr-1" />
										Ch {prevChapterNumber}
									</Button>
								)}
								{nextChapterId && nextChapterNumber != null && (
									<Button
										variant="outline"
										size="sm"
										className="shrink-0"
										nativeButton={false}
										render={
											<Link
												to="/dashboard/bible/$bookId/$chapterId"
												params={{ bookId, chapterId: nextChapterId }}
												search={{ page: 1, search: "" }}
											/>
										}
									>
										Ch {nextChapterNumber}
										<ChevronRight className="w-4 h-4 ml-1" />
									</Button>
								)}
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:shrink-0">
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={() => setBulkImportOpen(true)}
						>
							<Upload className="w-4 h-4 mr-2" />
							Import verses
						</Button>
						<Button
							className="w-full sm:w-auto"
							onClick={() => setCreateVerseDialogOpen(true)}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Verse
						</Button>
					</div>
				</div>

				{/* Search */}
				<div className="flex gap-2 mb-6 max-w-md">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search verses..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							className="pl-10"
						/>
					</div>
					<Button variant="outline" onClick={handleSearch}>
						Search
					</Button>
				</div>

				{/* Empty State */}
				{typedVerses.length === 0 ? (
					<VersesEmptyState
						bookName={bookName}
						chapterNumber={typedChapter.chapter_number}
						searchTerm={search}
						onClearSearch={() => navigate({ search: { page: 1, search: "" } })}
						onAddVerse={() => setCreateVerseDialogOpen(true)}
						onBulkImport={() => setBulkImportOpen(true)}
					/>
				) : (
					<>
						{/* Verses List */}
						<div className="space-y-3 mb-6">
							{typedVerses.map((verse) => {
								const isEditing = editingVerse?.id === verse.id;

								return (
									<div
										key={verse.id}
										className={`bg-card rounded-lg border p-4 transition-all ${
											isEditing ? "ring-2 ring-primary" : "hover:shadow-sm"
										}`}
									>
										{isEditing ? (
											<div className="space-y-4">
												<div className="flex items-start gap-3">
													<span className="text-primary font-bold text-lg shrink-0 w-8">
														{verse.verse_number}
													</span>
													<div className="flex-1 space-y-3">
														<div>
															<Label
																htmlFor="text-en"
																className="text-xs text-muted-foreground"
															>
																English
															</Label>
															<Textarea
																id="text-en"
																value={editTextEn}
																onChange={(e) => setEditTextEn(e.target.value)}
																className="mt-1"
																rows={3}
															/>
														</div>
														<div>
															<Label
																htmlFor="text-am"
																className="text-xs text-muted-foreground"
															>
																Amharic
															</Label>
															<Textarea
																id="text-am"
																value={editTextAm}
																onChange={(e) => setEditTextAm(e.target.value)}
																className="mt-1"
																rows={3}
															/>
														</div>
													</div>
												</div>
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={handleEditCancel}
														disabled={isSaving}
													>
														<X className="w-4 h-4 mr-1" />
														Cancel
													</Button>
													<Button
														size="sm"
														onClick={handleEditSave}
														disabled={isSaving}
													>
														{isSaving ? (
															<>
																<Loader2 className="w-4 h-4 mr-1 animate-spin" />
																Saving...
															</>
														) : (
															<>
																<Save className="w-4 h-4 mr-1" />
																Save
															</>
														)}
													</Button>
												</div>
											</div>
										) : (
											<div>
												<div className="flex items-start gap-3">
													<span className="text-primary font-bold text-lg shrink-0 w-8">
														{verse.verse_number}
													</span>
													<div className="flex-1 min-w-0">
														<p className="text-foreground leading-relaxed">
															{getLocalizedText(verse.text, "en")}
														</p>
														{getLocalizedText(verse.text, "am") && (
															<p className="text-muted-foreground mt-2 text-sm">
																{getLocalizedText(verse.text, "am")}
															</p>
														)}
													</div>
													<div className="flex gap-1 shrink-0">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() => handleToggleExpand(verse.id)}
															title="Footnotes & Cross References"
														>
															{expandedVerse === verse.id ? (
																<ChevronUp className="w-4 h-4" />
															) : (
																<ChevronDown className="w-4 h-4" />
															)}
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() => handleEditStart(verse)}
														>
															<Edit2 className="w-4 h-4" />
														</Button>
														{showDelete && (
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => {
																	setVerseToDelete(verse);
																	setDeleteDialogOpen(true);
																}}
															>
																<Trash2 className="w-4 h-4 text-destructive" />
															</Button>
														)}
													</div>
												</div>

												{/* Footnotes & Cross References Section */}
												{expandedVerse === verse.id && (
													<div className="mt-4 pt-4 border-t space-y-4">
														{loadingFootnotes === verse.id ? (
															<div className="flex items-center justify-center py-4">
																<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
															</div>
														) : (
															<>
																{/* Footnotes */}
																<div>
																	<div className="flex items-center justify-between mb-2">
																		<h4 className="text-sm font-medium flex items-center gap-2">
																			<MessageSquare className="w-4 h-4" />
																			Footnotes
																		</h4>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => {
																				setSelectedVerseForAdd(verse);
																				setAddFootnoteDialogOpen(true);
																			}}
																		>
																			<Plus className="w-3 h-3 mr-1" />
																			Add
																		</Button>
																	</div>
																	{(footnotes[verse.id]?.length ?? 0) === 0 ? (
																		<p className="text-sm text-muted-foreground">
																			No footnotes
																		</p>
																	) : (
																		<div className="space-y-2">
																			{footnotes[verse.id]?.map((footnote) => (
																				<div
																					key={footnote.id}
																					className="bg-muted/50 rounded-md p-3 text-sm relative group"
																				>
																					<span className="font-medium text-primary mr-2">
																						{getLocalizedText(
																							footnote.marker,
																							"en",
																						)}
																					</span>
																					<span>
																						{getLocalizedText(
																							footnote.note,
																							"en",
																						)}
																					</span>
																					{getLocalizedText(
																						footnote.note,
																						"am",
																					) && (
																						<p className="text-muted-foreground mt-1">
																							{getLocalizedText(
																								footnote.note,
																								"am",
																							)}
																						</p>
																					)}
																					<div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
																						<Button
																							variant="ghost"
																							size="icon"
																							className="h-6 w-6"
																							onClick={() =>
																								handleEditFootnote(
																									footnote,
																									verse.id,
																								)
																							}
																						>
																							<Edit2 className="w-3 h-3" />
																						</Button>
																						{showDelete && (
																							<Button
																								variant="ghost"
																								size="icon"
																								className="h-6 w-6"
																								onClick={() =>
																									handleDeleteFootnote(
																										footnote.id,
																										verse.id,
																									)
																								}
																							>
																								<Trash2 className="w-3 h-3 text-destructive" />
																							</Button>
																						)}
																					</div>
																				</div>
																			))}
																		</div>
																	)}
																</div>

																{/* Cross References */}
																<div>
																	<div className="flex items-center justify-between mb-2">
																		<h4 className="text-sm font-medium flex items-center gap-2">
																			<Link2 className="w-4 h-4" />
																			Cross References
																		</h4>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => {
																				setSelectedVerseForAdd(verse);
																				setAddCrossRefDialogOpen(true);
																			}}
																		>
																			<Plus className="w-3 h-3 mr-1" />
																			Add
																		</Button>
																	</div>
																	{(crossRefs[verse.id]?.length ?? 0) === 0 ? (
																		<p className="text-sm text-muted-foreground">
																			No cross references
																		</p>
																	) : (
																		<div className="flex flex-wrap gap-2">
																			{crossRefs[verse.id]?.map((ref) => {
																				// Use joined bible_books data from API, fallback to allBooks lookup
																				const joinedBook = (
																					ref as { bible_books?: BibleBook }
																				).bible_books;
																				const refBook =
																					joinedBook ||
																					allBooks.find(
																						(b) => b.id === ref.ref_book_id,
																					);
																				const refBookName = refBook
																					? getLocalizedName(refBook.name)
																					: getLocalizedText(
																							ref.description,
																							"en",
																						) || "Unknown";
																				const verseRange =
																					ref.ref_verse_end != null
																						? `${ref.ref_verse_start ?? ""}-${ref.ref_verse_end}`
																						: String(
																								ref.ref_verse_start ?? "",
																							);
																				return (
																					<div
																						key={ref.id}
																						className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm flex items-center gap-1 group"
																					>
																						<span>
																							{refBookName}{" "}
																							{ref.ref_chapter ?? ""}:
																							{verseRange}
																						</span>
																						{showDelete && (
																							<Button
																								variant="ghost"
																								size="icon"
																								className="h-4 w-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
																								onClick={() =>
																									handleDeleteCrossRef(
																										ref.id,
																										verse.id,
																									)
																								}
																							>
																								<X className="w-3 h-3" />
																							</Button>
																						)}
																					</div>
																				);
																			})}
																		</div>
																	)}
																</div>
															</>
														)}
													</div>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Showing {(page - 1) * 200 + 1} to{" "}
									{Math.min(page * 200, total)} of {total} verses
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handlePageChange(page - 1)}
										disabled={page <= 1}
									>
										<ChevronLeft className="w-4 h-4" />
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handlePageChange(page + 1)}
										disabled={page >= totalPages}
									>
										Next
										<ChevronRight className="w-4 h-4" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Verse</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete verse{" "}
							{verseToDelete?.verse_number}? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Create Verse Dialog */}
			<Dialog
				open={createVerseDialogOpen}
				onOpenChange={setCreateVerseDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Verse</DialogTitle>
						<DialogDescription>
							Add a new verse to {bookName} Chapter{" "}
							{typedChapter.chapter_number}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							createVerseForm.handleSubmit();
						}}
						className="space-y-4"
					>
						<createVerseForm.Field name="verse_number">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="verse_number">Verse Number *</Label>
									<Input
										id="verse_number"
										type="number"
										min={1}
										value={field.state.value}
										onChange={(e) =>
											field.handleChange(parseInt(e.target.value) || 1)
										}
									/>
									{field.state.meta.errors?.length > 0 && (
										<p className="text-sm text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</createVerseForm.Field>

						<createVerseForm.Field name="text_en">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="text_en">English Text *</Label>
									<Textarea
										id="text_en"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={4}
									/>
									{field.state.meta.errors?.length > 0 && (
										<p className="text-sm text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</createVerseForm.Field>

						<createVerseForm.Field name="text_am">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="text_am">Amharic Text</Label>
									<Textarea
										id="text_am"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={4}
									/>
								</div>
							)}
						</createVerseForm.Field>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setCreateVerseDialogOpen(false)}
								disabled={isCreatingVerse}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreatingVerse}>
								{isCreatingVerse ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									"Create Verse"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Bulk import verses */}
			<Dialog open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
				<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Import verses (English)</DialogTitle>
						<DialogDescription>
							One verse per line. Lines without a number continue from the next
							verse after the highest existing number in this chapter. Use{" "}
							<code className="text-xs bg-muted px-1 rounded">
								12|Your text
							</code>{" "}
							or{" "}
							<code className="text-xs bg-muted px-1 rounded">
								12. Your text
							</code>{" "}
							to set verse numbers explicitly. Up to 200 lines per import.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 py-2">
						<Label htmlFor="bulk-paste">Paste text</Label>
						<Textarea
							id="bulk-paste"
							value={bulkPaste}
							onChange={(e) => setBulkPaste(e.target.value)}
							rows={12}
							className="font-mono text-sm"
							placeholder={`1|In the beginning God created...`}
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setBulkImportOpen(false)}
							disabled={isBulkImporting}
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleBulkImport}
							disabled={isBulkImporting}
						>
							{isBulkImporting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Importing...
								</>
							) : (
								"Import"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Footnote Dialog */}
			<Dialog
				open={addFootnoteDialogOpen}
				onOpenChange={setAddFootnoteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Footnote</DialogTitle>
						<DialogDescription>
							Add a footnote to verse {selectedVerseForAdd?.verse_number}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							createFootnoteForm.handleSubmit();
						}}
						className="space-y-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<createFootnoteForm.Field name="marker_en">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="marker_en">Marker (EN) *</Label>
										<Input
											id="marker_en"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g., [a], [1]"
										/>
										{field.state.meta.errors?.length > 0 && (
											<p className="text-sm text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										)}
									</div>
								)}
							</createFootnoteForm.Field>

							<createFootnoteForm.Field name="marker_am">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="marker_am">Marker (AM)</Label>
										<Input
											id="marker_am"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Optional"
										/>
									</div>
								)}
							</createFootnoteForm.Field>
						</div>

						<createFootnoteForm.Field name="note_en">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="note_en">Note (EN) *</Label>
									<Textarea
										id="note_en"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={3}
									/>
									{field.state.meta.errors?.length > 0 && (
										<p className="text-sm text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</createFootnoteForm.Field>

						<createFootnoteForm.Field name="note_am">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="note_am">Note (AM)</Label>
									<Textarea
										id="note_am"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={3}
									/>
								</div>
							)}
						</createFootnoteForm.Field>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setAddFootnoteDialogOpen(false)}
								disabled={isCreatingFootnote}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreatingFootnote}>
								{isCreatingFootnote ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Adding...
									</>
								) : (
									"Add Footnote"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit Footnote Dialog */}
			<Dialog
				open={editFootnoteDialogOpen}
				onOpenChange={setEditFootnoteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Footnote</DialogTitle>
						<DialogDescription>Update the footnote details</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							editFootnoteForm.handleSubmit();
						}}
						className="space-y-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<editFootnoteForm.Field name="marker_en">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="edit_marker_en">Marker (EN) *</Label>
										<Input
											id="edit_marker_en"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g., [a], [1]"
										/>
										{field.state.meta.errors?.length > 0 && (
											<p className="text-sm text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										)}
									</div>
								)}
							</editFootnoteForm.Field>

							<editFootnoteForm.Field name="marker_am">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="edit_marker_am">Marker (AM)</Label>
										<Input
											id="edit_marker_am"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Optional"
										/>
									</div>
								)}
							</editFootnoteForm.Field>
						</div>

						<editFootnoteForm.Field name="note_en">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="edit_note_en">Note (EN) *</Label>
									<Textarea
										id="edit_note_en"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={3}
									/>
									{field.state.meta.errors?.length > 0 && (
										<p className="text-sm text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</editFootnoteForm.Field>

						<editFootnoteForm.Field name="note_am">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="edit_note_am">Note (AM)</Label>
									<Textarea
										id="edit_note_am"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={3}
									/>
								</div>
							)}
						</editFootnoteForm.Field>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setEditFootnoteDialogOpen(false)}
								disabled={isUpdatingFootnote}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isUpdatingFootnote}>
								{isUpdatingFootnote ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Add Cross Reference Dialog */}
			<Dialog
				open={addCrossRefDialogOpen}
				onOpenChange={setAddCrossRefDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Cross Reference</DialogTitle>
						<DialogDescription>
							Add a cross reference to verse {selectedVerseForAdd?.verse_number}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							createCrossRefForm.handleSubmit();
						}}
						className="space-y-4"
					>
						<createCrossRefForm.Field name="reference_book_id">
							{(field) => (
								<div className="space-y-2">
									<Label>Book *</Label>
									<Select
										value={field.state.value}
										onValueChange={(value) => field.handleChange(value || "")}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a book" />
										</SelectTrigger>
										<SelectContent>
											{allBooks.map((b) => (
												<SelectItem key={b.id} value={b.id}>
													{getLocalizedName(b.name)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{field.state.meta.errors?.length > 0 && (
										<p className="text-sm text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</createCrossRefForm.Field>

						<createCrossRefForm.Field name="reference_chapter">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="ref_chapter">Chapter *</Label>
									<Input
										id="ref_chapter"
										type="number"
										min={1}
										value={field.state.value}
										onChange={(e) =>
											field.handleChange(parseInt(e.target.value) || 1)
										}
									/>
									{field.state.meta.errors?.length > 0 && (
										<p className="text-sm text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</createCrossRefForm.Field>

						<div className="grid grid-cols-2 gap-4">
							<createCrossRefForm.Field name="reference_verse_start">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="reference_verse_start">Start Verse *</Label>
										<Input
											id="reference_verse_start"
											type="number"
											min={1}
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(parseInt(e.target.value) || 1)
											}
										/>
										{field.state.meta.errors?.length > 0 && (
											<p className="text-sm text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										)}
									</div>
								)}
							</createCrossRefForm.Field>

							<createCrossRefForm.Field name="reference_verse_end">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="reference_verse_end">End Verse</Label>
										<Input
											id="reference_verse_end"
											type="number"
											min={0}
											value={field.state.value || ""}
											onChange={(e) => {
												const val = e.target.value
													? parseInt(e.target.value)
													: 0;
												field.handleChange(val);
											}}
											placeholder="Optional"
										/>
									</div>
								)}
							</createCrossRefForm.Field>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setAddCrossRefDialogOpen(false)}
								disabled={isCreatingCrossRef}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreatingCrossRef}>
								{isCreatingCrossRef ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Adding...
									</>
								) : (
									"Add Reference"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
