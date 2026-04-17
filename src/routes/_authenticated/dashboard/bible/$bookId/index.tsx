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
	ChevronLeft,
	ChevronRight,
	FileText,
	Loader2,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import type { BibleBook, BibleChapter } from "@/api/bible";
import {
	createBibleChapter,
	deleteBibleChapter,
	getBibleBook,
	getBibleChapters,
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
import { Skeleton } from "@/components/ui/skeleton";
import { canDelete } from "@/lib/roles";

// Validation schema for creating a chapter
const createChapterSchema = z.object({
	chapter_number: z.number().min(1, "Chapter number is required"),
	verse_count: z.number().min(1, "Verse count is required"),
});

export const Route = createFileRoute(
	"/_authenticated/dashboard/bible/$bookId/",
)({
	validateSearch: (search: Record<string, unknown>): { page: number } => ({
		page: Number(search.page) || 1,
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ params, deps }) => {
		const [book, chaptersData] = await Promise.all([
			getBibleBook({ data: { id: params.bookId } }),
			getBibleChapters({
				data: {
					bookId: params.bookId,
					page: deps.page,
					limit: 150,
				},
			}),
		]);
		return { book, ...chaptersData };
	},
	pendingComponent: BookDetailLoadingSkeleton,
	errorComponent: BookDetailErrorState,
	component: BookDetailPage,
});

// Loading Skeleton Component
function BookDetailLoadingSkeleton() {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto p-4">
				{/* Back Button & Title Skeleton */}
				<div className="mb-6">
					<Skeleton className="h-8 w-24 mb-4" />
					<div className="flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div>
							<Skeleton className="h-6 w-48 mb-2" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				</div>

				{/* Grid Skeleton */}
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
					{Array.from({ length: 20 }).map((_, i) => (
						<Skeleton key={i} className="h-20 rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
}

// Error State Component
function BookDetailErrorState({ error }: { error: Error }) {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="text-center max-w-md">
					<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
					<h2 className="text-xl font-semibold mb-2">Failed to Load Book</h2>
					<p className="text-muted-foreground mb-4">
						{error.message ||
							"An unexpected error occurred while loading the book."}
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
function ChaptersEmptyState({
	bookName,
	onAddChapter,
}: {
	bookName: string;
	onAddChapter: () => void;
}) {
	return (
		<div className="flex-1 flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
					<FileText className="w-8 h-8 text-muted-foreground" />
				</div>
				<h2 className="text-xl font-semibold mb-2">No Chapters Found</h2>
				<p className="text-muted-foreground mb-4">
					{bookName} doesn't have any chapters yet.
				</p>
				<Button onClick={onAddChapter}>
					<Plus className="w-4 h-4 mr-2" />
					Add Chapter
				</Button>
			</div>
		</div>
	);
}

function BookDetailPage() {
	const { book, chapters, total, page, totalPages } = Route.useLoaderData();
	const { bookId } = Route.useParams();
	const navigate = useNavigate({ from: Route.fullPath });
	const router = useRouter();
	const { user } = Route.useRouteContext();
	const showDelete = !!user && canDelete(user.role);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [chapterToDelete, setChapterToDelete] = useState<BibleChapter | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const typedBook = book as BibleBook;
	const typedChapters = chapters as BibleChapter[];

	const createForm = useForm({
		defaultValues: {
			chapter_number: (typedChapters.length || 0) + 1,
			verse_count: 1,
		},
		validators: {
			onChange: createChapterSchema,
		},
		onSubmit: async ({ value }) => {
			setIsCreating(true);
			try {
				await createBibleChapter({
					data: {
						book_id: bookId,
						chapter_number: value.chapter_number,
						verse_count: value.verse_count,
					},
				});
				setCreateDialogOpen(false);
				createForm.reset();
				router.invalidate();
			} catch (error) {
				console.error("Failed to create chapter:", error);
			} finally {
				setIsCreating(false);
			}
		},
	});

	const getLocalizedName = (name: unknown): string => {
		if (typeof name === "object" && name !== null) {
			const nameObj = name as { en?: string; am?: string };
			return nameObj.en || nameObj.am || "Unknown";
		}
		return String(name || "Unknown");
	};

	const bookName = getLocalizedName(typedBook.name);
	const testamentText = getLocalizedName(typedBook.testament);
	const isOldTestament = testamentText.toLowerCase().includes("old");

	const handlePageChange = (newPage: number) => {
		navigate({
			search: { page: newPage },
		});
	};

	const handleDelete = async () => {
		if (!chapterToDelete) return;
		setIsDeleting(true);
		try {
			await deleteBibleChapter({ data: { id: chapterToDelete.id } });
			setDeleteDialogOpen(false);
			setChapterToDelete(null);
			navigate({
				to: "/dashboard/bible/$bookId",
				params: { bookId },
				search: { page },
			});
		} catch (error) {
			console.error("Failed to delete chapter:", error);
		} finally {
			setIsDeleting(false);
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
							to="/dashboard/bible"
							search={{ testament: undefined, page: 1, search: "" }}
						/>
					}
					nativeButton={false}
				>
					<ArrowLeft className="size-4 shrink-0" />
					<span className="min-w-0 wrap-break-word">Back to Books</span>
				</Button>

				{/* Book Info */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
					<div className="flex items-center gap-4">
						<div
							className={`p-4 rounded-full ${
								isOldTestament
									? "bg-amber-500/10 text-amber-500"
									: "bg-blue-500/10 text-blue-500"
							}`}
						>
							<BookOpen className="w-8 h-8" />
						</div>
						<div>
							<h1 className="text-2xl font-bold">{bookName}</h1>
							<p className="text-muted-foreground">
								{testamentText} • Book #{typedBook.book_number} •{" "}
								{typedBook.chapter_count} chapters
							</p>
						</div>
					</div>
					<Button
						className="shrink-0 w-full sm:w-auto"
						onClick={() => setCreateDialogOpen(true)}
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Chapter
					</Button>
				</div>

				{/* Empty State */}
				{typedChapters.length === 0 ? (
					<ChaptersEmptyState
						bookName={bookName}
						onAddChapter={() => setCreateDialogOpen(true)}
					/>
				) : (
					<>
						{/* Chapters Grid */}
						<div className="mb-4">
							<h2 className="text-lg font-semibold mb-3">Chapters</h2>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 mb-6">
							{typedChapters.map((chapter) => (
								<div
									key={chapter.id}
									className="bg-card rounded-lg border hover:shadow-md transition-all group relative"
								>
									<Link
										to="/dashboard/bible/$bookId/$chapterId"
										params={{ bookId, chapterId: chapter.id }}
										search={{ page: 1, search: "" }}
										className="block p-4 text-center"
									>
										<p className="text-2xl font-bold text-primary mb-1">
											{chapter.chapter_number}
										</p>
										<p className="text-xs text-muted-foreground">
											{chapter.verse_count} verses
										</p>
									</Link>
									{showDelete && (
										<div className="absolute top-1 right-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={(e) => {
													e.preventDefault();
													setChapterToDelete(chapter);
													setDeleteDialogOpen(true);
												}}
											>
												<Trash2 className="w-3 h-3 text-destructive" />
											</Button>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Showing {(page - 1) * 150 + 1} to{" "}
									{Math.min(page * 150, total)} of {total} chapters
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
						<DialogTitle>Delete Chapter</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete Chapter{" "}
							{chapterToDelete?.chapter_number}? This will also delete all
							verses in this chapter. This action cannot be undone.
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

			{/* Create Chapter Dialog */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Add New Chapter</DialogTitle>
						<DialogDescription>
							Add a new chapter to {bookName}. Fill in the details below.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							createForm.handleSubmit();
						}}
						className="space-y-4"
					>
						<createForm.Field name="chapter_number">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="chapter_number">Chapter Number</Label>
									<Input
										id="chapter_number"
										type="number"
										min={1}
										value={field.state.value}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										onBlur={field.handleBlur}
									/>
									{field.state.meta.errors[0] && (
										<p className="text-xs text-destructive">
											{field.state.meta.errors[0]?.message}
										</p>
									)}
								</div>
							)}
						</createForm.Field>
						<createForm.Field name="verse_count">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="verse_count">Number of Verses</Label>
									<Input
										id="verse_count"
										type="number"
										min={1}
										value={field.state.value}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										onBlur={field.handleBlur}
									/>
									{field.state.meta.errors[0] && (
										<p className="text-xs text-destructive">
											{field.state.meta.errors[0]?.message}
										</p>
									)}
								</div>
							)}
						</createForm.Field>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setCreateDialogOpen(false)}
								disabled={isCreating}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreating}>
								{isCreating ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									"Create Chapter"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
